/**
 * Logger utility for Stylizer
 * 
 * Uses JSG Logger if available via window.JSG_Logger (set by consuming app),
 * otherwise falls back to no-op logger.
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
 * Get logger component once at module load
 * Checks window.JSG_Logger if available
 */
let logger: LoggerInterface | null = null;

if (typeof window !== 'undefined') {
  if ((window as any).JSG_Logger) {
    console.log('[Stylizer] 🔍 window.JSG_Logger found, attempting to get component...');
    try {
      const component = (window as any).JSG_Logger.getComponent('webComponents');
      if (component && typeof component.debug === 'function') {
        logger = component;
        console.log('[Stylizer] ✅ Using JSG Logger component from window.JSG_Logger');
      } else {
        console.log('[Stylizer] ⚠️ window.JSG_Logger found but getComponent("webComponents") returned invalid component');
      }
    } catch (error) {
      console.log('[Stylizer] ❌ Error getting logger component:', error);
    }
  } else {
    console.log('[Stylizer] ℹ️ window.JSG_Logger not found, using no-op logger');
  }
} else {
  console.log('[Stylizer] ℹ️ Not in browser environment, using no-op logger');
}

/**
 * Export logger or no-op fallback
 */
export const stylizerLogger = logger || noOpLogger;
