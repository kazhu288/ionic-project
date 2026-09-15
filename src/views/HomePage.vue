<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <main class="page-container">
        <!-- Application Title -->
        <header class="app-title">
          <span class="eyebrow">IONIC / EVERYDAY COLLECTION</span>
          <h1>Product Catalog<span class="title-dot">.</span></h1>
          <p>Simple finds for your everyday life. Explore the collection.</p>
        </header>

        <!-- Add Product Button -->
        <div class="add-product-section">
          <IonButton @click="openAddModal" expand="block">
            <IonIcon slot="start" :icon="addOutline" />
            Add New Product
          </IonButton>
        </div>

        <!-- Search and Category Filters -->
        <section aria-label="Filter products" class="filter-container">
          <IonSearchbar
            v-model="searchText"
            placeholder="Search products..."
            aria-label="Search products"
            :debounce="0"
          />
          <div class="categories" role="group" aria-label="Product categories">
            <IonButton
              v-for="category in categories"
              :key="category"
              :fill="selectedCategory === category ? 'solid' : 'outline'"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
            >{{ category }}</IonButton>
          </div>
        </section>

        <!-- Product List Component -->
        <ProductList
          :products="products"
          :search-text="searchText"
          :selected-category="selectedCategory"
          @edit="openEditModal"
          @delete="handleDelete"
          @reset-filters="resetFilters"
        />

        <footer>{{ products.length }} everyday essentials <span aria-hidden="true">/</span> Sample catalog · Prices in PHP</footer>
      </main>
    </IonContent>

    <!-- Product Form Modal -->
    <ProductForm
      :is-open="isModalOpen"
      :product="editingProduct"
      @submit="handleFormSubmit"
      @dismiss="closeModal"
    />
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonButton, IonSearchbar, IonIcon } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import ProductList from '../components/ProductList.vue';
import ProductForm from '../components/ProductForm.vue';
import { firebaseService, Product, ProductInput } from '../services/firebase';

/*
||--------------------------------------------------------------------------
|| Catalog State
||--------------------------------------------------------------------------
*/
type Category = 'All' | 'Electronics' | 'Lifestyle' | 'Home';
const searchText = ref('');
const selectedCategory = ref<Category>('All');
const categories: Category[] = ['All', 'Electronics', 'Lifestyle', 'Home'];
const products = ref<Product[]>([]);
const isModalOpen = ref(false);
const editingProduct = ref<Product | undefined>(undefined);

/*
||--------------------------------------------------------------------------
|| Firebase CRUD Operations
||--------------------------------------------------------------------------
*/
async function loadProducts() {
  try {
    products.value = await firebaseService.getProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function handleFormSubmit(productData: ProductInput) {
  try {
    if (editingProduct.value?.id) {
      // Update existing product
      await firebaseService.updateProduct(editingProduct.value.id, productData);
    } else {
      // Add new product
      await firebaseService.addProduct(productData);
    }
    await loadProducts();
    closeModal();
  } catch (error) {
    console.error('Error saving product:', error);
  }
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await firebaseService.deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}

/*
||--------------------------------------------------------------------------
|| Modal Management
||--------------------------------------------------------------------------
*/
function openAddModal() {
  editingProduct.value = undefined;
  isModalOpen.value = true;
}

function openEditModal(product: Product) {
  editingProduct.value = product;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingProduct.value = undefined;
}

/*
||--------------------------------------------------------------------------
|| Reset Filters
||--------------------------------------------------------------------------
*/
function resetFilters() {
  searchText.value = '';
  selectedCategory.value = 'All';
}

/*
||--------------------------------------------------------------------------
|| Lifecycle
||--------------------------------------------------------------------------
*/
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
/* Ionic Page and Main Container */
ion-content { --background: #f7f6f2; --color: #263d32; }
.page-container { max-width: 1100px; margin: 0 auto; padding: calc(48px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom)); }

/* Application Title */
.app-title { padding-bottom: 32px; border-bottom: 1px solid #dadfd7; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2.2px; }
h1 { margin: 14px 0; font-size: clamp(32px, 5vw, 54px); font-weight: 650; letter-spacing: -1.8px; }
.title-dot { color: #9b723d; }
.app-title p { color: #677168; margin: 0; line-height: 1.6; }

/* Add Product Section */
.add-product-section { margin: 20px 0; }

/* Search and Category Buttons */
.filter-container { padding: 26px 0 18px; }
ion-searchbar { padding: 0; --background: #fff; --color: #263d32; --placeholder-color: #677168; --icon-color: #677168; --border-radius: 12px; --box-shadow: 0 0 0 1px #dadfd7; }
.categories { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
ion-button { margin: 0; min-height: 42px; text-transform: none; letter-spacing: 0; --border-radius: 24px; --box-shadow: none; --background: #2b493a; --color: #fff; --border-color: #b3bcb2; --border-width: 1px; }
ion-button[fill='outline'] { --color: #3e5547; }

/* Footer and Small Phones */
footer { margin-top: 30px; padding-top: 24px; border-top: 1px solid #dadfd7; color: #677168; font-size: 12px; text-align: center; line-height: 1.7; }
footer span { margin: 0 10px; }
@media (max-width: 575px) {
  .page-container { padding: calc(28px + env(safe-area-inset-top)) 18px calc(24px + env(safe-area-inset-bottom)); }
  .app-title { padding-bottom: 24px; }
  .categories { gap: 6px; }
  ion-button { font-size: 12px; --padding-start: 14px; --padding-end: 14px; }
}
</style>
