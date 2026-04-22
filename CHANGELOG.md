# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Landing Page** with hero section showcasing the HireHub platform and feature cards highlighting key onboarding capabilities.
- **Interest Form** with client-side validation for name, email, and message fields, including localStorage persistence so users do not lose their input on page refresh.
- **Admin Login** with hardcoded credentials for demonstration purposes, providing secure access to the admin dashboard.
- **Admin Dashboard** with full CRUD operations for managing onboarding submissions — create, read, update, and delete entries stored in localStorage.
- **Responsive Design** ensuring a seamless experience across desktop, tablet, and mobile devices.
- **SPA Routing** using React Router with client-side navigation between landing page, interest form, admin login, and admin dashboard.
- **Vercel Deployment Support** with `vercel.json` rewrite rules to handle client-side routing and prevent 404 errors on direct URL access.
- **Form Validation** with real-time error feedback for required fields, email format checking, and minimum length requirements.
- **Protected Routes** preventing unauthenticated users from accessing the admin dashboard.
- **Toast Notifications** providing user feedback on form submissions, login attempts, and CRUD operations.