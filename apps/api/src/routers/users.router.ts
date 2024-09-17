import { UsersController } from "@/controllers/user.controller";
import { Router } from "express";


export class UserRouters {
    private router: Router
    private userController: UsersController

    constructor() {
        this.userController = new UsersController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/', this.userController.getUsers)
    }

    getRouter(): Router {
        return this.router
    }
}