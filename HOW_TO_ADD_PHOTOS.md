# How to Add Your Wedding Photos to the Gallery

This guide explains how to replace the placeholder photo boxes with your actual wedding photos.

---

## Quick Overview

The photo gallery is located between the Quranic verse and the "Send Your Wishes" section. It displays 6 photos in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile).

---

## Step-by-Step Instructions

### Step 1: Prepare Your Photos

1. **Choose 6 photos** you want to display on your invitation
2. **Rename them** for easy identification:
   - `photo1.jpg` (or `.png`, `.webp`)
   - `photo2.jpg`
   - `photo3.jpg`
   - `photo4.jpg`
   - `photo5.jpg`
   - `photo6.jpg`

3. **Optimize your photos** (recommended):
   - **Size:** 800x800 pixels (square format works best)
   - **File size:** Keep under 500KB each for fast loading
   - **Format:** JPG or WebP recommended

**Pro tip:** Use free tools like [TinyPNG.com](https://tinypng.com) to compress your photos without losing quality.

---

### Step 2: Add Photos to Your Project

1. **Locate the assets folder:**
   - Open your `wedding-invitation` project folder
   - Navigate to `src/assets/`

2. **Copy your photos:**
   - Place all 6 photos into the `src/assets/` folder
   - Make sure the filenames match what you named them in Step 1

**Your folder structure should look like:**
```
wedding-invitation/
├── src/
│   ├── assets/
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   ├── photo3.jpg
│   │   ├── photo4.jpg
│   │   ├── photo5.jpg
│   │   └── photo6.jpg
│   ├── App.jsx
│   └── ...
```

---

### Step 3: Update the Code

1. **Open `src/App.jsx`** in a text editor (VS Code, Notepad++, or any code editor)

2. **Find the import section** at the top of the file (around lines 1-8)

3. **Add these import statements** after the existing imports:

```javascript
import photo1 from './assets/photo1.jpg'
import photo2 from './assets/photo2.jpg'
import photo3 from './assets/photo3.jpg'
import photo4 from './assets/photo4.jpg'
import photo5 from './assets/photo5.jpg'
import photo6 from './assets/photo6.jpg'
```

**Important:** If your photos have different file extensions (like `.png`), update the extensions accordingly:
```javascript
import photo1 from './assets/photo1.png'
```

4. **Find the Photo Gallery section** (around line 219-296)

5. **Replace each placeholder `<div>` with an `<img>` tag**

**Example for Photo 1:**

**BEFORE:**
```jsx
<div className="aspect-square bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center">
  <div className="text-center p-8">
    <Heart className="w-16 h-16 mx-auto mb-4 text-rose-400" />
    <p className="text-gray-600 font-medium">Photo 1</p>
    <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
  </div>
</div>
```

**AFTER:**
```jsx
<img 
  src={photo1} 
  alt="Wedding moment 1" 
  className="aspect-square object-cover w-full h-full"
/>
```

6. **Repeat for all 6 photos**

Here's the complete code for all 6 photos:

```jsx
{/* Photo 1 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo1} 
    alt="Wedding moment 1" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>

{/* Photo 2 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo2} 
    alt="Wedding moment 2" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>

{/* Photo 3 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo3} 
    alt="Wedding moment 3" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>

{/* Photo 4 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo4} 
    alt="Wedding moment 4" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>

{/* Photo 5 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo5} 
    alt="Wedding moment 5" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>

{/* Photo 6 */}
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo6} 
    alt="Wedding moment 6" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>
```

7. **Save the file**

---

### Step 4: Test Your Changes

1. **If using local development:**
   ```bash
   pnpm run dev
   ```
   Open `http://localhost:5173` in your browser

2. **Check that all photos display correctly**

3. **Test on mobile:** Resize your browser window to see the responsive layout

---

## Alternative: Using Online Photos

If your photos are already hosted online (e.g., Google Photos, Imgur, Dropbox), you can use direct URLs instead:

```jsx
<img 
  src="https://example.com/your-photo.jpg" 
  alt="Wedding moment 1" 
  className="aspect-square object-cover w-full h-full"
/>
```

**Note:** Make sure the URLs are publicly accessible and use HTTPS.

---

## Customization Options

### Change the Number of Photos

**To show only 3 photos:**
- Delete the code for Photo 4, 5, and 6
- The grid will automatically adjust

**To show more than 6 photos:**
- Copy one of the photo blocks
- Add a new import statement
- Paste and update the photo number

### Change the Grid Layout

The grid is controlled by this line:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**To show 4 columns on desktop:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

**To show 2 columns on desktop:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

### Add Captions to Photos

To add a caption below each photo:

```jsx
<div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
  <img 
    src={photo1} 
    alt="Wedding moment 1" 
    className="aspect-square object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <p className="font-semibold">Our Engagement</p>
  </div>
</div>
```

---

## Troubleshooting

### Photos Not Showing

**Problem:** Photos appear as broken images

**Solutions:**
1. Check that photo files are in `src/assets/`
2. Verify filenames match exactly (case-sensitive)
3. Check file extensions (`.jpg` vs `.jpeg` vs `.png`)
4. Make sure import statements are correct

### Photos Look Stretched or Distorted

**Problem:** Photos don't look good in square format

**Solution:** Use `object-cover` with different positioning:
```jsx
className="aspect-square object-cover object-top w-full h-full"
```

Options: `object-top`, `object-center`, `object-bottom`

### Photos Load Slowly

**Problem:** Website takes too long to load

**Solutions:**
1. Compress photos using [TinyPNG.com](https://tinypng.com)
2. Resize photos to 800x800 pixels
3. Convert to WebP format for better compression

---

## After Adding Photos

Once you've added your photos and tested locally:

1. **Commit changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add wedding photos to gallery"
   git push
   ```

2. **Netlify will automatically rebuild** and deploy your updated site

3. **Check your live site** to ensure photos display correctly

---

## Need Help?

If you encounter any issues:

1. Check the browser console for error messages (F12 → Console tab)
2. Verify all import statements are correct
3. Make sure photo files are properly named and located
4. Try using different photo formats (JPG, PNG, WebP)

---

**Congratulations!** Your wedding invitation now has a beautiful photo gallery showcasing your special moments! 📸💕
