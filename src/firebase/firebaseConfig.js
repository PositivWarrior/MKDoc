import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Helper functions for storage operations
export const listAllPDFs = async () => {
  const storageRef = ref(storage, 'documents');
  try {
    const result = await listAll(storageRef);
    const files = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          fullPath: item.fullPath,
          url,
          createdAt: item.name.split('-').pop().replace('.pdf', '') // Extract timestamp from filename
        };
      })
    );
    return files.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
  } catch (error) {
    console.error('Error listing PDFs:', error);
    throw error;
  }
};

export { storage, ref, getDownloadURL }; 