import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const aes = {};

aes.detect = (text) => text.startsWith("U2FsdGVkX1");

aes.decode = (text) => AES.decrypt(text, "/").toString(enc.Utf8);

aes.encode = (text) => AES.encrypt(text, "/").toString();

export default aes;
