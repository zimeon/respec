// Module core/include-config
// Inject's the document's configuration into the head as JSON.
"use strict";
define(
  ["core/pubsubhub"],
  function(pubsubhub) {
    var initialUserConfig;
    try {
      if (Object.assign) {
        initialUserConfig = Object.assign({}, conf);
      } else {
        initialUserConfig = JSON.parse(JSON.stringify(conf));
      }
    } catch (err) {
      initialUserConfig = {};
    }
    var script = document.createElement('script');
    script.id = 'initialUserConfig';
    script.type = 'application/json';
    respecConfig.initialUserConfig = initialUserConfig;
    pubsubhub.sub('end-all', function() {
      var confFilter = function(key, val) {
        // DefinitionMap contains array of DOM elements that aren't serializable
        // we replace them by their id
        if (key === 'definitionMap') {
          var ret = {};
          Object
            .keys(val)
            .forEach(function(k) {
              ret[k] = val[k].map(function(d) {
                return d[0].id;
              });
            });
          return ret;
        }
        return val;
      };
      script.innerHTML = JSON.stringify(initialUserConfig, confFilter, 2);
      document.head.appendChild(script);
    });
    return {};
  }
);
