import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
  saveSubmissions,
} from './storage.js';

const STORAGE_KEY = 'hirehub_submissions';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage value is null', () => {
      localStorage.removeItem(STORAGE_KEY);
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when valid JSON array exists', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-06-01T12:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
    });

    it('resets to empty array and returns [] when localStorage contains corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('resets to empty array and returns [] when localStorage contains a non-array JSON value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('resets to empty array when localStorage contains a JSON string', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('hello'));
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });
  });

  describe('saveSubmissions', () => {
    it('saves an array of submissions to localStorage', () => {
      const data = [
        {
          id: '1',
          fullName: 'Test User',
          email: 'test@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      const result = saveSubmissions(data);
      expect(result).toEqual({ success: true });
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(data);
    });

    it('returns error when data is not an array', () => {
      const result = saveSubmissions('not an array');
      expect(result).toEqual({ success: false, error: 'Data must be an array' });
    });
  });

  describe('addSubmission', () => {
    it('adds a new submission with generated UUID and timestamp', () => {
      const submission = {
        fullName: 'John Smith',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Marketing',
      };

      const result = addSubmission(submission);
      expect(result).toEqual({ success: true });

      const submissions = getSubmissions();
      expect(submissions).toHaveLength(1);

      const saved = submissions[0];
      expect(saved.fullName).toBe('John Smith');
      expect(saved.email).toBe('john@example.com');
      expect(saved.mobile).toBe('9876543210');
      expect(saved.department).toBe('Marketing');
      expect(saved.id).toBeDefined();
      expect(typeof saved.id).toBe('string');
      expect(saved.id.length).toBeGreaterThan(0);
      expect(saved.submittedAt).toBeDefined();
      // Verify submittedAt is a valid ISO date string
      expect(new Date(saved.submittedAt).toISOString()).toBe(saved.submittedAt);
    });

    it('adds multiple submissions successfully', () => {
      addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Sales',
      });

      const submissions = getSubmissions();
      expect(submissions).toHaveLength(2);
      expect(submissions[0].email).toBe('one@example.com');
      expect(submissions[1].email).toBe('two@example.com');
    });

    it('returns error when adding a submission with a duplicate email', () => {
      addSubmission({
        fullName: 'First User',
        email: 'duplicate@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = addSubmission({
        fullName: 'Second User',
        email: 'duplicate@example.com',
        mobile: '0987654321',
        department: 'Sales',
      });

      expect(result).toEqual({ success: false, error: 'Duplicate email' });
      expect(getSubmissions()).toHaveLength(1);
    });

    it('detects duplicate email case-insensitively', () => {
      addSubmission({
        fullName: 'First User',
        email: 'Test@Example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = addSubmission({
        fullName: 'Second User',
        email: 'test@example.com',
        mobile: '0987654321',
        department: 'Sales',
      });

      expect(result).toEqual({ success: false, error: 'Duplicate email' });
      expect(getSubmissions()).toHaveLength(1);
    });

    it('generates unique UUIDs for each submission', () => {
      addSubmission({
        fullName: 'User A',
        email: 'a@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      addSubmission({
        fullName: 'User B',
        email: 'b@example.com',
        mobile: '2222222222',
        department: 'Sales',
      });

      const submissions = getSubmissions();
      expect(submissions[0].id).not.toBe(submissions[1].id);
    });
  });

  describe('updateSubmission', () => {
    it('updates an existing submission by id', () => {
      addSubmission({
        fullName: 'Original Name',
        email: 'original@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const submissions = getSubmissions();
      const id = submissions[0].id;

      const result = updateSubmission(id, { fullName: 'Updated Name' });
      expect(result).toEqual({ success: true });

      const updated = getSubmissions();
      expect(updated[0].fullName).toBe('Updated Name');
      expect(updated[0].email).toBe('original@example.com');
      expect(updated[0].id).toBe(id);
    });

    it('updates multiple fields at once', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const id = getSubmissions()[0].id;

      const result = updateSubmission(id, {
        fullName: 'New Name',
        mobile: '9999999999',
        department: 'Marketing',
      });
      expect(result).toEqual({ success: true });

      const updated = getSubmissions()[0];
      expect(updated.fullName).toBe('New Name');
      expect(updated.mobile).toBe('9999999999');
      expect(updated.department).toBe('Marketing');
      expect(updated.email).toBe('test@example.com');
    });

    it('returns error when submission id is not found', () => {
      const result = updateSubmission('nonexistent-id', { fullName: 'Test' });
      expect(result).toEqual({ success: false, error: 'Submission not found' });
    });

    it('returns error when updating email to a duplicate', () => {
      addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Sales',
      });

      const submissions = getSubmissions();
      const secondId = submissions[1].id;

      const result = updateSubmission(secondId, { email: 'one@example.com' });
      expect(result).toEqual({ success: false, error: 'Duplicate email' });

      // Verify original data is unchanged
      const afterUpdate = getSubmissions();
      expect(afterUpdate[1].email).toBe('two@example.com');
    });

    it('allows updating email to the same value (no false duplicate)', () => {
      addSubmission({
        fullName: 'User One',
        email: 'same@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      const id = getSubmissions()[0].id;

      const result = updateSubmission(id, { email: 'same@example.com' });
      expect(result).toEqual({ success: true });
    });

    it('only modifies the correct entry when multiple submissions exist', () => {
      addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Sales',
      });

      const submissions = getSubmissions();
      const firstId = submissions[0].id;

      updateSubmission(firstId, { fullName: 'Updated One' });

      const after = getSubmissions();
      expect(after[0].fullName).toBe('Updated One');
      expect(after[1].fullName).toBe('User Two');
    });
  });

  describe('deleteSubmission', () => {
    it('deletes a submission by id', () => {
      addSubmission({
        fullName: 'To Delete',
        email: 'delete@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const id = getSubmissions()[0].id;

      const result = deleteSubmission(id);
      expect(result).toEqual({ success: true });
      expect(getSubmissions()).toHaveLength(0);
    });

    it('returns error when submission id is not found', () => {
      const result = deleteSubmission('nonexistent-id');
      expect(result).toEqual({ success: false, error: 'Submission not found' });
    });

    it('only removes the targeted submission and leaves others intact', () => {
      addSubmission({
        fullName: 'Keep Me',
        email: 'keep@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      addSubmission({
        fullName: 'Delete Me',
        email: 'delete@example.com',
        mobile: '2222222222',
        department: 'Sales',
      });
      addSubmission({
        fullName: 'Also Keep',
        email: 'alsokeep@example.com',
        mobile: '3333333333',
        department: 'Marketing',
      });

      const submissions = getSubmissions();
      const deleteId = submissions[1].id;

      const result = deleteSubmission(deleteId);
      expect(result).toEqual({ success: true });

      const remaining = getSubmissions();
      expect(remaining).toHaveLength(2);
      expect(remaining[0].email).toBe('keep@example.com');
      expect(remaining[1].email).toBe('alsokeep@example.com');
    });
  });

  describe('isEmailDuplicate', () => {
    it('returns false when no submissions exist', () => {
      expect(isEmailDuplicate('test@example.com')).toBe(false);
    });

    it('returns true when email already exists', () => {
      addSubmission({
        fullName: 'Existing User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('existing@example.com')).toBe(true);
    });

    it('performs case-insensitive comparison', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'Test@Example.COM',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('test@example.com')).toBe(true);
      expect(isEmailDuplicate('TEST@EXAMPLE.COM')).toBe(true);
    });

    it('returns false for a non-existing email', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('different@example.com')).toBe(false);
    });

    it('returns false when email is empty or falsy', () => {
      expect(isEmailDuplicate('')).toBe(false);
      expect(isEmailDuplicate(null)).toBe(false);
      expect(isEmailDuplicate(undefined)).toBe(false);
    });
  });

  describe('corrupted localStorage handling', () => {
    it('recovers from corrupted JSON by resetting to empty array', () => {
      localStorage.setItem(STORAGE_KEY, 'this is not json{{{');
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('recovers from non-array JSON value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(42));
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('allows adding submissions after corrupted storage recovery', () => {
      localStorage.setItem(STORAGE_KEY, 'corrupted!!!');
      getSubmissions(); // triggers recovery

      const result = addSubmission({
        fullName: 'Recovery User',
        email: 'recovery@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(result).toEqual({ success: true });
      expect(getSubmissions()).toHaveLength(1);
      expect(getSubmissions()[0].fullName).toBe('Recovery User');
    });

    it('handles localStorage.setItem throwing an error on addSubmission', () => {
      const originalSetItem = Storage.prototype.setItem;
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key) => {
        if (key === STORAGE_KEY) {
          throw new Error('QuotaExceededError');
        }
        return originalSetItem.call(localStorage, key);
      });

      const result = addSubmission({
        fullName: 'Fail User',
        email: 'fail@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(result).toEqual({ success: false, error: 'Storage write failed' });
    });
  });
});