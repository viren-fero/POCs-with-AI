<template>
  <aside class="milestone-panel">
    <header class="panel-header">
      <div>
        <span class="eyebrow">Trip Status</span>
        <h3>{{ selectedTrip.id }}</h3>
      </div>
      <Tag :value="selectedTrip.type" :severity="selectedTrip.type === 'FTL' ? 'warn' : 'info'" />
    </header>

    <section class="trip-summary">
      <div class="progress-ring" :style="{ '--progress': `${selectedTrip.progress}%` }">
        <div class="progress-ring-inner">
          <strong>{{ selectedTrip.progress }}%</strong>
          <span>complete</span>
        </div>
      </div>

      <div class="summary-copy">
        <span class="summary-label">Current milestone</span>
        <strong>{{ activeMilestoneName }}</strong>
        <small>{{ selectedTrip.vendor || 'Carrier pending' }}</small>
      </div>
    </section>

    <section class="route-card">
      <div class="route-point">
        <span>Origin</span>
        <strong>{{ compactLocation(selectedTrip.origin) }}</strong>
      </div>
      <i class="pi pi-arrow-right"></i>
      <div class="route-point">
        <span>Destination</span>
        <strong>{{ compactLocation(selectedTrip.destination) }}</strong>
      </div>
    </section>

    <section class="timeline-list">
      <div
        v-for="(milestone, index) in selectedTrip.milestones"
        :key="milestone.name"
        class="milestone-row"
        :class="{
          completed: milestone.completed,
          active: index === selectedTrip.currentMilestoneIndex,
          pending: !milestone.completed && index !== selectedTrip.currentMilestoneIndex
        }"
      >
        <div class="rail">
          <span class="marker">
            <i v-if="milestone.completed" class="pi pi-check"></i>
            <i v-else-if="index === selectedTrip.currentMilestoneIndex" class="pi pi-map-marker"></i>
            <i v-else class="pi pi-circle"></i>
          </span>
        </div>

        <div class="milestone-card">
          <div class="milestone-main">
            <strong>{{ milestone.name }}</strong>
            <span>{{ milestone.time }}</span>
          </div>
          <small>{{ milestoneStatus(index, milestone) }}</small>
        </div>
      </div>
    </section>

    <footer class="panel-action">
      <template v-if="selectedTrip.status === 'Dispatched'">
        <div>
          <strong>Field simulation</strong>
          <span>Advance this trip to the next operational checkpoint.</span>
        </div>
        <Button
          @click="triggerNextMilestone"
          label="Advance Milestone"
          icon="pi pi-forward"
          class="w-full p-button-warning p-button-outlined text-xs"
        />
      </template>

      <div class="completed-state" v-else>
        <i class="pi pi-check-circle"></i>
        <div>
          <strong>Trip completed</strong>
          <span>Financial details have been forwarded to Billing & Settlement.</span>
        </div>
      </div>
    </footer>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../../../../store';

const props = defineProps({
  selectedTrip: Object
});

const activeMilestoneName = computed(() => {
  if (props.selectedTrip.status === 'Completed') return 'POD Uploaded';
  if (props.selectedTrip.currentMilestoneIndex === -1) return 'Departing';
  return props.selectedTrip.milestones[props.selectedTrip.currentMilestoneIndex]?.name || 'Awaiting update';
});

const compactLocation = (location) => location?.split(' (')[0] || 'N/A';

const milestoneStatus = (index, milestone) => {
  if (milestone.completed) return 'Completed';
  if (index === props.selectedTrip.currentMilestoneIndex) return 'In progress';
  return 'Awaiting update';
};

const triggerNextMilestone = () => {
  store.advanceMilestone(props.selectedTrip.id);
};
</script>

<style scoped>
.milestone-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  padding: 18px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 14px;
}

.eyebrow {
  display: block;
  color: var(--text-color-secondary);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.panel-header h3 {
  color: var(--text-color);
  font-size: 17px;
  font-weight: 700;
  margin: 4px 0 0;
}

.trip-summary {
  display: grid;
  grid-template-columns: 86px 1fr;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, rgba(5, 18, 88, 0.045), rgba(254, 150, 5, 0.045));
  border: 1px solid var(--surface-border);
  border-radius: 10px;
  padding: 14px;
}

.progress-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--brand-orange) var(--progress), var(--surface-border) 0);
}

.progress-ring-inner {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--surface-a);
}

.progress-ring-inner strong {
  color: var(--text-color);
  font-size: 16px;
  line-height: 1;
}

.progress-ring-inner span,
.summary-copy small,
.summary-label {
  color: var(--text-color-secondary);
  font-size: 10.5px;
  font-weight: 600;
}

.summary-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.summary-copy strong {
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.25;
  margin: 4px 0;
}

.route-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  border: 1px solid var(--surface-border);
  border-radius: 10px;
  padding: 12px;
  background: var(--surface-b);
}

.route-card i {
  color: var(--brand-orange);
  font-size: 12px;
}

.route-point {
  min-width: 0;
}

.route-point span {
  display: block;
  color: var(--text-color-secondary);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.route-point strong {
  display: block;
  color: var(--text-color);
  font-size: 12px;
  line-height: 1.25;
  margin-top: 4px;
}

.timeline-list {
  flex: 1;
  overflow-y: auto;
  padding: 2px 2px 2px 0;
}

.milestone-row {
  display: grid;
  grid-template-columns: 28px 1fr;
  position: relative;
  min-height: 72px;
}

.milestone-row:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 28px;
  bottom: -6px;
  width: 1px;
  background: var(--surface-border);
}

.rail {
  position: relative;
  z-index: 1;
  padding-top: 4px;
}

.marker {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--surface-a);
  border: 1px solid var(--surface-border);
  color: var(--text-color-secondary);
  font-size: 9px;
}

.milestone-row.completed .marker {
  background: var(--brand-navy);
  border-color: var(--brand-navy);
  color: #ffffff;
}

.milestone-row.active .marker {
  background: var(--brand-orange);
  border-color: var(--brand-orange);
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(254, 150, 5, 0.12);
}

.milestone-card {
  border: 1px solid var(--surface-border);
  border-radius: 9px;
  padding: 11px 12px;
  background: var(--surface-a);
  margin-bottom: 10px;
}

.milestone-row.active .milestone-card {
  border-color: rgba(254, 150, 5, 0.38);
  background: rgba(254, 150, 5, 0.045);
}

.milestone-row.pending .milestone-card {
  background: var(--surface-b);
}

.milestone-main {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.milestone-main strong {
  color: var(--text-color);
  font-size: 12.5px;
  line-height: 1.25;
}

.milestone-main span {
  color: var(--text-color-secondary);
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.milestone-card small {
  display: block;
  color: var(--text-color-secondary);
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 5px;
}

.panel-action {
  border-top: 1px solid var(--surface-border);
  padding-top: 14px;
}

.panel-action > div:first-child {
  margin-bottom: 10px;
}

.panel-action strong {
  display: block;
  color: var(--text-color);
  font-size: 12.5px;
}

.panel-action span {
  display: block;
  color: var(--text-color-secondary);
  font-size: 11.5px;
  line-height: 1.4;
  margin-top: 3px;
}

.completed-state {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid rgba(5, 18, 88, 0.14);
  border-radius: 9px;
  background: rgba(5, 18, 88, 0.04);
  padding: 12px;
}

.completed-state i {
  color: var(--brand-orange);
  margin-top: 2px;
}

.w-full {
  width: 100%;
}

.text-xs {
  font-size: 12px;
}
</style>
