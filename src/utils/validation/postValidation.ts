import { CreatePostRequest, UpdatePostRequest, ValidationError, ValidationResult } from '../../types/index.js';

export class PostValidator {
    static validateCreatePost(data: CreatePostRequest): ValidationResult {
        const errors: ValidationError[] = [];

        // Validate French title
        if (!data.titleFr || data.titleFr.trim().length === 0) {
            errors.push({
                field: 'titleFr',
                message: 'French title is required',
            });
        } else if (data.titleFr.length > 255) {
            errors.push({
                field: 'titleFr',
                message: 'French title must be less than 255 characters',
            });
        }

        // Validate German title
        if (!data.titleDe || data.titleDe.trim().length === 0) {
            errors.push({
                field: 'titleDe',
                message: 'German title is required',
            });
        } else if (data.titleDe.length > 255) {
            errors.push({
                field: 'titleDe',
                message: 'German title must be less than 255 characters',
            });
        }

        // Validate French content
        if (!data.contentFr || data.contentFr.trim().length === 0) {
            errors.push({
                field: 'contentFr',
                message: 'French content is required',
            });
        }

        // Validate German content
        if (!data.contentDe || data.contentDe.trim().length === 0) {
            errors.push({
                field: 'contentDe',
                message: 'German content is required',
            });
        }

        // Validate image data if provided
        if (data.img64) {
            if (!this.isValidBase64Image(data.img64)) {
                errors.push({
                    field: 'img64',
                    message: 'Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed',
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    static validateUpdatePost(data: UpdatePostRequest): ValidationResult {
        const errors: ValidationError[] = [];

        // Validate ID
        if (!data.id || data.id.trim().length === 0) {
            errors.push({
                field: 'id',
                message: 'Post ID is required',
            });
        } else if (isNaN(parseInt(data.id))) {
            errors.push({
                field: 'id',
                message: 'Post ID must be a valid number',
            });
        }

        // Use the same validation as create for other fields
        const createValidation = this.validateCreatePost(data);
        errors.push(...createValidation.errors);

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    private static isValidBase64Image(imageData: string): boolean {
        const validFormats = [
            'data:image/jpeg;base64,',
            'data:image/png;base64,',
            'data:image/gif;base64,',
            'data:image/webp;base64,',
        ];

        return validFormats.some(format => imageData.startsWith(format));
    }

    static sanitizePostData(data: CreatePostRequest | UpdatePostRequest): CreatePostRequest | UpdatePostRequest {
        return {
            ...data,
            titleFr: data.titleFr?.trim(),
            titleDe: data.titleDe?.trim(),
            contentFr: data.contentFr?.trim(),
            contentDe: data.contentDe?.trim(),
        };
    }
}

export default PostValidator; 