import { createDecipheriv } from "crypto-browserify";
import { deriveKey } from "./encryption";
export function decryptMessage(encrypted, sharedSecret) {
    console.log("decrypting message", encrypted);
    try {
        const _encrypted = Buffer.from(encrypted);
        const key = deriveKey(sharedSecret);

        const iv = _encrypted.subarray(0, 12);

        const tag = _encrypted.subarray(12, 28);

        const text = _encrypted.subarray(28);
        const decipher = createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(tag);
        const decrypted = decipher.update(text) + decipher.final("utf8");
        console.log("Message decrypted successfully");
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Error decrypting message:", error);
        throw error;
    }
}
