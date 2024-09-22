// src/components/RegisterForm.tsx

"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const RegisterSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  referralCode: yup.string().optional(), // Optional referral code
});

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/register", values);
      toast.success(response.data.msg);
      // Optionally reset the form or navigate
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create an Account</h2>
        <Formik
          initialValues={{ username: "", name: "", email: "", password: "", referralCode: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                <div className="mt-2">
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    aria-label="Username"
                    className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <div className="mt-2">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    aria-label="Name"
                    className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>
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
              <div className="mb-6">
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300">Referral Code (Optional)</label>
                <div className="mt-2">
                  <Field
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    aria-label="Referral Code"
                    className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter referral code (if any)"
                  />
                  <ErrorMessage name="referralCode" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>
              <button 
                type="submit" 
                className={`w-full p-3 text-sm font-medium text-white rounded-md ${loading ? 'bg-gray-600' : 'bg-orange-500 hover:bg-orange-600'} transition duration-200`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <div className="mt-6 text-center">
                <Link href="/login">
                  <div className="text-sm text-indigo-400 hover:underline">Already have an account? Login</div>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
