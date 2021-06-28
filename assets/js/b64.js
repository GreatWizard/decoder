const b64 = {};

b64.detect = (text) => {
  return (
    text.match(
      /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/
    ) !== null
  );
};

b64.decode = (text) => {
  return atob(text);
};

b64.encode = (text) => {
  return btoa(text);
};

export default b64;
