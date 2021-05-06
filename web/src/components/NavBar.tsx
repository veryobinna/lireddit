import { Box, Button, Flex, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useMeQuery } from "../generated/graphql"

interface NavBar {}
export const NavBar:React.FC<NavBar> = ()=>{
    const [meResult, me] = useMeQuery()
    let body;
    console.log('me data',meResult.data)
    
    if(meResult.fetching){
        body = null
    }else if(meResult.data.me == null){
        console.log(meResult.data.me)
        console.log("this should hit")
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>
                    login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">
                    register
                    </Link>
                </NextLink>
            </>
            
        )
    }else{
        body = (
            <Flex color="white">
                <Box>{meResult.data.me.user.username}</Box>
                <Box ml={2}>
                    <Button variant="link" >
                        logout
                    </Button >
                </Box>
            </Flex>
            )
    }
    return(
        <Flex bg="tomato">
        <Box ml={"auto"} p={4} >
            {body}
        </Box>
        </Flex>
    )
}