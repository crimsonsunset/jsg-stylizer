/**
 * Type declarations for @crimsonsunset/jsg-logger
 */

declare module '@crimsonsunset/jsg-logger' {
  export interface LoggerInstance {
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  }

  export interface JSGLoggerConfig {
    configPath?: string;
    [key: string]: any;
  }

  export interface JSGLogger {
    getInstance(config?: JSGLoggerConfig): {
      components?: {
        webComponents?: LoggerInstance;
      };
    };
  }

  const logger: JSGLogger;
  export default logger;
}

