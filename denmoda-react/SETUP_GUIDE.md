# Complete Setup Guide - DenModa React Migration

This guide walks you through every step to get your DenModa website live with Firebase and Cloudinary.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup (Detailed)](#firebase-setup-detailed)
3. [Cloudinary Setup (Detailed)](#cloudinary-setup-detailed)
4. [Local Development](#local-development)
5. [Deploying to Firebase](#deploying-to-firebase)
6. [Post-Deployment Tasks](#post-deployment-tasks)

---

## Prerequisites

### Install Node.js
1. Download from: https://nodejs.org/
2. Choose LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

---

## Firebase Setup (Detailed)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Enter project name: `denmoda-portfolio` (or your choice)
4. Click **Continue**
5. Disable Google Analytics (optional, click toggle off)
6. Click **Create Project**
7. Wait for project creation, then click **Continue**

### Step 2: Register Web App

1. On project overview, click the **</>** (Web) icon
2. Enter app nickname: `denmoda-web`
3. Check **"Also set up Firebase Hosting"**
4. Click **Register app**
5. **IMPORTANT**: Copy the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Click **Continue to console**

### Step 3: Enable Firestore Database

1. In left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode** (we'll set rules later)
4. Choose location closest to your users (e.g., `us-central` or `europe-west`)
5. Click **Enable**
6. Wait for database to provision

### Step 4: Enable Authentication

1. In left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Click **Sign-in method** tab
4. Click **Google** in the providers list
5. Toggle **Enable** on
6. Select your **Project support email**
7. Click **Save**

### Step 5: Add Authorized Domain

1. Still in Authentication, click **Settings** tab
2. Click **Authorized domains**
3. Your Firebase domains are automatically added
4. For custom domain later, click **Add domain**

### Step 6: Deploy Firestore Security Rules

In your terminal (inside denmoda-react folder):

```bash
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

---

## Cloudinary Setup (Detailed)

### Step 1: Create Account

1. Go to https://cloudinary.com/users/register_free
2. Fill out registration form
3. Verify email

### Step 2: Get Cloud Name

1. After login, you're on the Dashboard
2. Find **Cloud Name** in the "Account Details" card
3. It looks like: `dxyzabc123`
4. **Copy this value**

### Step 3: Create Upload Preset

1. Click gear icon (Settings) in top right
2. Click **Upload** tab on left sidebar
3. Scroll down to **"Upload presets"**
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `denmoda_uploads`
   - **Signing Mode**: Select **Unsigned** (IMPORTANT!)
   - **Folder** (optional): `denmoda`
6. Click **Save**

### Understanding Cloudinary URLs

Uploaded images get URLs like:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/denmoda/image.jpg
```

---

## Local Development

### Step 1: Install Dependencies

```bash
cd denmoda-react
npm install
```

### Step 2: Create Environment File

Create `.env` file in `denmoda-react` folder:

```env
# Firebase - from firebaseConfig you copied
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Cloudinary
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=denmoda_uploads

# Admin - CHANGE THIS to your email
REACT_APP_ADMIN_EMAIL=denmoda.manufacturing@gmail.com
```

### Step 3: Update Firebase Project ID

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Step 4: Copy Static Assets

Copy from original project:
- `public/assets/` - logos, favicon, hero backgrounds
- `public/img/products/` - product images
- `public/img/team/` - team member photos

### Step 5: Start Development Server

```bash
npm start
```

Browser opens to http://localhost:3000

### Step 6: Seed Database

1. Click "Admin" link in footer (or go to `/login`)
2. Sign in with Google (use the admin email)
3. Go to **Settings** in admin sidebar
4. Click **"Seed Database with Defaults"**
5. This loads all your original content!

---

## Deploying to Firebase

### Step 1: Build Production

```bash
npm run build
```

This creates optimized `build/` folder.

### Step 2: Deploy

```bash
firebase deploy
```

Or deploy only hosting:
```bash
firebase deploy --only hosting
```

### Step 3: Access Your Site

Your site is now live at:
- https://your-project-id.web.app
- https://your-project-id.firebaseapp.com

---

## Post-Deployment Tasks

### Custom Domain (Optional)

1. In Firebase Console → Hosting
2. Click **Add custom domain**
3. Enter your domain (e.g., `denmoda.com`)
4. Verify ownership via DNS
5. Add provided DNS records to your domain registrar
6. Wait for SSL certificate (can take up to 24 hours)

### Update SEO URLs

1. Edit `public/sitemap.xml` - change `denmoda.web.app` to your domain
2. Edit `public/index.html` - update canonical URL
3. Redeploy

### Google Search Console

1. Go to https://search.google.com/search-console
2. Add your property (domain or URL prefix)
3. Verify ownership
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Change Admin Email

If you need to use a different admin email:

1. Update `.env`:
   ```
   REACT_APP_ADMIN_EMAIL=new-admin@email.com
   ```

2. Update `firestore.rules` (change email on all lines):
   ```
   allow write: if request.auth != null && 
                   request.auth.token.email == 'new-admin@email.com';
   ```

3. Redeploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Firebase CLI Commands Reference

```bash
# Login to Firebase
firebase login

# List projects
firebase projects:list

# Select project
firebase use project-id

# Initialize (if not done)
firebase init

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only firestore rules
firebase deploy --only firestore:rules

# Open Firebase console
firebase open

# View hosting URL
firebase hosting:channel:list
```

---

## Troubleshooting

### "Permission denied" when writing to Firestore

1. Check you're logged in with correct admin email
2. Verify email in firestore.rules matches exactly
3. Redeploy rules: `firebase deploy --only firestore:rules`

### Cloudinary images not uploading

1. Check Cloud Name in `.env` is correct
2. Verify Upload Preset is **Unsigned**
3. Check browser console for specific errors

### Firebase deploy fails

1. Run `firebase login` again
2. Check `.firebaserc` has correct project ID
3. Run `firebase use your-project-id`

### Site shows old content after deploy

1. Clear browser cache (Ctrl+Shift+R)
2. Wait 5-10 minutes for CDN propagation

---

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Cloudinary Documentation: https://cloudinary.com/documentation
- React Documentation: https://react.dev

For project-specific issues: denmoda.manufacturing@gmail.com





