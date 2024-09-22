import { ReactNode } from "react"

export interface IUserReg {
    pointsTrx: any
    Status: ReactNode
    SumPointAmount: ReactNode
    username : string
    name : string
    email : string
    password : string
    refferalcode? : string
}

export interface IUserLogin {
    email : string
    password : string
}

export interface IUserState {
    UserId: String
    Username: String
    Name: String
    Email: String
    Type: String
}