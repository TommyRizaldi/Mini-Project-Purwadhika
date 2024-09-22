import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { transporter } from "@/helpers/nodemailer";
import path from "path";
import fs from 'fs'
import handlebars from "handlebars";

export class UserController {
    async createUser(req: Request, res: Response) {
        const { username, name, email, password, referralCode } = req.body;
    
        // Input validation
        if (!username || !name || !email || !password) {
            return res.status(400).send({
                status: 'error',
                msg: 'All fields except referralCode are required'
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
        try {
            const transaction = await prisma.$transaction(async (prisma) => {
                // Create the user
                const user = await prisma.user.create({
                    data: {
                        Username: username,
                        Name: name,
                        Email: email,
                        Password: hashedPassword,
                        Type: 'Customer',
                        Status: 'Inactive',
                        ReferralCode: newReferralCode,
                        SumPointAmount: 0,
                        CountOfTransId: 0
                    }
                });

                const payload = { id: user.UserId }
                const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' })
    
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
    
                    // Ensure the referrer exists
                    const referrer = await prisma.user.findUnique({
                        where: { UserId: referrerId }
                    });
    
                    if (!referrer) {
                        throw new Error('Referrer does not exist');
                    }

                    const expireDate = new Date();
                    expireDate.setMonth(expireDate.getMonth() + 3);
                    
                    // console.log("Referrer ID:", referrerId);
                    // console.log("New User ID:", user.UserId);
                    // Record that the referral code has been used
                    await prisma.referralUsed.create({
                        data: {
                            ReferralCode: referralCode,
                            UsedDate: new Date(),
                            UsedBy: user.UserId // Use UserId here as well
                        }
                    });
                    
                    // Add points to the referrer
                    await prisma.pointsTrx.create({
                        data: {
                            UserId: referrerId,
                            ReferralCode: referralCode,
                            AddedDate: new Date(),
                            AddedBy: user.UserId, // Use UserId here
                            ExpireDate: expireDate,
                            PointAmount: 10000
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
                            SumPointAmount: totalPoints._sum.PointAmount || 0
                        }
                    });
                }
                const templatePath = path.join(__dirname, "../template", "verification.hbs")
                const templateSource = fs.readFileSync(templatePath, 'utf-8')
                const compiledTemplate = handlebars.compile(templateSource)
                const html = compiledTemplate({
                    name: user.Name,
                    link: `http://localhost:3000/verif/${token}`
                })
                // Send confirmation email
                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: user.Email,
                    subject: 'Welcome!',
                    html: html
                });
    
                return user; // Return the created user
            });
    
            // Handle successful response
            res.status(201).send({
                status: 'ok',
                msg: 'User created successfully!',
                user: transaction
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
    
            // Fetch the user by email
            const user = await prisma.user.findUnique({
                where: { Email: email }
            });
    
            // Check if user exists and is active
            if (!user) throw "User not found!";
            if (user.Status !== 'Active') throw "User is not active!";
    
            // Verify the password
            const isValidPassword = await compare(password, user.Password);
            if (!isValidPassword) throw "Incorrect password!";
    
            // // Generate a JWT token
            const payload = { id: user.UserId };
            const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });
    
            res.status(200).send({
                status: 'ok',
                msg: "Login successful!",
                token,
                user: user
            });
        } catch (err) {
            res.status(400).send({
                status: 'error',
                msg: err
            })
            console.log(err);
            
        }
    }
    
    async VerifUser(req: Request, res: Response) {
        try {
            // Fetch the user based on the ID from the request
            const user = await prisma.user.findUnique({
                where: { UserId: req.user?.id }  // Assuming 'UserId' is the identifier
            });
    
            // Check if the user was found and if the status is inactive
            if (!user || user.Status !== 'Inactive') {
                return res.status(400).send({
                    status: 'error'
                    // msg: "User is either not found or already verified."
                });
            }
    
            // Update the user's status to 'Active' (or true)
            await prisma.user.update({
                where: { UserId: req.user?.id }, // Use the correct user ID
                data: { Status: 'Active' } // Assuming you have defined 'Active' as a status
            });
    
            // Send success response
            res.status(200).send({
                status: 'ok',
                msg: "Successfully verified the author!"
            });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).send({
                status: 'error',
                msg: "An error occurred during verification."
            });
        }
    }
    

    // async verifyUser(req: Request, res: Response) {
    //     try {
    //         const { UserId } = req.body;
    
    //         // Fetch the user by UserId
    //         const user = await prisma.user.findUnique({
    //             where: { UserId }
    //         });
    
    //         // Check if user exists and is already active
    //         if (!user) throw "User not found!";
    //         if (user.Status === 'Active') throw "User already verified!";
    
    //         // Update user status to active
    //         await prisma.user.update({
    //             where: { UserId },
    //             data: { Status: 'Active' }
    //         });
    
    //         res.status(200).send({
    //             status: 'ok',
    //             msg: "User verified successfully!"
    //         });
    //     } catch (err) {
    //         res.status(400).send({
    //             status: 'error',
    //             msg: err || 'An error occurred'
    //         });
    //     }
    // }
    

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

    async logout(req: Request, res: Response) {
        try {
          res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.LOGOUT === "private",
            sameSite: 'strict',
          });
    
        } catch (err) {
          res.status(400).send({
            status: 'error',
            msg: err instanceof Error ? err.message : 'logout process terminated',
          });
        }
      }

    // Example method for generating a referral code
    // private generateReferralCode(): string {
    //     return Math.random().toString(36).substring(2, 10).toUpperCase();
    // }
}