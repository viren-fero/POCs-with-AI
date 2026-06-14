# Emirates Logistics TMS-V2 POC

A modern Transport Management System proof of concept for Emirates Logistics, focused on FTL and FCL movement workflows across operations, customers, and subcontracted vendors.

The application demonstrates how a centralized TMS can move an order from customer booking to vendor assignment, live trip tracking, milestone execution, and billing settlement.

## Live Demo

[Open Emirates Logistics TMS-V2 POC](https://pocs-with-ai.vercel.app/)

## Product Snapshot

**Client:** Emirates Logistics, Dubai  
**Domain:** Transport Management System  
**Scope:** Frontend proof of concept  
**Primary workflows:** Booking, trip scheduling, control tower tracking, billing settlement  
**Primary users:** Operations Admin, Customer, Vendor

## Key Capabilities

- **Operations Dashboard**
  - Executive KPIs with animated values.
  - Skeleton loading states for a polished first impression.
  - Movement mix, modality split, and revenue trend widgets.

- **Order Management**
  - FTL and FCL order pool.
  - Search, filters, status tracking, and detail drill-downs.
  - Simulated customer order creation.

- **Trip Scheduling**
  - Pending dispatch queue.
  - Vendor selection.
  - Automatic vehicle, driver, and vendor rate allocation.

- **Control Tower**
  - OpenStreetMap-based live tracking view.
  - Route line, hub pins, and moving trip marker.
  - Custom milestone timeline panel with progress state.

- **Billing & Settlement**
  - Customer invoice approval.
  - Vendor bill approval.
  - Margin calculation and reconciliation flow.

- **Customer Portal**
  - Booking portal with contract lane selection.
  - Automatic customer tariff preview.
  - Shipment tracking and invoice access.

- **Vendor Portal**
  - Trip execution queue.
  - Driver milestone simulation.
  - Fleet and driver registry.

## Tech Stack

- Vue 3 with `script setup`
- Vite
- Vue Router
- PrimeVue
- Chart.js
- OpenStreetMap raster tiles
- Local reactive store for POC data simulation

## Folder Structure

```text
Excercise-01-Emirates-Logistics/
├── POC-BRIEF.md
├── context.md
├── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── vercel.json
    └── src/
        ├── main.js
        ├── router.js
        ├── store.js
        ├── assets/
        ├── layouts/
        └── pages/
            ├── LoginPage.vue
            ├── admin/
            ├── customer/
            └── vendor/
```

## Run Locally

```bash
cd Excercise-01-Emirates-Logistics/frontend
npm install
npm run dev
```

Then open the local Vite URL, usually:

```text
http://localhost:5173/
```

## Build

```bash
cd Excercise-01-Emirates-Logistics/frontend
npm run build
```

## Preview Production Build

```bash
cd Excercise-01-Emirates-Logistics/frontend
npm run preview
```

## Vercel Deployment

The frontend includes `vercel.json` with an SPA rewrite:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents 404 errors when refreshing nested routes such as `/admin/dashboard` or `/customer/orders`.

If the Vercel project root is set to `frontend`, no additional rewrite file is needed. If the project root is one level above, copy or move the rewrite configuration to the actual Vercel root.

## Demo Flow

1. **Login**
   - Select a persona: Operations Admin, Customer Portal, or Vendor Portal.

2. **Customer Booking**
   - Open the Customer Portal.
   - Select movement type and contracted lane.
   - Confirm the booking after tariff preview.

3. **Trip Scheduling**
   - Switch to Operations Admin.
   - Open Trip Scheduling.
   - Select the pending order.
   - Assign a vendor and dispatch the trip.

4. **Control Tower**
   - Track the active trip on the OpenStreetMap control tower.
   - Advance milestones to simulate trip execution.

5. **Billing & Settlement**
   - Open Billing & Settlement.
   - Review margin.
   - Approve customer invoice and vendor bill.

6. **Vendor Execution**
   - Switch to Vendor Portal.
   - Review assigned trips and fleet details.

## Design Direction

The UI is intentionally built around the Emirates Logistics brand:

- Corporate navy: `#051258`
- Accent orange: `#FE9605`
- Neutral enterprise surfaces
- Light mode by default
- Consistent sidebar/page titles
- Compact operational widgets
- Skeleton loaders and animated dashboard metrics

## Important Notes

- This is a frontend POC, not a production TMS backend.
- Business logic is simulated in `frontend/src/store.js`.
- OpenStreetMap tiles require internet access in the browser.
- Milestone updates and trip movement are simulated.
- Invoice and bill approvals update local reactive state only.

## Related Documents

- [POC Brief](./POC-BRIEF.md)
- [Project Context & Demo Guide](./context.md)
- [Frontend Source](./frontend)
