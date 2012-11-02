/*! cachejs - v0.1.0 - 2012-11-02 */

/*jshint*/
/*global Backbone, define, console */

;(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'jquery', 'underscore', 'jquery.store'], factory);
  } else {
    root.Backbone.Cache = factory(root.Backbone, root.jQuery, root._);
  }
}(this, function (Backbone, $, _) {
  "use strict";

  var Cache = {

    cache : new Backbone.Model(),

    store : new $.store(),

    scrambled : false,

    encoder : null,

    setEncoder : function(encoder) {
      if (_.isObject(encoder)) this.encoder = encoder;
    },

    setScramble : function(bool) {
      if (_.isBoolean(bool)) this.isScrambled = bool;
    },

    scramble : function(string) {
      if (!this.encoder || (this.encoder && !_.isFunction(this.encoder.encode))) {
        throw new Error("Cache Encoder Not Set");
      } else {
        return this.encoder.encode(string);
      }
    },

    unscramble : function(string) {
      if (!this.encoder || (this.encoder && !_.isFunction(this.encoder.decode))) {
        throw new Error("Cache Decoder Not Set");
      } else {
        return this.encoder.decode(string);
      }
    },

    getItem : function(key, forceNew) {
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

    setItem : function(key, val) {
      if (this.isScrambled) {
        this.store.set(this.scramble(key), this.scramble(JSON.stringify(val)));
      } else {
        this.store.set(key, val);
      }
      this.cache.set(key, val);
      return val;
    },

    removeItem : function(key) {
      this.cache.unset(key);
      this.store.del(this.isScrambled ? this.scramble(key) : key);
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
