# EmailJS Setup Instructions

To enable **REAL EMAIL SENDING** to perelgut@gmail.com, follow these steps:

## 🚀 Quick Setup (5 minutes)

### 1. Create EmailJS Account
- Go to [EmailJS.com](https://www.emailjs.com/)
- Sign up for FREE account
- Verify your email

### 2. Add Email Service
- Dashboard → "Email Services" → "Add New Service"
- Choose **Gmail** 
- Connect your Gmail account
- **Copy the Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
- Dashboard → "Email Templates" → "Create New Template"
- **Template Name:** `Essex Condo Feedback`
- **Subject:** `Essex Feedback - {{topic}} - {{urgency}}`
- **Content:**
```
New feedback submitted to Essex Portal:

FROM: {{from_name}} (Unit {{unit_number}})
TOPIC: {{topic}}
URGENCY: {{urgency}}

SUBJECT: {{subject}}

MESSAGE:
{{message}}

---
Submission ID: {{submission_id}}
Sent via Essex Feedback Portal
```
- **Copy the Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
- Dashboard → "Account" → "General"
- **Copy the Public Key** (e.g., `user_abcdef123`)

### 5. Update App.js
Replace these lines in `src/App.js` (around line 67):

```javascript
// REPLACE THESE WITH YOUR ACTUAL VALUES:
const serviceID = 'YOUR_SERVICE_ID_HERE';     // Step 2
const templateID = 'YOUR_TEMPLATE_ID_HERE';   // Step 3  
const publicKey = 'YOUR_PUBLIC_KEY_HERE';     // Step 4
```

With your actual IDs:
```javascript
const serviceID = 'service_abc123';     // Your actual Service ID
const templateID = 'template_xyz789';   // Your actual Template ID
const publicKey = 'user_abcdef123';     // Your actual Public Key
```

## ✅ Testing
1. Save the file
2. Fill out the feedback form
3. Click "Submit"
4. Check perelgut@gmail.com for the email!

## 🎯 Current Status
- ✅ EmailJS library installed
- ✅ Form validation working
- ✅ Code ready for EmailJS
- ⏳ **Needs EmailJS configuration** (follow steps above)
- 🔄 **Currently in prototype mode** - shows alert instead of sending

Once configured, emails will be sent to **perelgut@gmail.com** automatically!