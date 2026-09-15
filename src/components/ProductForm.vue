<template>
  <IonModal :is-open="isOpen" @will-dismiss="onDismiss">
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ isEdit ? 'Edit Product' : 'Add New Product' }}</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="onDismiss">Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <form @submit.prevent="handleSubmit">
        <IonItem>
          <IonLabel position="floating">Product Name</IonLabel>
          <IonInput v-model="formData.name" type="text" required />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Category</IonLabel>
          <IonSelect v-model="formData.category" placeholder="Select Category">
            <IonSelectOption value="Electronics">Electronics</IonSelectOption>
            <IonSelectOption value="Lifestyle">Lifestyle</IonSelectOption>
            <IonSelectOption value="Home">Home</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonTextarea v-model="formData.description" :rows="3" required />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Price (PHP)</IonLabel>
          <IonInput v-model.number="formData.price" type="number" step="0.01" required />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Image URL</IonLabel>
          <IonInput v-model="formData.image" type="url" required />
        </IonItem>

        <div class="form-actions">
          <IonButton type="submit" expand="block">
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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/vue';
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
  } else {
    isEdit.value = false;
    formData.value = {
      name: '',
      category: 'Lifestyle',
      description: '',
      price: 0,
      image: ''
    };
  }
});

function handleSubmit() {
  emit('submit', formData.value);
}

function onDismiss() {
  emit('dismiss');
}
</script>

<style scoped>
.form-actions {
  margin-top: 20px;
}
</style>
