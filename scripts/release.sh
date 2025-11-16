#!/bin/bash
# Release script that runs np and creates GitHub release automatically

VERSION_TYPE=$1

# Commit any uncommitted changes
git add -A
git commit -m 'chore: prepare for release' || true

# Run np with auto-confirm
echo 'y' | npx np $VERSION_TYPE --no-tests --any-branch --no-release-draft

# Get the version that was just published from package.json
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
TAG="v${VERSION}"

# Get the previous tag to generate release notes
PREVIOUS_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")

# Generate release notes from commits since last tag
if [ -n "$PREVIOUS_TAG" ]; then
  NOTES=$(git log ${PREVIOUS_TAG}..HEAD --pretty=format:"- %s (%h)" | head -20)
else
  NOTES=$(git log --pretty=format:"- %s (%h)" -10)
fi

# Create GitHub release using the tag np created
gh release create "$TAG" \
  --title "$TAG" \
  --notes "$NOTES" \
  --repo crimsonsunset/jsg-stylizer || echo "Release creation skipped (may already exist)"

