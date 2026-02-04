# Sitemap Troubleshooting Guide

## Issue: "Couldn't fetch" in Google Search Console

If you're seeing "Couldn't fetch" status for your sitemap, follow these steps:

### Step 1: Verify Sitemap is Accessible

1. **Test in Browser:**
   - Open: `https://denmoda.web.app/sitemap.xml`
   - You should see the XML content, not HTML
   - If you see HTML, the sitemap is being caught by the React router

2. **Test with curl (Command Line):**
   ```bash
   curl -I https://denmoda.web.app/sitemap.xml
   ```
   - Should return: `Content-Type: application/xml; charset=utf-8`
   - Status code should be: `200 OK`

### Step 2: Verify Sitemap Format

The sitemap must be valid XML. Check:
- ✅ XML declaration: `<?xml version="1.0" encoding="UTF-8"?>`
- ✅ Proper namespace: `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
- ✅ All URLs use `https://` (not `http://`)
- ✅ All URLs are absolute (not relative)
- ✅ No special characters that break XML

### Step 3: Check Firebase Configuration

The `firebase.json` should have:
1. **Headers for sitemap.xml:**
   ```json
   {
     "source": "/sitemap.xml",
     "headers": [
       {
         "key": "Content-Type",
         "value": "application/xml; charset=utf-8"
       }
     ]
   }
   ```

2. **Sitemap in public folder:**
   - File should be at: `public/sitemap.xml`
   - After build, it should be at: `build/sitemap.xml`

### Step 4: Verify robots.txt

Your `robots.txt` should reference the sitemap:
```
Sitemap: https://denmoda.web.app/sitemap.xml
```

### Step 5: Common Issues and Fixes

#### Issue: Sitemap returns HTML instead of XML
**Cause:** React router is catching the request
**Fix:** Ensure `sitemap.xml` is in the `public/` folder (not `src/`)

#### Issue: 404 Not Found
**Cause:** File not copied to build folder
**Fix:** 
1. Ensure `sitemap.xml` is in `public/` folder
2. Rebuild: `npm run build`
3. Verify `build/sitemap.xml` exists
4. Redeploy: `npm run deploy`

#### Issue: Wrong Content-Type
**Cause:** Firebase not serving with correct headers
**Fix:** Check `firebase.json` headers configuration (see Step 3)

#### Issue: Invalid XML
**Cause:** Special characters or malformed XML
**Fix:** 
1. Validate XML: https://www.xmlvalidation.com/
2. Check for unescaped characters (`&`, `<`, `>`)
3. Ensure all tags are properly closed

### Step 6: Test After Fixes

1. **Rebuild and Redeploy:**
   ```bash
   npm run build
   npm run deploy
   ```

2. **Wait 5-10 minutes** for Firebase CDN to update

3. **Test sitemap:**
   - Visit: `https://denmoda.web.app/sitemap.xml`
   - Should see XML, not HTML

4. **Resubmit in Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Navigate to: Sitemaps
   - Remove old sitemap entry
   - Submit: `sitemap.xml` (just the path, not full URL)
   - Wait 24-48 hours for Google to process

### Step 7: Verify in Google Search Console

After resubmitting:
- Status should change from "Couldn't fetch" to "Success"
- "Discovered pages" should show > 0
- "Last read" should update to current date

### Additional Resources

- **Google Sitemap Guidelines:** https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- **Validate Sitemap:** https://www.xml-sitemaps.com/validate-xml-sitemap.html
- **Firebase Hosting Docs:** https://firebase.google.com/docs/hosting/full-config

### Still Not Working?

If the sitemap still shows "Couldn't fetch" after following all steps:

1. **Check Firebase Hosting Logs:**
   - Go to Firebase Console → Hosting
   - Check for any errors or warnings

2. **Test with Google's Fetch Tool:**
   - In Search Console, use "URL Inspection" tool
   - Enter: `https://denmoda.web.app/sitemap.xml`
   - Click "Test Live URL"
   - Check if Google can fetch it

3. **Verify Domain Ownership:**
   - Ensure you've verified `denmoda.web.app` in Search Console
   - Check that you're using the correct property

4. **Check for Redirects:**
   - Ensure `denmoda.web.app` doesn't redirect to another domain
   - Verify SSL certificate is valid

5. **Contact Support:**
   - If all else fails, check Firebase support or Google Search Console help
