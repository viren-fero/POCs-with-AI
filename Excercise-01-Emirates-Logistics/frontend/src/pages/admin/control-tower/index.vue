<template>
  <div class="control-tower-page animate-fade-in">
    <div class="tower-layout">
      <!-- Left side: Dispatched trips list -->
      <div class="trips-section flex-column">
        <h2 class="text-md font-bold mb-3 text-white">Active Transit Trips ({{ activeTrips.length }})</h2>
        <div class="trips-list flex-1 overflow-y-auto pr-1">
          <div 
            v-for="trip in activeTrips" 
            :key="trip.id"
            @click="selectedTrip = trip"
            class="trip-card p-3 rounded mb-3 cursor-pointer transition-colors hover-interactive"
            :class="{ 'selected-trip': selectedTrip?.id === trip.id }"
          >
            <div class="trip-header flex-row justify-between align-center text-xs mb-2">
              <span class="trip-id font-bold">{{ trip.id }}</span>
              <Tag :value="trip.vendor.split(' ')[0]" severity="warn" class="text-3xs" />
            </div>
            
            <div class="trip-route flex-row align-center text-sm font-semibold mb-3">
              <span>{{ trip.origin.split(' (')[0] }}</span>
              <i class="pi pi-arrow-right text-muted mx-2 text-xs"></i>
              <span>{{ trip.destination.split(' (')[0] }}</span>
            </div>

            <!-- PrimeVue ProgressBar -->
            <div class="mb-3">
              <ProgressBar :value="trip.progress" :showValue="false" style="height: 5px" />
            </div>

            <div class="trip-footer flex-row justify-between align-center text-xs text-muted">
              <span class="milestone-text flex-row align-center font-semibold text-white">
                <i class="pi pi-map-marker text-primary mr-1 text-xs"></i>
                {{ getActiveMilestoneName(trip) }}
              </span>
              <span class="pct-text font-bold text-white">{{ trip.progress }}%</span>
            </div>
          </div>

          <div v-if="activeTrips.length === 0" class="empty-trips-container text-center text-muted p-4">
            <i class="pi pi-map text-4xl mb-3"></i>
            <p class="m-0 text-sm">No vehicles currently in transit.</p>
            <p class="mt-1 text-xs">Go to Trip Dispatch to schedule a vehicle.</p>
          </div>
        </div>
      </div>

      <!-- Center: Modular Map Panel Component -->
      <div class="map-section">
        <LiveMap :selectedTrip="selectedTrip" />
      </div>

      <!-- Right: Modular Milestone Timeline Component -->
      <div class="milestone-section">
        <MilestoneTimeline v-if="selectedTrip" :selectedTrip="selectedTrip" />
        
        <Card v-else class="no-selection-card h-full">
          <template #content>
            <div class="text-center p-5 text-muted flex-column align-center justify-center h-full">
              <i class="pi pi-clock text-4xl mb-3"></i>
              <p class="m-0 text-sm">Select an active trip on the left to display the real-time milestone timeline and simulation controls.</p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { store } from '../../../store';
import LiveMap from './components/LiveMap.vue';
import MilestoneTimeline from './components/MilestoneTimeline.vue';

const selectedTrip = ref(null);

const activeTrips = computed(() => store.orders.filter(o => o.status === 'Dispatched' || o.status === 'Completed'));

// Set initial selection
if (activeTrips.value.length > 0) {
  selectedTrip.value = activeTrips.value[0];
}

// Watch activeTrips list to select the first item if the current selection is lost
watch(activeTrips, (newVal) => {
  if (newVal.length > 0 && (!selectedTrip.value || !newVal.find(t => t.id === selectedTrip.value.id))) {
    selectedTrip.value = newVal[0];
  } else if (newVal.length === 0) {
    selectedTrip.value = null;
  }
});

const getActiveMilestoneName = (trip) => {
  if (trip.status === 'Completed') return 'POD Uploaded';
  if (trip.currentMilestoneIndex === -1) return 'Departing';
  return trip.milestones[trip.currentMilestoneIndex].name;
};
</script>

<style scoped>
.control-tower-page {
  height: calc(100vh - 120px);
  overflow: hidden;
}

.tower-layout {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1.3fr;
  gap: 20px;
  height: 100%;
}

@media (max-width: 1200px) {
  .tower-layout {
    grid-template-columns: 1.2fr 2fr;
  }
  .milestone-section {
    display: none;
  }
}

@media (max-width: 900px) {
  .tower-layout {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
  .map-section {
    height: 350px;
  }
  .control-tower-page {
    height: auto;
    overflow: auto;
  }
}

/* Trips List Section */
.trips-section {
  background-color: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 20px;
  height: 100%;
  box-shadow: var(--card-shadow);
}

.trip-card {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.trip-card:hover {
  border-color: var(--brand-orange) !important;
}

.p-dark .trip-card:hover {
  border-color: var(--primary-color) !important;
}

.trip-card.selected-trip {
  background-color: var(--primary-color-transparent);
  border-color: var(--primary-color) !important;
}

.empty-trips-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Map Section */
.map-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Milestones Timeline Section */
.milestone-section {
  height: 100%;
}

.no-selection-card {
  border: 1px dashed var(--surface-border) !important;
  box-shadow: none !important;
}

.text-muted {
  color: var(--text-color-secondary);
}

.text-white {
  color: var(--text-color);
}

.text-primary {
  color: var(--primary-color);
}

.border-b {
  border-bottom: 1px solid var(--surface-border);
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

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 13.5px;
}

.text-md {
  font-size: 15px;
}

.text-2xs {
  font-size: 10px;
}

.text-3xs {
  font-size: 9px;
}

.text-4xl {
  font-size: 40px;
}

.mt-1 {
  margin-top: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mr-1 {
  margin-right: 4px;
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

.cursor-pointer {
  cursor: pointer;
}

.transition-colors {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.overflow-y-auto {
  overflow-y: auto;
}

.flex-1 {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>
