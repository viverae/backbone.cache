/*jshint*/
/*global define */

;(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.base64 = factory();
  }
}(this, function () {
  "use strict";

  return {
    /**
     * Base64 Encode String
     * Based Off Of Yahoo's Implementation
     * @diff Replace("+", ".").Replace("/", "_").Replace("=", "-") <-- To Match With PHP Base64_encode
     * @param string
     */
    encode : function (string) {
      string = string || '';
      var b64_keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
      var output = "";
      var n = 0;
      var oct1, oct2, oct3;
      var char1, char2, char3, char4;

      while (n < string.length) {
        oct1 = string.charCodeAt(n++);
        oct2 = string.charCodeAt(n++);
        oct3 = string.charCodeAt(n++);
        char1 = oct1 >> 2;
        char2 = ((oct1 & 3) << 4) | (oct2 >> 4);
        char3 = ((oct2 & 15) << 2) | (oct3 >> 6);
        char4 = oct3 & 63;

        if (isNaN(oct2)) {
          char3 = char4 = 64;
        } else if (isNaN(oct3)) {
          char4 = 64;
        }
        output = output + b64_keys.charAt(char1) + b64_keys.charAt(char2) + b64_keys.charAt(char3) + b64_keys.charAt(char4);
      }
      return output;
    },

    decode : function (string) {
      string = string || '';
      var b64_keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
      var output = "";
      var n = 0;
      var oct1, oct2, oct3;
      var char1, char2, char3, char4;

      while (n < string.length) {
        char1 = b64_keys.indexOf(string.charAt(n++));
        char2 = b64_keys.indexOf(string.charAt(n++));
        char3 = b64_keys.indexOf(string.charAt(n++));
        char4 = b64_keys.indexOf(string.charAt(n++));
        oct1 = (char1 << 2) | (char2 >> 4);
        oct2 = ((char2 & 15) << 4) | (char3 >> 2);
        oct3 = ((char3 & 3) << 6) | char4;

        output = output + String.fromCharCode(oct1);
        if (char3 !== 64) {
          output = output + String.fromCharCode(oct2);
        }
        if (char4 !== 64) {
          output = output + String.fromCharCode(oct3);
        }
      }
      return output;
    }
  };

}));
