const b64 = {};

b64.detect = (text) =>
  text.match(
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/
  ) !== null;

b64.decode = (text) => atob(text);

b64.encode = (text) => btoa(text);

export default b64;
