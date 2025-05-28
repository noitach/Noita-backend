import { Sequelize } from 'sequelize';

export function createSequelizeInstance({
  database = process.env.DB_NAME,
  username = process.env.DB_USER,
  password = process.env.DB_PASS,
  host = process.env.DB_HOST || '127.0.0.1',
  port = 5432,
  dialect = 'postgres',
  logging = false,
  ssl = process.env.DB_SSL === 'true',
} = {}) {
  return new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    dialectOptions: ssl
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
      : {},
    logging,
  });
}

const sequelize = createSequelizeInstance();

export default sequelize;