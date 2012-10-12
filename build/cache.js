/*! or-cachejs - v0.1.0 - 2012-10-11 */

/*jshint*/
/*global Backbone, define, console */

;(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'jquery', '.', 'jquery.store'], factory);
  } else {
    root.Backbone.Cache = factory(root.Backbone, root.jQuery, root._);
  }
}(this, function (Backbone, $, _) {
  "use strict";

  var Encoders = {

    base64 : {
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
    }
  };

  var Cache = {

    cache : new Backbone.Model(),

    store : new $.store(),

    encoders : {base64 : Encoders.base64},

    encoder : 'base64',

    scrambled : false,

    setEncoder : function(key) {
      //Allow Default base64 Encoding
      if (this.encoders[key]) this.encoder = key;
    },

    setScramble : function(bool) {
      if (_.isBoolean(bool)) this.isScrambled = bool;
    },

    scramble : function(string) {
      return this.encoders[this.encoder].encode(string);
    },

    unscramble : function(string) {
      return this.encoders[this.encoder].decode(string);
    },

    get : function(key, forceNew) {
      var val =  this.cache.get(key);
      if (!val || forceNew) {
        if (this.scrambled) {
          var skey = this.scramble(key);
          val = this.unscramble(this.store.get(skey));
          try {
            val = JSON.parse(val);
          } catch (e) {
            val = null;
            this.store.del(skey);
            this.cache.unset(key, {silent : true});
          }
        } else {
          val = this.store.get(key);
        }
        this.cache.set(key, val, {silent : true});
      }
      return val;
    },

    set : function(key, val) {
      if (this.isScrambled) {
        this.store.set(this.scramble(key), this.scramble(JSON.stringify(val)));
      } else {
        this.store.set(key, val);
      }
      this.cache.set(key, val);
      return val;
    },

    unset : function(key) {
      this.cache.unset(key);
      this.store.del(this.isScrambled ? this.scramble(key) : key);
    },

    //Backwards Compat
    del : function(key) {
      this.unset(key);
    },

    flush : function() {
      this.cache.clear();
      this.store.flush();
    }
  };

  (function() {
    //Not Sure If We Should Expose These?
    Cache.store.driver.scope = 'browser';
    Cache.store.encoders = ['xml', 'json'];
    Cache.store.decoders = ['json', 'xml'];
  })();

  return Cache;
}));
