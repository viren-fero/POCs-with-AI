<template>
  <div class="customer-orders-page animate-fade-in">
    <!-- 1. LISTING PAGE (Full Width) -->
    <div v-if="!isViewingDetails" class="listing-view flex-column gap-4">
      <div class="actions-header flex-row justify-between align-center p-3 rounded border">
        <h2 class="m-0 text-md font-bold">Active Shipment Tracking Pool</h2>
        
        <!-- Search Input -->
        <div class="search-wrapper relative w-full max-w-sm">
          <i class="pi pi-search search-icon text-muted text-sm absolute"></i>
          <InputText 
            v-model="searchQuery" 
            placeholder="Search Order ID, Route..." 
            class="p-inputtext-sm search-input pl-8 w-full" 
          />
        </div>
      </div>

      <!-- Full-Width DataTable -->
      <div class="table-section p-3 rounded border">
        <DataTable 
          :value="filteredOrders" 
          responsiveLayout="scroll" 
          :paginator="true" 
          :rows="10"
          class="custom-datatable"
        >
          <Column field="id" header="Order ID" sortable headerStyle="width: 20%">
            <template #body="slotProps">
              <span class="font-bold text-sm" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
            </template>
          </Column>
          
          <Column field="route" header="Route">
            <template #body="slotProps">
              <div class="route-display text-xs font-semibold text-white-override">
                <span>{{ slotProps.data.origin.split(' (')[0] }}</span>
                <i class="pi pi-arrow-right text-2xs mx-1 text-muted"></i>
                <span>{{ slotProps.data.destination.split(' (')[0] }}</span>
              </div>
            </template>
          </Column>

          <Column field="type" header="Modality" sortable headerStyle="width: 15%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="slotProps.data.type === 'FTL' ? 'warn' : 'info'" class="text-2xs" />
            </template>
          </Column>

          <Column field="date" header="Pickup Date" sortable headerStyle="width: 18%">
            <template #body="slotProps">
              <span class="text-xs font-semibold text-white-override">{{ slotProps.data.date }}</span>
            </template>
          </Column>

          <Column field="status" header="Status" sortable headerStyle="width: 20%">
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.status" 
                :severity="getStatusSeverity(slotProps.data.status)" 
                class="text-2xs" 
              />
            </template>
          </Column>

          <Column header="Actions" headerStyle="width: 8%" class="text-center">
            <template #body="slotProps">
              <Button 
                icon="pi pi-map-marker" 
                class="p-button-rounded p-button-text p-button-sm text-primary" 
                @click="viewShipmentDetails(slotProps.data)" 
                title="Track Shipment"
              />
            </template>
          </Column>
        </DataTable>

        <div v-if="filteredOrders.length === 0" class="empty-list text-center text-muted p-5">
          <i class="pi pi-box text-4xl mb-3"></i>
          <p class="m-0 text-sm">No shipments logged under your account match the search criteria.</p>
        </div>
      </div>
    </div>

    <!-- 2. DETAIL PAGE (Full Width) -->
    <div v-else class="detail-view animate-fade-in" v-if="selectedOrder">
      <!-- Back Navigation Header -->
      <div class="detail-header flex-row align-center justify-between mb-4">
        <Button 
          label="Back to Tracking Pool" 
          icon="pi pi-arrow-left" 
          class="p-button-text p-button-secondary text-sm" 
          @click="isViewingDetails = false" 
        />
        <div class="flex-row align-center gap-2">
          <span class="text-muted text-sm">Tracking Shipment:</span>
          <Tag :value="selectedOrder.id" severity="success" class="p-2 text-xs font-bold" />
        </div>
      </div>

      <!-- Dedicated details component loaded in full screen context -->
      <div class="detail-view-container">
        <TrackingTimeline :selectedOrder="selectedOrder" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../../../store';
import TrackingTimeline from './components/TrackingTimeline.vue';

const selectedOrder = ref(null);
const searchQuery = ref('');
const isViewingDetails = ref(false);

const customerOrders = computed(() => {
  return store.orders.filter(o => o.customer === store.selectedCustomerName);
});

// Set initial selection
onMounted(() => {
  if (customerOrders.value.length > 0) {
    selectedOrder.value = customerOrders.value[0];
  }
});

const filteredOrders = computed(() => {
  let list = customerOrders.value;
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.origin.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  }
  
  return list;
});

// Watch search query to reset detail mode
watch(searchQuery, () => {
  isViewingDetails.value = false;
});

const viewShipmentDetails = (order) => {
  selectedOrder.value = order;
  isViewingDetails.value = true;
};

// Watch customerOrders to update selection if needed
watch(customerOrders, (newVal) => {
  if (newVal.length > 0 && (!selectedOrder.value || !newVal.find(o => o.id === selectedOrder.value.id))) {
    selectedOrder.value = newVal[0];
    isViewingDetails.value = false;
  } else if (newVal.length === 0) {
    selectedOrder.value = null;
  }
});

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending Dispatch': return 'warn';
    case 'Dispatched': return 'primary';
    case 'Completed': return 'success';
    default: return 'info';
  }
};
</script>

<style scoped>
.customer-orders-page {
  display: flex;
  flex-direction: column;
}

.actions-header {
  background-color: var(--surface-a);
  border-color: var(--surface-border) !important;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.search-input {
  background-color: var(--surface-c) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--text-color) !important;
}

.search-input:focus {
  border-color: var(--primary-color) !important;
}

.table-section {
  background-color: var(--surface-a);
  border-color: var(--surface-border) !important;
  overflow: hidden;
}

.route-display {
  display: flex;
  align-items: center;
}

.text-white-override {
  color: var(--text-color) !important;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-view-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Alignments */
.text-muted {
  color: var(--text-color-secondary);
}

.border-b {
  border-bottom: 1px solid var(--surface-border);
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

.justify-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
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

.text-2xs {
  font-size: 10px;
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 13.5px;
}

.text-md {
  font-size: 15px;
}

.text-lg {
  font-size: 16px;
}

.text-4xl {
  font-size: 38px;
}

.mb-4 {
  margin-bottom: 16px;
}

.pb-3 {
  padding-bottom: 12px;
}

.pl-8 {
  padding-left: 32px !important;
}

.p-2 {
  padding: 8px !important;
}

.p-3 {
  padding: 12px !important;
}

.p-5 {
  padding: 24px !important;
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

.max-w-sm {
  max-width: 380px;
}

.text-center {
  text-align: center;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

/* Transitions */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
