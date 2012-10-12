/*globals Backbone,  beforeEach, $, require, jasmine, describe, it, expect, loadFixtures*/

describe("Cache", function () {
  "use strict";

  var base64map,
    base64mapScrambled;

  beforeEach(function () {
    base64mapScrambled = 'eyJmb28iOiJabTl2IiwiIUAjQCojJipAIyQqQCMkISI6IklVQWpRQ29qSmlwQUl5UXFRQ01rSVEtLSJ9';
    base64map = {
      'foo' : 'Zm9v',
      '!@#@*#&*@#$*@#$!' : 'IUAjQCojJipAIyQqQCMkIQ--'
    };
  });

  it("Should Be Attached to Backbone.Cache", function() {
    expect(Backbone.Cache).toBeDefined();
  });

  it("Should Base64 Encode (scramble) Values", function () {
    _.each(base64map, function (encoded,decoded) {
      expect(Backbone.Cache.scramble(decoded)).toEqual(encoded);
    });
  });

  it("Should Base64 Decode (unscramble) Values", function () {
    _.each(base64map, function (encoded,decoded) {
      expect(Backbone.Cache.unscramble(encoded)).toEqual(decoded);
    });
  });

  it("Should Cache An scrambled Key -> Value pair (set)", function() {
    Backbone.Cache.setScramble(true);
    var scrambled = Backbone.Cache.scramble(JSON.stringify(base64map));
    expect(base64mapScrambled).toEqual(scrambled);
  });

  it("Should Cache An unscrambled Key -> Value pair (set)", function() {
    Backbone.Cache.set("testSet", base64map);
    expect(Backbone.Cache.get("testSet")).toEqual(base64map);
  });

  it("Should Remove A Key -> Value pair from Cache (unset)", function() {
    Backbone.Cache.set("testSet", base64map);
    Backbone.Cache.unset("testSet");
    expect(Backbone.Cache.get("testSet")).toBeNull();
  });

  it("Should Remove A Key -> Value pair from Cache (del)", function() {
    Backbone.Cache.set("testSet", base64map);
    Backbone.Cache.del("testSet");
    expect(Backbone.Cache.get("testSet")).toBeNull();
  });

  it("Should Flush Cache", function() {
    Backbone.Cache.set("testSet", base64map);
    Backbone.Cache.flush();
    expect(Backbone.Cache.get("testSet")).toBeNull();
  });

});
