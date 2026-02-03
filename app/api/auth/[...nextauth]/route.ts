import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import {prisma} from "@/lib/prisma"
import { adapter } from "next/dist/server/web/adapter";
import { signIn } from "next-auth/react";

export const authOptions={
    adapter:PrismaAdapter(prisma),
    providers:[
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session:{
        strategy:"database",
    },

    pages:{
        signIn:"/"
    },

    secret:process.env.NEXTAUTH_SECRET,
}

const handler=NextAuth(authOptions)

export {handler as GET,handler as POST};