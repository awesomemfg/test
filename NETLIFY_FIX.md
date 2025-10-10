# Netlify Environment Variables Setup

## 🚀 Add These Environment Variables to Netlify:

### In Netlify Dashboard:
1. Go to your site settings
2. Click "Environment variables" 
3. Add these variables:

```
VITE_FIREBASE_API_KEY=AIzaSyBkxmSs7fGxkgLYza2GHzjpqJkoygtHVsI
VITE_FIREBASE_AUTH_DOMAIN=test-2b9ee.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=test-2b9ee
VITE_FIREBASE_STORAGE_BUCKET=test-2b9ee.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=7375017909
VITE_FIREBASE_APP_ID=1:7375017909:web:69aca166f1017014b42bfc
```

## 🔧 Deploy Configuration Fixed:
- Changed from `pnpm` to `npm` in netlify.toml
- This should resolve the "dependency_installation script returned non-zero exit code: 1" error

## 📋 Next Steps:
1. Add the environment variables above to Netlify
2. Push these changes to your GitHub repository
3. Netlify will automatically redeploy
4. Your wedding invitation should work with Firebase!

## 🎯 Alternative: Manual Deploy
If you have Node.js installed locally:
```bash
npm install
npm run build
```
Then drag the `dist` folder to Netlify for manual deployment.