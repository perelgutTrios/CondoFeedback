# GitHub Pages CSV Storage Setup Guide

This guide explains how to set up server-side CSV storage that works with GitHub Pages using GitHub's API.

## 🎯 **How It Works**

Instead of using PHP (not supported on GitHub Pages), we use:
- **GitHub API** to save CSV data directly to your repository
- **GitHub Pages** to serve the React application
- **Repository data folder** to store CSV files
- **Personal Access Token** for secure API access

## 🔧 **Setup Steps**

### **Step 1: Create GitHub Personal Access Token**

1. **Go to GitHub Settings**
   ```
   https://github.com/settings/tokens
   ```

2. **Click "Generate new token (classic)"**

3. **Configure Token:**
   - **Name:** `Essex Feedback Portal CSV`
   - **Expiration:** `No expiration` (or 1 year)
   - **Scopes:** Check `repo` (full repository access)

4. **Generate and Copy Token**
   - ⚠️ **Save this token immediately** - you won't see it again!
   - Example: `ghp_1234567890abcdef...`

### **Step 2: Configure the Application**

1. **Update GitHub Storage Settings**
   
   Edit `src/services/GitHubCSVStorage.js`:
   ```javascript
   constructor() {
     this.owner = 'perelgutTrios';           // Your GitHub username
     this.repo = 'CondoFeedback';            // Your repository name
     this.branch = 'deployAndSave';          // Branch to save data
     this.csvPath = 'data/essex-feedback.csv'; // CSV file path
     this.token = 'ghp_YOUR_ACTUAL_TOKEN_HERE'; // Your token
   }
   ```

2. **Replace Token Placeholder**
   ```javascript
   this.token = 'ghp_1234567890abcdef...'; // Your actual token
   ```

### **Step 3: Test and Deploy**

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Test Submission**
   - Submit feedback through the form
   - Check success message for GitHub save status
   - Verify CSV file appears in repository

## 📁 **Repository Structure**

After setup, your repository will have:
```
CondoFeedback/
├── data/
│   └── essex-feedback.csv          # CSV data file
├── src/
│   └── services/
│       └── GitHubCSVStorage.js     # GitHub API integration
├── public/
└── ... (other files)
```

## 📊 **CSV Data Access**

### **Direct Download URL**
```
https://raw.githubusercontent.com/perelgutTrios/CondoFeedback/deployAndSave/data/essex-feedback.csv
```

### **Repository View**
```
https://github.com/perelgutTrios/CondoFeedback/blob/deployAndSave/data/essex-feedback.csv
```

### **Admin Access Methods**

#### **Method 1: GitHub Web Interface**
1. Go to your repository on GitHub
2. Navigate to `data/essex-feedback.csv`
3. Click "Raw" to download or "Download" button

#### **Method 2: Direct URL**
- Copy the raw GitHub URL
- Paste in browser or use in Excel/Google Sheets import

#### **Method 3: Git Clone**
```bash
git clone https://github.com/perelgutTrios/CondoFeedback.git
cd CondoFeedback
# CSV file is in data/essex-feedback.csv
```

## 🔐 **Security Considerations**

### **Token Security**
- ⚠️ **Never commit tokens to public repositories**
- Consider using GitHub Secrets for production
- Rotate tokens regularly (annually recommended)

### **Repository Privacy**
- **Public Repository:** CSV data is publicly visible
- **Private Repository:** Only you and collaborators can access
- **Consider data sensitivity** when choosing

### **Alternative: Environment Variables**
For production, use environment variables:
```javascript
this.token = process.env.REACT_APP_GITHUB_TOKEN;
```

## 🚀 **Production vs Development**

### **Development (Current)**
- Token hardcoded in source (for testing)
- Works with XAMPP for local testing
- GitHub API for production deployment

### **Production (Recommended)**
- Use GitHub Actions for secure token handling
- Environment variables for sensitive data
- Automated backups and monitoring

## 📈 **Advantages of GitHub API Approach**

### **✅ GitHub Pages Compatible**
- No server-side code required
- Works entirely with static hosting
- Leverages GitHub's infrastructure

### **✅ Version Control Integration**
- CSV changes tracked in Git history
- Automatic backups via Git
- Rollback capabilities

### **✅ Collaboration Friendly**
- Multiple admins can access data
- Permission management via GitHub
- Audit trail for all changes

### **✅ Excel/Sheets Integration**
- Direct CSV download URLs
- Import into any spreadsheet software
- Real-time data access

## 🛠️ **Alternative Options**

### **Option 2: Netlify Functions**
If you prefer Netlify over GitHub Pages:
- Deploy to Netlify instead
- Use Netlify Functions for server-side logic
- Store data in Netlify databases

### **Option 3: Vercel + Database**
For more advanced needs:
- Deploy to Vercel
- Use Vercel's Postgres database
- More scalable for high volume

### **Option 4: External Services**
For completely serverless:
- Airtable API for database
- Google Sheets API
- Firebase (as originally planned)

## 🚨 **Troubleshooting**

### **GitHub Save Fails**
1. **Check Token:** Ensure it's valid and has `repo` scope
2. **Check Repository:** Verify owner/repo names are correct
3. **Check Branch:** Ensure branch exists and is correct
4. **Check Rate Limits:** GitHub API has rate limits (5000/hour)

### **CSV Not Appearing**
1. **Check Repository:** Look in the `data/` folder
2. **Check Branch:** Ensure you're looking at the correct branch
3. **Check Permissions:** Ensure token has write access

### **Download Issues**
1. **Use Raw URL:** Not the GitHub web interface URL
2. **Check Branch:** Ensure URL points to correct branch
3. **Check File Path:** Verify `data/essex-feedback.csv` exists

## 📋 **Migration from PHP**

If you already have PHP CSV data:
1. **Download existing CSV** from XAMPP
2. **Upload to GitHub** repository in `data/` folder
3. **Configure token** in GitHubCSVStorage.js
4. **Test with new submission** to verify append works

The GitHub API approach provides a robust, scalable solution that works perfectly with GitHub Pages while maintaining the simplicity of CSV storage!