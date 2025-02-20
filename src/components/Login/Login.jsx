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
import gymPic from '../../assets/img/form-banner-1.jpg'


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

  // Dynamisch initialisieren basierend auf formSwitch
  const initialValues = formSwitch === "Registration" ? registrationInitialValues : loginInitialValues;

  console.log("Initial Values:", initialValues);

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }, isLogin) => {
    const url = isLogin ? login : register;

    try {
      const response = await axios.post(url, values);
      if (response.data.success) {
        console.log("CheckAuth aufgerufen.");
        await checkAuth();
        console.log("Weiterleitung zum Dashboard..."); // Debugging
        navigate('/dashboard');
      } else {
        console.log("Fehler: Login nicht erfolgreich.");
      }
    } catch (error) {
      // Prüfe, ob der Fehler die erwartete Struktur hat
      if (error.response) {
        console.error('Fehler bei der Anfrage:', error.response.data);
      } else {
        console.error('Fehler ohne response:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className={formSwitch === "Login" ? 'form-container login-form' : 'form-container regist-form'}>
      {/* <div ></div> */}
      {/* <div className="form-container"> */}

      <img src={gymPic} alt="" className="form-banner" />

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
              <div className="input-container">
                <Field type="text" id="name" name="name" required />
                <div className='lable-line'>Enter your Name</div>
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>
            )}

            <div className="input-container">
              <Field type="text" id="email" name="email" required />
              <div className='lable-line'>Enter your E-Mail</div>
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="input-container">
              <Field type="password" id="password" name="password" required />
              <div className='lable-line'>Enter your password</div>
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
      {/* </div> */}
    </div>
  );
};
