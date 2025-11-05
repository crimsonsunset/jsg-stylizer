/**
 * JSG Logger integration for Stylizer Web Component
 */

// Declare global Window interface for JSG_Logger
declare global {
  interface Window {
    JSG_Logger?: any;
  }
}

// Lazy logger initialization
let loggerInstance: any = null;
let loggerControls: any = null;
let loggerInitialized = false;

async function initializeLogger() {
  if (loggerInitialized) return;
  
  loggerInitialized = true;
  try {
    // Use dynamic import for ES module compatibility
    const JSGLoggerModule = await import('@crimsonsunset/jsg-logger');
    const JSGLogger = JSGLoggerModule.default || JSGLoggerModule;
    
    const logger = JSGLogger.getInstance({
      configPath: 'logger-config.json',
      // Enable DevTools for demo/dev environments
      devtools: {
        enabled: true
      }
    });

    // Store the full logger instance and webComponents logger
    if (logger.components?.webComponents) {
      loggerInstance = logger.components.webComponents;
    }

    // Store controls reference (window.JSG_Logger is now automatically exposed by logger v1.5.5+)
    if (typeof window !== 'undefined' && logger.controls) {
      loggerControls = logger.controls;
    }
  } catch (error) {
    // Logger not available, use no-op logger
    console.warn('[Stylizer] JSG Logger not available:', error);
  }

  // If logger didn't initialize, use no-op
  if (!loggerInstance) {
    loggerInstance = {
      info: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
    };
  }
}

function getLogger() {
  if (!loggerInitialized) {
    // Start async initialization but don't wait
    initializeLogger();
  }
  return loggerInstance;
}

/**
 * Get logger controls for DevTools access
 */
export function getLoggerControls() {
  if (!loggerInitialized) {
    getLogger(); // Initialize if needed
  }
  return loggerControls;
}

// Initialize logger on module load (for browser environments)
if (typeof window !== 'undefined') {
  initializeLogger(); // Start async initialization so window.JSG_Logger is available
}

// Export a proxy that lazily initializes
export const stylizerLogger = {
  info: (...args: any[]) => getLogger().info(...args),
  debug: (...args: any[]) => getLogger().debug(...args),
  warn: (...args: any[]) => getLogger().warn(...args),
  error: (...args: any[]) => getLogger().error(...args),
};

// Convenience logging functions
export const logFontChange = (fontType: string, fontFamily: string) => {
  stylizerLogger.info('Font applied', { fontType, fontFamily });
};

export const logPickerInit = (mode: string, fontCount: number) => {
  stylizerLogger.info('Picker initialized', { mode, fontCount });
};

export const logError = (message: string, error: any) => {
  stylizerLogger.error(message, {
    error: error.message,
    stack: error.stack
  });
};

export const logDebug = (message: string, data?: any) => {
  stylizerLogger.debug(message, data);
};
