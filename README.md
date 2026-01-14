# Flacron Sports Backend

A Node.js backend service for sports data aggregation, content generation using Gemini AI, and newsletter distribution.

## Features

- Sports data fetching from multiple APIs
- AI-powered content generation using Google Gemini
- Automated newsletter distribution
- Cron job scheduling for data collection and content generation
- Firebase Firestore integration for data storage

## Prerequisites

- Node.js 18+ 
- Firebase project with Firestore
- Google Gemini API key
- Sports API key (for sports data)
- Email service credentials (for newsletter)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=3000

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Sports API
SPORTS_API_KEY=your-sports-api-key

# Email (for newsletter)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Add Firebase service account key to project root
5. Start the server:
   ```bash
   npm start
   ```

## Deployment to Render

### 1. Prepare Your Repository

- Ensure all files are committed to your Git repository
- Make sure `.gitignore` excludes sensitive files (`.env`, Firebase keys)

### 2. Create Render Account

- Sign up at [render.com](https://render.com)
- Connect your GitHub/GitLab repository

### 3. Deploy as Web Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Service**
   - **Name**: `flacron-sports-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier available)

3. **Environment Variables**
   Add all required environment variables in Render dashboard:
   - `PORT` (Render will set this automatically)
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `GEMINI_API_KEY`
   - `SPORTS_API_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`

4. **Firebase Service Account**
   - Upload your Firebase service account JSON file
   - Or add the key content as environment variable

### 4. Deploy

- Click "Create Web Service"
- Render will automatically build and deploy your application
- Your API will be available at: `https://your-app-name.onrender.com`

## API Endpoints

- `GET /health` - Health check
- `GET /api/football` - Football data
- `GET /api/baseball` - Baseball data
- `GET /api/hockey` - Hockey data
- `GET /api/basketball` - Basketball data
- `GET /api/rugby` - Rugby data
- `GET /api/volleyball` - Volleyball data
- `GET /api/afl` - AFL data
- `GET /api/formula1` - Formula 1 data
- `GET /api/mma` - MMA data
- `GET /api/nfl` - NFL data

## Cron Jobs

The application runs automated tasks:
- **Data Fetch**: Daily at 05:00 AM UTC
- **Content Generation**: Every 5 minutes (testing)
- **Newsletter Distribution**: Daily at 06:00 AM UTC

## Important Notes

- **Free Tier Limitations**: Render's free tier has limitations on cron jobs and uptime
- **Environment Variables**: Never commit sensitive data to your repository
- **Firebase Keys**: Keep your Firebase service account key secure
- **API Limits**: Be aware of rate limits for sports APIs and Gemini API

## Troubleshooting

- Check Render logs for deployment issues
- Verify all environment variables are set correctly
- Ensure Firebase service account key is properly configured
- Monitor API rate limits and quotas 