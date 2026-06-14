<template>
  <form @submit.prevent="submit" class="booking-form">
    <!-- Modality selection -->
    <div class="form-group mb-4">
      <label class="form-label text-muted text-xs block uppercase font-bold mb-2">Movement Modality</label>
      <SelectButton 
        v-model="form.type" 
        :options="modalityOptions" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full custom-selectbutton"
      >
        <template #option="slotProps">
          <div class="flex-row align-center gap-2">
            <i :class="slotProps.option.value === 'FCL' ? 'pi pi-box' : 'pi pi-truck'" class="text-sm"></i>
            <span class="text-sm font-semibold">{{ slotProps.option.label }}</span>
          </div>
        </template>
      </SelectButton>
    </div>

    <!-- Lane selection -->
    <div class="form-group mb-4">
      <label class="form-label text-muted text-xs block uppercase font-bold mb-2">Select Contracted Lane</label>
      <Select 
        v-model="selectedLane" 
        :options="availableLanes" 
        optionLabel="label" 
        placeholder="Select Contracted Route" 
        class="w-full"
        @change="onLaneChange"
      />
    </div>

    <!-- Date Selector -->
    <div class="form-group mb-4">
      <label class="form-label text-muted text-xs block uppercase font-bold mb-2">Scheduled Pickup Date</label>
      <DatePicker 
        v-model="form.date" 
        dateFormat="yy-mm-dd" 
        class="w-full" 
        placeholder="Select Pickup Date"
        :minDate="new Date()"
      />
    </div>

    <!-- Live Contract Pricing Match Card -->
    <div class="contract-pricing-card p-3 rounded flex-column gap-1 mb-4 border" v-if="matchedContractRate !== null">
      <div class="pricing-label flex-row align-center gap-2 text-xs font-bold uppercase text-success">
        <i class="pi pi-file-edit"></i>
        <span>Customer Contract Tariff Applied</span>
      </div>
      <div class="pricing-value text-success text-3xl font-extrabold">{{ matchedContractRate.toLocaleString() }} AED</div>
      <div class="pricing-sub text-muted text-2xs">Fixed rate locked under client contract agreements.</div>
    </div>

    <Button 
      type="submit" 
      label="Confirm Booking Request" 
      icon="pi pi-shopping-cart" 
      class="w-full p-button-primary p-3"
      :disabled="!selectedLane"
    />
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { store } from '../../../../store';

const emit = defineEmits(['submit-booking']);

const form = ref({
  origin: '',
  destination: '',
  type: 'FCL',
  date: new Date()
});

const selectedLane = ref(null);

const modalityOptions = [
  { label: 'FCL (Container Haulage)', value: 'FCL' },
  { label: 'FTL (Full Truckload)', value: 'FTL' }
];

// Filter contracts that match active customer and type, adding a helper label
const availableLanes = computed(() => {
  return store.customerContracts
    .filter(c => c.customer === store.selectedCustomerName && c.type === form.value.type)
    .map(c => ({
      ...c,
      label: `${c.origin.split(' (')[0]} ➔ ${c.destination.split(' (')[0]}`
    }));
});

// Match the rate based on selection
const matchedContractRate = computed(() => {
  return selectedLane.value ? selectedLane.value.rate : null;
});

// Update form fields when dropdown changes
function onLaneChange() {
  if (selectedLane.value) {
    form.value.origin = selectedLane.value.origin;
    form.value.destination = selectedLane.value.destination;
  }
}

// Update selection when modality type changes
watch(availableLanes, (newVal) => {
  if (newVal.length > 0) {
    selectedLane.value = newVal[0];
    onLaneChange();
  } else {
    selectedLane.value = null;
  }
}, { immediate: true });

const submit = () => {
  if (!form.value.origin || !form.value.destination) return;
  
  // Format Date object to YYYY-MM-DD string
  const formattedDate = form.value.date instanceof Date 
    ? form.value.date.toISOString().split('T')[0] 
    : form.value.date;

  emit('submit-booking', {
    origin: form.value.origin,
    destination: form.value.destination,
    type: form.value.type,
    date: formattedDate
  });
};
</script>

<style scoped>
.booking-form {
  display: flex;
  flex-direction: column;
}

.contract-pricing-card {
  background: linear-gradient(135deg, rgba(5, 18, 88, 0.06), rgba(254, 150, 5, 0.06));
  border-color: rgba(5, 18, 88, 0.14) !important;
}

.p-dark .contract-pricing-card {
  background: linear-gradient(135deg, rgba(254, 150, 5, 0.08), rgba(254, 150, 5, 0.03));
  border-color: rgba(254, 150, 5, 0.16) !important;
}

.pricing-value {
  font-family: 'Outfit', sans-serif;
}

/* Alignment utilities */
.text-muted {
  color: var(--text-color-secondary);
}

.text-success {
  color: var(--success-color);
}

.uppercase {
  text-transform: uppercase;
}

.block {
  display: block;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.w-full {
  width: 100%;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.font-extrabold {
  font-weight: 800;
}

.text-2xs {
  font-size: 10px;
}

.text-xs {
  font-size: 11px;
}

.text-sm {
  font-size: 13.5px;
}

.text-3xl {
  font-size: 28px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.p-3 {
  padding: 12px !important;
}

.hidden {
  display: none;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.flex-1 {
  flex: 1;
}

.transition-colors {
  transition: all 0.2s ease;
}
</style>
