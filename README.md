# HireHub Onboarding Portal

A modern employee onboarding portal built with React 18+, Vite, and React Router v6. This application streamlines the new hire onboarding process with an intuitive interface for both administrators and new employees.

## Tech Stack

- **React 18+** — UI library
- **Vite** — Build tool and dev server
- **React Router v6** — Client-side routing
- **Plain CSS** — Styling (no CSS frameworks)
- **localStorage** — Client-side data persistence

## Features

- **Admin Dashboard** — Manage onboarding tasks, view employee progress, and assign workflows
- **Employee Portal** — New hires can view and complete assigned onboarding tasks
- **Task Management** — Create, edit, and delete onboarding tasks and checklists
- **Progress Tracking** — Visual progress indicators for each employee's onboarding journey
- **Authentication** — Role-based access control for admin and employee users
- **Responsive Design** — Works across desktop and mobile devices
- **Persistent State** — All data stored in localStorage for seamless sessions

## Folder Structure

```
hirehub-onboarding-portal/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm 7+ installed

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Admin Credentials

Use the following credentials to log in as an administrator:

- **Username:** `admin`
- **Password:** `admin`

## Deployment (Vercel)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

For subsequent deployments, every push to the main branch will trigger an automatic deployment.

### Manual Deployment via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to link your project and deploy.

## Environment Variables

Environment variables are accessed via `import.meta.env.VITE_*` in the application. Create a `.env` file in the project root if needed:

```
VITE_APP_TITLE=HireHub Onboarding Portal
```

## License

**Private** — All rights reserved.