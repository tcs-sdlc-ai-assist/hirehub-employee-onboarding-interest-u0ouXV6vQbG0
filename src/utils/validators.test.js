import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from './validators';

describe('validateName', () => {
  it('returns error for undefined input', () => {
    expect(validateName(undefined)).toBe('Full name is required');
  });

  it('returns error for null input', () => {
    expect(validateName(null)).toBe('Full name is required');
  });

  it('returns error for empty string', () => {
    expect(validateName('')).toBe('Full name is required');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateName('   ')).toBe('Full name is required');
  });

  it('returns error for name shorter than 2 characters', () => {
    expect(validateName('A')).toBe('Full name must be at least 2 characters');
  });

  it('returns error for name exceeding 50 characters', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toBe('Full name must not exceed 50 characters');
  });

  it('returns error for name containing numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only letters and spaces');
  });

  it('returns error for name containing special characters', () => {
    expect(validateName('John-Doe')).toBe('Full name must contain only letters and spaces');
  });

  it('returns empty string for valid name', () => {
    expect(validateName('Jane Doe')).toBe('');
  });

  it('returns empty string for valid name with only letters', () => {
    expect(validateName('Alice')).toBe('');
  });

  it('returns empty string for valid two-character name', () => {
    expect(validateName('Al')).toBe('');
  });

  it('returns empty string for valid name at 50 characters', () => {
    const name = 'A'.repeat(50);
    expect(validateName(name)).toBe('');
  });

  it('returns empty string for name with multiple spaces', () => {
    expect(validateName('John Michael Doe')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns error for undefined input', () => {
    expect(validateEmail(undefined)).toBe('Email is required');
  });

  it('returns error for null input', () => {
    expect(validateEmail(null)).toBe('Email is required');
  });

  it('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error for email exceeding 100 characters', () => {
    const longEmail = 'a'.repeat(90) + '@example.com';
    expect(validateEmail(longEmail)).toBe('Email must not exceed 100 characters');
  });

  it('returns error for email without @ symbol', () => {
    expect(validateEmail('janedoe.com')).toBe('Please enter a valid email address');
  });

  it('returns error for email without domain', () => {
    expect(validateEmail('jane@')).toBe('Please enter a valid email address');
  });

  it('returns error for email without TLD', () => {
    expect(validateEmail('jane@example')).toBe('Please enter a valid email address');
  });

  it('returns error for email with spaces', () => {
    expect(validateEmail('jane doe@example.com')).toBe('Please enter a valid email address');
  });

  it('returns error for email with double dots in domain', () => {
    expect(validateEmail('jane@example..com')).toBe('Please enter a valid email address');
  });

  it('returns empty string for valid email', () => {
    expect(validateEmail('jane.doe@example.com')).toBe('');
  });

  it('returns empty string for valid email with plus sign', () => {
    expect(validateEmail('jane+tag@example.com')).toBe('');
  });

  it('returns empty string for valid email with subdomain', () => {
    expect(validateEmail('jane@mail.example.com')).toBe('');
  });

  it('returns empty string for valid email with numbers', () => {
    expect(validateEmail('jane123@example.com')).toBe('');
  });
});

describe('validateMobile', () => {
  it('returns error for undefined input', () => {
    expect(validateMobile(undefined)).toBe('Mobile number is required');
  });

  it('returns error for null input', () => {
    expect(validateMobile(null)).toBe('Mobile number is required');
  });

  it('returns error for empty string', () => {
    expect(validateMobile('')).toBe('Mobile number is required');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required');
  });

  it('returns error for mobile with letters', () => {
    expect(validateMobile('12345abcde')).toBe('Mobile number must contain only digits');
  });

  it('returns error for mobile with special characters', () => {
    expect(validateMobile('+1234567890')).toBe('Mobile number must contain only digits');
  });

  it('returns error for mobile with dashes', () => {
    expect(validateMobile('123-456-7890')).toBe('Mobile number must contain only digits');
  });

  it('returns error for mobile with spaces', () => {
    expect(validateMobile('123 456 7890')).toBe('Mobile number must contain only digits');
  });

  it('returns error for mobile shorter than 10 digits', () => {
    expect(validateMobile('123456789')).toBe('Mobile number must be between 10 and 15 digits');
  });

  it('returns error for mobile longer than 15 digits', () => {
    expect(validateMobile('1234567890123456')).toBe('Mobile number must be between 10 and 15 digits');
  });

  it('returns empty string for valid 10-digit mobile', () => {
    expect(validateMobile('1234567890')).toBe('');
  });

  it('returns empty string for valid 15-digit mobile', () => {
    expect(validateMobile('123456789012345')).toBe('');
  });

  it('returns empty string for valid 12-digit mobile', () => {
    expect(validateMobile('123456789012')).toBe('');
  });
});

describe('validateDepartment', () => {
  it('returns error for undefined input', () => {
    expect(validateDepartment(undefined)).toBe('Department selection is required');
  });

  it('returns error for null input', () => {
    expect(validateDepartment(null)).toBe('Department selection is required');
  });

  it('returns error for empty string', () => {
    expect(validateDepartment('')).toBe('Department selection is required');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateDepartment('   ')).toBe('Department selection is required');
  });

  it('returns error for invalid department name', () => {
    expect(validateDepartment('Accounting')).toBe('Please select a valid department');
  });

  it('returns error for department with wrong casing', () => {
    expect(validateDepartment('engineering')).toBe('Please select a valid department');
  });

  it('returns empty string for each allowed department', () => {
    ALLOWED_DEPARTMENTS.forEach((dept) => {
      expect(validateDepartment(dept)).toBe('');
    });
  });

  it('returns empty string for Engineering', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for Human Resources', () => {
    expect(validateDepartment('Human Resources')).toBe('');
  });

  it('returns empty string for Marketing', () => {
    expect(validateDepartment('Marketing')).toBe('');
  });
});