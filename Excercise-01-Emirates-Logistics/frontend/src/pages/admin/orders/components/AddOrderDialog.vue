<template>
  <Dialog 
    :visible="visible" 
    @update:visible="val => $emit('close')" 
    modal 
    header="Simulate New Customer Booking" 
    :style="{ width: '450px' }"
    class="custom-dialog"
  >
    <div class="form-container">
      <div class="form-field">
        <label for="lane">Select Contracted Lane</label>
        <Select 
          id="lane"
          v-model="form.laneIndex" 
          :options="laneOptions" 
          optionLabel="label" 
          optionValue="value" 
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label for="date">Scheduled Pickup Date</label>
        <!-- datepicker handles formatting internally -->
        <input 
          type="date"
          id="date"
          v-model="form.date" 
          class="native-date-picker"
        />
      </div>

      <div class="contract-preview-box" v-if="selectedContractPreview">
        <h4>Customer Contract Tariff Applied</h4>
        <div class="preview-line">
          <span>Client Account:</span>
          <strong>{{ selectedContractPreview.customer }}</strong>
        </div>
        <div class="preview-line">
          <span>Modality:</span>
          <Tag :severity="selectedContractPreview.type === 'FCL' ? 'success' : 'info'" :value="selectedContractPreview.type" />
        </div>
        <div class="preview-line pricing">
          <span>Standard Contract Rate:</span>
          <strong class="price-highlight">{{ selectedContractPreview.rate }} AED</strong>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <Button label="Cancel" icon="pi pi-times" outlined severity="secondary" @click="$emit('close')" />
        <Button label="Submit Booking" icon="pi pi-check" @click="submit" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../../../../store';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  laneIndex: 0,
  date: new Date().toISOString().split('T')[0]
});

// Format lanes for PrimeVue Select options
const laneOptions = computed(() => {
  return store.customerContracts.map((c, index) => ({
    label: `${c.origin.split(' (')[0]} ➔ ${c.destination.split(' (')[0]} (${c.type})`,
    value: index
  }));
});

const selectedContractPreview = computed(() => {
  return store.customerContracts[form.value.laneIndex] || null;
});

const submit = () => {
  const contract = selectedContractPreview.value;
  if (!contract) return;
  
  const newOrder = store.addOrder(
    contract.origin,
    contract.destination,
    contract.type,
    form.value.date
  );
  
  emit('submit', newOrder);
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.native-date-picker {
  background: var(--surface-c);
  border: 1px solid var(--surface-border);
  color: var(--text-color);
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.native-date-picker:focus {
  border-color: var(--primary-color);
}

.contract-preview-box {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contract-preview-box h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--primary-color);
  margin-bottom: 4px;
  font-weight: 700;
}

.preview-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.preview-line span {
  color: var(--text-color-secondary);
}

.preview-line.pricing {
  border-top: 1px dashed var(--surface-border);
  padding-top: 10px;
  margin-top: 4px;
}

.price-highlight {
  color: var(--success-color);
  font-size: 16px;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
}
</style>
