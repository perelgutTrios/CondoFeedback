# EmailJS Setup Instructions

To enable email functionality in your Condo Feedback app, follow these steps:

## 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service
1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note the **Service ID** (e.g., `service_abc123`)

## 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

```
Subject: Condo Feedback - {{subject}}

New feedback submission from: {{from_name}}
Unit Number: {{unit_number}}
Topic: {{topic}}
Urgency: {{urgency}}
Button Used: {{button_type}}
Copy PM: {{copy_pm}}

Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the Condo Feedback Portal
```

4. Note the **Template ID** (e.g., `template_xyz789`)

## 4. Get Public Key
1. Go to "Account" > "General"
2. Find your **Public Key** (e.g., `user_abcdef123`)

## 5. Update App.js
Replace the placeholder values in `src/App.js`:

```javascript
const serviceID = 'your_service_id_here';     // From step 2
const templateID = 'your_template_id_here';   // From step 3
const publicKey = 'your_public_key_here';     // From step 4
```

And uncomment this line:
```javascript
await emailjs.send(serviceID, templateID, templateParams, publicKey);
```

## 6. Test
1. Start your app: `npm start`
2. Fill out the form
3. Click "Send"
4. Check perelgut@gmail.com for the email

## Current Status
- ✅ EmailJS library installed
- ✅ Form data collection implemented
- ✅ Email submission logic ready
- ⏳ EmailJS configuration needed (follow steps above)
- ✅ Prototype mode: Shows alert with form data

The app currently works in "prototype mode" - it shows an alert with the form data that would be sent to perelgut@gmail.com.