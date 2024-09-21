"use client";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link'; // Adjust import if you're not using Next.js

const LoginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password required"),
});

export default function LoginForm() {
    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={LoginSchema}
            onSubmit={(values, actions) => {
                // Handle login submission here
                console.log(values);
                actions.setSubmitting(false);
            }}
        >
            {() => (
                <Form>
                    <div className="min-w-[30vw]">
                        <div className="mt-10">
                            <label className="block text-sm font-medium leading-8 text-white">Email</label>
                            <div className="mt-2">
                                <Field
                                    name="email"
                                    type="text"
                                    className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-8 text-white">Password</label>
                            <div className="mt-2">
                                <Field
                                    name="password"
                                    type="password"
                                    className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500">
                            Login
                        </button>
                        <div className="mt-4 flex justify-between">
                            <Link href="/forgot-password">
                                <div className="text-sm text-indigo-400 hover:underline">Forgot Password?</div>
                            </Link>
                            <Link href="/register">
                                <div className="text-sm text-indigo-400 hover:underline">Register</div>
                            </Link>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
