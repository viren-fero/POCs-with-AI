<template>
  <div class="scheduling-page animate-fade-in">
    <div class="page-description mb-4">
      <p class="m-0 text-muted">Select a pending order from the queue below to assign a third-party transporter (vendor). The system will automatically allocate the vehicle and driver assets, matching the appropriate vendor contract tariff.</p>
    </div>

    <div class="scheduling-layout">
      <!-- Left side: List of orders needing dispatch using PrimeVue DataTable -->
      <div class="pending-section">
        <div class="section-header mb-4">
          <h2 class="text-md font-bold m-0">Unassigned Orders Queue ({{ pendingOrders.length }})</h2>
        </div>
        
        <DataTable 
          v-model:selection="selectedOrder" 
          :value="pendingOrders" 
          selectionMode="single" 
          dataKey="id" 
          responsiveLayout="scroll"
          class="p-datatable-sm"
          :rows="10"
        >
          <Column field="id" header="Order ID" headerStyle="width: 20%">
            <template #body="slotProps">
              <span class="order-id-link font-bold" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
            </template>
          </Column>
          <Column field="route" header="Route">
            <template #body="slotProps">
              <div class="route-display text-xs font-semibold">
                <span>{{ slotProps.data.origin.split(' (')[0] }}</span>
                <i class="pi pi-arrow-right text-3xs mx-2 text-muted"></i>
                <span>{{ slotProps.data.destination.split(' (')[0] }}</span>
              </div>
            </template>
          </Column>
          <Column field="type" header="Modality" headerStyle="width: 15%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="slotProps.data.type === 'FTL' ? 'warn' : 'info'" />
            </template>
          </Column>
          <Column field="rate" header="Client Rate" headerStyle="width: 20%">
            <template #body="slotProps">
              <span class="font-bold text-xs">{{ slotProps.data.rate.toLocaleString() }} AED</span>
            </template>
          </Column>
        </DataTable>

        <div v-if="pendingOrders.length === 0" class="empty-queue-container">
          <i class="pi pi-check-circle text-success text-5xl mb-3"></i>
          <p class="m-0 text-muted font-semibold text-sm">All orders have been dispatched!</p>
          <p class="mt-1 text-muted text-xs">Navigate to the Control Tower to track live transit updates.</p>
        </div>
      </div>

      <!-- Right side: Dispatch Configuration Panel -->
      <div class="dispatch-section">
        <Card v-if="selectedOrder" class="dispatch-form-card">
          <template #title>
            <div class="flex-row justify-between align-center border-b pb-3 mb-3">
              <h3 class="m-0 text-md">Configure Dispatch</h3>
              <Tag :value="selectedOrder.id" severity="success" class="p-2 font-bold" />
            </div>
          </template>
          <template #content>
            <div class="order-summary-header mb-4 p-3 rounded bg-panel">
              <div class="summary-item">
                <span class="label text-muted text-3xs block uppercase font-bold mb-1">Client Name</span>
                <span class="value font-bold text-sm text-white">{{ selectedOrder.customer }}</span>
              </div>
              <div class="summary-item mt-3 border-t pt-3 border-muted-faint">
                <span class="label text-muted text-3xs block uppercase font-bold mb-1">Movement Details</span>
                <span class="value font-semibold text-xs text-white">
                  {{ selectedOrder.origin.split(' (')[0] }} 
                  <i class="pi pi-arrow-right mx-1 text-3xs text-muted"></i> 
                  {{ selectedOrder.destination.split(' (')[0] }} 
                  <Tag :value="selectedOrder.type" :severity="selectedOrder.type === 'FCL' ? 'success' : 'info'" class="text-3xs ml-2" />
                </span>
              </div>
            </div>

            <!-- Select Transporter -->
            <div class="form-group mb-4">
              <label class="form-label text-muted text-xs block uppercase font-bold mb-2">Select Vendor (Transporter)</label>
              <Select 
                v-model="selectedVendor" 
                :options="vendorsList" 
                placeholder="-- Choose Transporter --" 
                class="w-full"
              />
            </div>

            <!-- Auto-Allocated details visible after selecting Vendor -->
            <div v-if="selectedVendor" class="allocation-preview-box p-3 rounded mb-4 border">
              <h4 class="text-primary text-xs block uppercase font-bold mb-3">Auto-Allocation & Pricing Match</h4>
              
              <div class="stat-row flex-row justify-between align-center mb-3">
                <span class="label text-muted text-xs">Vendor Contract Rate:</span>
                <strong class="cost-value text-success text-md font-bold">{{ vendorRatePreview.toLocaleString() }} AED</strong>
              </div>
              
              <div class="stat-row flex-row justify-between align-center mb-2">
                <span class="label text-muted text-xs">Auto-Allocated Vehicle:</span>
                <span class="font-semibold text-xs text-white">{{ allocatedVehicle.split(' (')[0] }}</span>
              </div>

              <div class="stat-row flex-row justify-between align-center mb-3">
                <span class="label text-muted text-xs">Auto-Allocated Driver:</span>
                <span class="font-semibold text-xs text-white">{{ allocatedDriver }}</span>
              </div>

              <div class="info-alert flex-row align-start p-2-5 rounded text-2xs text-muted">
                <i class="pi pi-info-circle mr-2 text-primary mt-0.5"></i>
                <span>Vehicles and drivers are pre-mapped to this lane in the subcontractor contract. No bidding required.</span>
              </div>
            </div>

            <!-- Dispatch Button -->
            <div class="dispatch-actions mt-4">
              <Button 
                @click="confirmDispatch" 
                label="Confirm & Dispatch Trip" 
                icon="pi pi-send" 
                class="w-full p-button-primary p-3"
                :disabled="!selectedVendor"
              />
            </div>
          </template>
        </Card>

        <Card v-else class="no-selection-card">
          <template #content>
            <div class="text-center p-5 text-muted flex-column align-center justify-center">
              <i class="pi pi-send text-4xl mb-3"></i>
              <p class="m-0 text-sm">Please select an order from the queue on the left to configure the vendor dispatch details.</p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { store } from '../../../store';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedOrder = ref(null);
const selectedVendor = ref(null);

const pendingOrders = computed(() => store.orders.filter(o => o.status === 'Pending Dispatch'));
const vendorsList = ref(['FastTrans Logistics', 'SwiftHaul Transport']);

// Set initial selection
onMounted(() => {
  if (pendingOrders.value.length > 0) {
    selectedOrder.value = pendingOrders.value[0];
  }
});

// Watch pending orders list to update selection if needed
watch(pendingOrders, (newVal) => {
  if (newVal.length > 0 && (!selectedOrder.value || !newVal.find(o => o.id === selectedOrder.value.id))) {
    selectedOrder.value = newVal[0];
  } else if (newVal.length === 0) {
    selectedOrder.value = null;
  }
});

// Reset vendor when selected order changes
watch(selectedOrder, () => {
  selectedVendor.value = null;
});

// Auto-allocated details via computed properties
const vendorRatePreview = computed(() => {
  if (!selectedVendor.value || !selectedOrder.value) return null;
  const contract = store.vendorContracts.find(
    c => c.vendor === selectedVendor.value &&
         c.origin === selectedOrder.value.origin &&
         c.destination === selectedOrder.value.destination &&
         c.type === selectedOrder.value.type
  );
  return contract ? contract.rate : 1200;
});

const allocatedDriver = computed(() => {
  if (!selectedVendor.value) return '';
  const fleet = store.vendorsFleet[selectedVendor.value];
  return fleet ? fleet.defaultDriver : 'Default Driver';
});

const allocatedVehicle = computed(() => {
  if (!selectedVendor.value) return '';
  const fleet = store.vendorsFleet[selectedVendor.value];
  return fleet ? fleet.defaultVehicle : 'Default Vehicle';
});

const confirmDispatch = () => {
  if (!selectedOrder.value || !selectedVendor.value) return;
  
  const orderId = selectedOrder.value.id;
  store.dispatchOrder(orderId, selectedVendor.value);
  
  // Reset fields
  selectedVendor.value = null;
  
  // Route to Control Tower to watch it run
  router.push('/admin/control-tower');
};
</script>

<style scoped>
.scheduling-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-description p {
  color: var(--text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.scheduling-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .scheduling-layout {
    grid-template-columns: 1fr;
  }
}

.pending-section {
  background-color: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 24px;
  height: fit-content;
}

.section-header h2 {
  font-size: 18px;
}

.route-display {
  display: flex;
  align-items: center;
}

.text-muted {
  color: var(--text-color-secondary);
}

.text-white {
  color: var(--text-color);
}

.empty-queue-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-queue-container i {
  color: var(--success-color);
}

.dispatch-section {
  position: sticky;
  top: 0;
}

/* Custom styles for select layout details */
.allocation-preview-box {
  background-color: var(--surface-c);
  border-color: var(--surface-border) !important;
}

.info-alert {
  background-color: rgba(5, 18, 88, 0.06);
  border: 1px solid rgba(5, 18, 88, 0.12);
}

.p-dark .info-alert {
  background-color: rgba(254, 150, 5, 0.08);
  border: 1px solid rgba(254, 150, 5, 0.16);
}

.no-selection-card {
  border: 1px dashed var(--surface-border) !important;
  box-shadow: none !important;
}

.border-b {
  border-bottom: 1px solid var(--surface-border);
}

.border-t {
  border-top: 1px solid var(--surface-border);
}

.border-muted-faint {
  border-color: var(--surface-border);
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

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.w-full {
  width: 100%;
}

.text-3xs {
  font-size: 9px;
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
  font-size: 18px;
}

.text-5xl {
  font-size: 44px;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.pb-3 {
  padding-bottom: 12px;
}

.p-2 {
  padding: 8px !important;
}

.p-2-5 {
  padding: 10px !important;
}

.p-3 {
  padding: 12px !important;
}

.p-5 {
  padding: 24px !important;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}
</style>
