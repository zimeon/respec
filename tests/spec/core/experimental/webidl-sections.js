"use strict";
describe("Experimental — Definitions", () => {
  afterAll(done => {
    flushIframes();
    done();
  });
  var doc;
  beforeAll(function(done) {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + `
      <section id="smoketest" data-dfn-for="PASS" data-link-for="PASS">
        <h2><dfn>PASS</dfn> interface</h2>
        <pre class="idl">
        interface SmokeTest{};
        </pre>
      </section>
      <section id="addheader" data-dfn-for="PASS">
        <pre class="idl">
        dictionary TestDictionary {};
        </pre>
      </section>
      <section data-link-for="PASS">
        <pre class="idl">
        enum TestEnum {};
        </pre>
      </section>
      <section data-link-for="PASS">
        <pre class="idl">
        interface Test {};
        </pre>
      </section>
      <section id="generate-all">
        <pre class="idl">
        interface FullTest {};
        </pre>
      </section>
      <section id="generate-all">
        <pre class="idl">
        interface FullTest {};
        </pre>
      </section>
      <section id="ambigious">
        <pre class="idl">
        interface AmbigiousInterface {};
        dictionary AmbigiousDictionary {};
        </pre>
      </section>
      `,
    };
    makeRSDoc(ops, function(idlDoc) {
      doc = idlDoc;
    }, "spec/core/webidl-contiguous.html").then(done);
  });
  it("automatically includes heading", function(done) {

    makeRSDoc(ops, function(doc) {
      var $sec = $("#dfn", doc);
      expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
      expect($sec.find("a").attr("href")).toEqual("#dfn-text");
    }).then(done);
  });
})
