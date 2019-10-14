import { get } from "axios";
import { decryptString } from "@govtechsg/opencerts-encryption";

export const decodeQrCode = qrCode => {
  const ttRegex = /tradetrust:\/\/(.*)/;
  if (!ttRegex.test(qrCode))
    throw new Error("QR Code is not formatted to TradeTrust specifications");
  const [, encodedPayload] = ttRegex.exec(qrCode);
  const decodedPayload = JSON.parse(decodeURIComponent(encodedPayload));
  return decodedPayload;
};

export const encodeQrCode = payload =>
  `tradetrust://${encodeURIComponent(JSON.stringify(payload))}`;

const decryptDocument = async uri => {
  const uriPart = uri.split("#");
  const { data } = await get(uriPart[0]);
  return JSON.parse(
    decryptString({
      tag: data.document.tag,
      cipherText: data.document.cipherText,
      iv: data.document.iv,
      key: uriPart[1],
      type: "OPEN-ATTESTATION-TYPE-1"
    })
  );
};

export const processQrCode = async qrCode => {
  const { uri } = decodeQrCode(qrCode);
  const data = await decryptDocument(uri);
  return data;
};
