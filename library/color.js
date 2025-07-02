const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  strikethrough: '\x1b[9m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  grey: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
  bgGrey: '\x1b[100m',
  bgBrightRed: '\x1b[101m',
  bgBrightGreen: '\x1b[102m',
  bgBrightYellow: '\x1b[103m',
  bgBrightBlue: '\x1b[104m',
  bgBrightMagenta: '\x1b[105m',
  bgBrightCyan: '\x1b[106m',
  bgBrightWhite: '\x1b[107m'
};

function createStyler(codes) {
  return function(text) {
    const openCodes = Array.isArray(codes) ? codes.join('') : codes;
    return `${openCodes}${text}${colors.reset}`;
  };
}

function createChainableStyler(appliedCodes = []) {
  const styler = function(text) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    const openCodes = appliedCodes.join('');
    return `${openCodes}${text}${colors.reset}`;
  };

  Object.keys(colors).forEach(key => {
    if (key === 'reset') return;
    
    Object.defineProperty(styler, key, {
      get() {
        return createChainableStyler([...appliedCodes, colors[key]]);
      }
    });
  });

  Object.defineProperty(styler, 'bold', {
    get() {
      return createChainableStyler([...appliedCodes, colors.bright]);
    }
  });

  Object.defineProperty(styler, 'italic', {
    get() {
      return createChainableStyler([...appliedCodes, '\x1b[3m']);
    }
  });

  Object.defineProperty(styler, 'underline', {
    get() {
      return createChainableStyler([...appliedCodes, colors.underscore]);
    }
  });

  Object.defineProperty(styler, 'inverse', {
    get() {
      return createChainableStyler([...appliedCodes, colors.reverse]);
    }
  });

  styler.rgb = function(r, g, b) {
    return createChainableStyler([...appliedCodes, `\x1b[38;2;${r};${g};${b}m`]);
  };

  styler.bgRgb = function(r, g, b) {
    return createChainableStyler([...appliedCodes, `\x1b[48;2;${r};${g};${b}m`]);
  };

  styler.hex = function(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return styler.rgb(r, g, b);
  };

  styler.bgHex = function(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return styler.bgRgb(r, g, b);
  };

  return styler;
}

const consoleDye = createChainableStyler();

consoleDye.supportsColor = {
  level: process.env.NODE_ENV !== 'test' ? 1 : 0,
  hasBasic: true,
  has256: true,
  has16m: true
};

consoleDye.visible = function(text) {
  return text;
};

consoleDye.strip = function(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
};

module.exports = { consoleDye }
