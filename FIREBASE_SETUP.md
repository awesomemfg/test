# Firebase Setup for Wedding Invitation (Super Easy!)

## Step 1: Create Firebase Project (2 minutes)

1. **Go to [console.firebase.google.com](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Project name:** `wedding-invitation` 
4. **Google Analytics:** Skip it (click "Continue")
5. **Wait for project creation** (30 seconds)

## Step 2: Set Up Firestore Database (1 minute)

1. **In your Firebase console, click "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (allows public read/write for 30 days)
4. **Location:** Choose closest to you (like `us-central1`)
5. **Click "Done"**

## Step 3: Get Your Configuration (1 minute)

1. **In Firebase console, click the gear icon ⚙️ → Project settings**
2. **Scroll down to "Your apps"**
3. **Click the web icon `</>`**
4. **App nickname:** `wedding-app`
5. **Skip "Firebase Hosting" for now**
6. **Click "Register app"**
7. **Copy the `firebaseConfig` object** - it looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## Step 4: Create Environment File

1. **In your project folder, create `.env.local`:**
   ```
   VITE_FIREBASE_API_KEY=AIzaSyC...your-actual-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## Step 5: Test It!

**Since you don't have pnpm installed, let's use Node.js directly:**

1. **Open PowerShell in your project folder**
2. **Run:** `npm install` (this will install Firebase)
3. **Run:** `npm run dev`
4. **Open:** `http://localhost:5173`
5. **Try adding a wish** - it should work!

## Firestore Security Rules (Optional but Recommended)

After testing, update your Firestore rules for better security:

1. **Go to Firestore → Rules**
2. **Replace the rules with:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read and write wishes
       match /wishes/{document} {
         allow read, write: if true;
       }
     }
   }
   ```
3. **Click "Publish"**

## Why Firebase is Great:

- ✅ **Completely free** (generous limits)
- ✅ **Real-time updates** (wishes appear instantly)
- ✅ **Google reliability**
- ✅ **No credit card needed**
- ✅ **Works everywhere**

## Troubleshooting:

**If npm doesn't work:**
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Restart PowerShell
- Try `npm install` again

**If you get permission errors:**
- Your Firestore rules might be too strict
- Make sure you're in "test mode" or use the rules above

**If wishes don't save:**
- Check browser console (F12) for errors
- Verify your `.env.local` file has the correct Firebase config

## Deploy to Netlify:

1. **Add the same environment variables to Netlify:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add all the `VITE_FIREBASE_*` variables

2. **Deploy!** Your wishes will be saved to Firebase and work everywhere.

That's it! Firebase is super reliable and much simpler than Supabase for this use case.