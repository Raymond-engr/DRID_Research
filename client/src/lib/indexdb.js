const DB_NAME = "research-portal";
const DB_VERSION = 1;
const TOKEN_STORE = "tokens";

export const initDB = () => {
  return new Promise((resolve, reject) => {
    console.log("Initializing IndexedDB");

    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(`IndexedDB error: ${event.target.error.message}`);
    };

    request.onsuccess = (event) => {
      console.log("IndexedDB initialized successfully");
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      console.log("Creating/upgrading IndexedDB schema");
      const db = event.target.result;

      if (!db.objectStoreNames.contains(TOKEN_STORE)) {
        db.createObjectStore(TOKEN_STORE, { keyPath: "id" });
        console.log("Token store created");
      }
    };
  });
};

export const saveToken = async (accessToken) => {
  if (!accessToken) {
    console.error("Attempted to save null/undefined token");
    return false;
  }

  try {
    console.log("Saving access token");
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readwrite");

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(false);
      };

      const store = transaction.objectStore(TOKEN_STORE);

      const tokenObject = {
        id: "accessToken",
        value: accessToken,
        timestamp: Date.now(),
      };

      const request = store.put(tokenObject);

      request.onsuccess = () => {
        console.log("Token saved successfully");
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Error saving token:", event.target.error);
        reject(false);
      };
    });
  } catch (error) {
    console.error("Failed to save token:", error);
    return false;
  }
};

export const getToken = async () => {
  try {
    console.log("Getting access token from IndexedDB");
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readonly");

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(null);
      };

      const store = transaction.objectStore(TOKEN_STORE);
      const request = store.get("accessToken");

      request.onsuccess = () => {
        const token = request.result ? request.result.value : null;
        console.log(
          "Token retrieval:",
          token ? "Token found" : "No token found"
        );

        // Check token expiration if we have a token
        if (token && request.result.timestamp) {
          // Check if token is more than 14 days old as a safety measure
          const tokenAge = Date.now() - request.result.timestamp;
          const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days

          if (tokenAge > maxAge) {
            console.warn("Token is too old, removing it");
            removeToken().catch((err) =>
              console.error("Error removing old token:", err)
            );
            resolve(null);
            return;
          }
        }

        resolve(token);
      };

      request.onerror = (event) => {
        console.error("Error getting token:", event.target.error);
        reject(null);
      };
    });
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    console.log("Removing access token");
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readwrite");

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(false);
      };

      const store = transaction.objectStore(TOKEN_STORE);
      const request = store.delete("accessToken");

      request.onsuccess = () => {
        console.log("Token removed successfully");
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Error removing token:", event.target.error);
        reject(false);
      };
    });
  } catch (error) {
    console.error("Failed to remove token:", error);
    return false;
  }
};
