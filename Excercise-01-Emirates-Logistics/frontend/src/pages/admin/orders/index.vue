<template>
  <div class="orders-page">
    <!-- 1. LISTING PAGE (Full Width) -->
    <div v-if="!isViewingDetails" class="listing-view flex-column gap-4 animate-fade-in">
      <div class="actions-header flex-row justify-between align-center p-3 rounded border flex-wrap gap-3">
        <div class="filter-and-search flex-row gap-3 align-center flex-1 flex-wrap">
          <!-- Status Filter Tabs -->
          <div class="filter-tabs flex-row gap-2">
            <Button 
              v-for="status in statuses" 
              :key="status"
              :label="status" 
              :class="activeStatusFilter === status ? 'p-button-primary' : 'p-button-text p-button-secondary'"
              @click="activeStatusFilter = status" 
              size="small"
            />
          </div>

          <!-- Client Filter Dropdown -->
          <div class="filter-dropdown-wrapper flex-row align-center gap-2">
            <span class="text-xs font-semibold text-muted">Client:</span>
            <Select 
              v-model="selectedClient" 
              :options="uniqueClients" 
              class="p-inputtext-sm w-44"
            />
          </div>

          <!-- Search Input -->
          <div class="search-wrapper relative flex-1 max-w-sm ml-auto">
            <i class="pi pi-search search-icon text-muted text-sm absolute"></i>
            <InputText 
              v-model="searchQuery" 
              placeholder="Search ID, Client, Route..." 
              class="p-inputtext-sm search-input pl-8 w-full" 
            />
          </div>
        </div>

        <Button 
          label="Simulate Customer Order" 
          icon="pi pi-plus" 
          @click="showAddDialog = true" 
          class="p-button-sm ml-3"
        />
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
          <Column field="id" header="Order ID" sortable headerStyle="width: 12%">
            <template #body="slotProps">
              <span class="font-bold text-sm" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
            </template>
          </Column>
          <Column field="customer" header="Client" sortable headerStyle="width: 18%">
            <template #body="slotProps">
              <span class="font-semibold text-xs text-white-override">{{ slotProps.data.customer }}</span>
            </template>
          </Column>
          <Column field="lane" header="Lane Route">
            <template #body="slotProps">
              <div class="lane-info text-xs font-semibold text-white-override">
                <span>{{ slotProps.data.origin.split(' (')[0] }}</span>
                <i class="pi pi-arrow-right text-muted mx-2 text-2xs"></i>
                <span>{{ slotProps.data.destination.split(' (')[0] }}</span>
              </div>
            </template>
          </Column>
          <Column field="type" header="Modality" sortable headerStyle="width: 12%">
            <template #body="slotProps">
              <Tag :severity="slotProps.data.type === 'FCL' ? 'success' : 'info'" :value="slotProps.data.type" class="text-2xs" />
            </template>
          </Column>
          <Column field="rate" header="Contract Rate" sortable headerStyle="width: 15%">
            <template #body="slotProps">
              <span class="text-xs font-semibold text-white-override">{{ slotProps.data.rate.toLocaleString() }} AED</span>
            </template>
          </Column>
          <Column field="status" header="Status" sortable headerStyle="width: 15%">
            <template #body="slotProps">
              <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" class="text-2xs" />
            </template>
          </Column>
          <Column header="Actions" headerStyle="width: 8%" class="text-center">
            <template #body="slotProps">
              <Button 
                icon="pi pi-eye" 
                class="p-button-rounded p-button-text p-button-sm text-primary" 
                @click="viewOrderDetails(slotProps.data)" 
                title="View Details"
              />
            </template>
          </Column>
        </DataTable>

        <div v-if="filteredOrders.length === 0" class="empty-list text-center text-muted p-5">
          <i class="pi pi-search text-4xl mb-3"></i>
          <p class="m-0 text-sm">No orders match the selected filters or search terms.</p>
        </div>
      </div>
    </div>

    <!-- 2. DETAIL PAGE (Full Width) -->
    <div v-else class="detail-view animate-fade-in" v-if="selectedOrder">
      <!-- Back Navigation Header -->
      <div class="detail-header flex-row align-center justify-between mb-4">
        <Button 
          label="Back to Orders List" 
          icon="pi pi-arrow-left" 
          class="p-button-text p-button-secondary text-sm" 
          @click="isViewingDetails = false" 
        />
        <div class="flex-row align-center gap-2">
          <span class="text-muted text-sm">Viewing Details for:</span>
          <Tag :value="selectedOrder.id" severity="success" class="p-2 text-xs font-bold" />
        </div>
      </div>

      <!-- Detailed Layout Dashboard Style -->
      <div class="detail-grid">
        <!-- Main Details Column -->
        <Card class="main-detail-card">
          <template #title>
            <div class="border-b pb-2 mb-3">
              <h3 class="m-0 text-md">Transit & Logistics Details</h3>
            </div>
          </template>
          <template #content>
            <div class="flex-column gap-4">
              <!-- Route Display Segment -->
              <div class="detail-group">
                <span class="label text-muted text-xs block uppercase font-bold mb-2">Transit Segment & Route Map</span>
                <div class="value route-segment-box p-3 rounded border">
                  <div class="flex-row align-center gap-2 mb-3">
                    <Tag :severity="selectedOrder.type === 'FCL' ? 'success' : 'info'" :value="selectedOrder.type" class="text-2xs" />
                    <span class="text-xs text-muted">Fixed Tariff Contract Lane</span>
                  </div>
                  <div class="route-stops flex-column gap-3 text-xs pl-2 relative">
                    <div class="stop-line absolute"></div>
                    <div class="flex-row align-center gap-3 relative z-1">
                      <span class="stop-dot origin flex-row align-center justify-center"><i class="pi pi-circle-fill text-2xs text-success"></i></span>
                      <span><strong>Origin Pickup:</strong> {{ selectedOrder.origin }}</span>
                    </div>
                    <div class="flex-row align-center gap-3 relative z-1">
                      <span class="stop-dot destination flex-row align-center justify-center"><i class="pi pi-map-marker text-xs text-danger"></i></span>
                      <span><strong>Destination Dropoff:</strong> {{ selectedOrder.destination }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- General details -->
              <div class="grid-2-col">
                <div class="detail-group p-3 rounded bg-panel">
                  <span class="label text-muted text-xs block uppercase font-bold mb-1">Customer Client</span>
                  <span class="value font-semibold text-white-override">{{ selectedOrder.customer }}</span>
                </div>
                <div class="detail-group p-3 rounded bg-panel">
                  <span class="label text-muted text-xs block uppercase font-bold mb-1">Date Created</span>
                  <span class="value font-semibold text-white-override">{{ selectedOrder.date }}</span>
                </div>
              </div>

              <!-- Carrier Info -->
              <div class="detail-group">
                <span class="label text-muted text-xs block uppercase font-bold mb-2">Carrier Assignment</span>
                <div v-if="selectedOrder.vendor" class="vendor-assignment p-3 rounded text-xs border">
                  <div class="flex-row justify-between mb-3">
                    <span class="text-muted">Subcontractor Name:</span>
                    <strong class="text-white-override font-bold">{{ selectedOrder.vendor }}</strong>
                  </div>
                  <div class="sub-details grid-2-col mt-2 border-t pt-3 border-muted-faint">
                    <div><span class="font-semibold text-muted block mb-1">Driver Name</span><span class="text-white-override font-semibold">{{ selectedOrder.driver }}</span></div>
                    <div><span class="font-semibold text-muted block mb-1">Vehicle Plate</span><span class="text-white-override font-semibold">{{ selectedOrder.vehicle.split(' (')[0] }}</span></div>
                  </div>
                </div>
                <div v-else class="unassigned-badge p-4 rounded flex-row align-center gap-3 border">
                  <i class="pi pi-exclamation-triangle text-warn text-xl"></i>
                  <div class="flex-1">
                    <strong class="text-warn text-sm block mb-1">No Subcontractor Assigned Yet</strong>
                    <span class="text-muted text-xs">Operations team needs to schedule a vendor carrier to activate dispatch.</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Right Side Payout Cards -->
        <div class="side-detail-column flex-column gap-4">
          <!-- Financial Details Card -->
          <Card class="financial-card">
            <template #title>
              <div class="border-b pb-2 mb-3">
                <h3 class="m-0 text-md">Financial Audit Statement</h3>
              </div>
            </template>
            <template #content>
              <div class="flex-column gap-3">
                <div class="row flex-row justify-between align-center p-3 rounded bg-panel">
                  <span class="text-muted text-xs uppercase font-bold">Client Tariff:</span>
                  <strong class="price text-success font-bold text-xl">{{ selectedOrder.rate.toLocaleString() }} AED</strong>
                </div>

                <div v-if="selectedOrder.vendorRate" class="flex-column gap-3">
                  <div class="row flex-row justify-between align-center p-3 rounded bg-panel">
                    <span class="text-muted text-xs uppercase font-bold">Vendor Payout Cost:</span>
                    <strong class="text-white-override text-md font-bold">{{ selectedOrder.vendorRate.toLocaleString() }} AED</strong>
                  </div>
                  <div class="margin-badge p-3 rounded flex-row justify-between align-center text-xs">
                    <span class="text-muted font-bold">Net Operating Margin:</span>
                    <strong class="text-success font-bold text-sm">{{ (selectedOrder.rate - selectedOrder.vendorRate).toLocaleString() }} AED ({{ calculateMarginPct(selectedOrder) }}%)</strong>
                  </div>
                </div>
                <div v-else class="p-3 rounded bg-panel text-muted text-xs border border-dashed text-center">
                  Expected net margin metrics will calculate after vendor dispatch.
                </div>
              </div>
            </template>
          </Card>

          <!-- Action Footer Card -->
          <Card class="action-card mt-auto">
            <template #title>
              <div class="border-b pb-2 mb-3">
                <h3 class="m-0 text-md">Workflow Controller</h3>
              </div>
            </template>
            <template #content>
              <div class="flex-column gap-3">
                <span class="text-muted text-xs block mb-1">Status: <Tag :severity="getStatusSeverity(selectedOrder.status)" :value="selectedOrder.status" class="text-2xs ml-1" /></span>
                <router-link 
                  v-if="selectedOrder.status === 'Pending Dispatch'" 
                  to="/admin/scheduling" 
                  class="action-link"
                >
                  <Button label="Assign Vendor & Dispatch" icon="pi pi-send" class="w-full p-button-primary p-3" />
                </router-link>
                <router-link 
                  v-else-if="selectedOrder.status === 'Dispatched'" 
                  to="/admin/control-tower" 
                  class="action-link"
                >
                  <Button label="Track in Control Tower" icon="pi pi-map" outlined class="w-full p-3" />
                </router-link>
                <div v-else class="completed-msg p-3 rounded flex-row align-center justify-center text-success text-xs font-bold border border-success">
                  <i class="pi pi-check-circle mr-2 text-sm"></i>
                  <span>Trip Settled & Closed</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Simulated Booking Dialog Component -->
    <AddOrderDialog 
      :visible="showAddDialog" 
      @close="showAddDialog = false" 
      @submit="onOrderAdded" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../../../store';
import AddOrderDialog from './components/AddOrderDialog.vue';

const route = useRoute();

const statuses = ['All', 'Pending Dispatch', 'Dispatched', 'Completed'];
const activeStatusFilter = ref('All');
const selectedClient = ref('All');
const selectedModality = ref('All');
const selectedOrder = ref(null);
const searchQuery = ref('');
const showAddDialog = ref(false);
const isViewingDetails = ref(false);

const modalityOptions = ['All', 'FCL', 'LCL'];

const uniqueClients = computed(() => {
  const clients = store.orders.map(o => o.customer);
  return ['All', ...new Set(clients)];
});

const syncModalityWithQuery = () => {
  const queryType = route.query.type;
  if (queryType === 'FTL' || queryType === 'FCL') {
    selectedModality.value = queryType;
  } else {
    selectedModality.value = 'All';
  }
};

// Set initial selection
onMounted(() => {
  syncModalityWithQuery();
  if (store.orders.length > 0) {
    selectedOrder.value = store.orders[0];
  }
});

// Watch query parameters
watch(() => route.query.type, () => {
  syncModalityWithQuery();
});

const filteredOrders = computed(() => {
  let list = store.orders;
  
  // Apply status filter
  if (activeStatusFilter.value !== 'All') {
    list = list.filter(o => o.status === activeStatusFilter.value);
  }

  // Apply client filter
  if (selectedClient.value !== 'All') {
    list = list.filter(o => o.customer === selectedClient.value);
  }

  // Apply modality filter
  if (selectedModality.value !== 'All') {
    list = list.filter(o => o.type === selectedModality.value);
  }
  
  // Apply search query
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.customer.toLowerCase().includes(q) ||
      o.origin.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q)
    );
  }
  
  return list;
});

// Watch filter changes to reset details view back to list for safety
watch([activeStatusFilter, searchQuery, selectedClient, selectedModality], () => {
  isViewingDetails.value = false;
});

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
  isViewingDetails.value = true;
};

const onOrderAdded = (newOrder) => {
  selectedOrder.value = newOrder;
  showAddDialog.value = false;
  isViewingDetails.value = true; // immediately show details of the added order
};

const calculateMarginPct = (order) => {
  if (!order.vendorRate) return 0;
  const margin = order.rate - order.vendorRate;
  return Math.round((margin / order.rate) * 100);
};

const getStatusSeverity = (status) => {
  if (status === 'Completed') return 'success';
  if (status === 'Dispatched') return 'info';
  return 'warn';
};
</script>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  min-height: 580px; /* Sensible screen height coverage */
}

.lane-info {
  display: flex;
  align-items: center;
}

.text-primary {
  color: var(--primary-color);
}

.text-white-override {
  color: var(--text-color) !important;
}

/* Detail View Layout */
.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.route-segment-box, .vendor-assignment {
  background-color: var(--surface-c);
  border-color: var(--surface-border) !important;
}

.bg-panel {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.unassigned-badge {
  background-color: rgba(254, 150, 5, 0.04);
  border: 1px dashed var(--warning-color);
}

.financial-card, .main-detail-card, .action-card {
  height: fit-content;
}

.margin-badge {
  background: linear-gradient(135deg, rgba(5, 18, 88, 0.08), rgba(254, 150, 5, 0.06));
  border: 1px solid rgba(5, 18, 88, 0.14);
}

/* Route Vertical Line */
.route-stops {
  position: relative;
}

.stop-line {
  left: 14px;
  top: 15px;
  bottom: 15px;
  width: 1px;
  border-left: 2px dotted var(--surface-border);
}

.stop-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--surface-c);
  border: 1.5px solid var(--surface-border);
}

.action-link {
  text-decoration: none;
}

.completed-msg {
  background-color: rgba(5, 18, 88, 0.04);
}

/* Utility alignments */
.text-muted {
  color: var(--text-color-secondary);
}

.text-white-override {
  color: var(--text-color);
}

.text-success {
  color: var(--success-color);
}

.text-warn {
  color: var(--warning-color);
}

.border-b {
  border-bottom: 1px solid var(--surface-border);
}

.border-t {
  border-top: 1px solid var(--surface-border);
}

.pt-3 {
  padding-top: 12px;
}

.pl-8 {
  padding-left: 32px !important;
}

.uppercase {
  text-transform: uppercase;
}

.block {
  display: block;
}

.flex-row {
  display: flex;
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
  font-size: 13px;
}

.text-md {
  font-size: 15px;
}

.text-lg {
  font-size: 16px;
}

.text-xl {
  font-size: 20px;
}

.text-4xl {
  font-size: 36px;
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

.pb-2 {
  padding-bottom: 8px;
}

.pb-3 {
  padding-bottom: 12px;
}

.p-2 {
  padding: 8px !important;
}

.p-3 {
  padding: 12px !important;
}

.p-4 {
  padding: 16px !important;
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

.gap-4 {
  gap: 16px;
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

.z-1 {
  z-index: 1;
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .grid-2-col {
    grid-template-columns: 1fr;
  }
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
