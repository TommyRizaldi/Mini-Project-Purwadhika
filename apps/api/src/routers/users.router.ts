import { UserController } from "@/controllers/user.controller";
import { checkAdmin, verifyToken } from "@/middlewares/token";
import { uploader } from "../middlewares/uploader";
import { validateRegister } from "../middlewares/validator";
import { Router } from "express";

export class UserRouter {
    private router: Router;
    private userController: UserController;

    constructor() {
        this.userController = new UserController();
        console.log(this.userController); // Check if this is not undefined
        this.router = Router();
        this.initializeRoutes();
    }
    

    private initializeRoutes(): void {
        // Get all users (Admin only)
        this.router.get('/', 
            verifyToken, checkAdmin,
            this.userController.getUsers);

        // Register a new user
        this.router.post('/', this.userController.createUser);

        // User login
        this.router.post('/login', this.userController.loginUser);

        // Get user by ID
        this.router.get('/get-user', verifyToken, this.userController.getUserById);
    }

    getRouter(): Router {
        return this.router;
    }
}
