import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, update, remove, onValue, get } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9NQEo9PxKBQoWMHMixjBmPOxPDIU85Ng",
  authDomain: "ionic-product-catalog.firebaseapp.com",
  databaseURL: "https://ionic-product-catalog-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ionic-product-catalog",
  storageBucket: "ionic-product-catalog.firebasestorage.app",
  messagingSenderId: "104802171943",
  appId: "1:104802171943:web:fbd31f2c0835b3ce312202",
  measurementId: "G-L7S9TTWY2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Product interface
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  createdAt?: number;
}

// Product input interface (for create/update)
export interface ProductInput {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

// Products reference
const productsRef = ref(db, 'products');

// CRUD Operations
export const firebaseService = {
  // Create - Add a new product
  async addProduct(product: ProductInput): Promise<string> {
    try {
      const newProductRef = push(productsRef);
      await set(newProductRef, {
        ...product,
        createdAt: Date.now()
      });
      return newProductRef.key || '';
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Read - Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const snapshot = await get(productsRef);
      const products: Product[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          products.push({
            id: childSnapshot.key || '',
            ...childSnapshot.val()
          });
        });
      }
      // Sort by createdAt descending
      return products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Update - Edit an existing product
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      const productRef = ref(db, `products/${id}`);
      await update(productRef, product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete - Remove a product
  async deleteProduct(id: string): Promise<void> {
    try {
      await remove(ref(db, `products/${id}`));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export default db;
