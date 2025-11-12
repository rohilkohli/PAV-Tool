<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Asset Verification (PAV) Tool

This contains everything you need to run your app locally or deploy it to GitHub Pages.

View your app in AI Studio: https://ai.studio/apps/drive/1SC5LIKnwzf_Jw6Rngo165aT8zTMsJZ31

## GitHub Pages Deployment

This application is configured to automatically deploy to GitHub Pages. 

### Setup Instructions

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", set **Source** to **GitHub Actions**
4. Push your changes to the `main` branch

The GitHub Actions workflow will automatically build and deploy your application. Once deployed, your site will be available at:
`https://rohilkohli.github.io/PAV-Tool/`

### How it works

- The workflow is triggered on every push to the `main` branch
- It installs dependencies, builds the application, and deploys to GitHub Pages
- The build output is configured with the correct base path for GitHub Pages

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Build for Production

To build the application for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.
