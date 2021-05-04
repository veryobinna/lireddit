import "reflect-metadata";
import { MikroORM} from "@mikro-orm/core";
import express from "express";
import microConfig from "./mikro-orm.config"
import {ApolloServer} from  "apollo-server-express";
import { buildSchema } from "type-graphql";

import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/user";

import redis from "redis";
import session from "express-session";
import connectRediss from "connect-redis";
import { PROD } from "./constants";
import cors from "cors";

const main = async () =>{
    const orm = await MikroORM.init(microConfig) //connect to db
    await orm.getMigrator().up(); // run migration

    const app = express()
    // app.get("/", (_, res)=>{
    //     res.send("Hello")
    // })

    const RedisStore = connectRediss(session)
    const redisClient = redis.createClient()
    app.use(cors({
        origin:"http://localhost:3000",
        credentials:true
    }))
    app.use(
        session({
            name:"qide",
            store: new RedisStore({ 
                client: redisClient,
                disableTouch:true,
            }),
            cookie:{
                maxAge: 1000*60*60*24*365*10, //10 years
                httpOnly: true,
                sameSite: "lax",
                secure: PROD //cookie only works inn https
            },
            saveUninitialized: false,
            secret: 'keyboardranndomcat',
            resave: false,

        })
    )

    const apolloServer = new ApolloServer({
        schema : await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver]
        }),
        context: ({req, res}) => ({em:orm.em, req, res})
    });

    apolloServer.applyMiddleware({
        app,
        cors:false
    });
    app.listen(4000, ()=>{
        console.log("Server started on localhost")
    })
}
main().catch(function(err){
    console.error(err)
})
console.log("Heyy")