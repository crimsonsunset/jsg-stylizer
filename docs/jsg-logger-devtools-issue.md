# JSG Logger Devtools Import Issue

**Date**: November 5, 2025  
**Component**: jsg-stylizer package  
**Logger Version**: @crimsonsunset/jsg-logger@1.5.2  
**Status**: Blocking demo/dev server startup

---

## Problem Summary

### Error Message

```
VITE v5.4.21  ready in 114 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help

12:03:42 PM [vite] Pre-transform error: Failed to load url /dist/index.esm.js 
(resolved id: /dist/index.esm.js). Does the file exist?

✘ [ERROR] Could not resolve import("./devtools/dist/panel-entry.js?v=*")

    node_modules/@crimsonsunset/jsg-logger/index.js:463:54:
      463 │                                 module = await import(`./devtools/dist/panel-entry.js?v=${cacheBuster}`);
          ╵                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Error: Build failed with 1 error:
node_modules/@crimsonsunset/jsg-logger/index.js:463:54: ERROR: Could not resolve 
import("./devtools/dist/panel-entry.js?v=*")
```

### Root Cause

**Vite's dependency optimizer is analyzing dynamic imports during dev server startup**, even though these imports are never executed in normal usage. The JSG Logger contains code for an optional devtools panel feature that attempts to dynamically import files that are **not published with the npm package**.

**Key Issue**: The `enableDevPanel()` function (lines 440-475) contains dynamic import statements that Vite tries to resolve during the pre-bundling phase, causing immediate failure when those files don't exist.

---

## Technical Details

### Logger Configuration

- **Package**: @crimsonsunset/jsg-logger
- **Version**: 1.5.2
- **Location**: `node_modules/@crimsonsunset/jsg-logger/index.js`
- **Problematic Function**: `enableDevPanel` (lines 440-475)

### Published Package Contents

According to `package.json`, the published npm package includes:

```json
"files": [
  "index.js",
  "config/",
  "formatters/",
  "stores/",
  "utils/",
  "examples/",
  "docs/",
  "README.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "LICENSE"
]
```

**Missing**: `devtools/` directory is NOT included in published files.

### When It Fails

1. Run `npm run demo` (which runs `vite demo --open`)
2. Vite starts dev server
3. Vite runs dependency optimization/pre-bundling
4. Vite scans all imported dependencies for static analysis
5. Vite finds dynamic import in logger: `import('./devtools/dist/panel-entry.js')`
6. Vite attempts to resolve the import path
7. **Build fails** because the file doesn't exist

### Attempted Fixes (Failed)

#### Attempt 1: Externalize Logger in Vite Config

```typescript
// vite.config.ts
rollupOptions: {
  external: ['@crimsonsunset/jsg-logger'],
  output: {
    globals: {
      '@crimsonsunset/jsg-logger': 'JSGLogger'
    }
  }
}
```

**Result**: Failed - Vite still analyzes the dependency during optimization

#### Attempt 2: Exclude from Dependency Optimization

```typescript
// vite.config.ts
optimizeDeps: {
  exclude: ['@crimsonsunset/jsg-logger']
}
```

**Result**: Failed - Vite still analyzes imports for dev server bundling

---

## Problematic Code

### Full Function from Logger (index.js:440-475)

```javascript
// DevTools panel controls
enableDevPanel: async () => {
    if (typeof window === 'undefined') {
        console.warn('[JSG-LOGGER] DevTools panel only available in browser environments');
        return null;
    }

    try {
        // In development: import source files directly for hot reload
        // In production: import built bundle
        const isDev = import.meta.env?.DEV || window.location.hostname === 'localhost';
        
        let module;
        if (isDev) {
            console.log('🔥 DEV MODE: Attempting to load DevTools from SOURCE for hot reload');
            try {
                // Fix the import path for Vite dev server
                const importPath = '/src/panel-entry.jsx';
                console.log('🔍 Importing:', importPath);
                module = await import(importPath);
                console.log('✅ Source import successful:', module);
            } catch (sourceError) {
                console.error('❌ Source import failed, falling back to bundle:', sourceError);
                const cacheBuster = Date.now();
                module = await import(`./devtools/dist/panel-entry.js?v=${cacheBuster}`);  // LINE 463 - FAILS HERE
            }
        } else {
            console.log('📦 PROD MODE: Loading DevTools from built bundle');
            const cacheBuster = Date.now();
            module = await import(`./devtools/dist/panel-entry.js?v=${cacheBuster}`);  // LINE 468 - ALSO FAILS
        }
        return module.initializePanel();
    } catch (error) {
        console.error('[JSG-LOGGER] Failed to load DevTools panel:', error);
        return null;
    }
},
```

### Current Stylizer Package Configuration

**package.json**:
```json
{
  "dependencies": {
    "fontpicker": "github:wipeautcrafter/jsfontpicker",
    "@crimsonsunset/jsg-logger": "^1.1.0"
  }
}
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Stylizer',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      external: ['@crimsonsunset/jsg-logger'],
      output: {
        globals: {
          '@crimsonsunset/jsg-logger': 'JSGLogger'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  optimizeDeps: {
    exclude: ['@crimsonsunset/jsg-logger']
  }
});
```

---

## Proposed Solutions

### Option 1: Environment/Config Check in Logger (RECOMMENDED)

**Modify the logger to check an environment variable before attempting devtools imports.**

#### Implementation

```javascript
// index.js:440
enableDevPanel: async () => {
    // Check if devtools is explicitly disabled
    if (process.env.JSG_LOGGER_DISABLE_DEVTOOLS === 'true' || 
        process.env.JSG_LOGGER_NO_DEVTOOLS === 'true') {
        console.warn('[JSG-LOGGER] DevTools disabled via environment variable');
        return null;
    }
    
    if (typeof window === 'undefined') {
        console.warn('[JSG-LOGGER] DevTools panel only available in browser environments');
        return null;
    }

    try {
        // Rest of function unchanged...
    } catch (error) {
        console.error('[JSG-LOGGER] Failed to load DevTools panel:', error);
        return null;
    }
},
```

#### Steps

1. Update `@crimsonsunset/jsg-logger` package
2. Add environment check at start of `enableDevPanel` function
3. Publish as v1.5.3
4. Update stylizer's `package.json` to use `^1.5.3`
5. Set environment variable in stylizer's vite config or package.json

#### Pros

- Clean, permanent solution
- Works for all consumers of the logger
- Backwards compatible (no breaking changes)
- Can be enabled when devtools are actually available
- Environment-based, no code changes needed by consumers

#### Cons

- Requires publishing a new logger version
- Needs to wait for npm publish/install
- Consumers need to set environment variable if they want devtools

#### Estimated Time

- 15 minutes to implement and test
- 5 minutes to publish
- 2 minutes to update stylizer

**Total: ~25 minutes**

---

### Option 2: String Concatenation to Hide from Vite

**Use string concatenation and Vite ignore comment to hide imports from static analysis.**

#### Implementation

```javascript
// index.js:463 and 468
// Change from:
module = await import(`./devtools/dist/panel-entry.js?v=${cacheBuster}`);

// Change to:
const devtoolsPath = './devtools/dist/' + 'panel-entry.js?v=' + cacheBuster;
module = await import(/* @vite-ignore */ devtoolsPath);
```

#### Steps

1. Update logger's `enableDevPanel` function
2. Replace template literal with string concatenation
3. Add `/* @vite-ignore */` comment
4. Publish as v1.5.3
5. Update stylizer dependency

#### Pros

- Minimal code change
- Vite won't analyze the import path
- Works immediately once published
- No environment variables needed

#### Cons

- Feels like a workaround rather than a proper fix
- Still requires logger republish
- Import will fail at runtime (but that's caught by try/catch)

#### Estimated Time

- 10 minutes to implement and test
- 5 minutes to publish
- 2 minutes to update stylizer

**Total: ~20 minutes**

---

### Option 3: Vite Plugin to Stub Imports

**Create a Vite plugin in stylizer to intercept and stub the problematic imports.**

#### Implementation

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'stub-logger-devtools',
      resolveId(id) {
        if (id.includes('devtools/dist/panel-entry.js')) {
          return id;
        }
      },
      load(id) {
        if (id.includes('devtools/dist/panel-entry.js')) {
          // Return a stub module
          return `
            export default {};
            export function initializePanel() {
              console.warn('[JSG-LOGGER] DevTools panel not available');
              return null;
            }
          `;
        }
      }
    }
  ],
  build: {
    // ... rest of config
  }
});
```

#### Steps

1. Add plugin to `vite.config.ts` in stylizer package
2. Test that demo starts successfully
3. Verify no runtime errors

#### Pros

- No logger changes needed
- Works immediately
- Keeps logger dependency as-is
- Full control over stub behavior

#### Cons

- Stylizer-specific workaround
- Doesn't solve the root problem
- Other consumers of logger will have same issue
- Adds complexity to stylizer's build config

#### Estimated Time

- 15 minutes to implement and test

**Total: ~15 minutes**

---

### Option 4: patch-package Approach

**Use patch-package to modify node_modules and track the change in version control.**

#### Implementation

```bash
# 1. Manually edit the file
nano node_modules/@crimsonsunset/jsg-logger/index.js

# 2. Make changes (add env check or string concat)

# 3. Create patch
npx patch-package @crimsonsunset/jsg-logger

# 4. Commit the patch file
git add patches/
git commit -m "Patch JSG Logger to fix devtools imports"
```

A `patches/@crimsonsunset+jsg-logger+1.5.2.patch` file will be created and committed.

#### Steps

1. Install patch-package: `npm install --save-dev patch-package`
2. Add postinstall script to package.json: `"postinstall": "patch-package"`
3. Edit `node_modules/@crimsonsunset/jsg-logger/index.js`
4. Run `npx patch-package @crimsonsunset/jsg-logger`
5. Commit the patch file

#### Pros

- Immediate fix
- Survives `npm install`
- Can be applied to any consumer project
- Version-controlled patch file

#### Cons

- Hacky solution
- Patch needs maintenance when logger updates
- Adds dev dependency
- Not solving the root problem
- Confusing for other developers

#### Estimated Time

- 20 minutes to implement and test

**Total: ~20 minutes**

---

### Option 5: Remove Logger Dependency

**Replace JSG Logger with simple console logging.**

#### Implementation

```typescript
// src/logger-utils.ts
const PREFIX = '[Stylizer]';
const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

export const stylizerLogger = {
  info: (...args: any[]) => {
    if (isDev) console.log(PREFIX, ...args);
  },
  debug: (...args: any[]) => {
    if (isDev) console.debug(PREFIX, ...args);
  },
  warn: (...args: any[]) => {
    console.warn(PREFIX, ...args);
  },
  error: (...args: any[]) => {
    console.error(PREFIX, ...args);
  },
};
```

Remove from `package.json`:
```json
"@crimsonsunset/jsg-logger": "^1.1.0"
```

#### Pros

- Zero dependencies
- Guaranteed to work
- Simpler codebase
- Smaller bundle size

#### Cons

- Loses logger features (formatting, components, etc.)
- Feels like giving up
- Removes integration with JSG logging ecosystem
- Need to reimplement if logger is fixed later

#### Estimated Time

- 10 minutes to implement
- 5 minutes to test

**Total: ~15 minutes**

---

## Decision Matrix

| Option | Time | Effort | Permanence | Impact on Logger | Impact on Stylizer |
|--------|------|--------|------------|------------------|-------------------|
| 1. Env Check | 25 min | Medium | Permanent | Fix for all users | Clean solution |
| 2. String Concat | 20 min | Low | Permanent | Fix for all users | Clean solution |
| 3. Vite Plugin | 15 min | Low | Temporary | None | Adds complexity |
| 4. Patch Package | 20 min | Medium | Temporary | None | Hacky workaround |
| 5. Remove Logger | 15 min | Low | Permanent | None | Loses features |

---

## Recommendation

### Primary: Option 1 (Environment Check)

**Best for long-term health of both projects.** Adds proper feature flag to logger, allows consumers to opt-out of devtools when not needed, and prevents similar issues in the future.

### Fallback: Option 3 (Vite Plugin)

**Best for immediate unblocking** if can't publish logger quickly. Takes 15 minutes, doesn't require any external changes, and can be removed later when logger is fixed properly.

### Not Recommended: Option 5

Removing the logger throws away good integration work and will need to be redone if/when the logger is fixed.

---

## Action Items

- [ ] Decide which option to implement
- [ ] If Option 1: Update logger, publish v1.5.3, update stylizer
- [ ] If Option 2: Update logger, publish v1.5.3, update stylizer  
- [ ] If Option 3: Implement Vite plugin in stylizer
- [ ] Test that `npm run demo` works without errors
- [ ] Verify demo site functionality
- [ ] Document the fix in this file
- [ ] Update stylizer-implementation-summary.md with resolution

---

## Related Files

- `/Users/joe/Desktop/Repos/Personal/jsg-tech-check-site/jsg-stylizer/package.json`
- `/Users/joe/Desktop/Repos/Personal/jsg-tech-check-site/jsg-stylizer/vite.config.ts`
- `/Users/joe/Desktop/Repos/Personal/jsg-tech-check-site/jsg-stylizer/src/logger-utils.ts`
- `/Users/joe/Desktop/Repos/Personal/jsg-tech-check-site/jsg-stylizer/node_modules/@crimsonsunset/jsg-logger/index.js`
- `/Users/joe/Desktop/Repos/Personal/jsg-tech-check-site/jsg-stylizer/node_modules/@crimsonsunset/jsg-logger/package.json`

---

**Status**: Awaiting decision on implementation approach.

