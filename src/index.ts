import { MikroORM} from "@mikro-orm/core";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config"

const main = async () =>{
    const orm = await MikroORM.init(microConfig) //connect to db
    await orm.getMigrator().up(); // run migration
    // const post = orm.em.create(Post, {title:"my first post"})
    // await orm.em.persistAndFlush(post)
    const posts = await orm.em.find(Post, {})
    console.log(posts)
}
main().catch(function(err){
    console.error(err)
})
console.log("Heyy")