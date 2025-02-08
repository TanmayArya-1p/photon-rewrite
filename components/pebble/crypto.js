import * as FileSystem from 'expo-file-system';
import * as CryptoJS from 'crypto-es';
import * as MediaLibrary from 'expo-media-library';
import {EllipticCurve} from "./stores"

async function encryptFileContents(uri, encryptionKey) {
    const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    console.log("ENCRYPTING FILE CONTENTS...")
    const encrypted = CryptoJS.default.AES.encrypt(fileData, encryptionKey).toString();
    const encryptedTempPath = FileSystem.cacheDirectory + 'encryptedFile.tmp';
    await FileSystem.writeAsStringAsync(encryptedTempPath, encrypted, { encoding: FileSystem.EncodingType.UTF8 });
    console.log("ENCRYPTED FILE 🔒")
    return encryptedTempPath;
}

async function decryptFileContents(encryptedUri, decryptionKey, outputUri) {
    console.log("DECRYPTING FILE...")
    const encryptedData = await FileSystem.readAsStringAsync(encryptedUri, { encoding: FileSystem.EncodingType.UTF8 });
    const bytes = CryptoJS.default.AES.decrypt(encryptedData, decryptionKey);
    const decryptedBase64 = bytes.toString(CryptoJS.default.enc.Utf8);
    await FileSystem.writeAsStringAsync(outputUri, decryptedBase64, { encoding: FileSystem.EncodingType.Base64 });
    console.log("DECRYPTED FILE 🔓")
}

async function deriveSharedSecret(OtherPublicKey) {
    console.log("DERIVING SHARED DHKE SECRET KEY 🔑")
    let ec = await EllipticCurve.getState()
    let keypair = ec.keyPair
    ec = ec.curve
    const myKey = ec.keyFromPrivate(keypair.privateKey, 'hex');
    const otherKey = ec.keyFromPublic(OtherPublicKey, 'hex');
    const sharedSecret = myKey.derive(otherKey.getPublic());
    const derivedKey = sharedSecret.toString(16);
    return CryptoJS.default.SHA256(derivedKey).toString();
}


module.exports = { encryptFileContents, decryptFileContents, deriveSharedSecret };