<template>
  <Card class="tracking-timeline-card h-full flex-column">
    <template #title>
      <div class="flex-row justify-between align-center border-b pb-3 mb-4">
        <h3 class="m-0 text-lg">Live Progress</h3>
        <Tag :value="selectedOrder.id" severity="success" class="p-2 font-bold" />
      </div>
    </template>

    <template #content>
      <!-- Progress bar using PrimeVue ProgressBar -->
      <div class="progress-details-box p-3 rounded mb-4" v-if="selectedOrder.status !== 'Pending Dispatch'">
        <div class="progress-info flex-row justify-between align-center mb-2 text-xs">
          <span class="text-muted">Delivery Completion:</span>
          <strong class="text-white-override font-bold">{{ selectedOrder.progress }}%</strong>
        </div>
        <ProgressBar :value="selectedOrder.progress" :showValue="false" style="height: 6px" />
      </div>

      <!-- Unscheduled Message -->
      <div v-else class="pending-dispatch-box p-3 rounded flex-row gap-3 align-start mb-4">
        <i class="pi pi-clock text-warn text-lg mt-1"></i>
        <div>
          <strong class="text-warn text-sm block mb-1">Awaiting Carrier Dispatch</strong>
          <p class="text-muted text-xs m-0">Your order is logged. Operations Admin is allocating a contracted vehicle.</p>
        </div>
      </div>

      <!-- Milestones Timeline using PrimeVue Timeline -->
      <div class="timeline-container-scroll flex-1 overflow-y-auto mb-4 pr-1" v-if="selectedOrder.status !== 'Pending Dispatch'">
        <h4 class="text-primary text-xs uppercase font-bold mb-3">Route Milestones</h4>
        
        <Timeline :value="selectedOrder.milestones" class="custom-timeline-style">
          <template #marker="slotProps">
            <span 
              class="custom-marker-circle" 
              :class="{ 
                'completed': slotProps.item.completed, 
                'active': slotProps.index === selectedOrder.currentMilestoneIndex 
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
                  'text-primary font-bold': slotProps.index === selectedOrder.currentMilestoneIndex,
                  'text-muted': !slotProps.item.completed && slotProps.index !== selectedOrder.currentMilestoneIndex
                }"
              >
                {{ slotProps.item.name }}
              </div>
              <div class="milestone-time text-xs text-muted mt-1">{{ slotProps.item.time }}</div>
            </div>
          </template>
        </Timeline>
      </div>

      <!-- Digital Invoice Download -->
      <div class="billing-container p-3 rounded mt-auto" v-if="selectedOrder.status === 'Completed'">
        <h4 class="text-success text-xs uppercase font-bold mb-3">Financial Statement</h4>
        <div class="invoice-box p-3 rounded flex-row align-center justify-between border">
          <div class="invoice-details flex-row align-center gap-3">
            <i class="pi pi-file-pdf text-danger text-2xl"></i>
            <div class="text flex-column text-xs">
              <strong class="text-white-override">TAX-INVOICE-{{ selectedOrder.id }}.pdf</strong>
              <span class="text-muted mt-1">Total: {{ selectedOrder.rate.toLocaleString() }} AED (VAT Inc.)</span>
            </div>
          </div>
          <Button 
            @click="downloadMockInvoice(selectedOrder)" 
            label="Download" 
            icon="pi pi-download" 
            class="p-button-outlined p-button-success p-button-sm text-xs"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps({
  selectedOrder: Object
});

const downloadMockInvoice = (order) => {
  alert(`Downloading Customer Tax Invoice:\n\nInvoice No: INV-${order.id}\nClient: ${order.customer}\nLane: ${order.origin.split(' (')[0]} to ${order.destination.split(' (')[0]}\nTotal Amount: ${order.rate} AED\n\nDownloaded successfully!`);
};
</script>

<style scoped>
.tracking-timeline-card {
  height: 100%;
}

.progress-details-box {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.pending-dispatch-box {
  background-color: rgba(254, 150, 5, 0.04);
  border: 1px dashed var(--warning-color);
}

.timeline-container-scroll {
  max-height: 300px;
  min-height: 200px;
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
  font-size: 13.5px;
  line-height: 1.2;
}

/* Billing invoice */
.invoice-box {
  background-color: var(--surface-c);
  border-color: var(--surface-border) !important;
}

.text-muted {
  color: var(--text-color-secondary);
}

.text-white-override {
  color: var(--text-color);
}

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

.text-warn {
  color: var(--warning-color);
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

.align-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
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

.overflow-y-auto {
  overflow-y: auto;
}

.flex-1 {
  flex: 1;
}

.mt-auto {
  margin-top: auto;
}
</style>
