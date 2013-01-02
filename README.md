# Backbone-Cache

> Simple Backbone Persistent LocalStorage Cache

## Getting Started

This is a basic localStorage backbone cache. This module has been written in the UMD (Universal Module Definition) Pattern For Use with AMD and non-amd applications.

This Implementation Relies on the following libraries:

- Backbone (https://github.com/documentcloud/backbone)
- jQuery (http://jquery.com/)
- jQuery Store (https://github.com/medialize/jQuery-store)

## Usage

Methods :

  - `setEncoder(encoder)`
    Set The Encoder for the cache bucket

  - `setScramble(boolean)`
    Set The Cache to be scrambled (encoded) or not

  - `getItem(key)` - alias (get)
    get a single item from localStorage

  - `setItem(key, value)` - alias (set)
    set a single item to localStorage

  - `removeItem(key)` - alias (unset)
    remove a single item from localStorage

  - `flush`
    Flush all persistent localStorage

###AMD
  - Remember To Setup jquery, jquery.store and backbone in your paths hash
  - In This use case we are scrambling the localStorage with a yahoo inspired base64 encoder implementation

```js

define(['backbone.cache', 'base64'], function(cache, base64) {

    cache.setEncoder(base64);
    cache.setScramble(true);

    cache.setItem('foo','bar);
    var foo = cache.getItem('foo');
}
```
