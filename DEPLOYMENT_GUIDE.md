# 🚀 Firebase Hosting + GitHub Actions CI/CD Setup Guide

## Step 1: Firebase Service Account Key

1. Go to: https://console.firebase.google.com/
2. Select your project: `divyamilan-28a06`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file securely

## Step 2: Add GitHub Secrets

Go to: https://github.com/9907918672SUNDEEP30/divyamilan/settings/secrets/actions

Add these secrets:

### Firebase Secrets (from your .env.local):
- `FIREBASE_API_KEY`: AIzaSyAEC9q97XDpzaO_Be6xunM4oVoT-LhdJM4
- `FIREBASE_AUTH_DOMAIN`: divyamilan-28a06.firebaseapp.com
- `FIREBASE_PROJECT_ID`: divyamilan-28a06
- `FIREBASE_STORAGE_BUCKET`: divyamilan-28a06.firebasestorage.app
- `FIREBASE_MESSAGING_SENDER_ID`: 554983607364
- `FIREBASE_APP_ID`: 1:554983607364:web:86fad5c81dbe7f740c4011

### Firebase Service Account:
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Paste entire JSON content from Step 1

## Step 3: Update next.config.mjs

Add this for Next.js Static Export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## Step 4: Test CI/CD Pipeline

1. Push a small change to GitHub
2. Check **Actions** tab in GitHub
3. Wait for build and deploy to complete
4. Check: https://divyamilan-28a06.web.app

## Step 5: Add Custom Domain

1. Go to Firebase Console → **Hosting**
2. Click **Add custom domain**
3. Enter your domain (e.g., `divyamilan.com`)
4. Add DNS records as shown in Firebase
5. Wait for SSL certificate (can take 24 hours)

## Troubleshooting

- **Build fails**: Check GitHub Actions logs
- **Deployment fails**: Verify Firebase Service Account key
- **Domain not working**: Check DNS records propagation (up to 48 hours)

## Commands (Local Testing)

```bash
# Build locally
npm run build

# Test locally before pushing
firebase serve

# Deploy manually (if needed)
firebase deploy --project=divyamilan-28a06
```
