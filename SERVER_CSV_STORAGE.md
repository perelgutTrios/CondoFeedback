# Server-Side CSV Storage for Essex Feedback Portal

This document explains the simple server-side CSV storage system that complements the browser-based localStorage.

## 🎯 **Why Server-Side Storage?**

- **Cross-Device Access:** Data accessible from any terminal/computer
- **Permanent Storage:** Survives browser clears and computer changes
- **Admin Flexibility:** Simple CSV format works with Excel, Google Sheets, etc.
- **Backup Security:** Data stored outside web root for protection

## 📁 **File Structure**

```
C:\xampp\htdocs\Condo Feedback\
├── data\
│   └── essex-feedback.csv          # CSV data file (outside web root)
├── condo-feedback\
│   └── public\
│       └── api\
│           ├── save-feedback.php   # Server save endpoint
│           └── admin.php          # Admin interface
```

## 💾 **How It Works**

### **1. Dual Storage System**
- **Primary:** Browser localStorage (instant, reliable)
- **Secondary:** Server CSV file (persistent, accessible)
- **Graceful Fallback:** If server fails, localStorage still works

### **2. Data Flow**
1. User submits feedback form
2. App saves to localStorage immediately
3. App attempts to save to server CSV
4. Success message shows both results
5. Admin can access CSV from any device

### **3. CSV Format**
```csv
Timestamp,Submission ID,Last Name,Unit Number,Topics,Urgency,Subject,Comment,Email,Anonymous,Copy PM,Copy Me,Submit Type
2025-10-25 14:30:45,feedback_671b2345,Smith,1205,"Plumbing, Leaks",Important,Kitchen sink leak,Water dripping under sink,resident@email.com,No,Yes,Yes,General Submit
```

## 🔧 **Server Requirements**

### **XAMPP Setup (Current)**
- ✅ PHP 7.0+ (included in XAMPP)
- ✅ File write permissions
- ✅ Web server running (Apache)

### **Production Server**
- PHP 7.0+ with file write permissions
- Web server (Apache, Nginx, etc.)
- HTTPS recommended for security

## 🔐 **Security Features**

### **Data Protection**
- CSV file stored **outside web root** (`/data/` not `/htdocs/`)
- Cannot be directly accessed via web browser
- Admin panel requires password authentication

### **Access Control**
- **Admin Password:** Same as client (`EssexPM`)
- **Session Timeout:** 30 minutes
- **Confirmation Required:** For data deletion

## 🌐 **Admin Access**

### **Local XAMPP Access**
```
http://localhost/Condo%20Feedback/condo-feedback/api/admin.php
```

### **Production Access**
```
https://your-domain.com/api/admin.php
```

### **Admin Features**
- 📊 View submission statistics
- 📥 Download CSV file
- 🔄 Refresh data counts
- 🗑️ Clear all data (with confirmation)

## 📊 **CSV Download & Analysis**

### **Excel Import**
1. Download CSV from admin panel
2. Open in Excel
3. Data imports with proper formatting
4. Use Excel features for analysis, filtering, charts

### **Google Sheets**
1. Download CSV file
2. Upload to Google Drive
3. Open with Google Sheets
4. Share with team members

## 🛠️ **Configuration**

### **Change Admin Password**
Edit both files to match:

**In `save-feedback.php`:** (No password needed for saving)

**In `admin.php`:**
```php
$adminPassword = 'YourNewPassword';
```

**In React `App.js`:** (Admin panel password)
```javascript
// Update the CryptoUtils password as well
```

### **Change CSV Location**
**In both PHP files:**
```php
$csvDir = '/your/custom/path/data/';
```

### **Production Deployment**
1. Upload PHP files to server
2. Create `/data/` directory outside web root
3. Set proper file permissions (755 for directory, 644 for files)
4. Update admin.php URL in success messages

## 🚨 **Troubleshooting**

### **Server Save Fails**
- Check XAMPP is running (Apache service)
- Verify file permissions in `/data/` directory
- Check PHP error logs

### **Admin Panel Access Issues**
- Verify admin.php URL is correct
- Check password is exactly `EssexPM`
- Clear browser cookies if session expired

### **CSV Download Problems**
- Ensure browser allows file downloads
- Check anti-virus software blocking downloads
- Try different browser

## ⚡ **Development vs Production**

### **Development (XAMPP)**
- ✅ Server save works locally
- ✅ Admin panel accessible at localhost
- ✅ Perfect for testing and demonstration

### **Production Deployment**
- Update file paths for server environment
- Configure proper security headers
- Set up regular automated backups
- Consider database upgrade for high volume

## 📈 **Future Enhancements**

### **Possible Upgrades**
- **Database Migration:** Move from CSV to MySQL/PostgreSQL
- **API Authentication:** JWT tokens for admin access
- **Automated Backups:** Daily email CSV exports
- **Advanced Analytics:** Dashboard with charts and trends

### **Current Advantages**
- ✅ Simple and reliable
- ✅ No database setup required
- ✅ Works with existing XAMPP
- ✅ Easy to understand and modify
- ✅ Excel-compatible data format

The server-side CSV system provides a perfect balance of simplicity and functionality for the Essex Feedback Portal's needs!