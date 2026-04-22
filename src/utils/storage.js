const STORAGE_KEY = 'hirehub_submissions';

/**
 * Generates a UUID v4 string.
 * @returns {string} A UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves all submissions from localStorage.
 * Handles corrupted JSON by resetting to an empty array.
 * @returns {Array<Object>} Array of submission objects
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

/**
 * Saves the entire submissions array to localStorage.
 * @param {Array<Object>} data - Array of submission objects to persist
 * @returns {{ success: boolean, error?: string }}
 */
export function saveSubmissions(data) {
  try {
    if (!Array.isArray(data)) {
      return { success: false, error: 'Data must be an array' };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Storage write failed' };
  }
}

/**
 * Adds a new submission to localStorage.
 * Generates a UUID and ISO timestamp automatically.
 * Checks for duplicate email before adding.
 * @param {{ fullName: string, email: string, mobile: string, department: string }} submission - Submission data without id/timestamp
 * @returns {{ success: boolean, error?: string }}
 */
export function addSubmission(submission) {
  try {
    const submissions = getSubmissions();

    if (isEmailDuplicate(submission.email)) {
      return { success: false, error: 'Duplicate email' };
    }

    const newSubmission = {
      id: generateUUID(),
      fullName: submission.fullName,
      email: submission.email,
      mobile: submission.mobile,
      department: submission.department,
      submittedAt: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Storage write failed' };
  }
}

/**
 * Updates an existing submission by id.
 * @param {string} id - The UUID of the submission to update
 * @param {Object} updates - Partial submission fields to merge
 * @returns {{ success: boolean, error?: string }}
 */
export function updateSubmission(id, updates) {
  try {
    const submissions = getSubmissions();
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, error: 'Submission not found' };
    }

    if (updates.email && updates.email !== submissions[index].email) {
      const duplicate = submissions.some(
        (s) => s.id !== id && s.email.toLowerCase() === updates.email.toLowerCase()
      );
      if (duplicate) {
        return { success: false, error: 'Duplicate email' };
      }
    }

    submissions[index] = { ...submissions[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Storage write failed' };
  }
}

/**
 * Deletes a submission by id.
 * @param {string} id - The UUID of the submission to delete
 * @returns {{ success: boolean, error?: string }}
 */
export function deleteSubmission(id) {
  try {
    const submissions = getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);

    if (filtered.length === submissions.length) {
      return { success: false, error: 'Submission not found' };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Storage write failed' };
  }
}

/**
 * Checks if an email already exists in submissions.
 * @param {string} email - The email to check
 * @returns {boolean} True if the email is already used
 */
export function isEmailDuplicate(email) {
  if (!email) {
    return false;
  }
  const submissions = getSubmissions();
  return submissions.some(
    (s) => s.email && s.email.toLowerCase() === email.toLowerCase()
  );
}