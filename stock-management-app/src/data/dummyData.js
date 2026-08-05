export const initialCategories = [
  { id: 'cat-1', name: 'Electronics', description: 'Gadgets, devices and accessories', status: 'Active' },
  { id: 'cat-2', name: 'Apparel', description: 'Clothing, shoes and garments', status: 'Active' },
  { id: 'cat-3', name: 'Office Supplies', description: 'Stationery, paper and desks', status: 'Active' },
  { id: 'cat-4', name: 'Home & Kitchen', description: 'Kitchenware, small appliances', status: 'Active' },
];

export const initialSuppliers = [
  { id: 'sup-1', name: 'John Doe', company: 'Global Tech Dist', phone: '+1234567890', email: 'john@globaltech.com', address: '123 Tech Lane', city: 'San Jose', state: 'CA', country: 'USA' },
  { id: 'sup-2', name: 'Sarah Connor', company: 'Apex Garments', phone: '+1987654321', email: 'sarah@apex.com', address: '456 Fashion Ave', city: 'New York', state: 'NY', country: 'USA' },
  { id: 'sup-3', name: 'Robert Vance', company: 'Vance Refrigeration', phone: '+15550199', email: 'robert@vance.com', address: '1725 Slough Ave', city: 'Scranton', state: 'PA', country: 'USA' },
];

export const initialCustomers = [
  { id: 'cust-1', name: 'Alice Smith', phone: '+14442221', email: 'alice@gmail.com', address: '789 Elm St, Boston, MA' },
  { id: 'cust-2', name: 'Bob Johnson', phone: '+14442222', email: 'bob@gmail.com', address: '321 Oak Rd, Seattle, WA' },
  { id: 'cust-3', name: 'Charlie Brown', phone: '+14442223', email: 'charlie@gmail.com', address: '456 Pine Ln, Austin, TX' },
];

export const initialProducts = [
  {
    id: 'prod-1',
    name: 'Wireless Mouse',
    sku: 'EL-MOU-01',
    category: 'Electronics',
    supplier: 'Global Tech Dist',
    purchasePrice: 15.00,
    sellingPrice: 29.99,
    quantity: 45,
    minStock: 10,
    brand: 'LogiTech',
    unit: 'pcs',
    description: 'Ergonomic 2.4GHz wireless mouse with optical tracking.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=60',
    location: 'Aisle 4, Shelf B-2'
  },
  {
    id: 'prod-2',
    name: 'Cotton T-Shirt',
    sku: 'AP-TSH-02',
    category: 'Apparel',
    supplier: 'Apex Garments',
    purchasePrice: 5.50,
    sellingPrice: 14.99,
    quantity: 120,
    minStock: 20,
    brand: 'H&M',
    unit: 'pcs',
    description: '100% organic cotton basic t-shirt in black.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=60',
    location: 'Row 2, Bin A'
  },
  {
    id: 'prod-3',
    name: 'Gel Pen Box',
    sku: 'OS-PEN-03',
    category: 'Office Supplies',
    supplier: 'Global Tech Dist',
    purchasePrice: 3.00,
    sellingPrice: 7.50,
    quantity: 8,
    minStock: 15,
    brand: 'Pilot',
    unit: 'box',
    description: 'Box of 12 black ink retractable gel pens.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=150&auto=format&fit=crop&q=60',
    location: 'Shelf C-12'
  },
  {
    id: 'prod-4',
    name: 'Bluetooth Headphones',
    sku: 'EL-HDP-04',
    category: 'Electronics',
    supplier: 'Global Tech Dist',
    purchasePrice: 40.00,
    sellingPrice: 89.99,
    quantity: 0,
    minStock: 5,
    brand: 'Sony',
    unit: 'pcs',
    description: 'Noise cancelling over-ear bluetooth headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60',
    location: 'Aisle 4, Shelf A-1'
  },
  {
    id: 'prod-5',
    name: 'Stainless Steel Kettle',
    sku: 'HK-KET-05',
    category: 'Home & Kitchen',
    supplier: 'Vance Refrigeration',
    purchasePrice: 18.00,
    sellingPrice: 35.00,
    quantity: 25,
    minStock: 8,
    brand: 'Hamilton Beach',
    unit: 'pcs',
    description: '1.7 Liter electric kettle with auto shut-off.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=60',
    location: 'Aisle 1, Shelf D-4'
  }
];

export const initialSales = [
  {
    id: 'sale-1',
    customer: 'Alice Smith',
    product: 'Wireless Mouse',
    productId: 'prod-1',
    quantity: 2,
    sellingPrice: 29.99,
    discount: 5.00,
    gst: 18,
    paymentMethod: 'Card',
    date: '2026-07-14T10:30:00Z',
    invoiceNo: 'INV-2026-001',
    total: 58.98
  },
  {
    id: 'sale-2',
    customer: 'Bob Johnson',
    product: 'Stainless Steel Kettle',
    productId: 'prod-5',
    quantity: 1,
    sellingPrice: 35.00,
    discount: 0.00,
    gst: 18,
    paymentMethod: 'UPI',
    date: '2026-07-15T09:15:00Z',
    invoiceNo: 'INV-2026-002',
    total: 41.30
  }
];

export const initialPurchases = [
  {
    id: 'pur-1',
    supplier: 'Global Tech Dist',
    product: 'Wireless Mouse',
    productId: 'prod-1',
    quantity: 50,
    purchasePrice: 15.00,
    discount: 25.00,
    date: '2026-07-10T14:00:00Z',
    total: 725.00
  },
  {
    id: 'pur-2',
    supplier: 'Vance Refrigeration',
    product: 'Stainless Steel Kettle',
    productId: 'prod-5',
    quantity: 30,
    purchasePrice: 18.00,
    discount: 0.00,
    date: '2026-07-12T11:45:00Z',
    total: 540.00
  }
];

export const initialOrders = [
  { id: 'ord-101', date: '2026-07-15', customer: 'Alice Smith', amount: 58.98, status: 'Delivered' },
  { id: 'ord-102', date: '2026-07-15', customer: 'Bob Johnson', amount: 41.30, status: 'Pending' },
  { id: 'ord-103', date: '2026-07-14', customer: 'Charlie Brown', amount: 89.99, status: 'Packed' },
  { id: 'ord-104', date: '2026-07-13', customer: 'Alice Smith', amount: 150.00, status: 'Cancelled' },
  { id: 'ord-105', date: '2026-07-12', customer: 'Bob Johnson', amount: 220.50, status: 'Confirmed' }
];

export const initialNotifications = [
  { id: 'not-1', title: 'Low Stock Alert', message: 'Gel Pen Box quantity is below minimum stock level.', type: 'warning', date: '2026-07-15T11:00:00Z', read: false },
  { id: 'not-2', title: 'Out of Stock Alert', message: 'Bluetooth Headphones is completely out of stock.', type: 'danger', date: '2026-07-15T09:45:00Z', read: false },
  { id: 'not-3', title: 'New Sale Recorded', message: 'Sale of Stainless Steel Kettle to Bob Johnson completed.', type: 'success', date: '2026-07-15T09:15:00Z', read: true },
  { id: 'not-4', title: 'Inventory Replenished', message: 'Purchase order of 50 Wireless Mouse items completed.', type: 'info', date: '2026-07-10T14:00:00Z', read: true }
];
