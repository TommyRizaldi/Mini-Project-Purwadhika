import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface IUser {
    id: number;
    type: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser; 
        }
    }
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token:', token);

        if (!token) throw new Error('Token not found');

        const verifiedToken = verify(token, process.env.SECRET_JWT!) as IUser;
        req.user = verifiedToken; 
        next();
    } catch (err) {
        res.status(400).send({
            status: 'This token is invalid',
            msg: err instanceof Error ? err.message : err,
        });
    }
};

export const checkAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user || req.user.type !== 'Organizer') {
            throw new Error('You are not an Organizer');
        }
        next();
    } catch (err) {
        res.status(403).send({ 
            status: 'Not authorized',
            msg: err,
        });
    }
};
