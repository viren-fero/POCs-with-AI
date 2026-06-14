<template>
  <div class="customer-dashboard animate-fade-in">
    <div class="dashboard-grid">
      <!-- Left side: Booking Form Component -->
      <div class="booking-section">
        <h2 class="text-lg font-bold mb-1">Book FTL / FCL Movement</h2>
        <p class="section-desc text-xs text-muted mb-4">Select your route and modality. The contract rate engine will automatically apply your active contracted tariff.</p>

        <BookingForm @submit-booking="handleBooking" />
      </div>

      <!-- Right side: History/List overview -->
      <div class="history-section flex-column">
        <h2 class="text-lg font-bold mb-1">Our Movement Pipeline</h2>
        <p class="section-desc text-xs text-muted mb-4">Active transits and bookings currently logged in the Emirates system.</p>

        <div class="flex-1">
          <DataTable 
            :value="customerOrders" 
            responsiveLayout="scroll"
            class="p-datatable-sm"
            :rows="5"
          >
            <Column field="id" header="Order ID" headerStyle="width: 20%">
              <template #body="slotProps">
                <span class="font-bold text-sm" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
              </template>
            </Column>
            <Column field="route" header="Route">
              <template #body="slotProps">
                <div class="route-display text-xs font-semibold">
                  <span>{{ slotProps.data.origin.split(' (')[0] }}</span>
                  <i class="pi pi-arrow-right text-2xs mx-1 text-muted"></i>
                  <span>{{ slotProps.data.destination.split(' (')[0] }}</span>
                </div>
              </template>
            </Column>
            <Column field="type" header="Modality" headerStyle="width: 15%">
              <template #body="slotProps">
                <Tag :value="slotProps.data.type" :severity="slotProps.data.type === 'FTL' ? 'warn' : 'info'" class="text-2xs" />
              </template>
            </Column>
            <Column field="rate" header="Tariff" headerStyle="width: 20%">
              <template #body="slotProps">
                <span class="font-bold text-xs">{{ slotProps.data.rate.toLocaleString() }} AED</span>
              </template>
            </Column>
            <Column field="status" header="Status" headerStyle="width: 20%">
              <template #body="slotProps">
                <Tag 
                  :value="slotProps.data.status" 
                  :severity="getStatusSeverity(slotProps.data.status)" 
                  class="text-2xs" 
                />
              </template>
            </Column>
          </DataTable>

          <div v-if="customerOrders.length === 0" class="empty-pipeline text-center text-muted p-5">
            <i class="pi pi-box text-4xl mb-3"></i>
            <p class="m-0 text-sm">No shipments currently logged.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../../../store';
import { useRouter } from 'vue-router';
import BookingForm from './components/BookingForm.vue';

const router = useRouter();

const customerOrders = computed(() => {
  return store.orders.filter(o => o.customer === store.selectedCustomerName);
});

const handleBooking = (formData) => {
  store.addOrder(
    formData.origin,
    formData.destination,
    formData.type,
    formData.date
  );

  router.push('/customer/orders');
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
.customer-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.booking-section, .history-section {
  background-color: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 24px;
  height: 100%;
  box-shadow: var(--card-shadow);
}

.route-display {
  display: flex;
  align-items: center;
}

.empty-pipeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-muted {
  color: var(--text-color-secondary);
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

.text-lg {
  font-size: 18px;
}

.text-4xl {
  font-size: 38px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.p-5 {
  padding: 24px !important;
}

.flex-1 {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>
