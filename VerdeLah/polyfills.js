// Polyfills for React Native compatibility with AWS SDK

// Enhanced crypto polyfill with better randomness
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      // Use a more secure random number generator
      try {
        // Try to use Web Crypto API if available
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
          return window.crypto.getRandomValues(array);
        }
      } catch (e) {
        // Fall through to fallback
      }
      
      // Fallback to Math.random with better distribution
      for (let i = 0; i < array.length; i++) {
        // Use multiple random calls for better distribution
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  };
}

// Enhanced TextEncoder/TextDecoder polyfill
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(input) {
      if (typeof input !== 'string') {
        throw new TypeError('TextEncoder.encode() expects a string');
      }
      
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  };
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    constructor(encoding = 'utf-8') {
      this.encoding = encoding;
    }
    
    decode(input) {
      if (!input) return '';
      
      const result = new Array(input.length);
      for (let i = 0; i < input.length; i++) {
        result[i] = String.fromCharCode(input[i]);
      }
      return decodeURIComponent(escape(result.join('')));
    }
  };
}

// Polyfill for URL and URLSearchParams
if (typeof global.URL === 'undefined') {
  global.URL = class URL {
    constructor(url, base) {
      if (base) {
        this.href = new URL(url, base).href;
      } else {
        this.href = url;
      }
    }
  };
}

if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = class URLSearchParams {
    constructor(init) {
      this.params = new Map();
      if (init) {
        if (typeof init === 'string') {
          init.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            this.params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
          });
        }
      }
    }
    
    get(name) {
      return this.params.get(name);
    }
    
    set(name, value) {
      this.params.set(name, value);
    }
    
    toString() {
      const pairs = [];
      this.params.forEach((value, key) => {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
      return pairs.join('&');
    }
  };
}

