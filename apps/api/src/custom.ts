type user = {
    id: number,
    type: string
}

declare namespace Express {
    export interface Request {
        user?: user
    }
}