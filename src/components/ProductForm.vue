<template>
  <IonModal :is-open="isOpen" @will-dismiss="onDismiss" class="enhanced-modal">
    <IonHeader class="modal-header">
      <IonToolbar>
        <IonTitle class="modal-title">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="onDismiss" class="close-button">
            <IonIcon :icon="closeOutline" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding modal-content">
      <form @submit.prevent="handleSubmit" class="product-form">
        <!-- Image Upload Section -->
        <div class="image-upload-section">
          <div class="image-preview" :class="{ 'has-image': imagePreview }">
            <img v-if="imagePreview" :src="imagePreview" alt="Product preview" />
            <div v-else class="upload-placeholder">
              <IonIcon :icon="imageOutline" class="upload-icon" />
              <p>Click to upload product image</p>
              <span class="upload-hint">Supports JPG, PNG, GIF</span>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            @change="handleImageUpload"
            accept="image/*"
            class="file-input"
          />
          <IonButton
            @click="triggerFileInput"
            fill="outline"
            class="upload-button"
          >
            <IonIcon slot="start" :icon="cameraOutline" />
            {{ imagePreview ? 'Change Image' : 'Upload Image' }}
          </IonButton>
        </div>

        <!-- Form Fields -->
        <div class="form-fields">
          <IonItem class="form-item" lines="full">
            <IonLabel position="floating" class="custom-label">Product Name</IonLabel>
            <IonInput v-model="formData.name" type="text" required class="custom-input" />
          </IonItem>

          <IonItem class="form-item" lines="full">
            <IonLabel position="floating" class="custom-label">Category</IonLabel>
            <IonSelect v-model="formData.category" placeholder="Select Category" class="custom-select">
              <IonSelectOption value="Electronics">Electronics</IonSelectOption>
              <IonSelectOption value="Lifestyle">Lifestyle</IonSelectOption>
              <IonSelectOption value="Home">Home</IonSelectOption>
              <IonSelectOption value="Clothes">Clothes</IonSelectOption>
              <IonSelectOption value="Shoes">Shoes</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem class="form-item" lines="full">
            <IonLabel position="floating" class="custom-label">Description</IonLabel>
            <IonTextarea v-model="formData.description" :rows="3" required class="custom-textarea" />
          </IonItem>

          <IonItem class="form-item" lines="full">
            <IonLabel position="floating" class="custom-label">Price (PHP)</IonLabel>
            <IonInput v-model.number="formData.price" type="number" step="0.01" required class="custom-input" />
          </IonItem>
        </div>

        <div class="form-actions">
          <IonButton type="submit" expand="block" class="submit-button" size="large">
            <IonIcon slot="start" :icon="isEdit ? pencilOutline : addOutline" />
            {{ isEdit ? 'Update Product' : 'Add Product' }}
          </IonButton>
        </div>
      </form>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonModal, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption 
} from '@ionic/vue';
import { closeOutline, imageOutline, cameraOutline, addOutline, pencilOutline } from 'ionicons/icons';
import { Product, ProductInput } from '../services/firebase';

const props = defineProps<{
  isOpen: boolean;
  product?: Product;
}>();

const emit = defineEmits<{
  submit: [product: ProductInput];
  dismiss: [];
}>();

const isEdit = ref(false);
const formData = ref<ProductInput>({
  name: '',
  category: 'Lifestyle',
  description: '',
  price: 0,
  image: ''
});

const imagePreview = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    isEdit.value = true;
    formData.value = {
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      price: newProduct.price,
      image: newProduct.image
    };
    imagePreview.value = newProduct.image;
  } else {
    isEdit.value = false;
    formData.value = {
      name: '',
      category: 'Lifestyle',
      description: '',
      price: 0,
      image: ''
    };
    imagePreview.value = '';
  }
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
      formData.value.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function handleSubmit() {
  emit('submit', formData.value);
}

function onDismiss() {
  emit('dismiss');
}
</script>

<style scoped>
.enhanced-modal {
  --height: auto;
  --max-width: 500px;
  --max-height: 90vh;
}

.modal-header {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color: #fff;
}

.modal-title {
  --color: #fff;
  font-weight: 600;
  font-size: 1.2rem;
}

.close-button {
  --color: #fff;
  --background: rgba(255, 255, 255, 0.2);
  --border-radius: 50%;
  --padding-start: 8px;
  --padding-end: 8px;
}

.modal-content {
  --background: #f8f9fa;
}

.product-form {
  max-width: 100%;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.image-preview {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-preview:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.image-preview.has-image {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  text-align: center;
  color: #6b7280;
}

.upload-icon {
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.upload-placeholder p {
  margin: 8px 0 4px;
  font-weight: 500;
  color: #374151;
}

.upload-hint {
  font-size: 0.8rem;
  color: #9ca3af;
}

.file-input {
  display: none;
}

.upload-button {
  --border-color: #667eea;
  --color: #667eea;
  --border-radius: 8px;
  --padding-start: 16px;
  --padding-end: 16px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  --background: #fff;
  --border-radius: 8px;
  --padding-start: 16px;
  --padding-end: 16px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.custom-label {
  --color: #6b7280;
  font-weight: 500;
}

.custom-input,
.custom-select,
.custom-textarea {
  --color: #1f2937;
  --placeholder-color: #9ca3af;
}

.form-actions {
  margin-top: 24px;
}

.submit-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}
</style>
