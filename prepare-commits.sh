#!/bin/bash

# Script to prepare commits for WebView authentication feature
# Run this script to create a new branch and organize commits

set -e

BRANCH_NAME="feat/webview-authentication"

echo "=========================================="
echo "Preparing Commits for WebView Authentication"
echo "=========================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    if [ "$CURRENT_BRANCH" == "main" ]; then
        echo "Creating new branch: $BRANCH_NAME"
        git checkout -b $BRANCH_NAME
    else
        echo "Warning: Currently on branch '$CURRENT_BRANCH'"
        read -p "Switch to branch '$BRANCH_NAME'? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME
        else
            exit 1
        fi
    fi
else
    echo "Already on branch: $BRANCH_NAME"
fi

echo ""
echo "=========================================="
echo "Step 1: Repository Structure & Documentation"
echo "=========================================="
echo ""

# Verify explanation MDs are excluded
echo "Verifying explanation MDs are excluded from commits..."
if git check-ignore COMMIT_PLAN.md PR_MESSAGE.md COMMIT_SUMMARY.md FILES_TO_COMMIT.md > /dev/null 2>&1; then
    echo "✓ Explanation MDs are properly ignored and won't be committed"
else
    echo "⚠ Warning: Some explanation MDs may not be ignored"
fi
echo ""

# Stage repository structure changes
echo "Adding repository structure changes..."
echo "Files to be committed:"
echo "  - .gitignore"
echo "  - README.md"
echo ""

git add .gitignore README.md

# Check if README deletions need to be staged
if git status --short | grep -q "D  brb-frontend/README.md"; then
    echo "Staging deleted README files..."
    git add brb-frontend/README.md brb-stablecoin/README.md 2>/dev/null || true
fi

echo ""
echo "Verifying explanation MDs are excluded..."
git check-ignore COMMIT_PLAN.md PR_MESSAGE.md COMMIT_SUMMARY.md FILES_TO_COMMIT.md > /dev/null && echo "✓ Explanation MDs are properly ignored" || echo "⚠ Warning: Some explanation MDs may not be ignored"

echo ""
echo "Committing repository structure changes..."
git commit -m "docs: update repository structure and main README

- Update .gitignore to exclude all .md files except root README.md
- Remove component-specific READMEs from git tracking (kept locally)
- Update main README.md with WebView-based authentication approach
- Remove emojis and update project overview documentation
- Document full-stack architecture and integration points"

echo ""
echo "=========================================="
echo "Step 2: WebView Authentication Implementation"
echo "=========================================="
echo ""

# Stage frontend authentication files
echo "Adding frontend authentication files..."
git add brb-frontend/app/login/
git add brb-frontend/utils/
git add brb-frontend/hooks/useCornellBRB.ts

echo ""
echo "Files to be committed:"
echo "  - brb-frontend/app/login/page.tsx (new)"
echo "  - brb-frontend/utils/sessionStorage.ts (new)"
echo "  - brb-frontend/hooks/useCornellBRB.ts (modified)"

echo ""
echo "Committing WebView authentication implementation..."
git commit -m "feat(frontend): implement WebView-based Cornell GET authentication

- Add login page with iframe embedding of Cornell GET portal
- Implement session ID extraction from GET redirect URL
- Add session storage utilities for localStorage management
- Update useCornellBRB hook to use session storage automatically
- Add session validation and logout functionality
- Support mock login for development testing

This implements a web-based authentication flow that works across
all platforms, replacing any platform-specific implementations.
Users authenticate through Cornell's GET portal, and the session
ID is extracted and used for all subsequent API calls."

echo ""
echo "=========================================="
echo "Commits Created Successfully!"
echo "=========================================="
echo ""
echo "Branch: $BRANCH_NAME"
echo ""
echo "Summary of commits:"
git log --oneline -2
echo ""
echo "Next steps:"
echo "1. Review the commits: git log --oneline"
echo "2. Push to remote: git push -u origin $BRANCH_NAME"
echo "3. Create PR on GitHub using the PR_MESSAGE.md content"
echo ""

