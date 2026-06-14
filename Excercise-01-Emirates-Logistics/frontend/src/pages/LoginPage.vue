<template>
  <div class="login-container">
    <div class="login-box">
      <header class="login-header">
        <div class="logo-wrapper">
          <img src="/src/assets/emirates-logistics-logo.svg" alt="Emirates Logistics Logo" class="brand-logo" />
        </div>
        <h1 class="portal-title">Transport Management System</h1>
        <p class="subtitle">Operations Portal &bull; Version 2.0 (POC)</p>
      </header>

      <div class="roles-grid">
        <!-- Admin Role Card -->
        <div class="role-card hover-interactive" @click="loginAs('admin')">
          <div class="role-icon admin">
            <i class="pi pi-shield"></i>
          </div>
          <h3 class="role-title">Operations Admin</h3>
          <p class="role-description">Configure client tariffs, dispatch subcontractor vehicles, monitor live tracking on the Control Tower, and reconcile financial settlement accounts.</p>
          <button class="role-btn admin">Access Admin Portal</button>
        </div>

        <!-- Customer Role Card -->
        <div class="role-card hover-interactive" @click="loginAs('customer')">
          <div class="role-icon customer">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <h3 class="role-title">Customer Portal</h3>
          <p class="role-description">Place new FTL and FCL movement requests, view automated contract tariff estimates, and track active shipment transits in real-time.</p>
          <button class="role-btn customer">Access Customer Portal</button>
        </div>

        <!-- Vendor Role Card -->
        <div class="role-card hover-interactive" @click="loginAs('vendor')">
          <div class="role-icon vendor">
            <i class="pi pi-truck"></i>
          </div>
          <h3 class="role-title">Vendor Portal</h3>
          <p class="role-description">Manage subcontractor fleet vehicles and drivers, view assigned dispatch schedules, and monitor transaction ledger payment records.</p>
          <button class="role-btn vendor">Access Vendor Portal</button>
        </div>
      </div>

      <footer class="login-footer">
        <p>&copy; 2026 Emirates Logistics. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { store } from '../store';

const router = useRouter();

const loginAs = (role) => {
  store.currentUser = role;
  if (role === 'admin') {
    router.push('/admin/dashboard');
  } else if (role === 'customer') {
    router.push('/customer/dashboard');
  } else if (role === 'vendor') {
    router.push('/vendor/dashboard');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--surface-b);
  background-image: 
    radial-gradient(circle at top right, rgba(254, 150, 5, 0.04), transparent 45%),
    radial-gradient(circle at bottom left, rgba(5, 18, 88, 0.05), transparent 45%);
  padding: 40px 24px;
}

.login-box {
  width: 100%;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.login-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  padding: 12px;
  background: #ffffff; /* Permanent white background for corporate logo contrast */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid var(--surface-border);
}

.brand-logo {
  max-width: 320px;
  height: auto;
  object-fit: contain;
}

.portal-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-color);
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 500;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 900px) {
  .roles-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }
}

.role-card {
  background-color: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 40px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(5, 18, 88, 0.06);
}

.p-dark .role-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.hover-interactive.role-card:hover {
  border-color: var(--primary-color) !important;
}

.role-card:nth-child(2):hover {
  border-color: var(--success-color) !important;
}

.role-card:nth-child(3):hover {
  border-color: var(--brand-orange) !important;
}

.role-icon {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.role-icon i {
  font-size: 26px;
}

.role-icon.admin {
  background-color: rgba(5, 18, 88, 0.06);
  color: var(--primary-color);
  border: 1px solid rgba(5, 18, 88, 0.1);
}

.p-dark .role-icon.admin {
  background-color: rgba(254, 150, 5, 0.12);
  color: var(--primary-color);
  border: 1px solid rgba(254, 150, 5, 0.2);
}

.role-icon.customer {
  background-color: rgba(5, 18, 88, 0.06);
  color: var(--primary-color);
  border: 1px solid rgba(5, 18, 88, 0.1);
}

.role-icon.vendor {
  background-color: rgba(254, 150, 5, 0.06);
  color: var(--brand-orange);
  border: 1px solid rgba(254, 150, 5, 0.1);
}

.role-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
}

.role-description {
  color: var(--text-color-secondary);
  font-size: 13.5px;
  line-height: 1.6;
  margin-bottom: 32px;
  flex: 1;
}

.role-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.role-btn.admin {
  background-color: var(--primary-color-transparent);
  color: var(--primary-color);
}

.role-btn.admin:hover, .role-card:hover .role-btn.admin {
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 4px 12px rgba(5, 18, 88, 0.15);
}

.role-btn.customer {
  background-color: rgba(5, 18, 88, 0.08);
  color: var(--primary-color);
}

.role-btn.customer:hover, .role-card:hover .role-btn.customer {
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 4px 12px rgba(5, 18, 88, 0.15);
}

.role-btn.vendor {
  background-color: rgba(254, 150, 5, 0.08);
  color: var(--brand-orange);
}

.role-btn.vendor:hover, .role-card:hover .role-btn.vendor {
  background-color: var(--brand-orange);
  color: #000;
  box-shadow: 0 4px 12px rgba(254, 150, 5, 0.15);
}

.login-footer {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 12px;
  margin-top: 16px;
}
</style>
