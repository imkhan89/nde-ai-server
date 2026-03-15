function timestamp() {
  return new Date().toISOString();
}

function info(message, meta = null) {
  if (meta) {
    console.log(`[INFO] ${timestamp()} - ${message}`, meta);
  } else {
    console.log(`[INFO] ${timestamp()} - ${message}`);
  }
}

function warn(message, meta = null) {
  if (meta) {
    console.warn(`[WARN] ${timestamp()} - ${message}`, meta);
  } else {
    console.warn(`[WARN] ${timestamp()} - ${message}`);
  }
}

function error(message, meta = null) {
  if (meta) {
    console.error(`[ERROR] ${timestamp()} - ${message}`, meta);
  } else {
    console.error(`[ERROR] ${timestamp()} - ${message}`);
  }
}

function debug(message, meta = null) {
  if (process.env.NODE_ENV !== "production") {
    if (meta) {
      console.debug(`[DEBUG] ${timestamp()} - ${message}`, meta);
    } else {
      console.debug(`[DEBUG] ${timestamp()} - ${message}`);
    }
  }
}

export { info, warn, error, debug };

export default {
  info,
  warn,
  error,
  debug
};
