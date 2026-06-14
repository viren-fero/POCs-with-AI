import { reactive } from 'vue';

// Predefined Lanes
export const LANES = [
  { origin: 'Jebel Ali Port (Dubai)', destination: 'Dubai South Warehouse (Dubai)', type: 'FCL', label: 'Jebel Ali Port to Dubai South (FCL)' },
  { origin: 'Jebel Ali Port (Dubai)', destination: 'JAFZA Zone 1 (Dubai)', type: 'FCL', label: 'Jebel Ali Port to JAFZA (FCL)' },
  { origin: 'Dubai Industrial City (Dubai)', destination: 'Abu Dhabi Industrial Zone (Abu Dhabi)', type: 'FTL', label: 'Dubai to Abu Dhabi Industrial (FTL)' },
  { origin: 'Abu Dhabi Port (Abu Dhabi)', destination: 'Jebel Ali Port (Dubai)', type: 'FCL', label: 'Abu Dhabi Port to Jebel Ali Port (FCL)' },
  { origin: 'Dubai Logistics City (Dubai)', destination: 'Sharjah Warehouse Zone (Sharjah)', type: 'FTL', label: 'Dubai to Sharjah (FTL)' }
];

export const store = reactive({
  currentUser: 'admin', // 'admin', 'customer', 'vendor'
  selectedCustomerName: 'Al-Futtaim Logistics',
  selectedVendorName: 'FastTrans Logistics',

  // Customer Contract Rates
  customerContracts: [
    { customer: 'Al-Futtaim Logistics', origin: 'Jebel Ali Port (Dubai)', destination: 'Dubai South Warehouse (Dubai)', type: 'FCL', rate: 1500 },
    { customer: 'Al-Futtaim Logistics', origin: 'Jebel Ali Port (Dubai)', destination: 'JAFZA Zone 1 (Dubai)', type: 'FCL', rate: 1100 },
    { customer: 'Al-Futtaim Logistics', origin: 'Dubai Industrial City (Dubai)', destination: 'Abu Dhabi Industrial Zone (Abu Dhabi)', type: 'FTL', rate: 1800 },
    { customer: 'Al-Futtaim Logistics', origin: 'Abu Dhabi Port (Abu Dhabi)', destination: 'Jebel Ali Port (Dubai)', type: 'FCL', rate: 2200 },
    { customer: 'Al-Futtaim Logistics', origin: 'Dubai Logistics City (Dubai)', destination: 'Sharjah Warehouse Zone (Sharjah)', type: 'FTL', rate: 1300 }
  ],

  // Vendor Contract Rates
  vendorContracts: [
    { vendor: 'FastTrans Logistics', origin: 'Jebel Ali Port (Dubai)', destination: 'Dubai South Warehouse (Dubai)', type: 'FCL', rate: 1200 },
    { vendor: 'FastTrans Logistics', origin: 'Jebel Ali Port (Dubai)', destination: 'JAFZA Zone 1 (Dubai)', type: 'FCL', rate: 900 },
    { vendor: 'FastTrans Logistics', origin: 'Dubai Industrial City (Dubai)', destination: 'Abu Dhabi Industrial Zone (Abu Dhabi)', type: 'FTL', rate: 1450 },
    { vendor: 'FastTrans Logistics', origin: 'Abu Dhabi Port (Abu Dhabi)', destination: 'Jebel Ali Port (Dubai)', type: 'FCL', rate: 1850 },
    { vendor: 'FastTrans Logistics', origin: 'Dubai Logistics City (Dubai)', destination: 'Sharjah Warehouse Zone (Sharjah)', type: 'FTL', rate: 1000 },

    { vendor: 'SwiftHaul Transport', origin: 'Jebel Ali Port (Dubai)', destination: 'Dubai South Warehouse (Dubai)', type: 'FCL', rate: 1250 },
    { vendor: 'SwiftHaul Transport', origin: 'Jebel Ali Port (Dubai)', destination: 'JAFZA Zone 1 (Dubai)', type: 'FCL', rate: 950 },
    { vendor: 'SwiftHaul Transport', origin: 'Dubai Industrial City (Dubai)', destination: 'Abu Dhabi Industrial Zone (Abu Dhabi)', type: 'FTL', rate: 1500 },
    { vendor: 'SwiftHaul Transport', origin: 'Abu Dhabi Port (Abu Dhabi)', destination: 'Jebel Ali Port (Dubai)', type: 'FCL', rate: 1800 },
    { vendor: 'SwiftHaul Transport', origin: 'Dubai Logistics City (Dubai)', destination: 'Sharjah Warehouse Zone (Sharjah)', type: 'FTL', rate: 1050 }
  ],

  // Subcontractor Fleet Assets (For Auto-Allocation)
  vendorsFleet: {
    'FastTrans Logistics': {
      drivers: ['Sajid Khan', 'Zafar Iqbal', 'Ramesh Kumar'],
      vehicles: ['DXB-T-98765 (Volvo FH16 FCL)', 'DXB-T-12345 (Scania R450 FTL)', 'DXB-T-33445 (Mercedes Actros FCL)'],
      defaultDriver: 'Sajid Khan',
      defaultVehicle: 'DXB-T-98765 (Volvo FH16 FCL)'
    },
    'SwiftHaul Transport': {
      drivers: ['Amir Bhatti', 'Kamran Akmal', 'Santhosh Nair'],
      vehicles: ['AUH-T-54321 (Mercedes Actros FCL)', 'SHJ-T-67890 (Volvo FMX FTL)', 'AUH-T-11223 (Scania Container Hauler)'],
      defaultDriver: 'Amir Bhatti',
      defaultVehicle: 'AUH-T-54321 (Mercedes Actros FCL)'
    }
  },

  // Active Orders in the System
  orders: [
    {
      id: 'ORD-2026-001',
      customer: 'Al-Futtaim Logistics',
      origin: 'Jebel Ali Port (Dubai)',
      destination: 'Dubai South Warehouse (Dubai)',
      type: 'FCL',
      rate: 1500,
      status: 'Pending Dispatch',
      date: '2026-06-15',
      vendor: null,
      vehicle: null,
      driver: null,
      vendorRate: null,
      milestones: [],
      currentMilestoneIndex: -1,
      progress: 0,
      customerInvoiceApproved: false,
      vendorBillApproved: false
    },
    {
      id: 'ORD-2026-002',
      customer: 'Al-Futtaim Logistics',
      origin: 'Dubai Industrial City (Dubai)',
      destination: 'Abu Dhabi Industrial Zone (Abu Dhabi)',
      type: 'FTL',
      rate: 1800,
      status: 'Dispatched',
      date: '2026-06-14',
      vendor: 'FastTrans Logistics',
      vehicle: 'DXB-T-12345 (Scania R450 FTL)',
      driver: 'Zafar Iqbal',
      vendorRate: 1450,
      milestones: [
        { name: 'Arrived at Pickup', time: '10:00 AM', completed: true },
        { name: 'Loading Completed', time: '11:30 AM', completed: true },
        { name: 'Departed from Pickup', time: '12:00 PM', completed: true },
        { name: 'Arrived at Drop', time: 'Pending', completed: false },
        { name: 'POD Uploaded', time: 'Pending', completed: false }
      ],
      currentMilestoneIndex: 2,
      progress: 60,
      customerInvoiceApproved: false,
      vendorBillApproved: false
    },
    {
      id: 'ORD-2026-003',
      customer: 'Al-Futtaim Logistics',
      origin: 'Abu Dhabi Port (Abu Dhabi)',
      destination: 'Jebel Ali Port (Dubai)',
      type: 'FCL',
      rate: 2200,
      status: 'Completed',
      date: '2026-06-13',
      vendor: 'SwiftHaul Transport',
      vehicle: 'AUH-T-54321 (Mercedes Actros FCL)',
      driver: 'Amir Bhatti',
      vendorRate: 1800,
      milestones: [
        { name: 'Arrived at Pickup', time: '08:30 AM', completed: true },
        { name: 'Loading Completed', time: '09:45 AM', completed: true },
        { name: 'Departed from Pickup', time: '10:00 AM', completed: true },
        { name: 'Arrived at Drop', time: '12:30 PM', completed: true },
        { name: 'POD Uploaded', time: '01:00 PM', completed: true }
      ],
      currentMilestoneIndex: 4,
      progress: 100,
      customerInvoiceApproved: true,
      vendorBillApproved: true
    }
  ],

  // Actions
  addOrder(origin, destination, type, date) {
    // Calculate customer rate from contract
    const contract = this.customerContracts.find(
      c => c.customer === this.selectedCustomerName &&
           c.origin === origin &&
           c.destination === destination &&
           c.type === type
    );
    const rate = contract ? contract.rate : 1600; // default rate if not explicitly contracted

    const newOrder = {
      id: `ORD-2026-0${this.orders.length + 1}`,
      customer: this.selectedCustomerName,
      origin,
      destination,
      type,
      rate,
      status: 'Pending Dispatch',
      date,
      vendor: null,
      vehicle: null,
      driver: null,
      vendorRate: null,
      milestones: [],
      currentMilestoneIndex: -1,
      progress: 0,
      customerInvoiceApproved: false,
      vendorBillApproved: false
    };

    this.orders.unshift(newOrder);
    return newOrder;
  },

  dispatchOrder(orderId, vendorName) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    // Find vendor rate
    const contract = this.vendorContracts.find(
      c => c.vendor === vendorName &&
           c.origin === order.origin &&
           c.destination === order.destination &&
           c.type === order.type
    );
    const vendorRate = contract ? contract.rate : 1200;

    // Auto-allocate driver & vehicle
    const fleet = this.vendorsFleet[vendorName];
    const driver = fleet ? fleet.defaultDriver : 'Default Driver';
    const vehicle = fleet ? fleet.defaultVehicle : 'Default Vehicle';

    order.status = 'Dispatched';
    order.vendor = vendorName;
    order.vendorRate = vendorRate;
    order.driver = driver;
    order.vehicle = vehicle;
    order.progress = 10;
    order.currentMilestoneIndex = 0;
    order.milestones = [
      { name: 'Arrived at Pickup', time: 'Pending', completed: false },
      { name: 'Loading Completed', time: 'Pending', completed: false },
      { name: 'Departed from Pickup', time: 'Pending', completed: false },
      { name: 'Arrived at Drop', time: 'Pending', completed: false },
      { name: 'POD Uploaded', time: 'Pending', completed: false }
    ];
  },

  advanceMilestone(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'Dispatched') return;

    const milestones = ['Arrived at Pickup', 'Loading Completed', 'Departed from Pickup', 'Arrived at Drop', 'POD Uploaded'];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (order.currentMilestoneIndex < milestones.length - 1) {
      order.currentMilestoneIndex++;
      order.milestones[order.currentMilestoneIndex].completed = true;
      order.milestones[order.currentMilestoneIndex].time = now;
      order.progress = Math.min(100, Math.floor(((order.currentMilestoneIndex + 1) / milestones.length) * 100));

      if (order.currentMilestoneIndex === milestones.length - 1) {
        order.status = 'Completed';
      }
    }
  },

  approveInvoice(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) order.customerInvoiceApproved = true;
  },

  approveBill(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) order.vendorBillApproved = true;
  },

  isDarkMode: false,
  toggleTheme() {
    store.isDarkMode = !store.isDarkMode;
    const root = document.documentElement;
    if (store.isDarkMode) {
      root.classList.add('p-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('p-dark');
      localStorage.setItem('theme', 'light');
    }
  }
});

// Initialize theme on app load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  store.isDarkMode = isDark;
  if (isDark) {
    document.documentElement.classList.add('p-dark');
  } else {
    document.documentElement.classList.remove('p-dark');
  }
}
