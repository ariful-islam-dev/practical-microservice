import { z } from "zod";

export const CartItemDTOSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  inventoryId: z.string(),
});
