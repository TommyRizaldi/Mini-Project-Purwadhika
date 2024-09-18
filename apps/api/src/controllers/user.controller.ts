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
        const { username, name, email, password, referralCode } = req.body;
    
        // Input validation
        if (!username || !name || !email || !password) {
            return res.status(400).send({
                status: 'error',
                msg: 'All fields are required'
            });
        }
    
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
    
        // Generate a new referral code for the user
        const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
        // Start transaction
        const transaction = await prisma.$transaction(async (prisma) => {
            // Create the user
            const user = await prisma.user.create({
                data: {
                    Username: username,
                    Name: name,
                    Email: email,
                    Password: hashedPassword,
                    Type: 'Customer',
                    Status: 'Active',
                    ReferralCode: newReferralCode,
                    SumPointAmount: 0,
                    CountOfTransId: 0
                }
            });
    
            // Create a new referral record for the user
            await prisma.referral.create({
                data: {
                    ReferralCode: newReferralCode,
                    UserId: user.UserId,
                    CountUsed: 0,
                    CreateDate: new Date(),
                    Status: 'ACTIVE'
                }
            });
    
            // If a referral code is provided, process the referral
            if (referralCode) {
                const referral = await prisma.referral.findFirst({
                    where: { ReferralCode: referralCode }
                });
    
                if (!referral) {
                    throw new Error('Invalid referral code');
                }
    
                const referrerId = referral.UserId;
                const usedBy = user.UserId;
    
                const expireDate = new Date();
                expireDate.setMonth(expireDate.getMonth() + 3);
    
                // Add points to the referrer
                await prisma.pointsTrx.create({
                    data: {
                        UserId: referrerId,
                        ReferralCode: referralCode,
                        AddedDate: new Date(),
                        AddedBy: usedBy,
                        ExpireDate: expireDate,
                        PointAmount: 10000
                    }
                });
    
                // Record that the referral code has been used
                await prisma.referralUsed.create({
                    data: {
                        ReferralCode: referralCode,
                        UsedDate: new Date(),
                        UsedBy: usedBy
                    }
                });
    
                // Increment the count of how many times the referral has been used
                await prisma.referral.update({
                    where: { ReferralId: referral.ReferralId },
                    data: {
                        CountUsed: { increment: 1 }
                    }
                });

                 // Update SumPointAmount for the referrer
                 const totalPoints = await prisma.pointsTrx.aggregate({
                    _sum: {
                        PointAmount: true
                    },
                    where: {
                        UserId: referrerId
                    }
                });

                await prisma.user.update({
                    where: { UserId: referrerId },
                    data: {
                        SumPointAmount: totalPoints._sum.PointAmount || 0 // Update SumPointAmount
                    }
                });
            }
    
            return user; // Return the created user
        });
    
        // Handle response
        res.status(201).send({
            status: 'ok',
            msg: 'User created successfully!',
            user: transaction
        });
        
        // Catch errors
        try {
            await transaction;
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
    
            // Fetch the user by email
            const user = await prisma.user.findUnique({
                where: { Email: email }
            });
    
            // Check if user exists and is active
            if (!user) throw new Error("User not found!");
            if (user.Status !== 'Active') throw new Error("User is not active!");
    
            // Verify the password
            const isValidPassword = await compare(password, user.Password);
            if (!isValidPassword) throw new Error("Incorrect password!");
    
            // Generate a JWT token
            const payload = { id: user.UserId };
            const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });
    
            res.status(200).send({
                status: 'ok',
                msg: "Login successful!",
                token,
                user: {
                    UserId: user.UserId,
                    Username: user.Username,
                    Name: user.Name,
                    Email: user.Email,
                    Type: user.Type,
                    SumPointAmount: user.SumPointAmount,
                    CountOfTransId: user.CountOfTransId,
                    ReferralCode: user.ReferralCode,
                    Status: user.Status
                }
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
            const { UserId } = req.body;
    
            // Fetch the user by UserId
            const user = await prisma.user.findUnique({
                where: { UserId }
            });
    
            // Check if user exists and is already active
            if (!user) throw new Error("User not found!");
            if (user.Status === 'Active') throw new Error("User already verified!");
    
            // Update user status to active
            await prisma.user.update({
                where: { UserId },
                data: { Status: 'Active' }
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
