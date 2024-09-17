import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import path from "path";
import fs from 'fs';
import handlebars from "handlebars";
import { transporter } from "@/helpers/nodemailer";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const { username, name, email, password } = req.body;
    
            // Input validation
            if (!username || !name || !email || !password) {
                return res.status(400).send({
                    status: 'error',
                    msg: 'All fields are required'
                });
            }
    
            // Check if the email already exists
            const existingUser = await prisma.user.findUnique({
                where: { Email: email }
            });
    
            if (existingUser) {
                return res.status(400).send({
                    status: 'error',
                    msg: 'Email is already in use'
                });
            }
    
            // Hash the password
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);

            // Calling referralcode
            // const referralcode = this.generateReferralCode()
    
            // Create the user
            const user = await prisma.user.create({
                data: {
                    Username: username,
                    Name: name,
                    Email: email,
                    Password: hashedPassword, // Store hashed password
                    Status: 'ACTIVE', // Default status; adjust as needed
                    ReferralCode: Math.random().toString(36).substring(2, 10).toUpperCase(), // Assuming this method exists
                    SumPointAmount: 0,
                    CountOfTransId: 0
                }
            });
    
            res.status(201).send({
                status: 'ok',
                msg: 'User created successfully!',
                user
            });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).send({
                status: 'error',
                msg: 'An error occurred while creating the user'
            });
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { Email: email }
            });

            if (!user) throw new Error("User not found!");
            if (user.Status !== 'ACTIVE') throw new Error("User is not active!");

            const isValidPassword = await compare(password, user.Password);

            if (!isValidPassword) throw new Error("Incorrect password!");

            const payload = { id: user.UserId };
            const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

            res.status(200).send({
                status: 'ok',
                msg: "Login successful!",
                token,
                user
            });
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err || 'An error occurred'
            });
        }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { UserId: req.body.UserId }
            });

            if (!user) throw new Error("User not found!");
            if (user.Status === 'ACTIVE') throw new Error("User already verified!");

            await prisma.user.update({
                where: { UserId: req.body.UserId },
                data: { Status: 'ACTIVE' } // Adjust based on your schema
            });

            res.status(200).send({
                status: 'ok',
                msg: "User verified successfully!"
            });
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err || 'An error occurred'
            });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.status(200).send({
                status: 'ok',
                users
            });
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err || 'An error occurred'
            });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { UserId: req.params.id }
            });

            if (!user) throw new Error("User not found!");

            res.status(200).send({
                status: 'ok',
                user
            });
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err || 'An error occurred'
            });
        }
    }

    // Example method for generating a referral code
    // private generateReferralCode(): string {
    //     return Math.random().toString(36).substring(2, 10).toUpperCase();
    // }
}
