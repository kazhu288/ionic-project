<template>
  <article class="product-card">
    <img :src="product.image" :alt="product.name" width="320" height="270" />
    <div class="product-information">
      <span class="product-category">{{ product.category }}</span>
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <strong class="product-price">{{ formatPrice(product.price) }}</strong>
      <div class="product-actions">
        <IonButton size="small" @click="$emit('edit', product)">Edit</IonButton>
        <IonButton size="small" color="danger" @click="$emit('delete', product.id)">Delete</IonButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { Product } from '../services/firebase';

defineProps<{
  product: Product;
}>();

defineEmits<{
  edit: [product: Product];
  delete: [id: string];
}>();

const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
function formatPrice(price: number): string {
  return pesoFormatter.format(price);
}
</script>

<style scoped>
.product-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid #e0e3db;
  border-radius: 16px;
  background: #fff;
}

.product-card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 320 / 230;
  object-fit: cover;
}

.product-information {
  padding: 22px;
}

.product-category {
  color: #63735f;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 700;
}

h3 {
  font-size: 19px;
  margin: 9px 0;
  font-weight: 650;
}

.product-information p {
  color: #697069;
  font-size: 14px;
  line-height: 1.65;
  min-height: 47px;
  margin: 0 0 18px;
}

.product-price {
  font-size: 19px;
  display: block;
  margin-bottom: 12px;
}

.product-actions {
  display: flex;
  gap: 8px;
}
</style>
