# Deployable Branch - Condo Feedback App

This is the **deployable** branch of the Condo Feedback application, designed for production deployment and testing.

## 🎯 Purpose

This branch serves as:
- **Production-ready version** for deployment testing
- **Stable release candidate** before merging to main
- **Environment for testing deployment configurations**
- **Branch for production-specific optimizations**

## 🌐 Deployment

This branch is configured for GitHub Pages deployment:

**Live URL:** https://perelguttrios.github.io/CondoFeedback

### Deploy Commands:
```bash
# Build and deploy to GitHub Pages
npm run deploy

# Build only (for testing)
npm run build
```

## 🔄 Branch Workflow

```
main (development) → deployable (staging) → GitHub Pages (production)
```

### To Deploy Changes:
1. Make changes in `main` branch
2. Test locally with `npm start`
3. Switch to `deployable` branch: `git checkout deployable`
4. Merge from main: `git merge main`
5. Deploy: `npm run deploy`
6. Push changes: `git push`

## 📋 Current Features

- ✅ Complete feedback form with validation
- ✅ Anonymous submission option
- ✅ EmailJS integration ready
- ✅ Mobile-responsive design
- ✅ Production build optimized
- ✅ GitHub Pages deployment configured

## 🔧 Configuration

- **Homepage:** https://perelguttrios.github.io/CondoFeedback
- **Build Output:** `build/` directory
- **Deploy Target:** `gh-pages` branch

## 📧 Email Setup

To enable real email sending to perelgut@gmail.com:
1. Follow instructions in `EMAILJS_SETUP.md`
2. Update credentials in `src/App.js`
3. Deploy with `npm run deploy`

---

**Note:** This branch should remain stable and production-ready at all times.