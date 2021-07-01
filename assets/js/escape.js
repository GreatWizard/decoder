const escape = {};

escape.detect = (text) =>
  text.startsWith("https%3A%2F") || text.startsWith("http%3A%2F");

escape.decode = (text) => decodeURIComponent(text);

escape.encode = (text) => encodeURIComponent(text);

export default escape;
