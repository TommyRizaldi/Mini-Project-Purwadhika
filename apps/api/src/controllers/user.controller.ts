import prisma from "@/prisma"
import { Request, Response } from "express"

export const authUser = () => {
    
}

export class UsersController {
    async getUsers(req: Request, res: Response) {
        try {
            const Users = await prisma.user.findMany()
            res.status(200).send({
                status: 'ok',
                Users
            })
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err
            })
        }
    }

    async createUsers(req: Request, res: Response) {
        try {
            
        } catch (error) {
            
        }
    }
}