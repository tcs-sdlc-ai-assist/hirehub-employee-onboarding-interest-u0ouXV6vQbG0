# Deployment Guide — HireHub Onboarding Portal

## Table of Contents

- [Overview](#overview)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Overview

HireHub Onboarding Portal is a single-page application (SPA) built with **React 18+** and **Vite**. The recommended deployment platform is **Vercel**, which provides automatic framework detection, preview deployments, and zero-config CI/CD.

---

## Build Configuration

| Setting          | Value         |
| ---------------- | ------------- |
| Build Command    | `vite build`  |
| Output Directory | `dist`        |
| Install Command  | `npm install`  |
| Dev Command      | `vite`        |
| Node Version     | 18.x or 20.x |

To build locally and verify the production output:

```bash
npm install
npm run build
```

The production-ready files will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Vercel Deployment

### Step 1: Connect Your Git Repository

1. Log in to [Vercel](https://vercel.com) (or create an account).
2. Click **"Add New…" → "Project"** from the dashboard.
3. Select your Git provider (GitHub, GitLab, or Bitbucket).
4. Find and import the **hirehub-onboarding-portal** repository.

### Step 2: Configure Project Settings

Vercel will auto-detect the **Vite** framework. Verify the following settings on the configuration screen:

- **Framework Preset:** Vite
- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

These should be populated automatically. If not, enter them manually.

### Step 3: Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, run the build, and deploy the application.
3. Once complete, you will receive a production URL (e.g., `https://hirehub-onboarding-portal.vercel.app`).

### Automatic Deployments

After the initial setup, every push to the **main** branch triggers a production deployment. Pull requests automatically generate **preview deployments** with unique URLs for testing.

---

## SPA Rewrite Configuration

Since this is a single-page application using client-side routing, all routes must be rewritten to serve `index.html`. Without this configuration, navigating directly to a route like `/onboarding/step-2` will return a 404 error.

Create a `vercel.json` file in the project root with the following content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for every route that doesn't match a static file, allowing React Router to handle routing on the client side.

---

## Environment Variables

**No environment variables are required** for the base deployment of this application.

If you add environment variables in the future, follow these guidelines:

- All client-side environment variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL` — **never** use `process.env`.
- Add variables in Vercel under **Project Settings → Environment Variables**.
- You can scope variables to **Production**, **Preview**, and **Development** environments independently.

Example of adding a variable in the future:

```bash
# In a .env file for local development
VITE_API_URL=https://api.example.com
```

```javascript
// In your application code
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Troubleshooting

### 404 Errors on Direct Navigation or Page Refresh

**Symptom:** Navigating directly to a route (e.g., `/onboarding/step-3`) or refreshing the page returns a 404 error.

**Cause:** The server is looking for a file matching the route path instead of serving the SPA entry point.

**Solution:** Ensure `vercel.json` exists in the project root with the SPA rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

After adding or modifying `vercel.json`, commit and push the change to trigger a redeployment.

### Build Fails with Module Not Found

**Symptom:** The build fails with errors like `Cannot find module '...'` or `Module not found`.

**Solution:**
1. Delete `node_modules` and `package-lock.json` locally.
2. Run `npm install` to regenerate the lock file.
3. Verify the import paths in the failing file are correct (case-sensitive on Linux/Vercel).
4. Commit the updated `package-lock.json` and push.

### Blank Page After Deployment

**Symptom:** The deployment succeeds but the page is blank with no visible content.

**Solution:**
1. Open the browser developer console and check for JavaScript errors.
2. Verify that `base` in `vite.config.js` is set correctly (it should be `'/'` for root deployments or omitted entirely).
3. Ensure the output directory is set to `dist` in Vercel project settings.

### Assets Not Loading (CSS, Images, JS)

**Symptom:** The page loads but styles are missing, images are broken, or JavaScript files return 404.

**Solution:**
1. Confirm the **Output Directory** in Vercel is set to `dist` (not `build` or `public`).
2. Check that asset paths in your code use relative imports or the `public/` directory correctly.
3. Verify there are no hardcoded absolute paths that assume a specific domain.

### Stale Deployment / Changes Not Reflected

**Symptom:** You pushed changes but the live site still shows the old version.

**Solution:**
1. Check the **Deployments** tab in Vercel to confirm a new deployment was triggered.
2. Clear your browser cache or open the site in an incognito window.
3. If using a custom domain, DNS propagation or CDN caching may cause delays — wait a few minutes and retry.
4. You can manually trigger a redeployment from the Vercel dashboard under **Deployments → Redeploy**.

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Rewrites Configuration](https://vercel.com/docs/projects/project-configuration#rewrites)
- [React Router Documentation](https://reactrouter.com/)