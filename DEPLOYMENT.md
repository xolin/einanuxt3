# Vercel Deployment Setup Guide

This document provides step-by-step instructions for setting up automatic deployment to Vercel using GitHub Actions.

## Prerequisites

- GitHub repository with the Nuxt 3 application
- Vercel account (free tier works fine)
- Admin access to the GitHub repository

## Setup Steps

### 1. Create Vercel Account and Project

1. Go to [vercel.com](https://vercel.com) and create an account
2. Import your GitHub repository or create a new project
3. Note down your Project ID and Organization ID from the project settings

### 2. Get Vercel Token

1. Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a descriptive name (e.g., "GitHub Actions Deployment")
4. Copy the token (you won't see it again)

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Add the following secret:
   - Name: `VERCEL_TOKEN`
   - Value: Your Vercel token from step 2

### 4. Update Project Configuration (if needed)

If your Vercel project IDs are different from the current ones in `vercel.json`, update them:

```json
{
  "projectId": "your-project-id",
  "orgId": "your-org-id",
  // ... rest of config
}
```

You can find these IDs in your Vercel project settings.

## How It Works

### Automatic Deployment
- Every push to `main` or `master` branch triggers a production deployment
- Every pull request creates a preview deployment
- The workflow runs `npm run generate` to create static files
- Files are deployed from the `.output/public` directory

### Build Process
1. Checkout code from GitHub
2. Set up Node.js 18
3. Install dependencies with `npm ci`
4. Generate static files with `npm run generate`
5. Deploy to Vercel using the CLI

## Troubleshooting

### Common Issues

**Build fails with "command not found"**
- Ensure all dependencies are properly listed in `package.json`
- Check that build scripts are correctly defined

**Deployment fails with "unauthorized"**
- Verify that `VERCEL_TOKEN` secret is set correctly
- Make sure the token has the necessary permissions

**Wrong project deployed**
- Check that `projectId` and `orgId` in `vercel.json` match your Vercel project

### Manual Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Configuration Files

- `.github/workflows/deploy.yml` - Main deployment workflow
- `.github/workflows/build-test.yml` - CI/CD validation workflow
- `vercel.json` - Vercel project configuration
- `nuxt.config.ts` - Nuxt.js configuration with deployment optimizations

## Support

For issues with:
- **GitHub Actions**: Check the Actions tab in your repository
- **Vercel deployment**: Check the Vercel dashboard
- **Build errors**: Review the workflow logs in GitHub Actions