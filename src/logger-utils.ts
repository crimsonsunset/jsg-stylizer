/**
 * JSG Logger integration for Stylizer Web Component
 */

// Lazy logger initialization
let loggerInstance: any = null;
let loggerInitialized = false;

function getLogger() {
  if (!loggerInitialized) {
    loggerInitialized = true;
    try {
      // Try to import and initialize JSG Logger
      const JSGLogger = require('@crimsonsunset/jsg-logger');
      const logger = JSGLogger.getInstance({
        configPath: 'logger-config.json',
        // Explicitly disable DevTools to prevent build issues
        // DevTools code will be tree-shaken when disabled
        devtools: {
          enabled: true
        }
      });

      if (logger.components?.webComponents) {
        loggerInstance = logger.components.webComponents;
      }
    } catch (error) {
      // Logger not available, use no-op logger
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

  return loggerInstance;
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
