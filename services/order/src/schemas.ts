import { z } from "zod";
export const OrderCreateDTOSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  cartSessionId: z.string(),
});

export const CartItemDTOSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  inventoryId: z.string(),
});
