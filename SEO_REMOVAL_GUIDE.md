# SEO Removal Guide - Remove Old Site from Search Results

## Objective
Remove old GitHub Pages URLs from Google search results and ensure `denmoda.web.app` appears when searching for "DenModa".

---

## Step 1: Remove Old GitHub Pages URLs from Google

### In Google Search Console (for old site if you have access):

1. **Go to Google Search Console**
   - Visit: https://search.google.com/search-console
   - If you have the old GitHub Pages site verified, select it
   - If not, skip to Step 2

2. **Request URL Removal**
   - Navigate to: **Removals** (left sidebar)
   - Click: **New Request**
   - Select: **Remove this URL**
   - Enter: `https://denise-hub.github.io/DenModa-Manufacturer/`
   - Click: **Request Removal**
   - Repeat for any other old URLs that appear in search

3. **Temporary Removal (Fastest)**
   - In **Removals** → Click **New Request**
   - Select: **Temporarily hide URL**
   - Enter the old GitHub Pages URL
   - This removes it from search within 24 hours
   - Valid for 6 months (enough time for permanent removal)

---

## Step 2: Remove Old URLs from New Site's Search Console

### In Google Search Console (for denmoda.web.app):

1. **Add Property (if not already added)**
   - Go to: https://search.google.com/search-console
   - Click: **Add Property**
   - Enter: `https://denmoda.web.app`
   - Verify ownership (HTML tag or DNS)

2. **Request Removal of Old URLs**
   - Navigate to: **Removals** (left sidebar)
   - Click: **New Request**
   - Enter old URLs that might appear:
     - `https://denise-hub.github.io/DenModa-Manufacturer/`
     - `https://denise-hub.github.io/DenModa-Manufacturer/index.html`
     - Any other old GitHub Pages URLs
   - Click: **Request Removal**

3. **Submit Updated Sitemap**
   - Navigate to: **Sitemaps** (left sidebar)
   - Remove any old sitemap entries
   - Add new sitemap: `sitemap.xml`
   - Click: **Submit**

4. **Request Indexing for New Site**
   - Navigate to: **URL Inspection**
   - Enter: `https://denmoda.web.app`
   - Click: **Test Live URL**
   - If it shows "URL is available to Google" → Click **Request Indexing**
   - Repeat for key pages:
     - `https://denmoda.web.app/#products`
     - `https://denmoda.web.app/#about`

---

## Step 3: Prevent GitHub Repository from Appearing in Search

### Already Done:
- ✅ Added `.nojekyll` file to repository root
- ✅ This prevents GitHub from automatically indexing repository pages

### Additional Steps (if repository still appears):

1. **Add robots.txt to Repository (if needed)**
   - The repository already has `robots.txt` at root
   - It blocks all crawlers: `Disallow: /`

2. **GitHub Repository Settings**
   - Go to: https://github.com/Denise-hub/DenModa-Manufacturer/settings
   - Scroll to: **Features** section
   - Ensure: **GitHub Pages** is disabled (already done ✅)

3. **If Repository Still Appears in Search:**
   - In Google Search Console, add property: `https://github.com/Denise-hub/DenModa-Manufacturer`
   - Request removal of repository URLs
   - Or use Google's removal tool: https://search.google.com/search-console/removals

---

## Step 4: Verify New Site is Indexed

### Check Google Indexing:

1. **Search for Your Site**
   - Go to: https://www.google.com
   - Search: `site:denmoda.web.app`
   - You should see pages from your new site

2. **Search for "DenModa"**
   - Search: `DenModa`
   - Your new site should appear in results
   - Old GitHub Pages URLs should not appear (after removal)

3. **Check Google Search Console**
   - Go to: **Coverage** report
   - Check: **Valid** pages should show your new site URLs
   - Check: **Excluded** pages should not include old GitHub Pages URLs

---

## Step 5: Monitor and Maintain

### Weekly Checks (First Month):

1. **Search for "DenModa"**
   - Verify new site appears first
   - Check if old URLs still appear
   - If old URLs appear, request removal again

2. **Google Search Console**
   - Check **Coverage** report
   - Monitor **Indexing** status
   - Review any **Errors** or **Warnings**

3. **Sitemap Status**
   - Verify sitemap shows "Success"
   - Check "Discovered pages" count
   - Ensure it's increasing over time

---

## Timeline Expectations

- **24-48 hours:** Old URLs removed from search (temporary removal)
- **1-2 weeks:** New site fully indexed
- **2-4 weeks:** New site appears first in "DenModa" search
- **1-3 months:** Old URLs completely removed from search index

---

## Troubleshooting

### Old URLs Still Appearing After 2 Weeks:

1. **Re-request Removal**
   - Go to Google Search Console → Removals
   - Request removal again for old URLs

2. **Check for Other Old URLs**
   - Search: `site:denise-hub.github.io DenModa`
   - Find all old URLs
   - Request removal for each

3. **Submit Updated Sitemap**
   - Ensure sitemap only contains new site URLs
   - Resubmit in Google Search Console

### New Site Not Appearing:

1. **Verify Sitemap**
   - Check: https://denmoda.web.app/sitemap.xml
   - Should show XML content

2. **Request Indexing**
   - Use URL Inspection tool
   - Request indexing for homepage

3. **Check robots.txt**
   - Verify: https://denmoda.web.app/robots.txt
   - Should allow Googlebot

---

## Summary Checklist

- [ ] Old GitHub Pages site unpublished ✅
- [ ] `.nojekyll` file added to repository ✅
- [ ] Request removal of old URLs in Google Search Console
- [ ] Submit sitemap for new site (`denmoda.web.app`)
- [ ] Request indexing for new site homepage
- [ ] Monitor search results weekly
- [ ] Verify new site appears when searching "DenModa"

---

## Quick Reference

- **New Site:** https://denmoda.web.app
- **Old Site (removed):** https://denise-hub.github.io/DenModa-Manufacturer/
- **Google Search Console:** https://search.google.com/search-console
- **Sitemap:** https://denmoda.web.app/sitemap.xml
- **Robots.txt:** https://denmoda.web.app/robots.txt

---

**Note:** It takes time for Google to process removals and re-index. Be patient and monitor progress weekly.
