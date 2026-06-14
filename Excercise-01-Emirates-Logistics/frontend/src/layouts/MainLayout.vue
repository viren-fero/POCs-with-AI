<template>
  <div class="layout-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Left Sidebar -->
    <aside class="layout-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo-wrapper">
          <img v-if="!isSidebarCollapsed" src="/src/assets/emirates-logistics-logo.svg" alt="Emirates Logistics"
            class="brand-logo" />
          <div v-else class="collapsed-logo-badge">EL</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Admin Navigation -->
        <template v-if="role === 'admin'">
          <router-link to="/admin/dashboard" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Operations Dashboard' : null">
            <i class="pi pi-chart-bar"></i>
            <span>Operations Dashboard</span>
          </router-link>
          <router-link to="/admin/control-tower" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Control Tower' : null">
            <i class="pi pi-map"></i>
            <span>Control Tower</span>
          </router-link>
          <router-link to="/admin/orders" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Order Management' : null">
            <i class="pi pi-list"></i>
            <span>Order Management</span>
          </router-link>
          <router-link to="/admin/scheduling" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Trip Scheduling' : null">
            <i class="pi pi-send"></i>
            <span>Trip Scheduling</span>
          </router-link>
          <router-link to="/admin/invoices" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Billing & Settlement' : null">
            <i class="pi pi-receipt"></i>
            <span>Billing & Settlement</span>
          </router-link>
        </template>

        <!-- Customer Navigation -->
        <template v-else-if="role === 'customer'">
          <router-link to="/customer/dashboard" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Booking Portal' : null">
            <i class="pi pi-shopping-cart"></i>
            <span>Booking Portal</span>
          </router-link>
          <router-link to="/customer/orders" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Shipment Tracking' : null">
            <i class="pi pi-box"></i>
            <span>Shipment Tracking</span>
          </router-link>
        </template>

        <!-- Vendor Navigation -->
        <template v-else-if="role === 'vendor'">
          <router-link to="/vendor/dashboard" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Trip Execution' : null">
            <i class="pi pi-truck"></i>
            <span>Trip Execution</span>
          </router-link>
          <router-link to="/vendor/fleet" class="nav-item" active-class="active"
            v-tooltip.right="isSidebarCollapsed ? 'Fleet Management' : null">
            <i class="pi pi-users"></i>
            <span>Fleet Management</span>
          </router-link>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar" v-tooltip.right="isSidebarCollapsed ? `${username} (${role.toUpperCase()})` : null">
            <i class="pi pi-user"></i>
          </div>
          <div class="info" v-if="!isSidebarCollapsed">
            <div class="name">{{ username }}</div>
            <div class="role-badge" :class="role">{{ role.toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="layout-main">
      <header class="layout-header">
        <div class="header-left">
          <Button @click="isSidebarCollapsed = !isSidebarCollapsed"
            :icon="isSidebarCollapsed ? 'pi pi-bars' : 'pi pi-align-left'"
            class="p-button-rounded p-button-text p-button-secondary sidebar-toggle-btn"
            :title="isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'" />
          <span class="view-title">{{ currentViewTitle }}</span>
        </div>
        <div class="header-right">
          <!-- Quick Role Selector using PrimeVue Select -->
          <div class="demo-switcher flex align-center gap-2">
            <span class="switcher-label">Demo Persona:</span>
            <Select v-model="store.currentUser" :options="roleOptions" optionLabel="label" optionValue="value"
              @change="switchRole" class="role-select" />
          </div>

          <!-- Theme Switcher -->
          <Button @click="store.toggleTheme()" :icon="store.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            class="p-button-rounded p-button-text p-button-secondary theme-toggle-btn"
            :title="store.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'" />

          <button @click="logout" class="logout-btn">
            <i class="pi pi-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Child Views Render Here with modern fade transition wrapper -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../store';

const isSidebarCollapsed = ref(false);

const route = useRoute();
const router = useRouter();

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
  { label: 'Vendor', value: 'vendor' }
];

// Compute the current active role from route prefix
const role = computed(() => {
  if (route.path.startsWith('/admin')) return 'admin';
  if (route.path.startsWith('/customer')) return 'customer';
  if (route.path.startsWith('/vendor')) return 'vendor';
  return store.currentUser;
});

// Mock user profiles
const username = computed(() => {
  if (role.value === 'admin') return 'Ops Admin';
  if (role.value === 'customer') return store.selectedCustomerName;
  if (role.value === 'vendor') return store.selectedVendorName;
  return 'User';
});

// Dynamic Header Title
const currentViewTitle = computed(() => {
  switch (route.name) {
    case 'admin-dashboard': return 'Operations Dashboard';
    case 'admin-orders': return 'Order Management';
    case 'admin-scheduling': return 'Trip Scheduling';
    case 'admin-control-tower': return 'Control Tower';
    case 'admin-invoices': return 'Billing & Settlement';
    case 'customer-dashboard': return 'Booking Portal';
    case 'customer-orders': return 'Shipment Tracking';
    case 'vendor-dashboard': return 'Trip Execution';
    case 'vendor-fleet': return 'Fleet Management';
    default: return 'Emirates Logistics TMS';
  }
});

// Switch role from header switcher (Quick demo utility)
const switchRole = () => {
  if (store.currentUser === 'admin') {
    router.push('/admin/dashboard');
  } else if (store.currentUser === 'customer') {
    router.push('/customer/dashboard');
  } else if (store.currentUser === 'vendor') {
    router.push('/vendor/dashboard');
  }
};

const logout = () => {
  store.currentUser = 'admin';
  router.push('/');
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--surface-b);
  color: var(--text-color);
}

/* Sidebar Styling */
.layout-sidebar {
  width: 260px;
  background-color: var(--brand-navy);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: background-color 0.25s ease;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-logo {
  max-width: 100%;
  height: 36px;
  object-fit: contain;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item i {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.nav-item:hover i {
  color: #ffffff;
}

.nav-item.active {
  background-color: rgba(254, 150, 5, 0.12);
  color: var(--brand-orange);
  font-weight: 600;
}

.nav-item.active i {
  color: var(--brand-orange);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background-color: rgba(0, 0, 0, 0.15);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: var(--brand-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
}

.role-badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.role-badge.admin {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}

.role-badge.customer {
  background-color: rgba(5, 18, 88, 0.08);
  color: var(--primary-color);
}

.role-badge.vendor {
  background-color: rgba(254, 150, 5, 0.12);
  color: var(--brand-orange);
}

/* Main Area Styling */
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.layout-header {
  height: 64px;
  background-color: var(--surface-a);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  transition: background-color 0.25s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-title {
  font-size: 16px;
  font-weight: 650;
  font-family: var(--font-family);
  letter-spacing: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.demo-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switcher-label {
  font-size: 12px;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.role-select {
  width: 130px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--surface-border);
  color: var(--text-color-secondary);
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: var(--surface-hover);
  color: #ff5252;
  border-color: rgba(255, 82, 82, 0.2);
}

.layout-content {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  background-color: var(--surface-b);
  transition: background-color 0.25s ease;
}

/* Page Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
