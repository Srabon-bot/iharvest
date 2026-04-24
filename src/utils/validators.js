/**
 * iHarvest — Validation utilities
 * Input validation helpers used by services and UI forms.
 */

import { ROLES, LIVESTOCK_TYPES } from './constants.js';

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength.
 * Must be at least 8 characters with at least one uppercase, one lowercase, and one digit.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate that a string is a recognized user role.
 * @param {string} role
 * @returns {boolean}
 */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/**
 * Validate that a string is a recognized livestock type.
 * @param {string} type
 * @returns {boolean}
 */
export function isValidLivestockType(type) {
  return Object.values(LIVESTOCK_TYPES).includes(type);
}

/**
 * Validate a package creation payload.
 * @param {{ name: string, type: string, price: number, livestockCount: number, durationMonths: number, expectedROI: number }} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePackage(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.push('Package name is required and must be at least 3 characters.');
  }
  if (!isValidLivestockType(data.type)) {
    errors.push(`Invalid livestock type. Must be one of: ${Object.values(LIVESTOCK_TYPES).join(', ')}`);
  }
  if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
    errors.push('Price must be a positive number (BDT).');
  }
  if (!data.livestockCount || typeof data.livestockCount !== 'number' || data.livestockCount <= 0) {
    errors.push('Livestock count must be a positive integer.');
  }
  if (!data.durationMonths || typeof data.durationMonths !== 'number' || data.durationMonths <= 0) {
    errors.push('Duration (months) must be a positive number.');
  }
  if (data.expectedROI == null || typeof data.expectedROI !== 'number' || data.expectedROI < 0) {
    errors.push('Expected ROI must be a non-negative number (%).');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a survey submission payload.
 * @param {{ livestockId: string, fsoId: string, farmerId: string, healthStatus: string, feedUsed: number, mortality: number }} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSurvey(data) {
  const errors = [];

  if (!data.livestockId) errors.push('Livestock ID is required.');
  if (!data.fsoId) errors.push('FSO ID is required.');
  if (!data.farmerId) errors.push('Farmer ID is required.');
  if (!data.healthStatus) errors.push('Health status is required.');
  if (data.feedUsed == null || data.feedUsed < 0) errors.push('Feed used must be a non-negative number.');
  if (data.mortality == null || data.mortality < 0) errors.push('Mortality count must be a non-negative number.');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a vet request payload.
 * @param {{ farmerId: string, fsoId: string, issue: string }} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateVetRequest(data) {
  const errors = [];

  if (!data.farmerId) errors.push('Farmer ID is required.');
  if (!data.fsoId) errors.push('FSO ID is required.');
  if (!data.issue || data.issue.trim().length < 10) {
    errors.push('Issue description is required and must be at least 10 characters.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check that a value is a non-empty string.
 * @param {*} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check that a value is a positive number.
 * @param {*} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  return typeof value === 'number' && value > 0;
}
