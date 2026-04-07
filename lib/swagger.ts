import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FarmPOS API',
      version: '1.0.0',
      description:
        'REST API for the Farm / Pet Shop Point-of-Sale system. ' +
        'Currently backed by in-memory mock data; structured for future migration to .NET microservices.',
      contact: { name: 'FarmPOS Team' },
    },
    servers: [{ url: '/api', description: 'Next.js API Routes' }],
    tags: [
      { name: 'Products', description: 'Product catalogue management' },
      { name: 'Orders', description: 'Sales orders' },
      { name: 'Customers', description: 'Customer records' },
      { name: 'Inventory', description: 'Stock levels' },
      { name: 'Reports', description: 'Sales analytics' },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'prod_001' },
            name: { type: 'string', example: 'Premium Dog Food 5kg' },
            sku: { type: 'string', example: 'PF-DOG-001' },
            category: { type: 'string', enum: ['Pet Food','Pet Accessories','Farm Supplies','Livestock Feed','Veterinary','Seeds & Plants','Tools & Equipment','Other'] },
            price: { type: 'number', example: 24.99 },
            costPrice: { type: 'number', example: 14.00 },
            stock: { type: 'integer', example: 45 },
            lowStockThreshold: { type: 'integer', example: 10 },
            description: { type: 'string' },
            tenantId: { type: 'string', example: 'default' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string', example: 'ORD-20250401-120001' },
            customerId: { type: 'string' },
            customerName: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            subtotal: { type: 'number' },
            tax: { type: 'number' },
            taxRate: { type: 'number' },
            discount: { type: 'number' },
            total: { type: 'number' },
            paymentMethod: { type: 'string', enum: ['cash','card','mixed'] },
            amountPaid: { type: 'number' },
            change: { type: 'number' },
            status: { type: 'string', enum: ['pending','paid','cancelled'] },
            notes: { type: 'string' },
            tenantId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            productName: { type: 'string' },
            sku: { type: 'string' },
            quantity: { type: 'integer' },
            unitPrice: { type: 'number' },
            discount: { type: 'number' },
            subtotal: { type: 'number' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Alice Farmer' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            loyaltyPoints: { type: 'integer' },
            totalSpent: { type: 'number' },
            orderCount: { type: 'integer' },
            tenantId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        InventoryItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            productName: { type: 'string' },
            sku: { type: 'string' },
            currentStock: { type: 'integer' },
            reservedStock: { type: 'integer' },
            availableStock: { type: 'integer' },
            lowStockThreshold: { type: 'integer' },
            lastRestocked: { type: 'string', format: 'date-time' },
            tenantId: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./app/api/**/*.ts'],
};

let cachedSpec: ReturnType<typeof swaggerJsdoc> | null = null;

export function getSwaggerSpec() {
  if (!cachedSpec) {
    cachedSpec = swaggerJsdoc(options);
  }
  return cachedSpec;
}
