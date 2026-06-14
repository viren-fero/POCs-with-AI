<template>
  <Card class="milestone-timeline-card h-full flex flex-column">
    <template #title>
      <div class="flex justify-between align-center border-b pb-3 mb-4">
        <h3 class="m-0 text-lg">Milestones Timeline</h3>
        <Tag :value="selectedTrip.type" :severity="selectedTrip.type === 'FTL' ? 'warn' : 'info'" />
      </div>
    </template>

    <template #content>
      <div class="timeline-container-scroll flex-1 overflow-y-auto mb-4 pr-1">
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

      <!-- Simulator controls for Admins -->
      <div class="simulator-box p-3 rounded" v-if="selectedTrip.status === 'Dispatched'">
        <h4 class="text-warn text-xs uppercase font-bold mb-2">Simulation Controls</h4>
        <p class="text-muted text-xs mb-3">Manually trigger the next route milestone to simulate GPS progression on the map.</p>
        <Button 
          @click="triggerNextMilestone" 
          label="Simulate Next Milestone" 
          icon="pi pi-forward" 
          class="w-full p-button-warning p-button-outlined text-xs"
        />
      </div>

      <div class="completed-box p-3 rounded flex align-center justify-center text-success" v-else>
        <i class="pi pi-check-circle mr-2 text-lg"></i>
        <span class="font-bold text-xs">Trip Completed. Financial details forwarded to Invoicing.</span>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { store } from '../../../../store';

const props = defineProps({
  selectedTrip: Object
});

const triggerNextMilestone = () => {
  store.advanceMilestone(props.selectedTrip.id);
};
</script>

<style scoped>
.milestone-timeline-card {
  height: 100%;
}

.timeline-container-scroll {
  max-height: 380px;
  min-height: 250px;
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
  margin-bottom: 24px;
}

.milestone-title {
  font-size: 13px;
  line-height: 1.2;
}

.text-muted {
  color: var(--text-color-secondary);
}

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}

.text-warn {
  color: var(--warning-color);
}

.simulator-box {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.completed-box {
  background-color: rgba(5, 18, 88, 0.06);
  border: 1px solid var(--success-color);
  text-align: center;
}

.border-b {
  border-bottom: 1px solid var(--surface-border);
}

.uppercase {
  text-transform: uppercase;
}

.flex {
  display: flex;
}

.flex-column {
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

.mt-1 {
  margin-top: 4px;
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

.p-3 {
  padding: 12px !important;
}

.text-xs {
  font-size: 12px;
}

.text-lg {
  font-size: 16px;
}

.overflow-y-auto {
  overflow-y: auto;
}

.flex-1 {
  flex: 1;
}
</style>
