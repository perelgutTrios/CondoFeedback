# GitHub CSV Storage Setup Guide

## Overview
The Essex Feedback Portal uses GitHub API to save feedback data as CSV files in your GitHub repository. This enables cross-device access to feedback data and works with GitHub Pages deployment.

## Quick Setup Steps

### 1. Create GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Essex Feedback CSV Storage"
4. Set expiration (recommend 1 year for stability)
5. Select scopes:
   - For public repositories: check `public_repo`
   - For private repositories: check `repo` (full repository access)
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately - you won't see it again!

### 2. Configure Environment Variables

#### For Local Development:
1. Open the `.env` file in your project root
2. Replace `your_github_token_here` with your actual token:
   ```
   REACT_APP_GITHUB_TOKEN=ghp_your_actual_token_here
   ```

#### For GitHub Pages Deployment:
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `REACT_APP_GITHUB_TOKEN`
4. Value: Your GitHub token
5. Click "Add secret"

### 3. Update Repository Settings (if needed)
Check the `.env` file and verify these settings match your repository:
- `REACT_APP_GITHUB_OWNER`: Your GitHub username
- `REACT_APP_GITHUB_REPO`: Your repository name
- `REACT_APP_GITHUB_BRANCH`: Target branch (usually 'main' or 'deployAndSave')
- `REACT_APP_GITHUB_CSV_PATH`: Path where CSV will be stored

### 4. Test the Setup
1. Run `npm start` for development server
2. Submit a test feedback
3. Open browser developer console (F12)
4. Look for debug logs:
   - "GitHub CSV Storage - Received submission data"
   - "GitHub CSV Storage - CSV row"
   - Check for any errors

### 5. Verify Data Storage
After submitting feedback:
1. Check your GitHub repository
2. Navigate to the CSV file path (e.g., `data/essex-feedback.csv`)
3. Verify new submissions appear as CSV rows

## Troubleshooting

### Token Issues
- **"Bad credentials"**: Token is invalid or expired
- **"Not found"**: Repository name/owner incorrect or token lacks permissions
- **"Permission denied"**: Token needs `repo` scope for private repos

### Data Not Saving
1. Check browser console for errors
2. Verify repository settings in `.env`
3. Ensure token has correct permissions
4. Test with a simple curl command:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

### CSV Format Issues
- Last name or topics missing: Check debug logs for data reception
- Commas in data: Automatic CSV escaping handles this
- Special characters: UTF-8 encoding preserves all characters

## Security Notes

### Token Security
- Never commit tokens to your repository
- Use environment variables (`.env` files are in `.gitignore`)
- Regenerate tokens if compromised
- Use minimal required permissions

### GitHub Pages Deployment
For GitHub Pages, tokens are stored as repository secrets and injected during build process. This keeps them secure while enabling the CSV storage functionality.

## File Structure
```
your-repo/
├── data/
│   └── essex-feedback.csv    # Feedback data storage
├── .env                      # Local environment config (not committed)
├── src/services/
│   └── GitHubCSVStorage.js   # GitHub API integration
└── README.md
```

## CSV Data Format
The CSV includes these columns:
- Timestamp
- Submission ID
- Last Name
- Unit Number
- Topics
- Urgency
- Subject
- Comment
- Email
- Is Anonymous
- Copy PM
- Copy Me
- Button Type

## Advanced Configuration

### Custom CSV Path
Change `REACT_APP_GITHUB_CSV_PATH` to store CSV in different location.

### Multiple Environments
Create separate `.env.development` and `.env.production` files for different configurations.

### Backup Strategy
GitHub automatically maintains version history of your CSV file, providing built-in backup and recovery options.