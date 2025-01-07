import EncryptedStorage from "react-native-encrypted-storage";

async function set(key, object) {
    try {
        await EncryptedStorage.setItem(key, JSON.stringify(object));
    } catch (error) {
        console.log('secure.set', error);
    }
}

async function get(key) {
    try {
        const data = await EncryptedStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.log('secure.get', error);
        return null; // Ensure it always returns a value
    }
}

async function remove(key) {
    try {
        await EncryptedStorage.removeItem(key, JSON.stringify(key));
    } catch (error) {
        console.log('secure.remove', error);
    }
}

async function wipe() {
    try {
        await EncryptedStorage.clear();
    } catch (error) {
        console.log('secure.wipe', error);
    }
}

export default { set, get, remove, wipe };
