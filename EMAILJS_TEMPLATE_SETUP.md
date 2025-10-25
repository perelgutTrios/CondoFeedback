# EmailJS Template Setup Guide

This document explains how to configure your EmailJS template to support the Essex Feedback Portal's enhanced features.

## Required Template Variables

Your EmailJS email template should include these variables:

### Basic Information
- `{{to_email}}` - Main recipient (perelgut@gmail.com)
- `{{cc_email}}` - CC recipients (comma-separated list)
- `{{from_name}}` - Resident's last name
- `{{unit_number}}` - Unit number
- `{{date_sent}}` - Formatted submission date (DD MMM YYYY)

### Feedback Content
- `{{topic}}` - Selected topics (comma-separated)
- `{{urgency}}` - Urgency level
- `{{subject}}` - Feedback subject
- `{{message}}` - Feedback comment

### Copy Options
- `{{copy_pm}}` - "Yes" if PM should be copied
- `{{copy_me}}` - "Yes" if user requested copy
- `{{user_email}}` - User's email (if provided)

### Technical Details
- `{{button_type}}` - Submit button type
- `{{submission_id}}` - Local storage ID

## Sample Email Template

```html
Subject: Essex Feedback: {{subject}} - Unit {{unit_number}}

Date Sent: {{date_sent}}

NEW FEEDBACK SUBMISSION

From: {{from_name}} (Unit {{unit_number}})
Topics: {{topic}}
Urgency: {{urgency}}
Subject: {{subject}}

Message:
{{message}}

---
Copy Options:
Property Manager Copy: {{copy_pm}}
Resident Copy: {{copy_me}}
{{#user_email}}Resident Email: {{user_email}}{{/user_email}}

---
Technical Details:
Submission ID: {{submission_id}}
Submitted via: {{button_type}}
Portal: Essex Feedback Portal (GitHub Pages)
```

## EmailJS Configuration

### 1. Email Service Configuration
- **Service:** Gmail, Outlook, or your preferred email service
- **Template ID:** Use the template ID in App.js (`template_ry5de2o`)

### 2. CC Functionality Setup
- **To Field:** `{{to_email}}`
- **CC Field:** `{{cc_email}}`
- **From Field:** Your configured sender email

### 3. Template Parameters
All template variables listed above should be configured in your EmailJS template.

## Property Manager Email
The Property Manager's email is currently set to:
**propertymanager@theessex.ca**

To change this, update the `pmEmail` variable in `App.js`:
```javascript
const pmEmail = 'your-pm-email@domain.com';
```

## Testing
1. Test with "Copy Property Manager" checked
2. Test with "Copy me" checked  
3. Test with both options checked
4. Verify CC functionality works correctly

## Production Deployment
1. Replace placeholder credentials in App.js
2. Test email delivery thoroughly
3. Verify CC functionality with actual email addresses
4. Confirm date formatting displays correctly

## Troubleshooting
- **CC not working:** Check EmailJS service supports CC field
- **Date format issues:** Verify browser locale settings
- **Missing variables:** Ensure all template variables are defined in EmailJS