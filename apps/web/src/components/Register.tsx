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
          <div>
            <h2>Register</h2>
            <div>
              <label>Username</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" />
            </div>
            <div>
              <label>Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label>Email</label>
              <Field name="email" type="text" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label>Password</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <label>Referral Code (optional)</label>
              <Field name="referralCode" type="text" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
