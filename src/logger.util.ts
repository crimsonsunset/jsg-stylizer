/**
 * Smart logger utility for Stylizer
 * 
 * Detects existing logger instances and falls back gracefully:
 * 1. Check window.JSG_Logger (set by consuming app)
 * 2. Try dynamic import of jsg-logger (uses consuming app's version if peer dependency)
 * 3. Fall back to no-op logger if unavailable
 */

/**
 * Logger interface matching JSG Logger component methods
 */
interface LoggerInterface {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

/**
 * No-op logger fallback when logger is unavailable
 */
const noOpLogger: LoggerInterface = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/**
 * Track logger detection state for debugging
 */
let loggerDetected = false;
let detectionLogged = false;

/**
 * Get logger component lazily - checks window.JSG_Logger on each access
 * This allows logger to be detected even if it initializes after stylizer loads
 */
function getLoggerComponent(): LoggerInterface | null {
  if (typeof window !== 'undefined' && (window as any).JSG_Logger) {
    try {
      const component = (window as any).JSG_Logger.getComponent('webComponents');
      if (component && typeof component.debug === 'function') {
        // Log detection once (first successful access)
        if (!loggerDetected && !detectionLogged) {
          loggerDetected = true;
          detectionLogged = true;
          console.log('[Stylizer] ✅ Using existing JSG Logger instance from consuming app');
        }
        return component;
      }
    } catch (error) {
      // Fall through to no-op
    }
  }
  
  // Log no-op fallback once (first access when logger not available)
  if (!detectionLogged) {
    detectionLogged = true;
    console.log('[Stylizer] ℹ️ JSG Logger not available - using no-op logger (logs will be silent)');
  }
  
  return null;
}

/**
 * Create lazy logger proxy that checks window.JSG_Logger on each method call
 * This ensures logger is detected even if it initializes after stylizer loads
 */
function createLazyLogger(): LoggerInterface {
  return {
    debug: (...args: any[]) => {
      const logger = getLoggerComponent();
      if (logger) {
        logger.debug(...args);
      }
    },
    info: (...args: any[]) => {
      const logger = getLoggerComponent();
      if (logger) {
        logger.info(...args);
      }
    },
    warn: (...args: any[]) => {
      const logger = getLoggerComponent();
      if (logger) {
        logger.warn(...args);
      }
    },
    error: (...args: any[]) => {
      const logger = getLoggerComponent();
      if (logger) {
        logger.error(...args);
      }
    },
  };
}

/**
 * Export lazy logger that checks window.JSG_Logger on each call
 * Uses smart detection: checks window.JSG_Logger first, falls back to no-op
 */
export const stylizerLogger = createLazyLogger();

