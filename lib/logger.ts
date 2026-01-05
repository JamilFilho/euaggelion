/**
 * Logger utility that only logs in development environment
 */


declare global {
  interface Window {
    __DEV__?: boolean;
  }
}

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
}

export const clientLogger = {
  log: (...args: any[]) => {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.error(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.warn(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.info(...args)
    }
  },
}
