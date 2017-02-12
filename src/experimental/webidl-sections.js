import { parse } from "deps/webidl2";

function findParentByName(localName) {
  return function recurse(elem) {
    if (!elem.parentElement) {
      return null;
    }
    while (elem.parentElement.localName !== localName) {
      return recurse(elem.parentElement);
    }
    return {
      [localName]: elem.parentElement,
      elem,
    };
  }
}

function findTopLevelIdl(parsedIdl) {
  return parsedIdl.find(({ type }) => ["dictionary", "enum", "interface"].includes(type))
}

const findSectionParent = findParentByName("section")

function createHeading(name, type) {
  const h2 = document.createElement("h2");
  h2.innerHTML = `<dfn>${name}</dfn> ${type}`;
  return h2;
}

export async function run({ enableExperimentalFeatures }, doc, cb) {
  if(!enableExperimentalFeatures){
    return cb();
  }
  const sections = Array
    .from(doc.querySelectorAll("section pre.idl"))
    .map(findSectionParent)
    .map(
      ({ section, elem: pre }) => ({ section, pre, idl: parse(pre.textContent) })
    )
    .filter(
      ({ idl }) => idl.some(({ type }) => ["dictionary", "enum", "interface"].includes(type))
    )
    .forEach(({ section, pre, idl }) => {
      const hasHeading = section.querySelector(":scope>h2,:scope>h3,:scope>h4,:scope>h5,:scope>h6");
      const { name, type } = findTopLevelIdl(idl);
      if (hasHeading === null) {
        const heading = createHeading(name, type);
        section.insertBefore(heading, section.firstChild);
      }
      if (!section.dataset.dfnFor) {
        section.dataset.dfnFor = name;
      }
      if (!section.dataset.linkFor) {
        section.dataset.linkFor = name;
      }
    });
  cb();
}
