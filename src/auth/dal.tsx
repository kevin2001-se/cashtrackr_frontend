import 'server-only' // Indicamos que este codigo solo se quede en el servidor, ya que a veces viaja al cliente
// DATE ACCESS LAYER
import { cache } from "react";
import { redirect } from "next/navigation";
import { UserSchema } from "../schemas";
import getToken from './token';

// cache: Nos permite reutilizar la función si los datos no cambiaron
export const verifySession = cache( async () => {
    const token = getToken();
    
    if (!token) {
        redirect('/auth/login')
    }

    // Revisar la validez del token
    const url = `${process.env.API_URL}/auth/user`
    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const session = await req.json();

    const result = UserSchema.safeParse(session);

    if (!result.success) {
        redirect('/auth/login')
    }

    return {
        user: result.data,
        isAuth: true
    }
} )