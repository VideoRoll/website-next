import CryptoJS from "crypto-js";

// 加密
export function encrypt(data: string, password: string): string {
  const iv = password.substring(0, 16);
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(data),
    CryptoJS.enc.Utf8.parse(password),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
}

// 解密
export function decrypt(data: string, password: string): string {
  const iv = password.substring(0, 16);
  const decrypted = CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(password),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
}
