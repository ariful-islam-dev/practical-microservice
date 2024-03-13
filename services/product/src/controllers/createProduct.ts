
import { Request, Response, NextFunction } from "express";
import prisma from  '@/prisma';
import axios from 'axios';
import { ProductCreateDTOSchema } from '@/schemas';
import { INVENTORY_URL } from "@/config";

const createProduct = async(req: Request, res:Response, next:NextFunction)=>{
    try{
        // validate Request body
        const parsedBody = ProductCreateDTOSchema.safeParse(req.body);
        if(!parsedBody.success){
            return res
            .status(400)
            .json({error: parsedBody.error.errors, message: "Invalid request body"});
        }

        // check if product with the same sku already exists
        const existingProduct = await prisma.product.findFirst({
            where: {
                sku: parsedBody.data.sku
            }
        })
        if(existingProduct){
            return res 
                .status(400)
                .json({message: "Product the same sku already exists"})
        }

        // Create Product
        const product = await prisma.product.create({
            data: parsedBody.data,
        })
        console.log("Product created successfully", product.id)

        // Create Inventory record for the product
        const {data: inventory}= await axios.post(
            `${INVENTORY_URL}/inventories`,
            {
                productId: product.id,
                sku: product.sku
            }
        );
        console.log("Inventory created successfully", inventory.id);

        // update product and store inventory id
         await prisma.product.update({
            where: {id: product.id},
            data: {
                inventoryId: inventory.id
            }
         });

         console.log("Product updated successfully with inventory id", inventory.id)

        return res.status(201).json({...product, inventoryId: inventory.id})
    }catch(err){
        next(err)
    }
}

export default createProduct;