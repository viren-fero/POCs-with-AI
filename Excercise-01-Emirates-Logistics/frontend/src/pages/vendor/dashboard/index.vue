<template>
  <div class="vendor-dashboard-page animate-fade-in">
    <!-- 1. LISTING PAGE (Full Width) -->
    <div v-if="!isViewingDetails" class="listing-view flex-column gap-4">
      <div class="actions-header flex-row justify-between align-center p-3 rounded border">
        <h2 class="m-0 text-md font-bold">Trip Execution Queue ({{ vendorTrips.length }})</h2>
        
        <!-- Search Input -->
        <div class="search-wrapper relative w-full max-w-sm">
          <i class="pi pi-search search-icon text-muted text-sm absolute"></i>
          <InputText 
            v-model="searchQuery" 
            placeholder="Search Trip ID, Route..." 
            class="p-inputtext-sm search-input pl-8 w-full" 
          />
        </div>
      </div>

      <!-- Full-Width DataTable -->
      <div class="table-section p-3 rounded border">
        <DataTable 
          :value="filteredTrips" 
          responsiveLayout="scroll" 
          :paginator="true" 
          :rows="10"
          class="custom-datatable"
        >
          <Column field="id" header="Trip ID" sortable headerStyle="width: 20%">
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

          <Column field="vendorRate" header="Tariff Cost" sortable headerStyle="width: 18%">
            <template #body="slotProps">
              <span class="text-xs font-bold text-success">{{ slotProps.data.vendorRate.toLocaleString() }} AED</span>
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
                icon="pi pi-chevron-right" 
                class="p-button-rounded p-button-text p-button-sm text-primary" 
                @click="viewTripDetails(slotProps.data)" 
                title="View Execution Details"
              />
            </template>
          </Column>
        </DataTable>

        <div v-if="filteredTrips.length === 0" class="empty-list text-center text-muted p-5">
          <i class="pi pi-truck text-4xl mb-3"></i>
          <p class="m-0 text-sm">No assigned trips match the search query.</p>
        </div>
      </div>
    </div>

    <!-- 2. DETAIL PAGE (Full Width) -->
    <div v-else class="detail-view animate-fade-in" v-if="selectedTrip">
      <!-- Back Navigation Header -->
      <div class="detail-header flex-row align-center justify-between mb-4">
        <Button 
          label="Back to Trip Execution" 
          icon="pi pi-arrow-left" 
          class="p-button-text p-button-secondary text-sm" 
          @click="isViewingDetails = false" 
        />
        <div class="flex-row align-center gap-2">
          <span class="text-muted text-sm">Trip Execution Ledger:</span>
          <Tag :value="selectedTrip.id" severity="success" class="p-2 text-xs font-bold" />
        </div>
      </div>

      <!-- Execution Grid Details -->
      <div class="detail-grid">
        <!-- Main details panel -->
        <Card class="detail-card-main">
          <template #title>
            <div class="border-b pb-2 mb-3">
              <h3 class="m-0 text-md">Transit Execution Details</h3>
            </div>
          </template>
          <template #content>
            <div class="flex-column gap-4">
              <!-- Route Segment -->
              <div class="detail-group">
                <span class="label text-muted text-xs block uppercase font-bold mb-2">Assigned Lane Route</span>
                <div class="value route-segment-box p-3 rounded bg-panel">
                  <div class="flex-row align-center gap-2 mb-3">
                    <Tag :severity="selectedTrip.type === 'FCL' ? 'success' : 'info'" :value="selectedTrip.type" class="text-2xs" />
                    <span class="text-xs text-muted">Movement Modality</span>
                  </div>
                  <div class="route-display text-sm font-bold text-white-override">
                    <span>{{ selectedTrip.origin }}</span>
                    <i class="pi pi-arrow-right text-muted mx-3 text-xs"></i>
                    <span>{{ selectedTrip.destination }}</span>
                  </div>
                </div>
              </div>

              <!-- Allocated Assets Box -->
              <div class="assets-box p-3 rounded border">
                <h4 class="text-primary text-xs uppercase font-bold mb-3">Allocated Resources</h4>
                
                <div class="grid-2-col">
                  <div class="asset-row flex-row justify-between p-2 rounded bg-panel text-sm">
                    <span class="text-muted">Driver:</span>
                    <strong class="text-white-override font-semibold">{{ selectedTrip.driver }}</strong>
                  </div>
                  <div class="asset-row flex-row justify-between p-2 rounded bg-panel text-sm">
                    <span class="text-muted">Vehicle:</span>
                    <strong class="text-white-override font-semibold">{{ selectedTrip.vehicle ? selectedTrip.vehicle.split(' (')[0] : 'N/A' }}</strong>
                  </div>
                </div>
              </div>

              <!-- Milestones timeline using PrimeVue Timeline -->
              <div class="milestones-container p-3 rounded bg-panel">
                <h4 class="text-primary text-xs uppercase font-bold mb-3">Milestone Updates</h4>
                
                <Timeline :value="selectedTrip.milestones" class="custom-timeline-style">
                  <template #marker="slotProps">
                    <span 
                      class="custom-marker-circle" 
                      :class="{ 
                        'completed': slotProps.item.completed, 
                        'active': slotProps.index === selectedTrip.currentMilestoneIndex 
                      }"
                    >
                      <i :class="slotProps.item.completed ? 'pi pi-check text-xs text-white' : 'pi pi-circle text-2xs'" />
                    </span>
                  </template>
                  
                  <template #content="slotProps">
                    <div class="milestone-content-block">
                      <div 
                        class="milestone-title font-semibold"
                        :class="{ 
                          'text-primary font-bold': slotProps.index === selectedTrip.currentMilestoneIndex,
                          'text-muted': !slotProps.item.completed && slotProps.index !== selectedTrip.currentMilestoneIndex
                        }"
                      >
                        {{ slotProps.item.name }}
                      </div>
                      <div class="milestone-time text-xs text-muted mt-1">{{ slotProps.item.time }}</div>
                    </div>
                  </template>
                </Timeline>
              </div>
            </div>
          </template>
        </Card>

        <!-- Right Side Panel: Costs & simulation actions -->
        <div class="side-detail-column flex-column gap-4">
          <!-- Pricing summary -->
          <Card class="pricing-card">
            <template #title>
              <div class="border-b pb-2 mb-3">
                <h3 class="m-0 text-md">Tariff Summary</h3>
              </div>
            </template>
            <template #content>
              <div class="p-3 rounded bg-panel flex-row justify-between align-center">
                <span class="text-muted text-xs uppercase font-bold">Transporter Credit Payout:</span>
                <strong class="text-success font-bold text-lg">{{ selectedTrip.vendorRate.toLocaleString() }} AED</strong>
              </div>
            </template>
          </Card>

          <!-- Driver actions simulation -->
          <Card class="actions-card mt-auto">
            <template #title>
              <div class="border-b pb-2 mb-3">
                <h3 class="m-0 text-md">Driver Field Simulator</h3>
              </div>
            </template>
            <template #content>
              <div class="driver-actions-box p-3 rounded bg-panel" v-if="selectedTrip.status === 'Dispatched'">
                <p class="text-muted text-xs mb-3 m-0">Simulate status logs sent by the driver device to notify operations of route milestones.</p>
                <Button 
                  @click="updateTripMilestone" 
                  label="Log Next Milestone Complete"
                  icon="pi pi-check"
                  class="w-full p-button-success p-button-outlined text-xs p-2 mt-2"
                />
              </div>

              <div class="completed-box p-3 rounded flex-row gap-3 align-center text-success border border-success" v-else>
                <i class="pi pi-check-circle text-lg"></i>
                <div class="text flex-column text-xs">
                  <strong class="font-bold text-white-override">Trip Completed & Audited</strong>
                  <span class="text-muted mt-1">Vendor Invoice generated for: {{ selectedTrip.vendorRate.toLocaleString() }} AED</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../../../store';

const selectedTrip = ref(null);
const searchQuery = ref('');
const isViewingDetails = ref(false);

const vendorTrips = computed(() => {
  return store.orders.filter(
    o => o.vendor === store.selectedVendorName && (o.status === 'Dispatched' || o.status === 'Completed')
  );
});

// Set initial selection
onMounted(() => {
  if (vendorTrips.value.length > 0) {
    selectedTrip.value = vendorTrips.value[0];
  }
});

const filteredTrips = computed(() => {
  let list = vendorTrips.value;
  
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

const viewTripDetails = (trip) => {
  selectedTrip.value = trip;
  isViewingDetails.value = true;
};

// Watch vendorTrips to update selection if needed
watch(vendorTrips, (newVal) => {
  if (newVal.length > 0 && (!selectedTrip.value || !newVal.find(t => t.id === selectedTrip.value.id))) {
    selectedTrip.value = newVal[0];
    isViewingDetails.value = false;
  } else if (newVal.length === 0) {
    selectedTrip.value = null;
  }
});

const updateTripMilestone = () => {
  if (!selectedTrip.value) return;
  store.advanceMilestone(selectedTrip.value.id);
};

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
.vendor-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-description p {
  color: var(--text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
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

/* Detail Grid Layout */
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

.detail-card-main, .pricing-card, .actions-card {
  height: fit-content;
}

.route-segment-box {
  background-color: var(--surface-c);
}

.bg-panel {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

/* Custom Marker Styling */
.custom-marker-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--surface-c);
  border: 2px solid var(--surface-border);
  z-index: 2;
  transition: all 0.2s ease;
}

.custom-marker-circle.completed {
  border-color: var(--success-color);
  background-color: var(--success-color);
}

.custom-marker-circle.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color-transparent);
  box-shadow: 0 0 10px var(--primary-color);
}

.text-2xs {
  font-size: 6px;
  color: var(--text-color-secondary);
}

.custom-marker-circle.active .text-2xs {
  color: var(--primary-color);
}

.milestone-content-block {
  padding-left: 12px;
  margin-bottom: 20px;
}

.milestone-title {
  font-size: 13.5px;
  line-height: 1.2;
}

.completed-box {
  background-color: rgba(5, 18, 88, 0.04);
}

/* Alignments */
.text-muted {
  color: var(--text-color-secondary);
}

.text-white-override {
  color: var(--text-color);
}

.text-success {
  color: var(--success-color);
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
