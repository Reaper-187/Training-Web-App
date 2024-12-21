import React, { useState, useContext } from 'react';
import './Login.css'
import 'material-symbols';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CheckAuthContext } from "../../CheckAuthContext";
import * as Yup from 'yup';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies
const register = import.meta.env.VITE_API_REGISTER
const login = import.meta.env.VITE_API_LOGIN

export const Login = () => {
  

  const { checkAuth } = useContext(CheckAuthContext);

  const [formSwitch, setFormSwitch] = useState("Login");

  // Validierungsschema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(7, 'Password must be at least 7 characters').required('Password is required'),
    name: formSwitch === "Registration" 
      ? Yup.string().required('Name is required') 
      : Yup.string().notRequired(),
  });

// Initialwerte für Login und Registrierung
  const registrationInitialValues = {
    name: '',
    email: '',
    password: '',
  };

  const loginInitialValues = {
    email: '',
    password: '',
  };

// Dynamisch initialisieren basierend auf `formSwitch`
const initialValues = formSwitch === "Registration" ? registrationInitialValues : loginInitialValues;

const navigate = useNavigate();

const handleSubmit = async (values, { setSubmitting }, isLogin) => {
  const url = isLogin ? login : register;

  try {
    const response = await axios.post(url, values); 
      if (response.data.success) {
      await checkAuth()
      navigate('/dashboard')
    } else {
      console.log("Fehler: Login nicht erfolgreich.");
    }
    } catch (error) {
      console.error('Fehler bei der Anfrage:', error.response.data);
      // console.error('Fehler bei der Anfrage:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="structure-form">
      <div className="login-form"></div>
      <div className="regist-form">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, { setSubmitting }, formSwitch === "Login"); // true für Login
            }}
          >

          {({ isSubmitting }) => (
            <Form className="client-data">
              <h1>{formSwitch}</h1>

              {formSwitch === "Registration" && (
                <div>
                  <Field type="text" id="name" name="name" placeholder="Enter Name" />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
              )}

              <div>
                <Field type="text" id="email" name="email" placeholder="Enter E-Mail" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div>
                <Field type="password" id="password" name="password" placeholder="Enter password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {formSwitch === "Login" ? "Login" : "Register"}
              </button>

              <a className="links-btn" onClick={() => setFormSwitch(formSwitch === "Login" ? "Registration" : "Login")}>
                {formSwitch === "Login" ? "Switch to Registration" : "Switch to Login"}
              </a>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
