import { UserController } from "@/controllers/user.controller";
import { Router } from "express";


export class UserRouters {
    private router: Router
    private userController: UserController

    constructor() {
        this.userController = new UserController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/', this.userController.getUsers);
        this.router.post('/', this.userController.createUser);
        this.router.post('/login', this.userController.loginUser);
        this.router.post('/verify', this.userController.verifyUser);
        this.router.get('/:id', this.userController.getUserById);
    }

    getRouter(): Router {
        return this.router
    }
}