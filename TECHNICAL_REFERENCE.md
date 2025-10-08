# Technical Reference - Wedding Invitation Website

This document provides technical details about the website architecture, customization options, and advanced configuration.

## Architecture Overview

The wedding invitation is a **Single Page Application (SPA)** built with modern web technologies. It runs entirely in the browser and requires no backend server for basic functionality.

### Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.x |
| **Vite** | Build tool & dev server | 6.x |
| **Tailwind CSS** | Styling framework | Latest |
| **shadcn/ui** | Component library | Latest |
| **Lucide React** | Icon library | Latest |
| **pnpm** | Package manager | 9.x |

### Project Structure

```
wedding-invitation/
├── public/              # Static assets
│   ├── favicon.ico      # Website icon
│   └── _redirects       # Netlify routing rules
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── netlify.toml         # Netlify deployment config
├── .replit              # Replit deployment config
└── replit.nix           # Replit environment config
```

## Key Features & Implementation

### 1. Personalized Guest Greetings

**How it works:** The application reads the `name` query parameter from the URL using the browser's `URLSearchParams` API.

**Code location:** `src/App.jsx` (lines 18-24)

```javascript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const nameParam = urlParams.get('name')
  if (nameParam) {
    setGuestName(decodeURIComponent(nameParam))
  }
}, [])
```

**URL encoding:** Spaces and special characters must be URL-encoded:
- Space → `%20`
- `&` → `%26`
- `#` → `%23`

**Example transformations:**
- `John Smith` → `John%20Smith`
- `Mr. & Mrs. Johnson` → `Mr.%20%26%20Mrs.%20Johnson`

### 2. Countdown Timer

**How it works:** Uses JavaScript's `setInterval` to update every second, calculating the time difference between now and the wedding date.

**Code location:** `src/App.jsx` (lines 45-62)

**Wedding date:** October 25, 2025, 12:00 PM Central Time (UTC-5)

**To change the date:** Modify line 19:
```javascript
const weddingDate = new Date('2025-10-25T12:00:00-05:00')
```

### 3. Guest Wishes System

**Current implementation:** Uses browser `localStorage` for data persistence.

**Code location:** `src/App.jsx` (lines 26-32, 64-82)

**Data structure:**
```javascript
{
  id: 1728312000000,           // Timestamp as unique ID
  name: "John Smith",          // Guest name
  message: "Congratulations!", // Wish message
  timestamp: "2025-10-07T..."  // ISO 8601 timestamp
}
```

**Storage key:** `weddingWishes`

**Limitations:**
- Data is stored per-browser, not shared between users
- Clearing browser data deletes all wishes
- No moderation or spam protection

### 4. Responsive Design

The website is fully responsive and adapts to all screen sizes using Tailwind CSS breakpoints:

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| `sm` | 640px+ | Large phones |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops |
| `xl` | 1280px+ | Desktops |

## Customization Guide

### Changing Colors

The color scheme uses CSS custom properties defined in `src/App.css`. The primary colors are rose/pink gradients.

**To change the theme color:**

1. Open `src/App.css`
2. Modify the `--primary` and related color variables in the `:root` section
3. Update gradient classes in `src/App.jsx` (search for `from-rose` and `to-pink`)

### Changing Wedding Details

All wedding information is hardcoded in `src/App.jsx`. To modify:

1. **Names:** Lines 94-110
2. **Date & Time:** Lines 136-139
3. **Location:** Lines 147-151
4. **Quranic Verse:** Lines 182-187

### Adding Photos

To add wedding photos or decorative images:

1. Place image files in `src/assets/`
2. Import in `src/App.jsx`:
   ```javascript
   import weddingPhoto from './assets/photo.jpg'
   ```
3. Use in JSX:
   ```jsx
   <img src={weddingPhoto} alt="Wedding" />
   ```

## Deployment Configuration Files

### netlify.toml

Configures Netlify's build process and routing:

```toml
[build]
  command = "pnpm install && pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Purpose:** Ensures all routes redirect to `index.html` for proper SPA routing.

### .replit

Configures Replit's development and deployment environment:

```
run = "pnpm install && pnpm run dev --host 0.0.0.0"

[deployment]
run = ["sh", "-c", "pnpm install && pnpm run build && pnpm run preview --host 0.0.0.0 --port 3000"]
deploymentTarget = "static"
publicDir = "dist"
```

### public/_redirects

Netlify-specific file for client-side routing:

```
/*    /index.html   200
```

**Purpose:** All requests are served `index.html`, allowing React Router to handle navigation.

## Build Process

### Development Build

```bash
pnpm install    # Install dependencies
pnpm run dev    # Start dev server on http://localhost:5173
```

### Production Build

```bash
pnpm install       # Install dependencies
pnpm run build     # Build optimized files to dist/
pnpm run preview   # Preview production build locally
```

**Output:** The `dist/` folder contains:
- `index.html` - Minified HTML
- `assets/` - Optimized CSS and JavaScript bundles

## Performance Optimizations

The production build includes:

1. **Code splitting:** JavaScript is split into smaller chunks
2. **Tree shaking:** Unused code is removed
3. **Minification:** All files are compressed
4. **CSS purging:** Unused Tailwind classes are removed
5. **Asset optimization:** Images and fonts are optimized

**Typical bundle sizes:**
- CSS: ~94 KB (14.85 KB gzipped)
- JavaScript: ~231 KB (72.36 KB gzipped)

## Browser Compatibility

The website is compatible with:

- **Chrome/Edge:** Version 90+
- **Firefox:** Version 88+
- **Safari:** Version 14+
- **Mobile browsers:** iOS Safari 14+, Chrome Mobile 90+

## Security Considerations

1. **No sensitive data:** All information is public
2. **No authentication:** Anyone with the URL can access the site
3. **Client-side only:** No server-side vulnerabilities
4. **HTTPS required:** Always deploy with SSL/TLS (Netlify provides this automatically)

## Upgrading to a Backend Database

To implement a shared, persistent guestbook, you would need to:

1. **Choose a backend service:** Supabase, Firebase, or a custom API
2. **Create a database table** with columns for name, message, and timestamp
3. **Replace localStorage logic** with API calls
4. **Add error handling** for network failures
5. **Implement rate limiting** to prevent spam

**Recommended approach:** Use Supabase for its simplicity and generous free tier.

## Troubleshooting

### Build Fails

**Error:** `command not found: pnpm`
**Solution:** Ensure pnpm is installed. Run `npm install -g pnpm`

**Error:** `Module not found`
**Solution:** Delete `node_modules` and run `pnpm install` again

### Routing Issues

**Problem:** Refreshing the page shows 404 error
**Solution:** Ensure `_redirects` file exists in `public/` and `netlify.toml` is configured correctly

### Personalized Names Not Showing

**Problem:** URL has `?name=...` but name doesn't display
**Solution:** Check that the URL parameter is properly encoded (spaces as `%20`)

## Support & Resources

- **React Documentation:** [react.dev](https://react.dev)
- **Vite Documentation:** [vitejs.dev](https://vitejs.dev)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Cloudflare Docs:** [developers.cloudflare.com](https://developers.cloudflare.com)

---

**Built with ❤️ for Farid & Jannah**
