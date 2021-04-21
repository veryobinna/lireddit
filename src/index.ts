import "reflect-metadata";
import { MikroORM} from "@mikro-orm/core";
import express from "express";
import microConfig from "./mikro-orm.config"
import {ApolloServer} from  "apollo-server-express";
import { buildSchema } from "type-graphql";

import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";

const main = async () =>{
    const orm = await MikroORM.init(microConfig) //connect to db
    await orm.getMigrator().up(); // run migration

    const app = express()
    // app.get("/", (_, res)=>{
    //     res.send("Hello")
    // })
    const apolloServer = new ApolloServer({
        schema : await buildSchema({
            resolvers: [HelloResolver, PostResolver]
        }),
        context: () => ({em:orm.em})
    });

    apolloServer.applyMiddleware({app});
    app.listen(4000, ()=>{
        console.log("Server started on localhost")
    })
}
main().catch(function(err){
    console.error(err)
})
console.log("Heyy")