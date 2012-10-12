/*jshint*/
/*global Backbone, define, console */

;(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'jquery', 'underscore', 'base64', 'jquery.store'], factory);
  } else {
    root.Backbone.Cache = factory(root.Backbone, root.jQuery, root._, base64);
  }
}(this, function (Backbone, $, _, base64) {
  "use strict";

  var Cache = {

    cache : new Backbone.Model(),

    store : new $.store(),

    encoders : {base64 : base64},

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
