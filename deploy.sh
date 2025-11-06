#!/bin/bash

# ========================================
# SaudiPayFlow v2.0.0 - Deployment Script
# ========================================

echo "🚀 Starting Vercel Deployment Setup..."
echo ""

# Check if GitHub repo URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: GitHub repository URL is required"
    echo ""
    echo "Usage: ./deploy.sh <GITHUB_REPO_URL>"
    echo ""
    echo "Example:"
    echo "  ./deploy.sh https://github.com/username/saudi-payflow.git"
    echo ""
    echo "Steps to create GitHub repository:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Name: saudi-payflow"
    echo "  3. Public"
    echo "  4. Don't initialize with README"
    echo "  5. Create repository"
    echo "  6. Copy the URL and run: ./deploy.sh <URL>"
    exit 1
fi

REPO_URL=$1

echo "✅ GitHub Repository URL: $REPO_URL"
echo ""

# Add remote origin
echo "📡 Adding remote origin..."
git remote add origin $REPO_URL
echo "✅ Remote added"
echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main
echo "✅ Code pushed to GitHub"
echo ""

# Instructions for Vercel
echo "═══════════════════════════════════════════════════════════════"
echo "                    🎉 SUCCESS!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Your code has been pushed to GitHub successfully!"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Go to: https://vercel.com"
echo "2️⃣  Sign in with GitHub"
echo "3️⃣  Click 'New Project'"
echo "4️⃣  Import your repository: saudi-payflow"
echo ""
echo "5️⃣  Configure environment variables (optional):"
echo "    - NEXT_PUBLIC_SUPABASE_URL"
echo "    - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "    - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "6️⃣  Click 'Deploy'"
echo "7️⃣  Wait 2-3 minutes for build to complete"
echo "8️⃣  Get your app URL! ✨"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Complete project documentation"
echo "   - DEPLOYMENT.md - Detailed deployment guide"
echo "   - VERCEL_DEPLOYMENT_STEPS.md - Step-by-step Vercel guide"
echo ""
echo "💡 Note: You can test the app without Supabase (demo mode)"
echo ""
echo "🎯 Your app will be available at:"
echo "   https://saudi-payflow-xxxx.vercel.app"
echo ""
echo "═══════════════════════════════════════════════════════════════"
