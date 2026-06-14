<template>
  <div class="dashboard-page animate-fade-in">
    <!-- Today's Header -->
    <div class="dashboard-header flex-row justify-between align-center mb-6">
      <div class="header-titles">
        <h1 class="text-xl font-bold m-0">Operations Overview</h1>
        <p class="subtitle text-xs text-muted mt-1">{{ todayDateString }}</p>
      </div>

      <!-- Filters & Date range bar -->
      <div class="header-filters flex-row gap-3 align-center">
        <div class="filter-item">
          <Select 
            v-model="selectedBranch" 
            :options="branchOptions" 
            class="custom-dropdown" 
          />
        </div>
        <div class="filter-item">
          <Select 
            v-model="modalityFilter" 
            :options="modalityOptions" 
            optionLabel="label" 
            optionValue="value" 
            class="custom-dropdown" 
          />
        </div>
        <Button label="Filter" icon="pi pi-filter" class="p-button-outlined" size="small" />
        <Button label="Export" icon="pi pi-download" class="p-button-outlined" size="small" />
      </div>
    </div>

    <!-- 1. KPI Summary Grid -->
    <div class="kpi-grid mb-6">
      <!-- Card 1: Pending Dispatch -->
      <Card class="kpi-card flex-1">
        <template #content>
          <div class="kpi-body">
            <div class="kpi-topline">
              <div class="kpi-info-stack">
                <span class="kpi-title">Pending Dispatch</span>
                <span class="kpi-value">{{ pendingCount }}</span>
              </div>
              <div class="kpi-icon-box orange">
                <i class="pi pi-clock"></i>
              </div>
            </div>
            <div class="kpi-trend warning">
              <i class="pi pi-exclamation-triangle"></i>
              <span>Needs transporter booking</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Card 2: Active Transit -->
      <Card class="kpi-card flex-1">
        <template #content>
          <div class="kpi-body">
            <div class="kpi-topline">
              <div class="kpi-info-stack">
                <span class="kpi-title">Active Transits</span>
                <span class="kpi-value">{{ activeCount }}</span>
              </div>
              <div class="kpi-icon-box blue">
                <i class="pi pi-sync"></i>
              </div>
            </div>
            <div class="kpi-trend">
              <i class="pi pi-arrow-up-right"></i>
              <span>Monitored on Control Tower</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Card 3: Completed Legs -->
      <Card class="kpi-card flex-1">
        <template #content>
          <div class="kpi-body">
            <div class="kpi-topline">
              <div class="kpi-info-stack">
                <span class="kpi-title">Completed Legs</span>
                <span class="kpi-value">{{ completedCount }}</span>
              </div>
              <div class="kpi-icon-box completed">
                <i class="pi pi-check-circle"></i>
              </div>
            </div>
            <div class="kpi-trend">
              <i class="pi pi-arrow-up-right"></i>
              <span>Closed movement legs</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Card 4: Billed Revenue -->
      <Card class="kpi-card flex-1">
        <template #content>
          <div class="kpi-body">
            <div class="kpi-topline">
              <div class="kpi-info-stack">
                <span class="kpi-title">Total Billed Revenue</span>
                <span class="kpi-value">{{ totalRevenue.toLocaleString() }} AED</span>
              </div>
              <div class="kpi-icon-box navy">
                <i class="pi pi-wallet"></i>
              </div>
            </div>
            <div class="kpi-trend">
              <i class="pi pi-check"></i>
              <span>Reconciled billing value</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 2. Middle Section: Charts Grid (PrimeVue Charts) -->
    <div class="charts-grid mb-6">
      <!-- Chart Column 1: Doughnut Chart -->
      <Card class="chart-card allocation-card flex-1">
        <template #content>
          <div class="chart-header-block">
            <div>
              <h3 class="text-sm font-bold m-0">Movement Allocation</h3>
              <span class="chart-subtitle">Current operational mix</span>
            </div>
            <span class="chart-period">Live</span>
          </div>

          <div class="allocation-content">
            <div class="donut-wrap">
              <Chart
                type="doughnut"
                :data="circularChartData"
                :options="circularChartOptions"
                class="donut-chart"
              />
              <div class="donut-center">
                <span>{{ store.orders.length }}</span>
                <small>Total</small>
              </div>
            </div>

            <div class="allocation-metrics">
              <div class="allocation-row">
                <span class="legend-dot navy"></span>
                <div>
                  <strong>{{ completedCount }}</strong>
                  <small>Completed</small>
                </div>
              </div>
              <div class="allocation-row">
                <span class="legend-dot orange"></span>
                <div>
                  <strong>{{ activeCount }}</strong>
                  <small>In transit</small>
                </div>
              </div>
              <div class="allocation-row">
                <span class="legend-dot neutral"></span>
                <div>
                  <strong>{{ pendingCount }}</strong>
                  <small>Pending</small>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Chart Column 2: Stacked Bar Chart -->
      <Card class="chart-card wide-chart-card flex-1">
        <template #content>
          <div class="chart-header-block">
            <div>
              <h3 class="text-sm font-bold m-0">Weekly Modality Split</h3>
              <span class="chart-subtitle">FCL, FTL and local haul distribution</span>
            </div>
            <div class="chart-total">
              <strong>61</strong>
              <span>movements</span>
            </div>
          </div>

          <div class="chart-canvas bar-chart-container">
            <Chart 
              type="bar" 
              :data="barChartData" 
              :options="barChartOptions" 
              class="chart-fill"
            />
          </div>
          
          <div class="chart-footer">
            <span><i class="legend-dot neutral"></i> FCL</span>
            <span><i class="legend-dot orange"></i> FTL</span>
            <span><i class="legend-dot navy"></i> Local haul</span>
          </div>
        </template>
      </Card>

      <!-- Chart Column 3: Area Line Chart -->
      <Card class="chart-card wide-chart-card flex-1">
        <template #content>
          <div class="chart-header-block">
            <div>
              <h3 class="text-sm font-bold m-0">Revenue Trend</h3>
              <span class="chart-subtitle">Billed value across recent operating periods</span>
            </div>
            <div class="chart-total">
              <strong>{{ totalRevenue.toLocaleString() }}</strong>
              <span>AED billed</span>
            </div>
          </div>

          <div class="chart-canvas area-chart-container">
            <Chart 
              type="line" 
              :data="areaChartData" 
              :options="areaChartOptions" 
              class="chart-fill"
            />
          </div>

          <div class="chart-footer split">
            <span>Month trend</span>
            <strong><i class="pi pi-arrow-up"></i> 21% improvement</strong>
          </div>
        </template>
      </Card>
    </div>

    <!-- 3. Bottom Section: 2-Column Datatable Layout -->
    <div class="bottom-tables-grid">
      <!-- Left Column Table: Active Movement Pool -->
      <Card class="table-card flex-1">
        <template #content>
          <div class="table-header-block flex-row justify-between align-center mb-4">
            <h3 class="text-sm font-bold m-0">Active Shipment Pipeline</h3>
            <router-link to="/admin/orders">
              <Button label="View" icon="pi pi-external-link" size="small" outlined />
            </router-link>
          </div>

          <DataTable :value="filteredOrders.slice(0, 4)" responsiveLayout="scroll" class="p-datatable-sm">
            <Column field="id" header="Trip ID">
              <template #body="slotProps">
                <span class="font-bold text-xs" :style="{ color: store.isDarkMode ? '#FE9605' : '#051258' }">{{ slotProps.data.id }}</span>
              </template>
            </Column>
            <Column field="route" header="Route">
              <template #body="slotProps">
                <div class="lane-display text-xs font-semibold">
                  <span>{{ slotProps.data.origin.split(' (')[0] }}</span>
                  <i class="pi pi-arrow-right text-muted mx-1 text-3xs"></i>
                  <span>{{ slotProps.data.destination.split(' (')[0] }}</span>
                </div>
              </template>
            </Column>
            <Column field="type" header="Modality">
              <template #body="slotProps">
                <Tag :severity="slotProps.data.type === 'FCL' ? 'success' : 'info'" :value="slotProps.data.type" />
              </template>
            </Column>
            <Column field="status" header="Status">
              <template #body="slotProps">
                <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Right Column Table: Financial Auditing Board -->
      <Card class="table-card flex-1">
        <template #content>
          <div class="table-header-block flex-row justify-between align-center mb-4">
            <h3 class="text-sm font-bold m-0">Recent Invoicing Settlements</h3>
            <router-link to="/admin/invoices">
              <Button label="Audit Panel" icon="pi pi-wallet" size="small" outlined />
            </router-link>
          </div>

          <DataTable :value="settledOrders.slice(0, 4)" responsiveLayout="scroll" class="p-datatable-sm">
            <Column field="id" header="Invoice ID">
              <template #body="slotProps">
                <span class="font-semibold text-xs">{{ slotProps.data.id }}</span>
              </template>
            </Column>
            <Column field="customer" header="Client Account">
              <template #body="slotProps">
                <span class="text-xs font-semibold">{{ slotProps.data.customer.split(' ')[0] }}</span>
              </template>
            </Column>
            <Column field="margin" header="Margin (AED)">
              <template #body="slotProps">
                <span class="text-success font-bold text-xs">{{ calculateMargin(slotProps.data) }} AED</span>
              </template>
            </Column>
            <Column header="Invoice Audit">
              <template #body="slotProps">
                <Tag 
                  :value="slotProps.data.customerInvoiceApproved ? 'Posted' : 'Audit Pending'" 
                  :severity="slotProps.data.customerInvoiceApproved ? 'success' : 'warn'"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../../../store';

const modalityFilter = ref('all');
const selectedBranch = ref('Dubai Main Hub');

const modalityOptions = [
  { label: 'All Modalities', value: 'all' },
  { label: 'FTL Only', value: 'FTL' },
  { label: 'FCL Only', value: 'FCL' }
];

const branchOptions = [
  'Dubai Main Hub',
  'Abu Dhabi Port Office',
  'Jebel Ali Free Zone Hub'
];

// Computed counts
const pendingCount = computed(() => store.orders.filter(o => o.status === 'Pending Dispatch').length);
const activeCount = computed(() => store.orders.filter(o => o.status === 'Dispatched').length);
const completedCount = computed(() => store.orders.filter(o => o.status === 'Completed').length);

const totalRevenue = computed(() => {
  return store.orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.rate, 0);
});

const filteredOrders = computed(() => {
  if (modalityFilter.value === 'all') return store.orders;
  return store.orders.filter(o => o.type === modalityFilter.value);
});

const settledOrders = computed(() => {
  return store.orders.filter(o => o.status === 'Completed');
});

// Calculate margins
const calculateMargin = (order) => {
  if (!order.vendorRate) return order.rate;
  return order.rate - order.vendorRate;
};

const getStatusSeverity = (status) => {
  if (status === 'Completed') return 'success';
  if (status === 'Dispatched') return 'info';
  return 'warn';
};

const todayDateString = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
});

// Computed Reactivity for Theme Changes inside Chart configs
const circularChartData = computed(() => {
  const primaryColor = store.isDarkMode ? '#FE9605' : '#051258';
  const accentColor = '#FE9605';
  const neutralColor = store.isDarkMode ? '#1e293b' : '#cbd5e1';
  const hoverPrimary = store.isDarkMode ? '#e08302' : '#030a38';
  const hoverAccent = '#e08302';
  const hoverNeutral = store.isDarkMode ? '#334155' : '#94a3b8';
  
  return {
    labels: ['Completed', 'In Transit', 'Pending'],
    datasets: [{
      data: [completedCount.value, activeCount.value, pendingCount.value],
      backgroundColor: [primaryColor, accentColor, neutralColor],
      hoverBackgroundColor: [hoverPrimary, hoverAccent, hoverNeutral],
      borderWidth: 0,
      borderRadius: 4
    }]
  };
});

const circularChartOptions = computed(() => ({
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true
    }
  },
  responsive: true,
  maintainAspectRatio: false
}));

const barChartData = computed(() => {
  const primaryColor = store.isDarkMode ? '#FE9605' : '#051258';
  const containerColor = store.isDarkMode ? '#94a3b8' : '#64748b';
  const truckloadColor = '#FE9605';
  return {
    labels: ['30 Sep', '10 Oct', '20 Oct', '30 Oct', '10 Nov'],
    datasets: [
      {
        type: 'bar',
        label: 'FCL (Container)',
        backgroundColor: containerColor,
        data: [2, 5, 2, 4, 3],
        stack: 'combined',
        borderRadius: 2
      },
      {
        type: 'bar',
        label: 'FTL (Truckload)',
        backgroundColor: truckloadColor,
        data: [3, 4, 3, 5, 4],
        stack: 'combined',
        borderRadius: 2
      },
      {
        type: 'bar',
        label: 'Local Haul',
        backgroundColor: primaryColor,
        data: [4, 6, 4, 7, 5],
        stack: 'combined',
        borderRadius: 2
      }
    ]
  };
});

const barChartOptions = computed(() => {
  const gridColor = store.isDarkMode ? '#1e293b' : '#f1f5f9';
  const labelColor = store.isDarkMode ? '#94a3b8' : '#64748b';
  
  return {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: labelColor,
          font: {
            size: 9
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: gridColor
        },
        ticks: {
          color: labelColor,
          font: {
            size: 9
          }
        }
      }
    }
  };
});

const areaChartData = computed(() => ({
  labels: ['30 Sep', '10 Oct', '20 Oct', '30 Oct', '10 Nov'],
  datasets: [{
    label: 'Revenue (AED)',
    data: [1500, 3300, 4800, 6300, Math.max(7800, totalRevenue.value)],
    fill: true,
    borderColor: '#fe9605',
    tension: 0.4,
    backgroundColor: store.isDarkMode ? 'rgba(254, 150, 5, 0.08)' : 'rgba(254, 150, 5, 0.04)',
    borderWidth: 2,
    pointBackgroundColor: store.isDarkMode ? '#FE9605' : '#051258',
    pointBorderColor: '#ffffff',
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}));

const areaChartOptions = computed(() => {
  const gridColor = store.isDarkMode ? '#1e293b' : '#f1f5f9';
  const labelColor = store.isDarkMode ? '#94a3b8' : '#64748b';
  
  return {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: labelColor,
          font: {
            size: 9
          }
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: labelColor,
          font: {
            size: 9
          }
        }
      }
    }
  };
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* Header Styles */
.dashboard-header {
  min-height: 44px;
}

.dashboard-header h1 {
  font-size: 20px;
  font-weight: 650;
}

.subtitle {
  margin: 0;
  font-weight: 450;
}

.custom-dropdown {
  min-width: 170px;
}

/* KPI Summaries */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 96px;
}

.kpi-card {
  position: relative;
  overflow: hidden;
}

.kpi-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-navy), var(--brand-orange));
  opacity: 0.72;
}

.kpi-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.kpi-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  box-shadow: none;
  border: 1px solid transparent;
}

.kpi-icon-box.orange {
  background-color: rgba(254, 150, 5, 0.08);
  color: #fe9605;
  border-color: rgba(254, 150, 5, 0.1);
}

.kpi-icon-box.blue {
  background-color: rgba(5, 18, 88, 0.06);
  color: var(--primary-color);
  border-color: rgba(5, 18, 88, 0.1);
}

.kpi-icon-box.completed {
  background-color: rgba(5, 18, 88, 0.08);
  color: var(--primary-color);
  border-color: rgba(5, 18, 88, 0.12);
}

.kpi-icon-box.navy {
  background-color: rgba(5, 18, 88, 0.08);
  color: #051258;
  border-color: rgba(5, 18, 88, 0.1);
}

.p-dark .kpi-icon-box.navy {
  background-color: rgba(254, 150, 5, 0.12);
  color: var(--brand-orange);
  border-color: rgba(254, 150, 5, 0.18);
}

.kpi-info-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.kpi-value {
  font-size: 25px;
  font-weight: 750;
  font-family: var(--font-family);
  color: var(--text-color);
  line-height: 1;
  letter-spacing: -0.01em;
}

.kpi-title {
  order: -1;
  font-size: 11px;
  font-weight: 750;
  color: var(--text-color-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr 1.35fr;
  gap: 18px;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  height: 100%;
}

.chart-card :deep(.p-card-body),
.chart-card :deep(.p-card-content) {
  height: 100%;
}

.chart-card :deep(.p-card-content) {
  display: flex;
  flex-direction: column;
}

.chart-header-block {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-header-block h3,
.table-header-block h3 {
  font-size: 13.5px;
  font-weight: 650;
}

.chart-subtitle {
  display: block;
  color: var(--text-color-secondary);
  font-size: 11.5px;
  font-weight: 500;
  margin-top: 4px;
}

.chart-period {
  border: 1px solid var(--surface-border);
  border-radius: 999px;
  color: var(--text-color-secondary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 8px;
  text-transform: uppercase;
}

.chart-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;
  white-space: nowrap;
}

.chart-total strong {
  color: var(--text-color);
  font-size: 18px;
  font-weight: 750;
}

.chart-total span {
  color: var(--text-color-secondary);
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 4px;
}

.allocation-content {
  display: grid;
  grid-template-columns: minmax(128px, 0.9fr) minmax(132px, 1fr);
  gap: 18px;
  align-items: center;
  flex: 1;
}

.donut-wrap {
  position: relative;
  height: 190px;
  min-width: 150px;
}

.donut-chart,
.chart-fill {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-center span {
  color: var(--text-color);
  font-size: 24px;
  font-weight: 750;
  line-height: 1;
}

.donut-center small {
  color: var(--text-color-secondary);
  font-size: 10px;
  font-weight: 700;
  margin-top: 5px;
  text-transform: uppercase;
}

.allocation-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.allocation-row {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 10px;
  align-items: center;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 10px;
  background: var(--surface-b);
}

.allocation-row strong {
  display: block;
  color: var(--text-color);
  font-size: 15px;
  font-weight: 750;
  line-height: 1;
}

.allocation-row small {
  display: block;
  color: var(--text-color-secondary);
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
}

.chart-canvas {
  flex: 1;
  min-height: 218px;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 14px 16px 8px;
  background:
    linear-gradient(180deg, rgba(5, 18, 88, 0.018), transparent 46%),
    var(--surface-a);
}

.chart-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 34px;
  margin-top: 12px;
  color: var(--text-color-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.chart-footer span,
.chart-footer strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.chart-footer.split {
  justify-content: space-between;
  text-transform: none;
}

.chart-footer.split strong {
  color: var(--brand-orange);
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.navy {
  background: var(--brand-navy);
}

.legend-dot.orange {
  background: var(--brand-orange);
}

.legend-dot.neutral {
  background: #64748b;
}

.p-dark .legend-dot.neutral {
  background: #94a3b8;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  min-height: 30px;
  padding: 7px 9px;
  border: 1px solid var(--surface-border);
  border-radius: 7px;
  background: var(--surface-b);
  color: var(--text-color-secondary) !important;
  font-size: 11.5px;
  font-weight: 650;
  line-height: 1.2;
}

.kpi-trend i {
  color: var(--brand-orange);
  font-size: 12px;
}

.kpi-trend.warning {
  background: rgba(254, 150, 5, 0.06);
  border-color: rgba(254, 150, 5, 0.16);
}

/* Bottom 2-Table grid */
.bottom-tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

@media (max-width: 1024px) {
  .bottom-tables-grid {
    grid-template-columns: 1fr;
  }
}

.table-card {
  height: 100%;
}

.lane-display {
  display: flex;
  align-items: center;
}

.text-muted {
  color: var(--text-color-secondary);
}

.text-success {
  color: var(--success-color);
}

.text-warn {
  color: var(--warning-color);
}

.text-2xs {
  font-size: 11px;
}

.text-3xs {
  font-size: 10px;
}

.text-sm {
  font-size: 14px;
}

.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.m-0 {
  margin: 0;
}

.mt-1 {
  margin-top: 4px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-6 {
  margin-top: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mr-1 {
  margin-right: 4px;
}

.p-2 {
  padding: 8px !important;
}

.p-3 {
  padding: 12px !important;
}

.flex-row {
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

.flex-1 {
  flex: 1;
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

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.uppercase {
  text-transform: uppercase;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.border-l {
  border-left: 1px solid var(--surface-border);
}
</style>
