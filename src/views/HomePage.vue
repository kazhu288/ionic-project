<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <main class="page-container">
        <!-- Application Title -->
        <header class="app-title">
          <div class="title-content">
            <span class="eyebrow">IONIC / EVERYDAY COLLECTION</span>
            <h1>Product Catalog<span class="title-dot">.</span></h1>
            <p>Simple finds for your everyday life. Explore the collection.</p>
          </div>
          <div class="header-decoration">
            <div class="decoration-circle"></div>
            <div class="decoration-circle"></div>
          </div>
        </header>

        <!-- Add Product Button -->
        <div class="add-product-section">
          <IonButton @click="openAddModal" expand="block" class="add-button">
            <IonIcon slot="start" :icon="addOutline" />
            Add New Product
          </IonButton>
        </div>

        <!-- Search and Category Filters -->
        <section aria-label="Filter products" class="filter-container">
          <div class="search-wrapper">
            <IonSearchbar
              v-model="searchText"
              placeholder="Search products..."
              aria-label="Search products"
              :debounce="0"
              class="enhanced-searchbar"
            />
          </div>
          <div class="categories" role="group" aria-label="Product categories">
            <IonButton
              v-for="category in categories"
              :key="category"
              :fill="selectedCategory === category ? 'solid' : 'outline'"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
              class="category-button"
            >
              {{ category }}
            </IonButton>
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

        <footer class="enhanced-footer">
          <div class="footer-content">
            <span class="product-count">{{ products.length }} everyday essentials</span>
            <span class="divider">/</span>
            <span class="catalog-info">Sample catalog · Prices in PHP</span>
          </div>
        </footer>
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
type Category = 'All' | 'Electronics' | 'Lifestyle' | 'Home' | 'Clothes' | 'Shoes';
const searchText = ref('');
const selectedCategory = ref<Category>('All');
const categories: Category[] = ['All', 'Electronics', 'Lifestyle', 'Home', 'Clothes', 'Shoes'];
const products = ref<Product[]>([]);
const isModalOpen = ref(false);
const editingProduct = ref<Product | undefined>(undefined);
const isLoading = ref(false);

/*
||--------------------------------------------------------------------------
|| Firebase CRUD Operations
||--------------------------------------------------------------------------
*/
async function loadProducts() {
  isLoading.value = true;
  try {
    products.value = await firebaseService.getProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    isLoading.value = false;
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
ion-content {
  --background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --color: #263d32;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(48px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom));
}

/* Application Title */
.app-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

.title-content {
  flex: 1;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.2px;
  color: #667eea;
  text-transform: uppercase;
}

h1 {
  margin: 14px 0;
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 700;
  letter-spacing: -1.8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-dot {
  color: #764ba2;
}

.app-title p {
  color: #677168;
  margin: 0;
  line-height: 1.6;
  font-size: 16px;
}

.header-decoration {
  display: flex;
  gap: 16px;
}

.decoration-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle:nth-child(2) {
  animation-delay: -3s;
  width: 40px;
  height: 40px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Add Product Section */
.add-product-section {
  margin: 24px 0;
}

.add-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Search and Category Buttons */
.filter-container {
  padding: 26px 0 18px;
}

.search-wrapper {
  margin-bottom: 20px;
}

.enhanced-searchbar {
  --background: #fff;
  --color: #263d32;
  --placeholder-color: #677168;
  --icon-color: #667eea;
  --border-radius: 16px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --padding-start: 16px;
  --padding-end: 16px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.category-button {
  margin: 0;
  min-height: 42px;
  text-transform: none;
  letter-spacing: 0;
  --border-radius: 24px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --background: #fff;
  --color: #667eea;
  --border-color: #667eea;
  --border-width: 2px;
  --padding-start: 20px;
  --padding-end: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-button:hover {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color: #fff;
  transform: translateY(-2px);
}

.category-button[fill='solid'] {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color: #fff;
  --border-color: transparent;
}

/* Footer */
.enhanced-footer {
  margin-top: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #677168;
  font-size: 14px;
}

.product-count {
  font-weight: 600;
  color: #667eea;
}

.divider {
  color: #d1d5db;
}

.catalog-info {
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 575px) {
  .page-container {
    padding: calc(28px + env(safe-area-inset-top)) 18px calc(24px + env(safe-area-inset-bottom));
  }

  .app-title {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 24px;
  }

  .header-decoration {
    display: none;
  }

  .categories {
    gap: 8px;
  }

  .category-button {
    font-size: 12px;
    --padding-start: 14px;
    --padding-end: 14px;
  }

  .footer-content {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
