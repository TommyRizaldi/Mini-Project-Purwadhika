// src/components/RegisterForm.tsx

"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

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
    <Formik
      initialValues={{ username: "", name: "", email: "", password: "", referralCode: "" }}
      validationSchema={RegisterSchema}
      onSubmit={handleRegister}
    >
      {() => (
        <Form>
        <div className=" min-w-[30vw]">
            <div>
                <label className="block text-sm font-medium leading-8 text-white">Username</label>
                <div className="mt-2">
                    <Field name="password" type="password" className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <ErrorMessage name="password" component={"div"} className="text-sm text-red-500"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-8 text-white">Name</label>
                <div className="mt-2">
                    <Field name="password" type="password" className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <ErrorMessage name="password" component={"div"} className="text-sm text-red-500"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-8 text-white">Email</label>
                <div className="mt-2">
                    <Field name="email" type="text" className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <ErrorMessage name="email" component={"div"} className="text-sm text-red-500"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-8 text-white">Password</label>
                <div className="mt-2">
                    <Field name="password" type="password" className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <ErrorMessage name="password" component={"div"} className="text-sm text-red-500"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-8 text-white">Referral Code</label>
                <div className="mt-2">
                    <Field name="password" type="password" className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <ErrorMessage name="password" component={"div"} className="text-sm text-red-500"/>
                </div>
            </div>
                <button type="submit" className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500 ">Register</button>
            </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
