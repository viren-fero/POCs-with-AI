<template>
  <div class="invoices-page">
    <!-- 1. LISTING PAGE (Full Width) -->
    <div v-if="!isViewingDetails" class="listing-view flex-column gap-4 animate-fade-in">
      <div class="actions-header flex-row justify-between align-center p-3 rounded border">
        <div class="filter-and-search flex-row gap-3 align-center flex-1">
          <h2 class="m-0 text-md font-bold">Completed Trips Pool ({{ completedOrders.length }})</h2>
          
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
      </div>

      <!-- Full-Width DataTable -->
      <div class="table-section p-3 rounded border">
        <DataTable 
          :value="filteredInvoices" 
          responsiveLayout="scroll" 
          :paginator="true" 
          :rows="10"
          class="custom-datatable"
        >
          <Column field="id" header="Trip ID" sortable headerStyle="width: 15%">
            <template #body="slotProps">
              <span class="font-bold text-sm" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
            </template>
          </Column>
          
          <Column field="customer" header="Client" sortable headerStyle="width: 20%">
            <template #body="slotProps">
              <span class="font-semibold text-xs text-white-override">{{ slotProps.data.customer }}</span>
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

          <Column field="type" header="Modality" sortable headerStyle="width: 12%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="slotProps.data.type === 'FTL' ? 'warn' : 'info'" class="text-2xs" />
            </template>
          </Column>

          <Column field="margin" header="Operating Margin" sortable headerStyle="width: 20%">
            <template #body="slotProps">
              <span class="text-success font-bold text-xs">{{ calculateMargin(slotProps.data).toLocaleString() }} AED</span>
            </template>
          </Column>

          <Column header="Audits" headerStyle="width: 20%">
            <template #body="slotProps">
              <div class="flex-row gap-2">
                <Tag 
                  :value="slotProps.data.customerInvoiceApproved ? 'Billed' : 'Inv. Pending'" 
                  :severity="slotProps.data.customerInvoiceApproved ? 'success' : 'warn'"
                  class="text-3xs"
                />
                <Tag 
                  :value="slotProps.data.vendorBillApproved ? 'Paid' : 'Bill Pending'" 
                  :severity="slotProps.data.vendorBillApproved ? 'success' : 'warn'"
                  class="text-3xs"
                />
              </div>
            </template>
          </Column>

          <Column header="Actions" headerStyle="width: 8%" class="text-center">
            <template #body="slotProps">
              <Button 
                icon="pi pi-wallet" 
                class="p-button-rounded p-button-text p-button-sm text-primary" 
                @click="viewInvoiceDetails(slotProps.data)" 
                title="Audit & Reconcile"
              />
            </template>
          </Column>
        </DataTable>

        <div v-if="filteredInvoices.length === 0" class="empty-list text-center text-muted p-5">
          <i class="pi pi-receipt text-4xl mb-3"></i>
          <p class="m-0 text-sm">No completed trips match the selected filters or search terms.</p>
        </div>
      </div>
    </div>

    <!-- 2. DETAIL PAGE (Full Width) -->
    <div v-else class="detail-view animate-fade-in" v-if="selectedOrder">
      <!-- Back Navigation Header -->
      <div class="detail-header flex-row align-center justify-between mb-4">
        <Button 
          label="Back to Settlements List" 
          icon="pi pi-arrow-left" 
          class="p-button-text p-button-secondary text-sm" 
          @click="isViewingDetails = false" 
        />
        <div class="flex-row align-center gap-2">
          <span class="text-muted text-sm">Auditing Statement:</span>
          <Tag :value="selectedOrder.id" severity="success" class="p-2 text-xs font-bold" />
        </div>
      </div>

      <!-- Financial Reconciliation Grid Layout -->
      <div class="detail-grid">
        <!-- Left Column: Margin Stats and Auditing blocks -->
        <div class="main-detail-column flex-column gap-4">
          <!-- Margin Metrics Summary Card -->
          <Card class="margin-metrics-card">
            <template #title>
              <div class="border-b pb-2 mb-3">
                <h3 class="m-0 text-md">Profit Margin Reconciliation</h3>
              </div>
            </template>
            <template #content>
              <div class="margin-analytics-card p-4 rounded flex-row">
                <div class="analytics-stat flex-1">
                  <span class="label text-muted text-xs uppercase block mb-1">Total Operating Margin</span>
                  <span class="value text-success text-2xl font-bold">{{ calculateMargin(selectedOrder).toLocaleString() }} AED</span>
                </div>
                <div class="analytics-stat flex-1 border-l pl-4">
                  <span class="label text-muted text-xs uppercase block mb-1">Operating Margin %</span>
                  <span class="value text-white-override text-2xl font-bold">{{ calculateMarginPct(selectedOrder) }}%</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- Side-by-Side Audit Blocks -->
          <div class="grid-2-col">
            <!-- Customer Invoice (Billed to Client) -->
            <Card class="audit-block-card">
              <template #title>
                <div class="flex-row justify-between align-center border-b pb-2 mb-3">
                  <h4 class="m-0 text-sm font-bold text-white-override">1. Customer Invoice (Debit)</h4>
                  <Tag 
                    :value="selectedOrder.customerInvoiceApproved ? 'Billed' : 'Pending Approval'" 
                    :severity="selectedOrder.customerInvoiceApproved ? 'success' : 'warn'" 
                    class="text-2xs"
                  />
                </div>
              </template>
              <template #content>
                <div class="block-body text-xs flex-column gap-3">
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Client Account:</span>
                    <strong class="text-white-override">{{ selectedOrder.customer }}</strong>
                  </div>
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Contract Lane Tariff:</span>
                    <strong class="price-text text-success font-bold text-sm">{{ selectedOrder.rate.toLocaleString() }} AED</strong>
                  </div>
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Route Specific Lane:</span>
                    <strong class="text-white-override">{{ selectedOrder.origin.split(' (')[0] }} ➔ {{ selectedOrder.destination.split(' (')[0] }}</strong>
                  </div>
                  
                  <div class="action-btn-wrapper mt-3">
                    <Button 
                      v-if="!selectedOrder.customerInvoiceApproved" 
                      @click="approveCustomerInvoice" 
                      label="Approve & Post Customer Invoice"
                      icon="pi pi-check"
                      class="w-full p-button-success p-button-outlined p-2 text-xs"
                    />
                    <div v-else class="success-message p-3 rounded flex-row align-center justify-center text-success text-xs font-bold border border-success">
                      <i class="pi pi-check-circle mr-2 text-sm"></i>
                      <span>Posted to Customer Account</span>
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Vendor Bill (Transporter Credit) -->
            <Card class="audit-block-card">
              <template #title>
                <div class="flex-row justify-between align-center border-b pb-2 mb-3">
                  <h4 class="m-0 text-sm font-bold text-white-override">2. Vendor Bill (Credit)</h4>
                  <Tag 
                    :value="selectedOrder.vendorBillApproved ? 'Approved' : 'Pending Approval'" 
                    :severity="selectedOrder.vendorBillApproved ? 'success' : 'warn'"
                    class="text-2xs"
                  />
                </div>
              </template>
              <template #content>
                <div class="block-body text-xs flex-column gap-3">
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Subcontractor:</span>
                    <strong class="text-white-override">{{ selectedOrder.vendor }}</strong>
                  </div>
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Contract Cost Rate:</span>
                    <strong class="price-text text-white-override font-bold text-sm">{{ selectedOrder.vendorRate.toLocaleString() }} AED</strong>
                  </div>
                  <div class="row flex-row justify-between p-2 rounded bg-panel">
                    <span class="text-muted">Allocated Asset:</span>
                    <strong class="text-white-override">{{ selectedOrder.vehicle ? selectedOrder.vehicle.split(' (')[0] : 'N/A' }} ({{ selectedOrder.driver }})</strong>
                  </div>
                  
                  <div class="action-btn-wrapper mt-3">
                    <Button 
                      v-if="!selectedOrder.vendorBillApproved" 
                      @click="approveVendorBill" 
                      label="Approve & Authorize Vendor Payment"
                      icon="pi pi-check"
                      class="w-full p-button-warning p-button-outlined p-2 text-xs"
                    />
                    <div v-else class="success-message p-3 rounded flex-row align-center justify-center text-success text-xs font-bold border border-success">
                      <i class="pi pi-check-circle mr-2 text-sm"></i>
                      <span>Authorized Payout Settle</span>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../../../store';

const selectedOrder = ref(null);
const searchQuery = ref('');
const isViewingDetails = ref(false);

const completedOrders = computed(() => store.orders.filter(o => o.status === 'Completed'));

// Set initial selection
onMounted(() => {
  if (completedOrders.value.length > 0) {
    selectedOrder.value = completedOrders.value[0];
  }
});

const filteredInvoices = computed(() => {
  let list = completedOrders.value;
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.customer.toLowerCase().includes(q) ||
      o.origin.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q) ||
      (o.vendor && o.vendor.toLowerCase().includes(q))
    );
  }
  
  return list;
});

// Watch search query changes to reset details view back to list for safety
watch(searchQuery, () => {
  isViewingDetails.value = false;
});

const viewInvoiceDetails = (order) => {
  selectedOrder.value = order;
  isViewingDetails.value = true;
};

// Reset selection if list changes
watch(completedOrders, (newVal) => {
  if (selectedOrder.value && !newVal.find(o => o.id === selectedOrder.value.id)) {
    selectedOrder.value = newVal[0] || null;
    isViewingDetails.value = false;
  } else if (!selectedOrder.value && newVal.length > 0) {
    selectedOrder.value = newVal[0];
  }
});

const calculateMargin = (order) => {
  return order.rate - order.vendorRate;
};

const calculateMarginPct = (order) => {
  const margin = order.rate - order.vendorRate;
  return Math.round((margin / order.rate) * 100);
};

const approveCustomerInvoice = () => {
  if (!selectedOrder.value) return;
  store.approveInvoice(selectedOrder.value.id);
};

const approveVendorBill = () => {
  if (!selectedOrder.value) return;
  store.approveBill(selectedOrder.value.id);
};
</script>

<style scoped>
.invoices-page {
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

.text-primary {
  color: var(--primary-color);
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Detail view layout */
.margin-metrics-card {
  height: fit-content;
}

.margin-analytics-card {
  background: linear-gradient(135deg, rgba(5, 18, 88, 0.08), rgba(254, 150, 5, 0.06));
  border: 1px solid rgba(5, 18, 88, 0.14);
}

.analytics-stat {
  display: flex;
  flex-direction: column;
}

.bg-panel {
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
}

.success-message {
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

.border-l {
  border-left: 1px solid var(--surface-border);
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

.text-2xl {
  font-size: 24px;
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

.pb-2 {
  padding-bottom: 8px;
}

.pb-3 {
  padding-bottom: 12px;
}

.pl-4 {
  padding-left: 16px;
}

.pl-8 {
  padding-left: 32px !important;
}

.ml-1 {
  margin-left: 4px;
}

.ml-auto {
  margin-left: auto;
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

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
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
