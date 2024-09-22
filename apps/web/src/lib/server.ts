'use server'

import { cookies } from 'next/headers'

export async function createToken(token: string) {
    const oneDay = 24 * 60 * 60; // Expires in seconds
    cookies().set('token', token, {
        maxAge: oneDay, // Use maxAge for expiration
        path: '/', // Make the cookie available throughout the site
        httpOnly: true, // Prevent client-side access
        secure: process.env.NODE_ENV === 'production' // Secure in production
    });
}

export async function getToken () {
    return cookies().get('token')?.value
}

export async function deleteToken () {
    return cookies().delete('token')
}