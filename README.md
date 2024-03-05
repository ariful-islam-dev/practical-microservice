# Practical Microservice

## Use Technologies
- [x] NodeJS = Programming & Coding
- [x] Postgresql = Database
- [x] Redis = Catch
- [x] Kong = API GETWAY
- [x] Rabbit MQ = Message Broker
- [x] Key Cloak = Authentication Service Maintains


## Services
- [x] <b>Auth</b>
  - [ ] Creating new users
  - [ ] Authentication
  - [ ] Account Verification
  - [ ] Password Recovery
  - [ ] Roles & Permission
- [x] <b>User</b>
  - [ ] Managing user profile information
  - [ ] A new user profile will be created upon registration
  - [ ] Auth service call this service to create a new user profile
- [x] <b>Catalog</b>
  - [ ] Create products
  - [ ] Create Inventory
  - [ ] Fetch all products
  - [ ] Fetch product details with available stocks
  - [ ] Update and delete products
- [x] <b>Inventory</b>
  - [ ] Maintain Inventory of products
  - [ ] Manage stock histories
- [x] <b>Cart</b>
  - [ ] Create cart for both authenticated and anonymous users
  - [ ] Update inventory
  - [ ] Hold stocks for 10-15 minutes
  - [ ] Release stocks automatically after 10-15 minutes
- [x] <b>Order</b>
  - [ ] Creating new orders
  - [ ] Invoke email service
  - [ ] Invoke caret service to clear the cart
  - [ ] Invoke inventory service to update stock and create a history
  - [ ] Invoke user service to create a record
- [x] <b>Email</b>
  - [ ] Send email with given payloads
  - [ ] Store history of the email
  
## Foder Structure
```

├── Services
|  ├── auth      
|  ├── Catalog
|  ├── Inventory
|  |
├── Api-gateway 
|  |  └── package.json
├── .gitignore          
├── docker-compose.yaml      
└── README.md

```

## Tools 
1. <b>Docker</b>
   1. Redis
   2. RabbitMQ
   3. Kong
2. <b>PostgreSQL</b>
   1. Prisma
3. <b>TypeScript</b>

