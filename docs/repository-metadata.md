# Repository Metadata

This repository uses the centralized GitHub metadata management system.

## File Location

- **Metadata File:** `.github/repository-metadata.json` (in `.github/` directory)
- **Centralized Update Script:** `starter-docs/setup-info/github-updater/update-all-repos.js`

## Updating Metadata

### Method 1: Edit JSON and Run Centralized Script

1. Edit `.github/repository-metadata.json` with your changes
2. Run the centralized update script from the starter-docs directory:
   ```bash
   cd /Users/joe/Desktop/Repos/Personal/starter-docs/setup-info/github-updater
   node update-all-repos.js
   ```
   
   This will update ALL repos that have `.github/repository-metadata.json` files.

### Method 2: Update This Repo Only

```bash
cd /Users/joe/Desktop/Repos/Personal/starter-docs/setup-info/github-updater
node update-all-repos.js
```

The script will automatically discover `jsg-stylizer` and update it.

### Method 3: Use GitHub CLI Directly

```bash
gh repo edit crimsonsunset/jsg-stylizer \
  --description "Your description" \
  --add-topic "topic1,topic2,topic3" \
  --homepage "https://stylizer-demo.netlify.app"
```

## Current Metadata

See `.github/repository-metadata.json` for current settings including:
- Description
- Website URL
- Topics/Tags
- Repository features (issues, wiki, projects)

## Reference

For complete documentation on the centralized metadata system, see:
`starter-docs/setup-info/github-updater/README.md`
