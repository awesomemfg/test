# Free Database Setup for Wedding Invitation

## Option 1: Supabase (Recommended - Completely Free)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub/Google (no credit card needed)
4. Create a new project:
   - Project name: `wedding-invitation`
   - Database password: (choose a strong password)
   - Region: Choose closest to your location

### Step 2: Create the Wishes Table
1. In your Supabase dashboard, go to **Table Editor**
2. Click **New Table**
3. Table name: `wishes`
4. Add these columns:
   ```
   id (int8, primary key, auto-increment) ✓
   name (text)
   message (text) 
   created_at (timestamptz, default: now())
   ```
5. Click **Save**

### Step 3: Get Your API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with https://...)
   - **anon/public** key (long string starting with eyJ...)

### Step 4: Add Environment Variables
Create a file `.env.local` in your project root:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Enable Row Level Security (Optional but Recommended)
1. In Supabase dashboard, go to **Authentication** → **Policies**
2. For the `wishes` table, add this policy:
   ```sql
   -- Allow anyone to read wishes
   CREATE POLICY "Allow public read" ON wishes FOR SELECT USING (true);
   
   -- Allow anyone to insert wishes
   CREATE POLICY "Allow public insert" ON wishes FOR INSERT WITH CHECK (true);
   ```

## Alternative: JSONBin (Super Simple)

If Supabase feels complex, try JSONBin:

1. Go to [jsonbin.io](https://jsonbin.io)
2. Create free account
3. Create a new bin with this structure:
   ```json
   {
     "wishes": []
   }
   ```
4. Get your bin ID and API key
5. I can modify the code to use JSONBin instead

## Alternative: Firebase Firestore

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project
3. Add Firestore database
4. Start in test mode
5. I can provide Firebase setup code

## Which One Should You Choose?

- **Supabase**: Best for real apps, PostgreSQL, real-time features
- **JSONBin**: Simplest, just JSON storage
- **Firebase**: Google ecosystem, good scaling

**Recommendation**: Start with Supabase - it's designed for this exact use case and the free tier is very generous (50,000 rows).

## Next Steps

1. Choose your option above
2. Follow the setup steps
3. Update your `.env.local` file
4. Test locally with `npm run dev` or `pnpm dev`
5. Deploy to Netlify (it will automatically use your environment variables)

Need help with any step? Let me know!