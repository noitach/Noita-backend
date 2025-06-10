import { describe, it, expect } from '@jest/globals';
import { PostValidator } from '../../src/utils/validation/postValidation.js';
import type { CreatePostRequest, UpdatePostRequest } from '../../src/types/index.js';

describe('PostValidator', () => {
    describe('validateCreatePost', () => {
        it('should pass validation with valid data', () => {
            const validData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
                img64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            };

            const result = PostValidator.validateCreatePost(validData);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail validation when French title is missing', () => {
            const invalidData: CreatePostRequest = {
                titleFr: '',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'titleFr',
                message: 'French title is required',
            });
        });

        it('should fail validation when German title is missing', () => {
            const invalidData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: '',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'titleDe',
                message: 'German title is required',
            });
        });

        it('should fail validation when French content is missing', () => {
            const invalidData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: '',
                contentDe: 'Test content in German',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'contentFr',
                message: 'French content is required',
            });
        });

        it('should fail validation when German content is missing', () => {
            const invalidData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: '',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'contentDe',
                message: 'German content is required',
            });
        });

        it('should fail validation when title is too long', () => {
            const longTitle = 'a'.repeat(256);
            const invalidData: CreatePostRequest = {
                titleFr: longTitle,
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'titleFr',
                message: 'French title must be less than 255 characters',
            });
        });

        it('should fail validation with invalid image format', () => {
            const invalidData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
                img64: 'invalid-image-data',
            };

            const result = PostValidator.validateCreatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'img64',
                message: 'Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed',
            });
        });

        it('should pass validation without image', () => {
            const validData: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
            };

            const result = PostValidator.validateCreatePost(validData);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('validateUpdatePost', () => {
        it('should pass validation with valid data', () => {
            const validData: UpdatePostRequest = {
                id: '1',
                titleFr: 'Updated Title FR',
                titleDe: 'Updated Title DE',
                contentFr: 'Updated content in French',
                contentDe: 'Updated content in German',
            };

            const result = PostValidator.validateUpdatePost(validData);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail validation when ID is missing', () => {
            const invalidData: UpdatePostRequest = {
                id: '',
                titleFr: 'Updated Title FR',
                titleDe: 'Updated Title DE',
                contentFr: 'Updated content in French',
                contentDe: 'Updated content in German',
            };

            const result = PostValidator.validateUpdatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'id',
                message: 'Post ID is required',
            });
        });

        it('should fail validation when ID is not a number', () => {
            const invalidData: UpdatePostRequest = {
                id: 'not-a-number',
                titleFr: 'Updated Title FR',
                titleDe: 'Updated Title DE',
                contentFr: 'Updated content in French',
                contentDe: 'Updated content in German',
            };

            const result = PostValidator.validateUpdatePost(invalidData);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'id',
                message: 'Post ID must be a valid number',
            });
        });
    });

    describe('sanitizePostData', () => {
        it('should trim whitespace from all string fields', () => {
            const dirtyData: CreatePostRequest = {
                titleFr: '  Test Title FR  ',
                titleDe: '  Test Title DE  ',
                contentFr: '  Test content in French  ',
                contentDe: '  Test content in German  ',
            };

            const sanitized = PostValidator.sanitizePostData(dirtyData);

            expect(sanitized.titleFr).toBe('Test Title FR');
            expect(sanitized.titleDe).toBe('Test Title DE');
            expect(sanitized.contentFr).toBe('Test content in French');
            expect(sanitized.contentDe).toBe('Test content in German');
        });

        it('should preserve other properties', () => {
            const data: CreatePostRequest = {
                titleFr: 'Test Title FR',
                titleDe: 'Test Title DE',
                contentFr: 'Test content in French',
                contentDe: 'Test content in German',
                img64: 'data:image/png;base64,test',
            };

            const sanitized = PostValidator.sanitizePostData(data);

            expect(sanitized.img64).toBe('data:image/png;base64,test');
        });
    });
}); 