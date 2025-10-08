# Quick Start Guide - Wedding Invitation Deployment

This is a condensed version of the full deployment guide. For detailed, step-by-step instructions, please refer to `DEPLOYMENT_GUIDE.md` inside the project folder.

## What You're Doing

You're deploying a beautiful wedding invitation website and hosting it at `awesomemfg.com/fromfaridtojannah`.

## Fastest Path (Recommended)

### Step 1: Upload to GitHub
1. Create a free GitHub account at [github.com](https://github.com)
2. Create a new repository named `wedding-invitation`
3. Upload all files from the `wedding-invitation` folder

### Step 2: Deploy with Netlify
1. Sign up at [netlify.com](https://www.netlify.com/) (use your GitHub account)
2. Click "Add new site" → "Import an existing project"
3. Select your `wedding-invitation` repository
4. Click "Deploy site" (settings are pre-configured)
5. Copy your Netlify URL (e.g., `https://random-name.netlify.app`)

### Step 3: Configure Custom Domain
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add site: `awesomemfg.com`
3. Update nameservers at Domainesia with Cloudflare's nameservers
4. Create Page Rule in Cloudflare:
   - URL: `www.awesomemfg.com/fromfaridtojannah/*`
   - Setting: Forwarding URL (301)
   - Destination: `https://your-netlify-url.netlify.app/$1`

### Step 4: Send Personalized Invitations
Create custom links for each guest:
```
https://www.awesomemfg.com/fromfaridtojannah/?name=John%20Smith
https://www.awesomemfg.com/fromfaridtojannah/?name=Sarah%20Johnson
```

Replace spaces with `%20` in guest names.

## Files Included

- **DEPLOYMENT_GUIDE.md** - Complete, verbose instructions
- **netlify.toml** - Netlify configuration (already set up)
- **.replit** - Replit configuration (alternative platform)
- **public/_redirects** - Routing configuration
- **src/** - All website source code

## Need Help?

Read the full `DEPLOYMENT_GUIDE.md` for detailed explanations of every step, alternative deployment platforms, and troubleshooting tips.

## Platform Comparison

| Platform | Difficulty | Speed | Best For |
|----------|-----------|-------|----------|
| **Netlify** | Easy | Fast | Recommended for everyone |
| **Replit** | Medium | Medium | If you want to edit code online |
| **Supabase** | Hard | Slow | Not recommended for static sites |

**Recommendation:** Use Netlify. It's free, fast, and designed exactly for this type of website.
