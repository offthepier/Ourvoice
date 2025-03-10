import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY } from "src/constants/Encryption";

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (text) => {
  let bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encrypt, decrypt };
