/* eslint no-console: 0 */

/**
 * Just a placeholder before deciding which library to use
 */

const verbose = process.env.TC_VERBOSE === 'true';


export function log(...args) {
  console.log(...args);
}

export function warn(...args) {
  console.warn(...args);
}

export function error(...args) {
  console.error(...args);
}


if (!verbose) {
  console.info = () => {};
}

export function info(...args) {
  console.info(...args);
}
