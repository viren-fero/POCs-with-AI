# Project Context & Demo Guide — Emirates Logistics TMS-V2

This document provides a comprehensive overview of the **Emirates Logistics TMS-V2** Proof of Concept (POC). It serves as both a system overview for developers and a step-by-step presenter guide for client demonstrations.

---

## 1. Executive Summary & Vision

Emirates Logistics is modernizing its land transport networks across the GCC by moving from spreadsheet-based scheduling to a centralized, digital Transport Management System (TMS-V2). 

This POC is a sandboxed frontend prototype designed to showcase the streamlined operations for **FTL (Full Truckload)** and **FCL (Full Containerload)** movements. It models the core workflows of three primary user groups: **Admin (Operations)**, **Customer (Client)**, and **Vendor (Carrier)**.

---

## 2. Brand Identity & Design System

The application theme is customized using the official Emirates Logistics colors and brand assets located in the project's assets directory:

* **Primary Corporate Navy (`#051258`):** Extracted from the logo text. Used for structural blocks, such as the left navigation sidebar background, to establish corporate weight.
* **Interactive Accent Orange (`#FE9605`):** Extracted from the logo graphic. Used for active navigation items, maps, route lines, status indicators, and primary action buttons.
* **Secondary Highlight White (`#FFFFFF`):** Used for headers, primary labels, and button typography to ensure high contrast and readability.
* **Branded Logo Assets:**
  * Vector Logo: [emirates-logistics-logo.svg](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/assets/emirates-logistics-logo.svg)
  * Raster Logo: [emirates-logistics-logo.png](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/assets/emirates-logistics-logo.png)

---

## 3. Core System Flow (Order to Settlement)

The prototype simulates the end-to-end cargo movement lifecycle:

```
  [Customer Portal]             [Admin Portal]            [Control Tower]            [Billing Audit]
  Place FTL/FCL Order  ➔   Assign Mapped Transporter  ➔   Simulate GPS Transit  ➔   Verify Profit Margin
  Auto-Tariff Matching      Auto-Allocate Fleet Asset      Update Milestones        Approve Invoice & Bill
```

1. **Intake:** The Customer books a shipment. The system's rate engine matches the lane against active Customer Contracts to calculate the billing tariff.
2. **Dispatch:** The Ops Admin assigns a Vendor. The system automatically allocates the carrier's default vehicle and driver for that lane, and calculates the subcontractor cost from active Vendor Contracts.
3. **Execution:** The trip runs. A simulator triggers milestone updates (*Arrived*, *Loaded*, *Transit*, *Arrived at Drop*, *POD Uploaded*) which Admin monitors in real-time on a Control Tower map.
4. **Settlement:** Upon completion, the system reconciles the Client Invoice and Vendor Bill, displaying the profit margin for Admin sign-off.

---

## 4. Live Demo Walkthrough Script (Presenter Run-Sheet)

Use this step-by-step script to showcase the system flow live to the client:

### Phase 1: Customer Order Booking
1. Start on the login screen and click **Access Customer Portal**.
2. Select **FCL (Container Haulage)** and choose the lane: *Jebel Ali Port ➔ Dubai South*.
3. Point out the **Contract Pricing Card**: The system matched the active contract to lock in the rate of **1,500 AED**. Click **Confirm Booking**.

### Phase 2: Dispatch & Auto-Allocation
4. In the top-right header, use the Demo Switcher to change the persona to **Admin**.
5. Navigate to the **Trip Dispatch** page. You will see the new order in the queue. Select it.
6. Under Vendor selection, select **FastTrans Logistics**.
7. Point out the **Auto-Allocation box**: The system instantly assigned the default vehicle (*DXB-T-98765*) and driver (*Sajid Khan*) and looked up the vendor contract cost of **1,200 AED**. Click **Confirm & Dispatch**.

### Phase 3: Control Tower Map Tracking
8. You will automatically land on the **Control Tower** map. Select the active trip.
9. Click **Simulate Next Milestone** multiple times. Point out how the truck icon moves dynamically along the Jebel Ali to Dubai South route on the map, and watch the milestones transition until the Proof of Delivery (POD) is uploaded.

### Phase 4: Invoice Audit & Reconciliation
10. Navigate to the **Invoices / Billing** page and select the completed trip.
11. Point out the **Margin Analytics card**: Shows a **300 AED margin** (1,500 AED revenue - 1,200 AED cost).
12. Click **Approve Customer Invoice** and **Approve Vendor Payment** to close the trip.

---

## 5. Technical Navigation Index

For developers extending the project, the core components are structured as follows:

* **State Store:** [store.js](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/store.js) — Manages reactive mock data lists and dispatch/milestone actions.
* **Layout Wrapper:** [MainLayout.vue](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/layouts/MainLayout.vue) — Generates the sidebar navigation layout dynamically based on the active role.
* **Style Sheet:** [main.css](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/assets/main.css) — Custom branding styles.
* **Views Index:**
  * **Admin:** [Dashboard](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/admin/dashboard/index.vue) | [Orders Pool](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/admin/orders/index.vue) | [Scheduling](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/admin/scheduling/index.vue) | [Control Tower](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/admin/control-tower/index.vue) | [Invoicing](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/admin/invoices/index.vue)
  * **Customer:** [Customer Dashboard](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/customer/dashboard/index.vue) | [Orders Tracking](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/customer/orders/index.vue)
  * **Vendor:** [Vendor Dashboard](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/vendor/dashboard/index.vue) | [Fleet Management](file:///home/viren-fero/Projects/POCs-with-AI/Excercise-01-Emirates-Logistics/frontend/src/pages/vendor/fleet/index.vue)

---

## 6. High-Level Modular Folder Structure & Entrypoint Architecture

The application is structured using an **encapsulated, feature-module architecture** designed to support scalability, maintainability, and domain isolation.

### 6.1 The Module Encapsulation & Entrypoint Pattern
Each page, role dashboard, or complex feature area in the app is treated as an independent, self-contained **Module**. The folder structure is designed around a strict set of architectural boundaries:

1. **Explicit Module Entry Point (`index.vue` / `index.js` / `index.ts`):**
   * Every module folder **MUST** contain a main entry point file named `index.vue` (for UI/page modules) or `index.js` / `index.ts` (for functional utility or shared business logic modules).
   * This index file serves as the **Public API / Contract** of the module. Any external consumer (such as the global router, layout wrappers, or other pages) should interact with the module solely through this index file.
   * *Rule:* Never bypass the module boundaries by deep-linking or importing internal component files from another module.

2. **Internal Scoping (Encapsulated Internals):**
   * All child components, helpers, local state, or custom stylesheets specific to a module must live **inside** that module's subdirectory (e.g., in a local `components/` sub-folder).
   * These local files are considered private implementation details. They must **never** be imported or used by files outside that module.
   * If a component or utility needs to be shared across multiple modules, it must be refactored and promoted to the global shared directories (such as `src/components/` or `src/utils/`).

3. **Routing and State Cleanliness:**
   * The global application router (`src/router.js`) resolves page modules by pointing explicitly to their entry point files (`index.vue`), maintaining a direct 1:1 mapping between route namespaces and module folder names.
   * Global state management (in `src/store.js`) maintains overall transactional records, while local module-specific UI state remains localized inside the module's parent `index.vue`.

---

### 6.2 Directory Tree Overview

```text
frontend/
├── index.html          # Entry HTML page
├── package.json        # NPM dependencies and project scripts
└── src/
    ├── main.js         # Global Vue configuration & PrimeVue component registration
    ├── App.vue          # Root component layout container
    ├── router.js       # App routes mapping module paths to view entrypoints
    ├── store.js        # Global reactive state engine & mock data collections
    ├── assets/
    │   ├── main.css    # Clean, Stripe-inspired layout stylesheets & color variables
    │   └── *.svg/*.png # Branded corporate logo icons & assets
    ├── layouts/
    │   └── MainLayout.vue # Header & role-based sidebar layout controller
    └── pages/          # Encapsulated role-based pages modules
        ├── LoginPage.vue # User entrance gateway
        ├── admin/      # Ops Administration Modules
        │   ├── dashboard/index.vue  # Operations control center
        │   ├── orders/              # Orders ledger view
        │   │   ├── index.vue        # Entry point
        │   │   └── components/      # Local dialog components
        │   ├── scheduling/index.vue # Dispatch & auto-allocation workspace
        │   ├── control-tower/       # Real-time tracking grid
        │   │   ├── index.vue        # Entry point
        │   │   └── components/      # Local map & timeline widgets
        │   └── invoices/index.vue   # Billing & settlements reconciliation board
        ├── customer/   # Customer portal views
        │   ├── dashboard/           # Booking intake dashboard
        │   │   ├── index.vue        # Entry point
        │   │   └── components/      # Local booking form inputs
        │   └── orders/              # Shipment tracking grid
        │       ├── index.vue        # Entry point
        │       └── components/      # Local tracking timeline widget
        └── vendor/     # Third-party vendor portal views
            ├── dashboard/index.vue  # Dispatch transit queue
            └── fleet/index.vue      # Carrier driver & truck registry panel
```
