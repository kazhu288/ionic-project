<template>
  <article class="product-card">
    <div class="card-image-container">
      <img :src="product.image" :alt="product.name" />
      <div class="card-overlay">
        <div class="overlay-actions">
          <IonButton @click="$emit('edit', product)" class="action-button edit-button">
            <IonIcon :icon="pencilOutline" />
          </IonButton>
          <IonButton @click="$emit('delete', product.id)" class="action-button delete-button">
            <IonIcon :icon="trashOutline" />
          </IonButton>
        </div>
      </div>
    </div>
    <div class="product-information">
      <div class="category-badge">{{ product.category }}</div>
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <div class="price-section">
        <span class="product-price">{{ formatPrice(product.price) }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { pencilOutline, trashOutline } from 'ionicons/icons';
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
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 320 / 230;
}

.card-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-image-container img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  --background: rgba(255, 255, 255, 0.9);
  --color: #1f2937;
  --border-radius: 50%;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.action-button:hover {
  --background: #fff;
  transform: scale(1.1);
}

.edit-button {
  --color: #667eea;
}

.delete-button {
  --color: #ef4444;
}

.product-information {
  padding: 20px;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

h3 {
  font-size: 18px;
  margin: 0 0 8px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.product-information p {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  min-height: 42px;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
