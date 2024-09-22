import { IUserLogin, IUserReg } from "@/type/user"

const base_url = process.env.NEXT_PUBLIC_BASE_API_URL

export const regUser = async (data: IUserReg) => {
    const res = await fetch(`${base_url}/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type" : "application/json"
        }
    })
    const result = await res.json()
    return { result, ok: res.ok}

}

export const loginUser = async(data: IUserLogin) => {
    const res = await fetch(`${base_url}/users/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type" : "application/json"
        }
    })
    const result = await res.json()
    return { result, ok: res.ok} 
}

export const verifyUser = async (token: string) => {
    const res = await fetch(`${base_url}/users/verif`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const result = await res.json()
    return { result, ok: res.ok }
}