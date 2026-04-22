/**
 * Validation utility module for candidate application form fields.
 * Each function takes a string input and returns an error message string.
 * Returns empty string if the input is valid.
 */

const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Legal',
  'Support',
];

/**
 * Validates a candidate's full name.
 * @param {string} name - The name to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateName(name) {
  if (name === undefined || name === null) {
    return 'Full name is required';
  }
  const trimmed = String(name).trim();
  if (trimmed.length === 0) {
    return 'Full name is required';
  }
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (trimmed.length > 50) {
    return 'Full name must not exceed 50 characters';
  }
  const namePattern = /^[a-zA-Z\s]+$/;
  if (!namePattern.test(trimmed)) {
    return 'Full name must contain only letters and spaces';
  }
  return '';
}

/**
 * Validates a candidate's email address.
 * @param {string} email - The email to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
  if (email === undefined || email === null) {
    return 'Email is required';
  }
  const trimmed = String(email).trim();
  if (trimmed.length === 0) {
    return 'Email is required';
  }
  if (trimmed.length > 100) {
    return 'Email must not exceed 100 characters';
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return '';
}

/**
 * Validates a candidate's mobile phone number.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateMobile(mobile) {
  if (mobile === undefined || mobile === null) {
    return 'Mobile number is required';
  }
  const trimmed = String(mobile).trim();
  if (trimmed.length === 0) {
    return 'Mobile number is required';
  }
  const digitsOnly = /^\d+$/;
  if (!digitsOnly.test(trimmed)) {
    return 'Mobile number must contain only digits';
  }
  if (trimmed.length < 10 || trimmed.length > 15) {
    return 'Mobile number must be between 10 and 15 digits';
  }
  return '';
}

/**
 * Validates a candidate's department selection.
 * @param {string} department - The department to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateDepartment(department) {
  if (department === undefined || department === null) {
    return 'Department selection is required';
  }
  const trimmed = String(department).trim();
  if (trimmed.length === 0) {
    return 'Department selection is required';
  }
  if (!ALLOWED_DEPARTMENTS.includes(trimmed)) {
    return 'Please select a valid department';
  }
  return '';
}

export { ALLOWED_DEPARTMENTS };

export const Validator = {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
};