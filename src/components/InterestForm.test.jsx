import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InterestForm } from './InterestForm';

vi.mock('../utils/storage.js', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

import { addSubmission, isEmailDuplicate } from '../utils/storage.js';

function renderInterestForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addSubmission.mockReturnValue({ success: true });
    isEmailDuplicate.mockReturnValue(false);
  });

  describe('rendering', () => {
    it('renders the form heading', () => {
      renderInterestForm();
      expect(screen.getByRole('heading', { name: /express your interest/i })).toBeInTheDocument();
    });

    it('renders the full name input field', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('renders the email input field', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders the mobile number input field', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    });

    it('renders the department select field', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/department of interest/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderInterestForm();
      expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
    });

    it('renders the Back to Home link', () => {
      renderInterestForm();
      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('renders department options', () => {
      renderInterestForm();
      expect(screen.getByRole('option', { name: /select a department/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Marketing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sales' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Human Resources' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Finance' })).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('shows validation error for empty full name on submit', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    });

    it('shows validation error for empty email on submit', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows validation error for empty mobile on submit', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/mobile number is required/i)).toBeInTheDocument();
    });

    it('shows validation error for empty department on submit', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/department selection is required/i)).toBeInTheDocument();
    });

    it('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'not-an-email');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    it('shows validation error for name with special characters', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane123');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/full name must contain only letters and spaces/i)).toBeInTheDocument();
    });

    it('shows validation error for mobile with non-digit characters', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '12345abcde');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/mobile number must contain only digits/i)).toBeInTheDocument();
    });

    it('shows validation error for mobile shorter than 10 digits', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '12345');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/mobile number must be between 10 and 15 digits/i)).toBeInTheDocument();
    });

    it('does not call addSubmission when validation fails', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('duplicate email', () => {
    it('shows duplicate email error when email already exists', async () => {
      isEmailDuplicate.mockReturnValue(true);

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'duplicate@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/this email has already been submitted/i)).toBeInTheDocument();
      expect(addSubmission).not.toHaveBeenCalled();
    });

    it('shows duplicate email error when addSubmission returns duplicate error', async () => {
      isEmailDuplicate.mockReturnValue(false);
      addSubmission.mockReturnValue({ success: false, error: 'Duplicate email' });

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'duplicate@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/this email has already been submitted/i)).toBeInTheDocument();
    });
  });

  describe('successful submission', () => {
    it('shows success banner after valid submission', async () => {
      addSubmission.mockReturnValue({ success: true });
      isEmailDuplicate.mockReturnValue(false);

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/your application has been submitted successfully/i)).toBeInTheDocument();
    });

    it('clears form fields after successful submission', async () => {
      addSubmission.mockReturnValue({ success: true });
      isEmailDuplicate.mockReturnValue(false);

      const user = userEvent.setup();
      renderInterestForm();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const mobileInput = screen.getByLabelText(/mobile number/i);
      const departmentSelect = screen.getByLabelText(/department of interest/i);

      await user.type(fullNameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.type(mobileInput, '1234567890');
      await user.selectOptions(departmentSelect, 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      await waitFor(() => {
        expect(fullNameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(mobileInput).toHaveValue('');
        expect(departmentSelect).toHaveValue('');
      });
    });

    it('calls addSubmission with trimmed form data', async () => {
      addSubmission.mockReturnValue({ success: true });
      isEmailDuplicate.mockReturnValue(false);

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), '  Jane Doe  ');
      await user.type(screen.getByLabelText(/email/i), '  jane@example.com  ');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(addSubmission).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });
    });

    it('success banner can be dismissed', async () => {
      addSubmission.mockReturnValue({ success: true });
      isEmailDuplicate.mockReturnValue(false);

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      const successBanner = await screen.findByText(/your application has been submitted successfully/i);
      expect(successBanner).toBeInTheDocument();

      const dismissButton = screen.getByLabelText(/dismiss success message/i);
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText(/your application has been submitted successfully/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('storage error handling', () => {
    it('shows error banner when addSubmission returns a non-duplicate error', async () => {
      addSubmission.mockReturnValue({ success: false, error: 'Storage write failed' });
      isEmailDuplicate.mockReturnValue(false);

      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit application/i }));

      expect(await screen.findByText(/storage write failed/i)).toBeInTheDocument();
    });
  });
});