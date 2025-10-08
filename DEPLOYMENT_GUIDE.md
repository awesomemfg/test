# Fully Verbose Guide: Deploying & Hosting Your Wedding Invitation

This guide provides extremely detailed, step-by-step instructions for deploying your wedding invitation website on various platforms and hosting it at your custom domain path: `awesomemfg.com/fromfaridtojannah`. Please read each step carefully.

**Your Goal:** You want visitors to go to `awesomemfg.com/fromfaridtojannah` and see your wedding invitation. You also want to be able to send personalized links like `awesomemfg.com/fromfaridtojannah?name=Guest%20Name`.

This guide will help you achieve exactly that, without using the temporary `manus.app` URL.

---

## **Part 1: Prerequisites - Getting Your Code on GitHub**

Before you can use services like Netlify or Replit, you need to have your website's code in a place they can access. The standard way to do this is by using GitHub, a platform for storing and managing code.

**You will need:**
*   A free [GitHub](https://github.com/) account.
*   The `wedding-invitation` project folder, which I will provide to you as a `.zip` file.

### **Step-by-Step: Uploading Your Project to GitHub**

1.  **Sign in to GitHub.**
2.  On the main dashboard, find and click the **"New"** or **"Create repository"** button. It's usually a green button near the top left.
3.  **Name your repository.** A simple name like `wedding-invitation` is perfect.
4.  **Choose the repository visibility.** You can set it to **Public** or **Private**. For this project, either is fine. Private is a good choice if you don't want it to be publicly visible on GitHub.
5.  **DO NOT** initialize the repository with a README, .gitignore, or license. We already have all the necessary files.
6.  Click **"Create repository"**.
7.  GitHub will now show you a page with instructions. Look for the section that says **"…or upload an existing file"**. Click that link.
8.  **Unzip the `wedding-invitation.zip` file** on your computer. You will have a folder named `wedding-invitation`.
9.  **Drag and drop** the *entire contents* of the `wedding-invitation` folder into the GitHub upload window in your browser. This will upload all the files and folders (`src`, `public`, `package.json`, etc.).
10. Once the files are uploaded, type a short message in the "Commit changes" box, like `Initial commit`.
11. Click the **"Commit changes"** button.

**Result:** Your website's code is now safely stored in a GitHub repository. This is the foundation for the next steps.

---

## **Part 2: Deploying the Website (Choose ONE Platform)**

Now you will deploy the website from your GitHub repository to a live hosting service. **Netlify is the highly recommended option** because it is the easiest, most powerful, and free for this type of project.

### **Option A: Deploying with Netlify (Recommended)**

Netlify is a top-tier platform for building and deploying web applications. It's designed to be fast and developer-friendly.

1.  **Sign up for Netlify:** Go to [netlify.com](https://www.netlify.com/) and sign up for a free account. The easiest way is to sign up using your GitHub account.
2.  **Authorize Netlify:** It will ask for permission to access your GitHub repositories. This is safe and necessary.
3.  **Add a New Site:** From your Netlify dashboard, click **"Add new site"** and then choose **"Import an existing project"**.
4.  **Connect to GitHub:** Click the **GitHub** button.
5.  **Select Your Repository:** A list of your GitHub repositories will appear. Find and select the `wedding-invitation` repository you created earlier.
6.  **Configure Build Settings:** Netlify will automatically detect that you have a `netlify.toml` file and pre-fill the settings. You should not need to change anything. It should look like this:
    *   **Build command:** `pnpm install && pnpm run build`
    *   **Publish directory:** `dist`
7.  **Deploy Site:** Click the **"Deploy site"** button.

Netlify will now pull your code from GitHub, run the build command to create the optimized website files, and deploy them to its global network. This process may take a minute or two. You will see a "Production" tag with a green checkmark when it's done.

**Result:** Your site is now live on a random Netlify URL (e.g., `random-words-12345.netlify.app`). We will connect this to your custom domain in Part 3.

### **Option B: Deploying with Replit**

Replit is an online coding environment that can also host websites.

1.  **Sign up for Replit:** Go to [replit.com](https://replit.com/) and create a free account.
2.  **Import from GitHub:** On your Replit dashboard, click the **"+" (Create Repl)** button. In the top right of the modal, click **"Import from GitHub"**.
3.  **Enter GitHub URL:** Paste the URL of your `wedding-invitation` GitHub repository into the field.
4.  **Import:** Replit will automatically clone your repository. It should detect the `replit.nix` file and configure the environment with Node.js and pnpm.
5.  **Run the Project:** Click the big green **"Run"** button at the top. This will execute the `run` command from your `.replit` file, which installs dependencies and starts the development server. You will see the live preview in a window on the right.
6.  **Deploy:** To create a permanent deployment, go to the **"Deployments"** tab on the left sidebar. Click **"Deploy"** and choose the **"Static"** deployment type. Replit will use the settings from the `[deployment]` section of your `.replit` file to build and deploy the site.

**Result:** Your site will be live on a Replit URL (e.g., `wedding-invitation.your-username.replit.dev`).

### **Option C: Hosting with Supabase (Advanced/Not Recommended for this Use Case)**

Supabase is an open-source Firebase alternative. It's primarily a **backend-as-a-service** (database, authentication, etc.). While you *can* host a static site using its Storage feature, it's not its main purpose and is more complicated than Netlify.

1.  **Build the Site Locally:** First, you need to build the production files. On your own computer (with Node.js and pnpm installed), you would run `pnpm install` and then `pnpm run build`. This creates a `dist` folder.
2.  **Sign up for Supabase:** Go to [supabase.com](https://supabase.com/) and create a free account and a new project.
3.  **Create a Storage Bucket:** In your Supabase project, go to the **Storage** section. Create a new **public** bucket. Let's call it `website`.
4.  **Upload Files:** Manually upload the *contents* of your `dist` folder (the `index.html` file, the `assets` folder, etc.) into the `website` bucket you just created.
5.  **Find the URL:** The public URL to your `index.html` file will be your website's URL. It will be long and complex, like `https://your-project-ref.supabase.co/storage/v1/object/public/website/index.html`.

**Note:** This method is cumbersome, requires manual uploads for every change, and doesn't handle routing for single-page apps (like yours) correctly without extra work. **It is strongly recommended to use Netlify instead.**

---

## **Part 3: Hosting at `awesomemfg.com/fromfaridtojannah`**

This is the final and most important part. You will use a free service called **Cloudflare** to intelligently route traffic. It will send requests for `awesomemfg.com/fromfaridtojannah` to your newly deployed Netlify/Replit site, while leaving your main `awesomemfg.com` blog untouched.

### **Step-by-Step: Configuring Cloudflare**

1.  **Create a Cloudflare Account:** Go to [cloudflare.com](https://cloudflare.com) and sign up for a free account.
2.  **Add Your Site:** Click **"Add a Site"** and enter your domain: `awesomemfg.com`.
3.  **Select the Free Plan.**
4.  **Review DNS Records:** Cloudflare will scan your domain's existing DNS records from Domainesia. It should find records pointing to Blogger. This is correct. Click **Continue**.
5.  **Update Your Nameservers (The Critical Step):**
    *   Cloudflare will give you two new nameservers (e.g., `dane.ns.cloudflare.com`).
    *   Log in to your **Domainesia** account.
    *   Find the DNS or Nameserver management section for `awesomemfg.com`.
    *   **Delete** your current nameservers and **replace** them with the two provided by Cloudflare.
    *   Save the changes. This can take up to 24 hours to update globally, but is often much faster.
    *   Cloudflare will email you when the change is complete.

6.  **Set Up the Redirect Rule:**
    *   Once your site is active on Cloudflare, go to your Cloudflare dashboard.
    *   Select `awesomemfg.com`.
    *   From the left menu, go to **Rules > Page Rules**.
    *   Click **"Create Page Rule"**.
    *   In the first field ("If the URL matches"), enter: `www.awesomemfg.com/fromfaridtojannah/*`
        *   *The `*` at the end is a wildcard. It's crucial for making the personalized name links work!*
    *   In the settings dropdown, choose **"Forwarding URL"**.
    *   For the status code, select **"301 - Permanent Redirect"**.
    *   In the destination URL field, paste the URL of your **Netlify site** (e.g., `https://random-words-12345.netlify.app/$1`)
        *   *The `$1` at the end is also crucial. It passes along anything that came after the wildcard, like `?name=Guest%20Name`.*
    *   Click **"Save and Deploy Page Rule"**.

**Result:** You've done it! Now, when you or a guest visits `www.awesomemfg.com/fromfaridtojannah`, Cloudflare will instantly and seamlessly redirect them to your deployed Netlify site. Your main blog at `www.awesomemfg.com` will not be affected.

---

## **Part 4: Customizing Personalized Invitations**

Now that you have your custom domain path set up, you can create the personalized links for your guests.

Simply append `?name=GUEST_NAME` to your new URL. Remember to replace spaces in the name with `%20`.

**Examples:**

*   For **John Smith**:
    `https://www.awesomemfg.com/fromfaridtojannah/?name=John%20Smith`

*   For **The Miller Family**:
    `https://www.awesomemfg.com/fromfaridtojannah/?name=The%20Miller%20Family`

When a guest uses one of these links, the website will automatically display their name in the invitation card.

---

## **Part 5: The Guest Wishes "Database"**

As a reminder, the guestbook feature currently uses `localStorage`. This means wishes are saved in the guest's own browser and are not shared between different guests.

To create a truly live, shared guestbook, you would need to integrate a backend database. Supabase (which we discussed as a hosting option) is an excellent choice for this. You would follow the conceptual code changes outlined in the previous guide to connect your Netlify-hosted frontend to a Supabase database backend. This is a common and powerful way to build full-stack applications.

Congratulations on your beautiful, custom-hosted wedding invitation!
