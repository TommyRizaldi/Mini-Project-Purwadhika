"use client";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { useState } from 'react';

const LoginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password required"),
});

export default function LoginForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-lg w-full">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back !</h2>
                <Formik
                    initialValues={{
                        email: "",
                        password: ""
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={(values, actions) => {
                        setIsSubmitting(true);
                        // Simulate an async login submission
                        setTimeout(() => {
                            console.log(values);
                            actions.setSubmitting(false);
                            setIsSubmitting(false);
                            // Handle success or failure here (e.g., redirect or show a message)
                        }, 1000);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <div className="mt-2">
                                    <Field
                                        id="email"
                                        name="email"
                                        type="text"
                                        aria-label="Email"
                                        className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                <div className="mt-2">
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        aria-label="Password"
                                        className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                                        placeholder="Enter your password"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className={`w-full p-3 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-gray-600' : 'bg-orange-500 hover:bg-orange-600'} transition duration-200`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="mt-6 flex justify-between">
                                <Link href="/forgot-password">
                                    <div className="text-sm text-indigo-400 hover:underline">Forgot Password?</div>
                                </Link>
                                <Link href="/register">
                                    <div className="text-sm text-indigo-400 hover:underline">Register</div>
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
