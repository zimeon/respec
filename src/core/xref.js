// PRESENT ISSUES:
// <a>TERM</a> is not distinguishable from data-xref terms
//   as core/link-to-dfn for local terms runs later
//   so, local terms are presently also sent in query to xrefs api
//   Status: Hotfix exists

import { closestParent } from "core/utils";

export const name = "core/xref";

export async function run(conf) {
  if (!conf.xref) return;
  // collect keys, prepare
  const keys = [...document.querySelectorAll("a[data-xref], a:not([href])")]
    .map(elem => {
      const key = {};
      if ("xref" in elem.dataset) {
        key.term = elem.dataset.xref;
      } else {
        key.term = elem.dataset.xref = elem.textContent;
      }
      const parentDataCite = closestParent(elem, "[data-cite]");
      key.specs = parentDataCite ? parentDataCite.dataset.cite.split(" ") : [];
      key.types = [];
      return key;
    })
    .reduce((keys, key) => {
      const { term } = key;
      if (keys.has(term)) {
        const temp = keys.get(term);
        temp.types = [...new Set([...temp.types, ...key.types])];
        temp.specs = [...new Set([...temp.specs, ...key.specs])];
        keys.set(term, temp);
      } else {
        keys.set(term, key);
      }
      return keys;
    }, new Map());

  const query = { keys: [...keys.values()] };
  const results = await simulateShepherd(query);

  // set data-cite for further processing
  document.querySelectorAll("a[data-xref]").forEach(elem => {
    const term = elem.getAttribute("data-xref");
    if (!results[term] || !results[term].length) {
      return;
    }
    const result = disambiguate(results[term], elem);
    if (!result) return;
    const { spec, uri } = result;
    const dataCite = `${spec}${uri.startsWith("#") ? uri : "/" + uri}`;
    elem.setAttribute("data-cite", dataCite);
  });
}

function disambiguate(data, elem) {
  if (data.length === 1) return data[0]; // unambiguous
  return data[0]; // todo
}

async function simulateShepherd(query) {
  // live experimental end point:
  // https://wt-466c7865b463a6c4cbb820b42dde9e58-0.sandbox.auth0-extend.com/respec-xref-proto
  await wait(10);
  const result = {};
  const data = Data();
  for (const key of query.keys) {
    if (key.term in data) {
      result[key.term] = data[key.term].filter(item => filterFn(item, key));
    }
  }
  return result;

  function filterFn(item, { specs, types }) {
    let valid = true;
    if (Array.isArray(specs) && specs.length) {
      valid = specs.includes(item.spec);
    }
    if (Array.isArray(types) && types.length) {
      valid = valid && types.includes(item.type);
    }
    return valid;
  }

  function wait(duration = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  // this just exists to keep the distracting stuff at end of code
  function Data() {
    return {
      EventHandler: [
        {
          spec: "html",
          type: "typedef",
          normative: true,
          uri: "webappapis.html#eventhandler",
        },
      ],
      "event handler": [
        {
          spec: "html",
          type: "dfn",
          normative: true,
          uri: "webappapis.html#event-handlers",
        },
      ],
      "URL parser": [
        {
          spec: "url",
          type: "dfn",
          normative: true,
          uri: "#concept-url-parser",
        },
      ],
      request: [
        {
          spec: "service-workers",
          type: "attribute",
          for: ["FetchEvent"],
          normative: true,
          uri: "#dom-fetchevent-request",
        },
        {
          spec: "service-workers",
          type: "dict-member",
          for: ["FetchEventInit"],
          normative: true,
          uri: "#dom-fetcheventinit-request",
        },
        {
          spec: "service-workers",
          type: "dfn",
          for: ["cache batch operation"],
          normative: true,
          uri: "#dfn-cache-batch-operation-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: ["Cache/add(request)"],
          normative: true,
          uri: "#dom-cache-add-request-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: ["Cache/delete(request, options)", "Cache/delete(request)"],
          normative: true,
          uri: "#dom-cache-delete-request-options-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: [
            "Cache/keys(request, options)",
            "Cache/keys(request)",
            "Cache/keys()",
          ],
          normative: true,
          uri: "#dom-cache-keys-request-options-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: ["Cache/match(request, options)", "Cache/match(request)"],
          normative: true,
          uri: "#dom-cache-match-request-options-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: [
            "Cache/matchAll(request, options)",
            "Cache/matchAll(request)",
            "Cache/matchAll()",
          ],
          normative: true,
          uri: "#dom-cache-matchall-request-options-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: ["Cache/put(request, response)"],
          normative: true,
          uri: "#dom-cache-put-request-response-request",
        },
        {
          spec: "service-workers",
          type: "argument",
          for: [
            "CacheStorage/match(request, options)",
            "CacheStorage/match(request)",
          ],
          normative: true,
          uri: "#dom-cachestorage-match-request-options-request",
        },
        {
          spec: "webusb",
          type: "dict-member",
          normative: true,
          for: ["USBControlTransferParameters"],
          uri: "#dom-usbcontroltransferparameters-request",
        },
        {
          spec: "fetch",
          type: "dfn",
          normative: true,
          uri: "#concept-request",
        },
        {
          spec: "fetch",
          type: "dfn",
          normative: true,
          for: ["fetch record"],
          uri: "#concept-fetch-record-request",
        },
      ],
      Request: [
        {
          spec: "fetch",
          type: "interface",
          normative: true,
          uri: "#request",
        },
      ],
    };
  }
}
