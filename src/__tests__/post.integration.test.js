import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Wait } from 'testcontainers';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { createSequelizeInstance } from '../config/database.js';
import { initPostModel } from '../models/post.js';
import { createPostController } from '../controllers/postController.js';
import { createPostRouter } from '../routers/postRouter.js';
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock image upload and auth middleware
jest.mock('../utils/upload/imageUpload.js', () => ({
    __esModule: true,
    default: jest.fn(async () => ({ error: null })),
}));
const mockAuth = (req, res, next) => next();

// Helper to execute SQL files
async function executeSqlFile(sequelize, filePath) {
    const sql = fs.readFileSync(filePath, 'utf-8');
    // Remove transaction statements
    const cleanedSql = sql
        .replace(/\bBEGIN;?\s*/gi, '')
        .replace(/\bCOMMIT;?\s*/gi, '');
    // Split on semicolons at the end of a line
    const statements = cleanedSql
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(Boolean);

    for (const stmt of statements) {
        if (!stmt) continue;
        try {
            await sequelize.query(stmt);
        } catch (error) {
            console.error(`Error executing statement from file: ${filePath}`);
            console.error('Statement:', stmt);
            console.error(error);
            throw error;
        }
    }
}

let container, sequelize, Post, app;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup block
describe('setup', () => {
    beforeAll(async () => {
        container = await new PostgreSqlContainer('postgres:17-alpine')
            .withDatabase('testdb')
            .withUsername('testuser')
            .withPassword('testpass')
            .withExposedPorts(5432)
            .withWaitStrategy(Wait.forListeningPorts())
            .start();
        sequelize = createSequelizeInstance({
            database: container.getDatabase(),
            username: container.getUsername(),
            password: container.getPassword(),
            host: container.getHost(),
            port: container.getPort(),
            logging: false,
            ssl: false,
        });
        Post = initPostModel(sequelize);
        // Execute SQL files for schema and seed
        await executeSqlFile(sequelize, path.join(__dirname, '../../data/initdb/01_create_tables.sql'));
        await executeSqlFile(sequelize, path.join(__dirname, '../../data/initdb/02_seeding.sql'));
        app = express();
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use('/posts', createPostRouter(createPostController(Post)));
        // Patch auth middleware
        for (const layer of app._router?.stack || []) {
            if (layer?.route?.stack) {
                for (const r of layer.route.stack) {
                    if (r?.name === 'auth') r.handle = mockAuth;
                }
            }
        }
    });

    afterAll(async () => {
        if (sequelize) await sequelize.close();
        if (container) await container.stop();
    });

    // Place actual tests in a separate describe block
    describe('Post API', () => {
        it('should create and fetch a post', async () => {
            const postData = {
                titleFr: 'Galotti Bandnacht, on arrive !',
                titleDe: 'Danke, Vertantzt !',
                contentFr: 'Contenu FR',
                contentDe: 'Inhalt DE',
                img64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
            };
            const createRes = await request(app)
                .post('/posts')
                .send(postData)
                .expect(401);

            const getRes = await request(app)
                .get('/posts')
                .expect(200)
                .expect(res => {
                    expect(res.body.length).toBe(2);
                    expect(res.body[0].title_fr).toBe(postData.titleFr);
                    expect(res.body[1].title_de).toBe(postData.titleDe);
                });
        });
    });
}); 