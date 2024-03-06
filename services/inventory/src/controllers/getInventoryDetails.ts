
import { Request, Response, NextFunction } from "express";
import prisma from  '@/prisma'
import { InventoryUpdateDTOSchema } from '@/schemas';

const getInventoryDetails = async(req: Request, res:Response, next:NextFunction)=>{
    try{

        //check if the inventory exists
        const {id}=req.params;
        const inventory = await prisma.inventory.findUnique({
            where: {id},
            include: {
                histories: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        
        if(!inventory){
            return res.status(404).json({message: "Inventory not found"})
        }

        return res.status(200).json(inventory)
    }catch(err){
        next(err)
    }
}

export default getInventoryDetails;