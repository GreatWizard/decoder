import "core-js/stable";
import "regenerator-runtime/runtime";

import aes from "./aes";
import b64 from "./b64";
import escape from "./escape";
import sc from "./sc";

const isUrl = (value) =>
  value && (value.startsWith("http://") || value.startsWith("https://"));

globalThis.waiters = {};

globalThis.waitBefore = (name, funcName, data, timeout = 250) => {
  if (!globalThis.waiters[name]) {
    globalThis.waiters[name] = 0;
  }
  clearTimeout(globalThis.waiters[name]);
  globalThis.waiters[name] = setTimeout(function () {
    globalThis[funcName](data);
  }, timeout);
};

globalThis.onDecoderChange = async (value) => {
  const encoded = value.trim();
  let decoded = encoded;
  let iterations = [];
  let noMoreDetection = false;
  while (!noMoreDetection) {
    if (b64.detect(decoded)) {
      let b64Decoded = await b64.decode(decoded);
      let scDecoded = false;
      if (!isUrl(b64Decoded)) {
        let trySC = await sc.decode(decoded);
        if (isUrl(trySC)) {
          iterations.push("SC");
          decoded = trySC;
          scDecoded = true;
        }
      }
      if (!scDecoded) {
        iterations.push("Base64");
        decoded = b64Decoded;
      }
    } else if (escape.detect(decoded)) {
      iterations.push("Escape");
      decoded = await escape.decode(decoded);
    } else if (aes.detect(decoded)) {
      iterations.push("AES");
      decoded = await aes.decode(decoded);
    } else {
      noMoreDetection = true;
    }
  }
  if (iterations.length === 0) {
    iterations.push("nothing to decode");
  }
  const resultURL = document.getElementById("result-decoder-url");
  const labelURL = document.getElementById("label-decoder-url");
  const labelURLIterations = document.getElementById(
    "label-decoder-url-iterations"
  );
  const resultOther = document.getElementById("result-decoder-other");
  const labelOther = document.getElementById("label-decoder-other");
  const labelOtherIterations = document.getElementById(
    "label-decoder-other-iterations"
  );
  const copyDecoded = document.getElementById("copy-decoded");
  if (isUrl(decoded)) {
    copyDecoded.classList.add("hide");
    resultOther.innerText = "";
    labelOtherIterations.innerText = "";
    resultOther.classList.add("hide");
    labelOther.classList.add("hide");
    labelOtherIterations.classList.add("hide");
    resultURL.href = decoded;
    resultURL.text = decoded;
    labelURLIterations.innerText = ` (${iterations.join(", ")})`;
    resultURL.classList.remove("hide");
    labelURL.classList.remove("hide");
    labelURLIterations.classList.remove("hide");
    resultURL.click();
  } else {
    resultURL.href = "#";
    resultURL.text = "";
    resultURL.classList.add("hide");
    labelURL.classList.add("hide");
    if (decoded !== undefined && decoded !== "") {
      resultOther.innerText = decoded;
      labelOtherIterations.innerText = ` (${iterations.join(", ")})`;
      resultOther.classList.remove("hide");
      labelOther.classList.remove("hide");
      labelOtherIterations.classList.remove("hide");
      copyDecoded.classList.remove("hide");
    } else {
      resultOther.innerText = "";
      labelOtherIterations.innerText = "";
      resultOther.classList.add("hide");
      labelOther.classList.add("hide");
      labelOtherIterations.classList.add("hide");
      copyDecoded.classList.add("hide");
    }
  }
};

globalThis.onEncoderChange = async (value, type = "b64") => {
  const encoded =
    value.trim() !== undefined && value.trim() !== ""
      ? type === "aes"
        ? await aes.encode(value.trim())
        : type === "escape"
        ? await escape.encode(value.trim())
        : type === "sc"
        ? await sc.encode(value.trim())
        : await b64.encode(value.trim())
      : undefined;
  const result = document.getElementById("result-encoder");
  const label = document.getElementById("label-encoder");
  const copyEncoded = document.getElementById("copy-encoded");
  if (encoded !== undefined && encoded !== "") {
    result.innerText = encoded;
    result.classList.remove("hide");
    label.classList.remove("hide");
    copyEncoded.classList.remove("hide");
  } else {
    result.innerText = "";
    result.classList.add("hide");
    label.classList.add("hide");
    copyEncoded.classList.add("hide");
  }
};

globalThis.copyFromId = (id) => {
  const el = document.getElementById(id);
  const range = document.createRange();
  range.selectNode(el);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
};
