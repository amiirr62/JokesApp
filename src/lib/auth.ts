import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "#/db"; // your drizzle instance
import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
import * as schema from "#/db/schema"
 


export const auth = betterAuth({
  //...
    emailAndPassword: { 
    enabled: true, 
    requireEmailVerification:false,
  }, 
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema,
    
}),
plugins: [tanstackStartCookies()],// make sure this is the last plugin in the array
});