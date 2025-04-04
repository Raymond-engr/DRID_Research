const DB_NAME = 'research-portal';
const DB_VERSION = 1;
const TOKEN_STORE = 'tokens';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('IndexedDB error: ' + event.target.errorCode);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(TOKEN_STORE)) {
        db.createObjectStore(TOKEN_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const saveToken = async (accessToken) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TOKEN_STORE], 'readwrite');
    const store = transaction.objectStore(TOKEN_STORE);
    
    const tokenObject = {
      id: 'accessToken',
      value: accessToken,
      timestamp: Date.now()
    };
    
    const request = store.put(tokenObject);
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
};

export const getToken = async () => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TOKEN_STORE], 'readonly');
    const store = transaction.objectStore(TOKEN_STORE);
    
    const request = store.get('accessToken');
    
    request.onsuccess = () => {
      const token = request.result ? request.result.value : null;
      resolve(token);
    };
    
    request.onerror = () => reject(null);
  });
};

export const removeToken = async () => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TOKEN_STORE], 'readwrite');
    const store = transaction.objectStore(TOKEN_STORE);
    
    const request = store.delete('accessToken');
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
};