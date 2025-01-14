import EncryptedStorage from "react-native-encrypted-storage";

async function set(key, object) {
    try {
        console.log(`Setting key: ${key}, value: ${JSON.stringify(object)}`); // Debug log
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
        return null;t
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


// import * as SecureStore from 'expo-secure-store';

// // Set a key-value pair in secure storage
// async function set(key, object) {
//     try {
//         await SecureStore.setItemAsync(key, JSON.stringify(object));
//         await saveKeyToRegistry(key);
//     } catch (error) {
//         console.log('secure.set: ', error);
//     }
// }

// // Get a value by key from secure storage
// async function get(key) {
//     try {
//         const data = await SecureStore.getItemAsync(key);
//         if (data !== null) {
//             return JSON.parse(data);
//         }
//         return null;
//     } catch (error) {
//         console.log('secure.get: ', error);
//     }
// }

// // Remove a key-value pair from secure storage
// async function remove(key) {
//     try {
//         await SecureStore.deleteItemAsync(key);
//         await removeKeyFromRegistry(key); 
//     } catch (error) {
//         console.log('secure.remove: ', error);
//     }
// }

// // Wipe all keys stored in SecureStore
// async function wipe() {
//     try {
//         const registry = await SecureStore.getItemAsync('secure_store_keys_registry');
//         const keys = registry ? JSON.parse(registry) : [];
        
//         for (const key of keys) {
//             await SecureStore.deleteItemAsync(key);
//         }

//         await SecureStore.deleteItemAsync('secure_store_keys_registry'); 
//         console.log('All secure storage keys wiped.');
//     } catch (error) {
//         console.log('secure.wipe: ', error);
//     }
// }

// // Register keys in SecureStore
// async function saveKeyToRegistry(key) {
//     try {
//         const registry = await SecureStore.getItemAsync('secure_store_keys_registry');
//         const keys = registry ? JSON.parse(registry) : [];
//         if (!keys.includes(key)) {
//             keys.push(key);
//             await SecureStore.setItemAsync('secure_store_keys_registry', JSON.stringify(keys));
//         }
//     } catch (error) {
//         console.log('saveKeyToRegistry error: ', error);
//     }
// }

// // Remove a key from the registry
// async function removeKeyFromRegistry(key) {
//     try {
//         const registry = await SecureStore.getItemAsync('secure_store_keys_registry');
//         const keys = registry ? JSON.parse(registry) : [];
//         const updatedKeys = keys.filter(k => k !== key);
        
//         if (updatedKeys.length !== keys.length) {
//             await SecureStore.setItemAsync('secure_store_keys_registry', JSON.stringify(updatedKeys));
//         }
//     } catch (error) {
//         console.log('removeKeyFromRegistry error: ', error);
//     }
// }
// export default { set, get, remove, wipe, saveKeyToRegistry, removeKeyFromRegistry };
