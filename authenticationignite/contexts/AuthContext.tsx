import { type } from 'os';
import { createContext, ReactNode, useEffect, useState } from 'react';
import Router from 'next/router';
import { api } from '../services/api';
import {setCookie,parseCookies,destroyCookie} from 'nookies';

type SignInCredentials = {
    email:string;
    password:string;
   
}
type AuthContextData = {
    signIn(credentials):Promise<void>;
    isAuthenticated:boolean;
    user:User;
};

type AuthProviderProps  = {
    children: ReactNode;
}

type User = {
    email:string;
    permissions:string[];
    roles:string[];
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut ()  {
destroyCookie(undefined,'nexauth.token')
destroyCookie(undefined,'nextauth.refreshToken')

Router.push('/')

}

export function AuthProvider ({children}:AuthProviderProps){
    const [user,setUser] = useState<User>()
    const isAuthenticated = !!user;


useEffect(()=> {
    const {'nextauth.token':token} = parseCookies()

    if (token) {
        api.get('/me').then(response => {
            const { email, permissions, roles} = response.data
            setUser({email,permissions,roles})
        }).catch(()=> {
            signOut()
        })
    }
},[])

    async function signIn({email,password}:SignInCredentials) {
        try {
        const response = await api.post('sessions', {
            email,
            password
        })

        const {token,refreshToken,permissions,roles} = response.data
        setCookie(undefined,'nextauth.token',token, {
            maxAge:60*60*24*30, // 30days
            path:'/'
        })
        
        setCookie(undefined,'nextauth.refreshToken',refreshToken,{
            maxAge:60*60*24*30, // 30days
            path:'/'
        })

        setUser({
            email,
            permissions,

            roles
        })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard')

    } catch (err) {
        console.log(err)
    }
     
    }

    return(

        <AuthContext.Provider value ={{ signIn ,isAuthenticated,user}}>
            {children}
        </AuthContext.Provider>
    )
}