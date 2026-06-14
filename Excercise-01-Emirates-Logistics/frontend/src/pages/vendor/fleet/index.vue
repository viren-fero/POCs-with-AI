<template>
  <div class="fleet-management-page animate-fade-in">
    <!-- Smart Filter & Toggle Header -->
    <div class="fleet-header flex-row justify-between align-center p-3 rounded border mb-4">
      <div class="header-left flex-row gap-3 align-center flex-1">
        <!-- View Toggle Buttons -->
        <div class="view-toggle flex-row gap-1 bg-surface-toggle p-1 rounded">
          <Button 
            label="Drivers Directory" 
            icon="pi pi-users" 
            :class="activeView === 'drivers' ? 'p-button-primary' : 'p-button-text p-button-secondary'"
            @click="activeView = 'drivers'"
            size="small"
          />
          <Button 
            label="Vehicle Registry" 
            icon="pi pi-truck" 
            :class="activeView === 'vehicles' ? 'p-button-primary' : 'p-button-text p-button-secondary'"
            @click="activeView = 'vehicles'"
            size="small"
          />
        </div>

        <!-- Smart Status Filter Pills with Counters -->
        <div class="status-filters flex-row gap-2">
          <button 
            v-for="filter in currentFilterOptions" 
            :key="filter.value"
            @click="activeStatusFilter = filter.value"
            class="status-filter-pill flex-row align-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            :class="activeStatusFilter === filter.value ? 'active' : 'inactive'"
          >
            <span>{{ filter.label }}</span>
            <span class="count-badge rounded-full flex-row align-center justify-center font-bold">{{ filter.count }}</span>
          </button>
        </div>
      </div>

      <!-- Search Box -->
      <div class="header-right search-wrapper relative w-full max-w-xs">
        <i class="pi pi-search search-icon text-muted text-sm absolute"></i>
        <InputText 
          v-model="searchQuery" 
          :placeholder="activeView === 'drivers' ? 'Search driver name...' : 'Search license plate...'" 
          class="p-inputtext-sm search-input pl-8 w-full" 
        />
      </div>
    </div>

    <!-- 1. DRIVER DIRECTORY VIEW -->
    <div v-if="activeView === 'drivers'" class="drivers-view grid-container">
      <Card 
        v-for="driver in filteredDrivers" 
        :key="driver.id" 
        class="driver-profile-card hover-card animate-fade-in"
      >
        <template #content>
          <div class="driver-card-body flex-column gap-3">
            <!-- Top Section: Avatar and status -->
            <div class="flex-row justify-between align-start">
              <div class="flex-row align-center gap-3">
                <div class="driver-avatar flex-row align-center justify-center font-bold text-white text-md">
                  {{ driver.initials }}
                </div>
                <div class="driver-info flex-column">
                  <h3 class="m-0 text-sm font-bold text-white-override">{{ driver.name }}</h3>
                  <span class="text-2xs text-muted mt-1">{{ driver.phone }}</span>
                </div>
              </div>
              <Tag 
                :value="driver.status" 
                :severity="driver.status === 'Available' ? 'success' : 'info'" 
                class="text-3xs" 
              />
            </div>

            <hr class="divider"/>

            <!-- Middle Section: Metrics -->
            <div class="driver-metrics grid-2-col text-2xs">
              <div class="metric-item p-2 rounded bg-panel">
                <span class="text-muted block mb-1 uppercase font-bold">Driver Rating</span>
                <span class="text-white-override font-bold flex-row align-center gap-1 text-xs">
                  <i class="pi pi-star-fill text-warn"></i>
                  {{ driver.rating }} / 5.0
                </span>
              </div>
              <div class="metric-item p-2 rounded bg-panel">
                <span class="text-muted block mb-1 uppercase font-bold">On-Time Ratio</span>
                <span class="text-success font-bold text-xs">{{ driver.efficiency }}</span>
              </div>
            </div>

            <hr class="divider"/>

            <!-- Footer Section: Current active trip -->
            <div class="driver-assignment flex-row justify-between align-center text-2xs p-2 rounded">
              <span class="text-muted font-bold">Duty Assignment:</span>
              <router-link 
                v-if="driver.currentTrip" 
                to="/vendor/dashboard" 
                class="trip-link font-bold text-primary"
              >
                {{ driver.currentTrip }} <i class="pi pi-angle-right"></i>
              </router-link>
              <span v-else class="text-success font-bold flex-row align-center gap-1">
                <span class="status-indicator online pulsing-dot"></span> Available / Idle
              </span>
            </div>
          </div>
        </template>
      </Card>

      <div v-if="filteredDrivers.length === 0" class="empty-fleet-state text-center text-muted p-5 col-span-full">
        <i class="pi pi-users text-4xl mb-3"></i>
        <p class="m-0 text-sm">No drivers match the selected status filters or search query.</p>
      </div>
    </div>

    <!-- 2. VEHICLE REGISTRY VIEW -->
    <div v-else class="vehicles-view grid-container">
      <Card 
        v-for="vehicle in filteredVehicles" 
        :key="vehicle.id" 
        class="vehicle-profile-card hover-card animate-fade-in"
      >
        <template #content>
          <div class="vehicle-card-body flex-column gap-3">
            <!-- Top Section: Dubai Plate Design and Modality -->
            <div class="flex-row justify-between align-center">
              <!-- Dubai Plate Badge -->
              <div class="dubai-license-plate flex-row rounded border overflow-hidden">
                <span class="plate-code flex-row align-center justify-center font-bold px-2 py-1 text-white">DUBAI</span>
                <span class="plate-number flex-row align-center justify-center font-bold px-3 py-1 bg-white text-black">{{ vehicle.plate }}</span>
              </div>
              <Tag 
                :value="vehicle.type" 
                :severity="vehicle.type === 'FTL' ? 'warn' : 'info'" 
                class="text-3xs" 
              />
            </div>

            <div class="vehicle-info flex-column">
              <h3 class="m-0 text-sm font-bold text-white-override">{{ vehicle.model }}</h3>
              <span class="text-2xs text-muted mt-1">Status: <strong :class="vehicle.status === 'Available' ? 'text-success' : 'text-primary'">{{ vehicle.status }}</strong></span>
            </div>

            <hr class="divider"/>

            <!-- Diagnostics Metrics -->
            <div class="vehicle-metrics grid-2-col text-2xs">
              <div class="metric-item p-2 rounded bg-panel">
                <span class="text-muted block mb-1 uppercase font-bold">Fuel Level</span>
                <span class="text-white-override font-bold flex-row align-center gap-1 text-xs">
                  <i class="pi pi-filter text-primary"></i>
                  {{ vehicle.fuel }}
                </span>
              </div>
              <div class="metric-item p-2 rounded bg-panel">
                <span class="text-muted block mb-1 uppercase font-bold">Engine Health</span>
                <span class="text-success font-bold text-xs">{{ vehicle.health }}</span>
              </div>
            </div>

            <hr class="divider"/>

            <!-- Footer Section: Current active trip -->
            <div class="vehicle-assignment flex-row justify-between align-center text-2xs p-2 rounded">
              <span class="text-muted font-bold">Current Transit:</span>
              <router-link 
                v-if="vehicle.currentTrip" 
                to="/vendor/dashboard" 
                class="trip-link font-bold text-primary"
              >
                {{ vehicle.currentTrip }} <i class="pi pi-angle-right"></i>
              </router-link>
              <span v-else class="text-success font-bold flex-row align-center gap-1">
                <span class="status-indicator online pulsing-dot"></span> Available
              </span>
            </div>
          </div>
        </template>
      </Card>

      <div v-if="filteredVehicles.length === 0" class="empty-fleet-state text-center text-muted p-5 col-span-full">
        <i class="pi pi-truck text-4xl mb-3"></i>
        <p class="m-0 text-sm">No vehicles match the selected status filters or search query.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../../../store';

const activeView = ref('drivers');
const activeStatusFilter = ref('All');
const searchQuery = ref('');

// Computed Enriched Drivers List
const enrichedDrivers = computed(() => {
  const fleet = store.vendorsFleet[store.selectedVendorName] || { drivers: [], vehicles: [] };
  return fleet.drivers.map((name, idx) => {
    // Check active dispatched shipments
    const activeOrder = store.orders.find(
      o => o.vendor === store.selectedVendorName && o.driver === name && o.status === 'Dispatched'
    );
    const status = activeOrder ? 'In Transit' : 'Available';
    return {
      id: `DRV-${100 + idx}`,
      name,
      initials: name.split(' ').map(n => n[0]).join(''),
      phone: `+971 50 77${idx} 44${idx}2`,
      status,
      currentTrip: activeOrder ? activeOrder.id : null,
      rating: (4.7 + idx * 0.1).toFixed(1),
      efficiency: `${94 + idx * 2}%`
    };
  });
});

// Computed Enriched Vehicles List
const enrichedVehicles = computed(() => {
  const fleet = store.vendorsFleet[store.selectedVendorName] || { drivers: [], vehicles: [] };
  return fleet.vehicles.map((vString, idx) => {
    // Format: "DXB-T-98765 (Volvo FH16 FCL)"
    const plate = vString.split(' (')[0];
    const rest = vString.split(' (')[1] || '';
    const model = rest.split(' F')[0] || 'Volvo FH16';
    const type = rest.includes('FCL') ? 'FCL' : 'FTL';
    
    const activeOrder = store.orders.find(
      o => o.vendor === store.selectedVendorName && o.vehicle === vString && o.status === 'Dispatched'
    );
    const status = activeOrder ? 'In Transit' : 'Available';
    
    return {
      id: `VEH-${500 + idx}`,
      plate,
      model,
      type,
      status,
      fuel: `${85 - idx * 10}%`,
      health: `${96 - idx * 2}%`,
      currentTrip: activeOrder ? activeOrder.id : null
    };
  });
});

// Current View Filter Options with reactive counters
const currentFilterOptions = computed(() => {
  if (activeView.value === 'drivers') {
    const list = enrichedDrivers.value;
    return [
      { label: 'All', value: 'All', count: list.length },
      { label: 'Available', value: 'Available', count: list.filter(d => d.status === 'Available').length },
      { label: 'In Transit', value: 'In Transit', count: list.filter(d => d.status === 'In Transit').length }
    ];
  } else {
    const list = enrichedVehicles.value;
    return [
      { label: 'All', value: 'All', count: list.length },
      { label: 'Available', value: 'Available', count: list.filter(v => v.status === 'Available').length },
      { label: 'In Transit', value: 'In Transit', count: list.filter(v => v.status === 'In Transit').length }
    ];
  }
});

// Filter Drivers
const filteredDrivers = computed(() => {
  let list = enrichedDrivers.value;
  
  if (activeStatusFilter.value !== 'All') {
    list = list.filter(d => d.status === activeStatusFilter.value);
  }
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(d => d.name.toLowerCase().includes(q));
  }
  
  return list;
});

// Filter Vehicles
const filteredVehicles = computed(() => {
  let list = enrichedVehicles.value;
  
  if (activeStatusFilter.value !== 'All') {
    list = list.filter(v => v.status === activeStatusFilter.value);
  }
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(v => v.plate.toLowerCase().includes(q));
  }
  
  return list;
});
</script>

<style scoped>
.fleet-management-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.fleet-header {
  background-color: var(--surface-a);
  border-color: var(--surface-border) !important;
}

.bg-surface-toggle {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

/* Status filters */
.status-filter-pill {
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
}

.status-filter-pill.active {
  background-color: var(--primary-color-transparent);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.status-filter-pill.inactive {
  background-color: var(--surface-c);
  border-color: var(--surface-border);
  color: var(--text-color-secondary);
}

.status-filter-pill.inactive:hover {
  color: var(--text-color);
  border-color: var(--text-color-secondary);
}

.count-badge {
  font-size: 10px;
  background-color: var(--surface-hover);
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  color: var(--text-color);
}

.status-filter-pill.active .count-badge {
  background-color: var(--primary-color);
  color: #fff;
}

/* Search input */
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

/* Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.hover-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--card-shadow) !important;
  border-color: var(--surface-border) !important;
}

.hover-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

/* Driver Avatar */
.driver-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-navy), rgba(254, 150, 5, 0.22));
  border: 1.5px solid var(--surface-border);
}

.p-dark .driver-avatar {
  background: linear-gradient(135deg, var(--primary-color), rgba(254, 150, 5, 0.16));
}

.bg-panel {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.divider {
  border: none;
  border-top: 1px solid var(--surface-border);
  margin: 0;
  opacity: 0.5;
}

.driver-assignment, .vehicle-assignment {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.trip-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
}

.trip-link:hover {
  text-decoration: underline;
}

/* dubai license plate design */
.dubai-license-plate {
  border-color: #333;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.5px;
  font-size: 11px;
}

.plate-code {
  background-color: #111;
  color: #fff;
  font-size: 9px;
  letter-spacing: 1px;
}

.plate-number {
  background-color: #f5f5f5;
  color: #111;
  font-size: 12px;
  font-weight: 800;
}

/* online pulse indicator */
.pulsing-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--success-color);
  border-radius: 50%;
  animation: pulse-indicator 2s infinite;
}

@keyframes pulse-indicator {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

/* Utility classes */
.text-muted {
  color: var(--text-color-secondary);
}

.text-white-override {
  color: var(--text-color);
}

.text-success {
  color: var(--success-color);
}

.text-primary {
  color: var(--primary-color);
}

.text-warn {
  color: var(--warning-color);
}

.border {
  border: 1px solid var(--surface-border);
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

.align-start {
  align-items: flex-start;
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
  font-size: 14px;
}

.text-md {
  font-size: 16px;
}

.text-lg {
  font-size: 18px;
}

.text-4xl {
  font-size: 36px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.pl-8 {
  padding-left: 32px !important;
}

.p-1 {
  padding: 4px !important;
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

.max-w-xs {
  max-width: 280px;
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
  gap: 12px;
}

.col-span-full {
  grid-column: 1 / -1;
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
