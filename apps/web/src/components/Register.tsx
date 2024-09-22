"use client"; // Mark this component as a Client Component

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Ensure these are imported
import { IUserReg } from "@/type/user";
import { regUser } from "@/lib/user";
import { log } from "console";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const RegisterSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  referralCode: yup.string().optional(), // Optional referral code
});

export default function RegisterForm () {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter()

  const handleRegister = async (data : IUserReg, action : FormikHelpers<IUserReg>) => {
    setLoading(false);
    try {
        const {result, ok} = await regUser(data)
        if (!ok) throw result.msg
        toast.success(result.msg)
        action.resetForm()
        router.push('/login');
    //   const response = await axios.post("http://localhost:8000/api/createuser", values);
    //   toast.success(response.data.msg);
    //   // Optionally reset the form or navigate
    //   const {} = await  
    } catch (err) {
      toast.error(err as string)
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create an Account</h2>
        <Formik
          initialValues={{ username: "", name: "", email: "", password: "", referralCode: "", Status: "", SumPointAmount: "", pointsTrx: ""  }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your username"
                />
                <ErrorMessage name="username" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
              </div>

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
                    type={showPassword ? "text" : "password"}
                    className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300">Referral Code (Optional)</label>
                <Field
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  className="block w-full rounded-md border-0 p-3 text-white bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter referral code (if any)"
                />
                <ErrorMessage name="referralCode" component="div" className="text-sm text-red-500 mt-1" />
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
