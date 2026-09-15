<template>
  <div>
    <!-- Product Count -->
    <div class="collection-heading">
      <h2>{{ selectedCategory === 'All' ? 'The collection' : selectedCategory }}</h2>
      <span role="status">{{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}</span>
    </div>

    <!-- Responsive Ionic Grid: 1 column on phones, 2 on tablets, 3 on desktops -->
    <IonGrid class="product-grid">
      <IonRow>
        <IonCol v-for="product in filteredProducts" :key="product.id" size="12" size-sm="6" size-lg="4">
          <ProductCard
            :product="product"
            @edit="$emit('edit', product)"
            @delete="$emit('delete', product.id)"
          />
        </IonCol>
      </IonRow>
    </IonGrid>

    <!-- Empty Search Results -->
    <section v-if="filteredProducts.length === 0" class="empty-state">
      <h3>No products found</h3>
      <p>Try another search or explore the whole collection.</p>
      <IonButton @click="$emit('reset-filters')">Reset filters</IonButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
import ProductCard from './ProductCard.vue';
import { Product } from '../services/firebase';

const props = defineProps<{
  products: Product[];
  searchText: string;
  selectedCategory: string;
}>();

defineEmits<{
  edit: [product: Product];
  delete: [id: string];
  'reset-filters': [];
}>();

const filteredProducts = computed(() => {
  const query = props.searchText.trim().toLowerCase();
  return props.products.filter((product) => {
    const matchesCategory = props.selectedCategory === 'All' || product.category === props.selectedCategory;
    const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });
});
</script>

<style scoped>
.collection-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 12px;
}

h2 {
  font-size: 21px;
  margin: 0;
}

.collection-heading span {
  font-size: 13px;
  color: #677168;
}

.product-grid {
  padding: 0;
  margin: 0 -10px;
}

ion-col {
  padding: 10px;
}

.empty-state {
  text-align: center;
  padding: 56px 16px;
}

.empty-state p {
  color: #697069;
  line-height: 1.6;
}
</style>
