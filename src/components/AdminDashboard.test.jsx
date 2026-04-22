import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

vi.mock('../hooks/useAdminAuth', () => ({
  useAdminAuth: vi.fn(() => ({
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  updateSubmission: vi.fn(),
  deleteSubmission: vi.fn(),
}));

import { useAdminAuth } from '../hooks/useAdminAuth';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSubmissions = [
  {
    id: 'uuid-1',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-06-01T12:00:00.000Z',
  },
  {
    id: 'uuid-2',
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    mobile: '9876543210',
    department: 'Marketing',
    submittedAt: '2024-06-15T08:30:00.000Z',
  },
  {
    id: 'uuid-3',
    fullName: 'Carol White',
    email: 'carol@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-07-01T10:00:00.000Z',
  },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSubmissions.mockReturnValue([]);
    updateSubmission.mockReturnValue({ success: true });
    deleteSubmission.mockReturnValue({ success: true });
    useAdminAuth.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  describe('rendering', () => {
    it('renders the dashboard heading', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    });

    it('renders the logout button', () => {
      renderDashboard();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('renders the submissions heading', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { name: /submissions/i })).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows "No submissions yet." when there are no submissions', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
    });

    it('displays total submissions as 0 when empty', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      const statCards = screen.getAllByText('0');
      expect(statCards.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('stat cards with data', () => {
    it('displays the correct total submissions count', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays the correct unique departments count', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Unique Departments')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays the latest submission date', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    });

    it('displays N/A for latest submission when no submissions exist', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('submissions table with data', () => {
    it('renders all submission rows', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol White')).toBeInTheDocument();
    });

    it('renders email addresses in the table', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    });

    it('renders department badges in the table', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      const engineeringBadges = screen.getAllByText('Engineering');
      expect(engineeringBadges.length).toBe(2);
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });

    it('renders edit buttons for each submission', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByRole('button', { name: /edit alice johnson/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit bob smith/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit carol white/i })).toBeInTheDocument();
    });

    it('renders delete buttons for each submission', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByRole('button', { name: /delete alice johnson/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete bob smith/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete carol white/i })).toBeInTheDocument();
    });
  });

  describe('edit modal', () => {
    it('opens edit modal when edit button is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));

      expect(screen.getByRole('dialog', { name: /edit submission/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    it('shows the email as read-only in the edit modal', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));

      const emailInput = screen.getByDisplayValue('alice@example.com');
      expect(emailInput).toBeDisabled();
    });

    it('closes edit modal when cancel is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));
      expect(screen.getByRole('dialog', { name: /edit submission/i })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /edit submission/i })).not.toBeInTheDocument();
      });
    });

    it('closes edit modal when close button is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));
      expect(screen.getByRole('dialog', { name: /edit submission/i })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close modal/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /edit submission/i })).not.toBeInTheDocument();
      });
    });

    it('calls updateSubmission and shows success banner on save', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      updateSubmission.mockReturnValue({ success: true });
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));

      const nameInput = screen.getByDisplayValue('Alice Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'Alice Updated');

      await user.click(screen.getByRole('button', { name: /save changes/i }));

      expect(updateSubmission).toHaveBeenCalledWith('uuid-1', {
        fullName: 'Alice Updated',
        mobile: '1234567890',
        department: 'Engineering',
      });

      await waitFor(() => {
        expect(screen.getByText(/submission updated successfully/i)).toBeInTheDocument();
      });
    });

    it('shows error banner when updateSubmission fails', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      updateSubmission.mockReturnValue({ success: false, error: 'Failed to update submission.' });
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to update submission/i)).toBeInTheDocument();
      });
    });
  });

  describe('delete submission', () => {
    it('calls deleteSubmission after confirmation and shows success banner', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue({ success: true });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /delete bob smith/i }));

      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('Bob Smith')
      );
      expect(deleteSubmission).toHaveBeenCalledWith('uuid-2');

      await waitFor(() => {
        expect(screen.getByText(/submission deleted successfully/i)).toBeInTheDocument();
      });

      window.confirm.mockRestore();
    });

    it('does not call deleteSubmission when confirmation is cancelled', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /delete bob smith/i }));

      expect(window.confirm).toHaveBeenCalled();
      expect(deleteSubmission).not.toHaveBeenCalled();

      window.confirm.mockRestore();
    });

    it('shows error banner when deleteSubmission fails', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue({ success: false, error: 'Submission not found' });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /delete alice johnson/i }));

      await waitFor(() => {
        expect(screen.getByText(/submission not found/i)).toBeInTheDocument();
      });

      window.confirm.mockRestore();
    });
  });

  describe('logout', () => {
    it('calls logout and navigates to /admin on logout click', async () => {
      const mockLogout = vi.fn();
      useAdminAuth.mockReturnValue({
        isAuthenticated: true,
        login: vi.fn(),
        logout: mockLogout,
      });
      getSubmissions.mockReturnValue([]);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /logout/i }));

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  describe('banner dismissal', () => {
    it('dismisses success banner when dismiss button is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue({ success: true });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByRole('button', { name: /delete alice johnson/i }));

      const banner = await screen.findByText(/submission deleted successfully/i);
      expect(banner).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /dismiss message/i }));

      await waitFor(() => {
        expect(screen.queryByText(/submission deleted successfully/i)).not.toBeInTheDocument();
      });

      window.confirm.mockRestore();
    });
  });

  describe('data refresh after operations', () => {
    it('reloads submissions after successful delete', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue({ success: true });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      const initialCallCount = getSubmissions.mock.calls.length;

      await user.click(screen.getByRole('button', { name: /delete alice johnson/i }));

      expect(getSubmissions.mock.calls.length).toBeGreaterThan(initialCallCount);

      window.confirm.mockRestore();
    });

    it('reloads submissions after successful update', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      updateSubmission.mockReturnValue({ success: true });
      const user = userEvent.setup();
      renderDashboard();

      const initialCallCount = getSubmissions.mock.calls.length;

      await user.click(screen.getByRole('button', { name: /edit alice johnson/i }));
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      expect(getSubmissions.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });
});