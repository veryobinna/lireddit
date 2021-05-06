import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';
import {useRouter} from "next/router"
import { useMutation } from "urql"

interface registerProps {

}
const LOGIN_MUT = `mutation Login($username: String!, $password:String!){
    login(options:{username:$username, password:$password}){
      user{
        id,
        username
      },
      errors{
        field,
        message
      }
    }
  }`

export const Login: React.FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [re, login] = useMutation(LOGIN_MUT)
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values)
                    const response = await login(values);
                    console.log("trhe result",re)
                    if(response.data?.login.errors){
                        console.log(response.data?.login.errors)
                        setErrors(toErrorMap(response.data.login.errors));
                    }else if(response.data.login.user){
                        router.push("/")
                    }
                }}
                
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField 
                            name="username"
                            placeholder="username"
                            label="Username"
                         />
                         <Box mt={4}>
                         <InputField 
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                         />
                         </Box>
                         <Button 
                             mt={4} 
                             type="submit" 
                             colorScheme="teal"
                             isLoading={isSubmitting}
                             >
                             login
                         </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>

    )
}

export default Login;
