import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import {useRouter} from "next/router"

interface registerProps {

}
const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String!){
    register(options:{username:$username, password: $password}){
      errors{
        field,
        message
      },
      user{
        id,
        createdAt,
        username,
      }
      
    }
  }`


export const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values);
                    if(response.data?.register.errors){
                        console.log(response.data?.register.errors)
                        setErrors(toErrorMap(response.data.register.errors));
                    }else if(response.data.register.user){
                        router.push("/")
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <div>hello</div>
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
                             register
                         </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>

    )
}

export default Register;
