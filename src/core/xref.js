export const name = "core/xref";

export async function run(conf) {
  if (!conf.xref) return;
  // collect keys, prepare
  const keys = [];
  document.querySelectorAll("a[data-xref], a:not([href])").forEach(elem => {
    console.log(elem);

    let term;
    if ("xref" in elem.dataset) {
      term = elem.dataset.xref;
    } else {
      term = elem.textContent;
      elem.dataset.xref = term;
    }
    keys.push({ term });
  });
  const query = { keys };

  const results = await simulateShepherd(query);

  // set data-cite for further processing
  document.querySelectorAll("a[data-xref]").forEach(elem => {
    if (!results[elem.dataset.xref].length) return;
    const result = disambiguate(results[elem.dataset.xref], elem);
    if (!result) return;
    const { spec, uri } = result;
    const dataCite = `${spec}/${uri}`;
    elem.setAttribute("data-cite", dataCite);
  });
}

function disambiguate(data, elem) {
  return data[0];
}

async function simulateShepherd(query) {
  await wait(500);
  const result = {};
  const data = Data();
  for (const { term } of query.keys) {
    result[term] = data[term];
  }
  return result;

  function wait(duration = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

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
