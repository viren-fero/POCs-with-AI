# POC Brief — Emirates Logistics - TMS

**Prepared by:** Product Team  
**Client:** Emirates Logistics (Dubai, UAE)  
**Type:** Proof of Concept — for stakeholder validation & client demo  

---

## 1. Background

Emirates Logistics is a premier supply chain and logistics provider headquartered in Dubai, UAE, managing extensive warehousing, freight forwarding, and domestic/cross-border transport networks across the GCC.

Currently, transport planning, contracting, and execution are coordinated manually or via legacy spreadsheets. To achieve operational excellence, reduce transport costs, improve asset utilization, and provide real-time visibility, Emirates Logistics is transitioning to a centralized Transport Management System (TMS-V2). This platform will connect customers, operations, and third-party vendors (subcontractors) in a unified ecosystem focusing on FTL (Full Truckload) and FCL (Full Containerload) logistics.

## 2. Objective

Deliver a focused proof-of-concept for the Emirates Logistics TMS-V2 platform. The POC must showcase the end-to-end transport lifecycle—covering contract rate management (both customer and vendor), order placement (FTL and FCL), direct vendor assignment with auto-allocation of vehicle/driver assets, real-time milestone tracking on a Control Tower map, and automated billing/invoicing.

This POC will demonstrate how Emirates Logistics can streamline dispatching, automate contract rate matching, and offer clean, dedicated dashboards for clients and subcontractors.

## 3. Users

| Role | Description |
|------|-------------|
| **Admin (Operations Admin)** | Manages customer and vendor contracts, handles FTL/FCL orders, dispatches trips to vendors, monitors operations on the Control Tower, and reviews invoices. |
| **Customer** | Places FTL and FCL orders, tracks shipment progress, and views digital invoices. |
| **Vendor (Subcontractor)** | Manages subcontractor driver and vehicle assets, views assigned trips, and monitors payment records. |

## 4. Functional Scope

The TMS-V2 POC covers the following core areas:

- **Dashboard**: Operational control board offering high-level KPIs (order volumes, active/completed trips, vehicle/driver utilization, financial summary) with filters for date and branch.
- **Order Management**: Supports two main cargo movement categories:
  - **FTL (Full Truckload)**: Heavy-duty single-point to single-point road transport.
  - **FCL (Full Containerload)**: Containerized sea-port haulage (e.g., Jebel Ali Port to inland destinations).
- **Rate & Contract Management**:
  - **Customer Contracts**: Lane-based pricing tariffs for client billing.
  - **Vendor Contracts**: Lane-based pricing tariffs for subcontractor payouts.
  - **Auto-Tariff Matching**: Automatic lookup and calculation of baseline costs for both client and vendor upon order setup.
- **Vendor Assignment & Auto-Allocation**:
  - Ops Admin assigns a contracted Vendor directly to an order.
  - Upon vendor selection, the system automatically allocates the Vendor's default **Vehicle** and **Driver** mapped to that lane.
- **Trip Scheduling & Planning**:
  - Automatically schedules FTL/FCL orders into trips upon vendor assignment.
  - Enforces automatic safety checklist clearance.
- **Control Tower & Live Tracking**:
  - Map-based visualization of active trips, vehicle locations, and route lines.
  - Real-time milestone updates (*Arrived at Pickup*, *Loading*, *Departed*, *Arrived at Drop*, *POD Uploaded*).
- **Billing & Invoicing**:
  - **Customer Invoice**: Automatically generated based on the active Customer Contract lane rate.
  - **Vendor Bill**: Automatically generated based on the active Vendor Contract lane rate.

## 5. Demo Scenario

A representative end-to-end journey to walk stakeholders through the TMS-V2 capabilities:

**Phase 1: Order Creation (Customer Portal)**
1. A **Customer** logs in, specifies origin/destination, cargo details, and places a new FCL order (e.g., Jebel Ali Port to Dubai South Warehouse).
2. The system automatically matches the order against the active **Customer Contract** to calculate the client tariff (e.g., 1,500 AED).

**Phase 2: Dispatch & Auto-Allocation (Admin)**
3. The **Admin** views the new order and selects a contracted **Vendor** (e.g., FastTrans Logistics) from the eligible partners dropdown.
4. The system automatically allocates FastTrans's default **Vehicle** and **Driver** to the trip.
5. The system automatically matches the order against FastTrans's **Vendor Contract** to calculate the subcontractor cost (e.g., 1,200 AED).

**Phase 3: Scheduling & Execution (Admin)**
6. The **Admin** schedules the trip, confirming the auto-allocated driver and vehicle.
7. The trip is dispatched, triggering real-time GPS simulation in the background.

**Phase 4: Live Execution & Control Tower (Admin)**
8. The system simulates milestone progression along the route:
   - *Arrived at Pickup* -> *Loading* -> *Departed* -> *Arrived at Drop* -> *POD Uploaded*.
9. The **Admin** tracks the vehicle's position live on the **Control Tower** map.

**Phase 5: Financial Settlement (Admin)**
10. The trip finishes upon POD upload.
11. In the **Billing** module, the **Admin** audits and approves the auto-generated **Customer Invoice** (1,500 AED) and the **Vendor Bill** (1,200 AED).

## 6. In Scope / Out of Scope

**In Scope:**
- Frontend Vue 3 application covering Admin, Customer, and Vendor portals.
- Core FTL & FCL order creation, detail views, and lists.
- Customer and Vendor Contract lane rate configuration and automatic pricing engine.
- Direct vendor dispatch with auto-allocation of default vehicle and driver.
- Control Tower map visualization and simulated milestone tracking.
- Automatic invoice generation.

**Out of Scope (For Future Phases):**
- Multi-drop / LTL distribution routes (no stop-level tasks or complex leg structures).
- RFQ Bidding Portal (subcontracting is handled directly via contract assignment).
- Mobile driver app (all milestones are simulated in the system backend).
- Real GPS/telematics hardware and external ERP (SAP) integrations.
- Live payment gateways.

## 7. Notes & Assumptions

- Dubai, Jebel Ali Port, and GCC lanes are the primary geographic focus.
- Base currency is set to AED (United Arab Emirates Dirham).
- Pre-commit hooks are configured to maintain formatting and linting standards across the codebase.

## 8. Success Criteria

- Successful execution of the 5-phase demo scenario without errors.
- Correct auto-tariff calculations for both Customer Invoice (1,500 AED) and Vendor Bill (1,200 AED).
- Control Tower map pins move and update status dynamically based on simulated milestones.
- Role-based permissions function correctly across the Admin, Customer, and Vendor interfaces.
