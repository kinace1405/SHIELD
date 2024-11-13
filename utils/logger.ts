// utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogMeta = Record<string, any>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: LogMeta;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Keep last 1000 logs in memory

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: LogMeta): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaString}`;
  }

  private addLog(level: LogLevel, message: string, meta?: LogMeta) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };

    // Add to in-memory logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Console output with color coding
    const colorCodes = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[35m', // Magenta
      reset: '\x1b[0m'
    };

    const color = colorCodes[level];
    console.log(`${color}${this.formatMessage(level, message, meta)}${colorCodes.reset}`);

    // If it's an error, also log the stack trace if available
    if (level === 'error' && meta?.error?.stack) {
      console.error(`${colorCodes.error}Stack Trace:${colorCodes.reset}`, meta.error.stack);
    }
  }

  info(message: string, meta?: LogMeta) {
    this.addLog('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.addLog('warn', message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.addLog('error', message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === 'development') {
      this.addLog('debug', message, meta);
    }
  }

  // Get recent logs
  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    return filteredLogs.slice(-limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

// Export a singleton instance
const logger = Logger.getInstance();

// Export convenience functions
export const log = (level: LogLevel, message: string, meta?: LogMeta) => {
  logger[level](message, meta);
};

export const logError = (error: Error, context?: string) => {
  logger.error(
    context ? `${context}: ${error.message}` : error.message,
    { error, stack: error.stack }
  );
};

export const logAPIRequest = (req: any, context: string) => {
  logger.info(`API Request: ${context}`, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query
  });
};

export const logAPIResponse = (res: any, context: string) => {
  logger.info(`API Response: ${context}`, {
    statusCode: res.statusCode,
    headers: res.getHeaders?.()
  });
};

// Export the logger instance as default
export default logger;