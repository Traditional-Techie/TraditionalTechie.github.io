# Traditional Techie - Editing Guide

## How to Edit Your Website

### FILE STRUCTURE
```
TradinationalTechie.github.io/
├── index.html      <-- Main page (edit this)
├── about.html      <-- About Me page
├── contact.html    <-- Contact page
├── projects.html   <-- Projects page
├── css/style.css   <-- Colors & design
├── js/scripts.js   <-- Functions
└── images/
    └── profile.jpg <-- Your photo
```

---

## 1. EDIT CONTACT INFO (Topbar)
Find these lines in index.html and replace:

```html
<!-- LINE 18-19: Change email and phone -->
<a href="mailto:YOUR_EMAIL">YOUR_EMAIL</a>
<a href="tel:YOUR_PHONE">YOUR_PHONE</a>

<!-- LINE 22-26: Change social links -->
<a href="https://facebook.com/YOUR_PAGE" target="_blank">
<a href="https://instagram.com/YOUR_USERNAME" target="_blank">
<a href="https://youtube.com/YOUR_CHANNEL" target="_blank">
<a href="https://twitter.com/YOUR_HANDLE" target="_blank">
<a href="https://pinterest.com/YOUR_PROFILE" target="_blank">
```

---

## 2. EDIT VIDEOS (Most Important!)

Find the video section starting with:
```html
<!-- Videos -->
<section class="videos" id="videos">
```

Each video card looks like this - replace the 3 parts:

```html
<div class="v-card">
    <div class="v-thumb">
        <!-- PART 1: Change thumbnail image -->
        <img src="YOUR_IMAGE_URL" alt="Video Title">
        
        <div class="v-play"><i class="fas fa-play"></i></div>
        
        <!-- PART 2: Change category tag -->
        <span class="v-tag">Cooking</span>
        
        <!-- PART 3: Change video duration -->
        <span class="v-dur">12:34</span>
    </div>
    <div class="v-body">
        <!-- PART 4: Change video title -->
        <h3><a href="#">YOUR VIDEO TITLE HERE</a></h3>
        
        <!-- PART 5: Change views and date -->
        <div class="v-meta">
            <span><i class="fas fa-eye"></i> 12.5K</span>
            <span>2 days ago</span>
        </div>
    </div>
</div>
```

### VIDEO CATEGORIES YOU CAN USE:
- `Cooking` - for recipe videos
- `Travel` - for travel vlogs
- `Traditional` - for Kolam, Rangoli, cultural
- `Technology` - for tech reviews

---

## 3. EDIT BLOG POSTS

Find the blog section:
```html
<!-- Blog -->
<section class="blog" id="blog">
```

Each blog card:
```html
<div class="b-card">
    <div class="b-thumb">
        <img src="YOUR_BLOG_IMAGE" alt="">
        <span class="b-tag">Cooking</span>  <!-- Change category -->
    </div>
    <div class="b-body">
        <h3><a href="#">YOUR BLOG TITLE</a></h3>
        <p>YOUR BLOG DESCRIPTION (2 lines max)</p>
        <div class="b-foot">
            <span>Aug 28, 2026</span>  <!-- Change date -->
            <a href="#">Read More <i class="fas fa-arrow-right" style="font-size:10px"></i></a>
        </div>
    </div>
</div>
```

---

## 4. EDIT ABOUT ME SECTION

Find:
```html
<!-- About Preview -->
<section class="about" id="about">
```

Replace:
- `YOUR BIO TEXT` - Your story
- `images/profile.jpg` - Your photo (put your photo in images/ folder)

---

## 5. EDIT CATEGORIES

Find:
```html
<!-- Categories -->
<section class="cats" id="categories">
```

Change the numbers:
```html
<span>24 Videos</span>  <!-- Change to your actual count -->
<span>18 Videos</span>
<span>31 Videos</span>
<span>15 Videos</span>
```

---

## 6. HOW TO ADD YOUR OWN IMAGES

### Option A: Use your own photo files
1. Put your images in the `images/` folder
2. Reference them like: `images/my-photo.jpg`

### Option B: Use online images (Unsplash)
1. Go to https://unsplash.com
2. Search for your topic
3. Click an image, then "Share" > "Copy link"
4. Paste the URL in the `src=""` attribute

### Option C: Use YouTube thumbnails
For YouTube videos, use this format:
```
https://img.youtube.com/vi/YOUR_VIDEO_ID/mqdefault.jpg
```
Replace `YOUR_VIDEO_ID` with the ID from your YouTube video URL.
Example: `https://www.youtube.com/watch?v=ABC123` -> `ABC123`

---

## 7. HOW TO UPLOAD TO GITHUB

### Method 1: Edit directly on GitHub
1. Go to your repo: https://github.com/TradinationalTechie/TradinationalTechie.github.io
2. Click on `index.html`
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"

### Method 2: Upload files
1. Go to your repo
2. Click "Add file" > "Upload files"
3. Drag your files
4. Click "Commit changes"

### Method 3: Using Git (on your computer)
```bash
cd your-repo-folder
git add .
git commit -m "Updated content"
git push origin main
```

---

## QUICK EDIT CHECKLIST

- [ ] Change email/phone in topbar
- [ ] Update social media links
- [ ] Replace video titles with your videos
- [ ] Replace video thumbnails with your images
- [ ] Update video categories and durations
- [ ] Replace blog post titles and descriptions
- [ ] Update About Me text
- [ ] Add your profile photo to images/
- [ ] Update category video counts
- [ ] Commit and push to GitHub
