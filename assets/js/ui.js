import aes from "./aes";
import b64 from "./b64";

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

globalThis.onDecoderChange = (value) => {
  const encoded = value.trim();
  let decoded;
  if (aes.detect(encoded)) {
    decoded = aes.decode(encoded);
  } else {
    decoded = encoded;
    do {
      decoded = b64.decode(decoded);
    } while (b64.detect(decoded));
  }
  const resultURL = document.getElementById("result-decoder-url");
  const labelURL = document.getElementById("label-decoder-url");
  const resultOther = document.getElementById("result-decoder-other");
  const labelOther = document.getElementById("label-decoder-other");
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    resultOther.innerText = "";
    resultOther.classList.add("hide");
    labelOther.classList.add("hide");
    resultURL.href = decoded;
    resultURL.text = decoded;
    resultURL.classList.remove("hide");
    labelURL.classList.remove("hide");
    resultURL.click();
  } else {
    resultURL.href = "#";
    resultURL.text = "";
    resultURL.classList.add("hide");
    labelURL.classList.add("hide");
    if (decoded !== undefined && decoded !== "") {
      resultOther.innerText = decoded;
      resultOther.classList.remove("hide");
      labelOther.classList.remove("hide");
    } else {
      resultOther.innerText = "";
      resultOther.classList.add("hide");
      labelOther.classList.add("hide");
    }
  }
};

globalThis.onEncoderChange = (value, type = "b64") => {
  const result = document.getElementById("result-encoder");
  const label = document.getElementById("label-encoder");
  const encoded =
    value.trim() !== undefined && value.trim() !== ""
      ? type === "aes"
        ? aes.encode(value.trim())
        : b64.encode(value.trim())
      : undefined;
  if (encoded !== undefined && encoded !== "") {
    result.innerText = encoded;
    result.classList.remove("hide");
    label.classList.remove("hide");
  } else {
    result.innerText = "";
    result.classList.add("hide");
    label.classList.add("hide");
  }
};
