import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const aes = {};

aes.detect = (text) => {
  return text.startsWith("U2FsdGVkX1");
};

aes.decode = (text) => {
  return AES.decrypt(text, "/").toString(enc.Utf8);
};

aes.encode = (text) => {
  return AES.encrypt(text, "/").toString();
};

export default aes;
