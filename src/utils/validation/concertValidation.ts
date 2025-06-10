import { CreateConcertRequest, UpdateConcertRequest, ValidationError, ValidationResult } from '../../types/index.js';

export class ConcertValidator {
    static validateCreateConcert(data: CreateConcertRequest): ValidationResult {
        const errors: ValidationError[] = [];

        // Validate city
        if (!data.city || data.city.trim().length === 0) {
            errors.push({
                field: 'city',
                message: 'City is required',
            });
        } else if (data.city.length > 255) {
            errors.push({
                field: 'city',
                message: 'City must be less than 255 characters',
            });
        }

        // Validate event date
        if (!data.eventDate || data.eventDate.trim().length === 0) {
            errors.push({
                field: 'eventDate',
                message: 'Event date is required',
            });
        } else {
            const date = new Date(data.eventDate);
            if (isNaN(date.getTime())) {
                errors.push({
                    field: 'eventDate',
                    message: 'Event date must be a valid date',
                });
            }
        }

        // Validate that either venue or event name is provided
        if ((!data.venue || data.venue.trim().length === 0) &&
            (!data.eventName || data.eventName.trim().length === 0)) {
            errors.push({
                field: 'venue',
                message: 'Either venue or event name is required',
            });
            errors.push({
                field: 'eventName',
                message: 'Either venue or event name is required',
            });
        }

        // Validate venue length if provided
        if (data.venue && data.venue.length > 255) {
            errors.push({
                field: 'venue',
                message: 'Venue must be less than 255 characters',
            });
        }

        // Validate event name length if provided
        if (data.eventName && data.eventName.length > 255) {
            errors.push({
                field: 'eventName',
                message: 'Event name must be less than 255 characters',
            });
        }

        // Validate event URL
        if (!data.eventUrl || data.eventUrl.trim().length === 0) {
            errors.push({
                field: 'eventUrl',
                message: 'Event URL is required',
            });
        } else if (!this.isValidUrl(data.eventUrl)) {
            errors.push({
                field: 'eventUrl',
                message: 'Event URL must be a valid URL',
            });
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    static validateUpdateConcert(data: UpdateConcertRequest): ValidationResult {
        const errors: ValidationError[] = [];

        // Validate ID
        if (!data.id || data.id.trim().length === 0) {
            errors.push({
                field: 'id',
                message: 'Concert ID is required',
            });
        } else if (isNaN(parseInt(data.id))) {
            errors.push({
                field: 'id',
                message: 'Concert ID must be a valid number',
            });
        }

        // Use the same validation as create for other fields
        const createValidation = this.validateCreateConcert(data);
        errors.push(...createValidation.errors);

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    private static isValidUrl(urlString: string): boolean {
        try {
            const url = new URL(urlString);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }

    static sanitizeConcertData(data: CreateConcertRequest | UpdateConcertRequest): CreateConcertRequest | UpdateConcertRequest {
        return {
            ...data,
            city: data.city?.trim(),
            eventDate: data.eventDate?.trim(),
            venue: data.venue?.trim(),
            eventName: data.eventName?.trim(),
            eventUrl: data.eventUrl?.trim(),
        };
    }
}

export default ConcertValidator; 