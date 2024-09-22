"use client"; // Mark this component as a Client Component

import { loginUser } from '@/lib/user';
import { createToken } from "@/lib/server";
import { useAppDispatch } from "@/redux/hooks";
import { loginAction } from "@/redux/slice/userSlice";
import { IUserLogin } from '@/type/user';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from 'yup';
import Link from 'next/link';

const LoginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password required"),
});

export default function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const onLogin = async (data: IUserLogin, action: FormikHelpers<IUserLogin>) => {
        try {
            const { result, ok } = await loginUser(data);
            console.log(result); // Inspect the result structure
            if (!ok) throw result.msg;
    
            // if (!result.User) throw "User data is not available."; // Check if User is present
    
            toast.success(result.msg);
            action.resetForm();
    
            // // Prepare the payload for the Redux action
            // const userPayload = {
            //     UserId: result.User.UserId,
            //     Username: result.User.Username,
            //     Name: result.User.Name,
            //     Email: result.User.Email,
            //     Type: result.User.Type,
            // };
    
            // dispatch(loginAction(userPayload)); // Dispatch login action
            createToken(result.token); // Create token
            router.push('/profile'); // Redirect to profile page
        } catch (err) {
            console.error(err);
            const errorMessage = typeof err === 'string' ? err : "An unexpected error occurred.";
            toast.error(errorMessage); // Show error message
        }
    };
    

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-lg w-full">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back!</h2>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={(values, actions) => onLogin(values, actions)}
                >
                    {() => (
                        <Form>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                                    placeholder="Enter your email"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                <div className="mt-2 relative">
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                                        placeholder="Enter your password"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-3 text-sm font-medium text-white rounded-md bg-orange-500 hover:bg-orange-600 transition duration-200"
                            >
                                Login
                            </button>

                            <div className="mt-6 text-center">
                                <Link href="/register">
                                    <div className="text-sm text-indigo-400 hover:underline">Don't have an account? Sign up</div>
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
