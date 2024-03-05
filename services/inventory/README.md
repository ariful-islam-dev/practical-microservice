# Inventory Service

## Third Party Libraries

- [x] Express
- [x] Cors
- [x] dotenv = Environment
- [x] morgan = View Log
- [x] zod = Validation

## Third Party Typescript Libraries (For Dev Dependencies)

- [x] typescript
- [ ] tsc
- [ ] ts-node-dev
- [ ] tsc-alias
- [ ] tsconfig-paths
- [ ] @types/express
- [ ] @types/node
- [ ] @types/corse
- [ ] prisma
- [ ] @prisma/client

```Run this Command
    npx prisma init --datasource-provider postgresql
```

## Endpoints

- [x] POST/inventories - Create a new inventory
- [x] PUT/inventories/:id - Update inventory
- [x] GET/inventories/:id - Fetch inventory
- [x] GET/inventories/:id/details - Fetch inventory details
