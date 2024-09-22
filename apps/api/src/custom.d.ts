type User = {
    id: string,
    type: string
}

declare namespace Express {
    export interface Request {
        user?: User
    }
}