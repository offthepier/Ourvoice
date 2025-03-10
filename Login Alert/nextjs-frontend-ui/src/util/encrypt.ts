import AES from "crypto-js/aes";
import Crypto from "crypto-js";

const encrypt = (text: string): string => {
  return AES.encrypt(
    text,
    process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? ""
  ).toString();
};

const decrypt = (text: string): string => {
  let bytes = Crypto.AES.decrypt(
    text,
    process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? ""
  );
  return bytes.toString(Crypto.enc.Utf8);
};

export { encrypt, decrypt };
