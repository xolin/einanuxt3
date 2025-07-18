# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

## Deployment to Vercel

This application is set up for automatic deployment to Vercel using GitHub Actions. 

### Setup Instructions:

1. **Create a Vercel Account** and link it to your GitHub repository
2. **Get Vercel Token**: Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens) and create a new token
3. **Set GitHub Secrets**: In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:
   - `VERCEL_TOKEN`: Your Vercel token

### Deployment Process:

- **Automatic Deployment**: Every push to the `main` or `master` branch will trigger a deployment
- **Preview Deployments**: Pull requests will create preview deployments
- **Build Command**: `npm run generate` (static site generation)
- **Output Directory**: `.output/public`

### Manual Deployment:

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

# einanuxt3
