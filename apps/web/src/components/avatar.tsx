'use client'

import { deleteToken, getToken } from "@/lib/server"
import { useAppSelector } from "@/redux/hooks"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AvatarComp() {
    const [token, setToken] = useState('')
    const getData = async () => {
        const res = await getToken()
        setToken(res || '')
    }
    const User = useAppSelector((state) => state.User)
    console.log(User);
    const onLogout = async () => {
        await deleteToken()
        setToken('')
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            {
                token ? 
                // <div onClick={onLogout} className="cursor-pointer">Log Out</div> 
                <div className="flex gap-2 cursor-pointer" onClick={onLogout}>
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                    </div>
                    <div>
                        <div>{User.Name}</div>
                        <div className="text-[14px]">{User.Email}</div>
                    </div>
                </div>
                    :
                <div className="flex gap-4">
                    <Link href={'/register'}>Register</Link>
                    <Link href={'/login'}>Login</Link>
                </div> 
        }
        </div>
    )
}