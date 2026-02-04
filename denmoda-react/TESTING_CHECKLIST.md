# Testing Checklist - DenModa Website Updates

## Before Testing
1. Make sure you're testing locally: `npm start`
2. Clear browser cache or use incognito mode
3. Open browser console to check for errors

---

## 1. Performance Testing

### ✅ Check Loading Speed
- [ ] Website loads quickly (under 3 seconds)
- [ ] No blocking operations during page load
- [ ] Email notifications don't delay page rendering
- [ ] Check browser console for any errors

**Expected Behavior:**
- Page should load smoothly
- Visitor email notification sends in background (non-blocking)
- No performance warnings in console

---

## 2. WhatsApp Integration Testing

### ✅ Footer WhatsApp Icon
- [ ] Click WhatsApp icon in footer
- [ ] WhatsApp should open with message: "Welcome to DenModa! Tell us more about the order you'd like to make."
- [ ] Message should be pre-filled and ready to send

**Location:** Footer → Social Links → WhatsApp Icon

### ✅ Contact Section WhatsApp Button
- [ ] Scroll to Contact section
- [ ] Click "Chat on WhatsApp" button
- [ ] WhatsApp should open with same welcome message
- [ ] Message should be pre-filled

**Location:** Contact Section → "Chat on WhatsApp" button

### ✅ Product Order Flow
- [ ] Browse to Products section
- [ ] Click "Order via WhatsApp" button on any product (or from product details modal)
- [ ] Order form modal should appear
- [ ] Fill in:
  - [ ] Name (required)
  - [ ] Phone number (required)
  - [ ] Preferred size (optional)
- [ ] Click "Submit & Open WhatsApp"
- [ ] WhatsApp should open immediately with complete order details
- [ ] Order should be saved to database (check admin panel)

**Expected WhatsApp Message Format:**
```
✨ Hello DenModa Team! ✨

I just came across your beautiful handcrafted sandals and I'm excited to place an order! 🛍️

━━━━━━━━━━━━━━━━━━━━━
📌 ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━

👟 Product: [Product Name]
🏷️ Category: [Category]
💵 Price: $[Price] (KES [Price])
📐 Available Sizes: [Sizes]

━━━━━━━━━━━━━━━━━━━━━
👤 CUSTOMER INFO
━━━━━━━━━━━━━━━━━━━━━

🙋 Name: [Customer Name]
📱 Phone: [Phone Number]
📏 Preferred Size: [Size]

━━━━━━━━━━━━━━━━━━━━━

Could you please confirm availability and let me know how to complete my purchase?

Looking forward to wearing DenModa! 👣✨

Thank you! 🙏
```

---

## 3. Order Management Testing (Admin Panel)

### ✅ Access Admin Panel
- [ ] Navigate to `/login`
- [ ] Login with admin credentials
- [ ] Go to Orders section

### ✅ View Orders
- [ ] All orders should be visible in table
- [ ] Orders should show:
  - [ ] Order date
  - [ ] Customer name
  - [ ] Customer phone
  - [ ] Product name
  - [ ] Size
  - [ ] Price
  - [ ] Current status

### ✅ Update Order Status
- [ ] Click status dropdown on any order
- [ ] Try updating status to:
  - [ ] Pending
  - [ ] Confirmed
  - [ ] Processing
  - [ ] Shipped
  - [ ] Delivered
  - [ ] Cancelled (should show confirmation dialog)
- [ ] Status should update immediately
- [ ] Success message should appear
- [ ] Order list should refresh automatically

### ✅ Contact Customer via WhatsApp
- [ ] Click WhatsApp button on any order
- [ ] WhatsApp should open with pre-filled message to customer
- [ ] Message should include order details

### ✅ Filter Orders
- [ ] Test filter buttons:
  - [ ] All
  - [ ] Pending
  - [ ] Confirmed
  - [ ] Delivered
  - [ ] Cancelled
- [ ] Orders should filter correctly
- [ ] Count badges should update

---

## 4. Email Notifications Testing

### ✅ Visitor Notification
- [ ] Visit website homepage
- [ ] Check admin email inbox
- [ ] Should receive email notification about new visitor
- [ ] Email should include:
  - [ ] Visitor ID
  - [ ] Device type
  - [ ] Page URL
  - [ ] Referrer
  - [ ] Timestamp

**Note:** Only sends once per session (first page load)

### ✅ Order Notification
- [ ] Place a test order through the website
- [ ] Check admin email inbox
- [ ] Should receive email notification about new order
- [ ] Email should include:
  - [ ] Customer name
  - [ ] Phone number
  - [ ] Product details
  - [ ] Price
  - [ ] Size
  - [ ] Order ID

---

## 5. Error Handling Testing

### ✅ Test Error Scenarios
- [ ] Try submitting order form without name → Should show error
- [ ] Try submitting order form without phone → Should show error
- [ ] Try submitting with invalid data → Should handle gracefully
- [ ] Test with slow internet connection → Should still work
- [ ] Test with email service down → Order should still go through, WhatsApp should still open

---

## 6. Cross-Browser Testing

### ✅ Test on Different Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### ✅ Test on Different Devices
- [ ] Desktop
- [ ] Mobile (Android)
- [ ] Mobile (iOS)
- [ ] Tablet

---

## 7. Performance Verification

### ✅ Check Console
- [ ] No JavaScript errors
- [ ] No network errors
- [ ] No blocking warnings
- [ ] Email sending should be non-blocking

### ✅ Check Network Tab
- [ ] Page loads quickly
- [ ] No failed requests
- [ ] Firebase calls complete successfully

---

## Issues to Report

If you find any issues, please note:
1. **What you were doing:** (e.g., "Clicking WhatsApp button in footer")
2. **Expected behavior:** (e.g., "WhatsApp should open with welcome message")
3. **Actual behavior:** (e.g., "Nothing happened / Old message appeared")
4. **Browser/Device:** (e.g., "Chrome on Windows 10")
5. **Console errors:** (Copy any error messages)

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ All WhatsApp links work correctly
✅ Order form works end-to-end
✅ Admin panel order management works
✅ Email notifications work (non-blocking)
✅ Performance is acceptable (no slow loading)

---

## Next Steps After Testing

Once all tests pass locally:
1. Build the project: `npm run build`
2. Test the build locally: `npx serve -s build`
3. If everything works, deploy: `npm run deploy` or `firebase deploy --only hosting`
4. After deployment, test on production site
5. Clear browser cache if needed
