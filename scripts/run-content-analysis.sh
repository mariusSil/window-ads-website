#!/bin/bash

# Service Content Analysis Runner Script
# Sets up environment and runs the content analysis

echo "🚀 Starting Service Content Analysis..."
echo "======================================"

# Check if .env.local exists, if not create it
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "DEEPINFRA_API_KEY=YXhfBfvoSFTaDGdTG8GEk7fr45UnNI53" > .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Run the analysis script
echo "🔍 Running content analysis..."
node scripts/analyze-service-content.js

echo ""
echo "📊 Analysis complete! Check the content-analysis-output/ directory for results."
echo "📄 Key files:"
echo "  - analysis-summary.md (human-readable report)"
echo "  - content-analysis-report.json (detailed analysis)"
echo "  - *-improved.json (AI-enhanced service files)"
