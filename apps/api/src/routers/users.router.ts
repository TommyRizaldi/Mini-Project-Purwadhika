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
        this.router.get('/', 
            verifyToken, //checkAdmin,
            this.userController.getUsers);
        this.router.post('/', validateRegister, this.userController.createUser);
        this.router.post('/login', this.userController.loginUser);
        this.router.get('/get-user', verifyToken, this.userController.getUserById);
        this.router.patch('/verif', verifyToken, this.userController.VerifUser)
    }

    getRouter(): Router {
        return this.router;
    }
}
