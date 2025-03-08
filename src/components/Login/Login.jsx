import React, { useState, useContext } from 'react';
import './Login.css'
import 'material-symbols';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CheckAuthContext } from "../../CheckAuthContext";
import * as Yup from 'yup';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import loginPic from '../../assets/img/loginPic.png'
import gymPic from '../../assets/img/registerPic.jpg'
import { passwordVisiblity } from './passwordVisiblity';
import { ForgotPasswordForm } from '../Reset-Password/ForgotPasswordForm';

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies
const register = import.meta.env.VITE_API_REGISTER
const login = import.meta.env.VITE_API_LOGIN


export const Login = () => {

  const { inputType, Icon } = passwordVisiblity()

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

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values, { setSubmitting }, isLogin) => {
    setServerError("");
    try {
      const url = isLogin ? login : register;
      const response = await axios.post(url, values, { withCredentials: true });

      if (response.data.success) {
        if (isLogin) {
          await checkAuth();
          navigate('/dashboard');
        } else {
          setServerError(response.data.message || "Registrierung erfolgreich! Bitte überprüfe deine E-Mails.");
        }
      } else {
        setServerError(response.data.message || "Ein Fehler ist aufgetreten.");
      }
    } catch (error) {
      console.error("Fehler:", error.response?.data || error.message);
      setServerError(error.response?.data?.message || "Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={formSwitch === "Login" ? 'form-container login-form' : 'form-container regist-form'}>
      <div className="form-banner">
        <img src={formSwitch === "Login" ? loginPic : gymPic} alt="Form Banner" />
      </div>

      {formSwitch === "ForgotPassword" ? (
        <ForgotPasswordForm onBackToLogin={() => setFormSwitch("Login")} />
      ) : (
        <Formik
          initialValues={formSwitch === "Registration" ? registrationInitialValues : loginInitialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, { setSubmitting }, formSwitch === "Login");
          }}
        >
          {({ isSubmitting }) => (
            <Form className="client-data">
              <h1>{formSwitch}</h1>

              {formSwitch === "Registration" && (
                <div className="input-container">
                  <Field type="text" id="name" name="name" required />
                  <div className='lable-line'>Enter your Name</div>
                  <br />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
              )}

              <div className="input-container">
                <Field type="text" id="email" name="email" required />
                <div className='lable-line'>Enter your E-Mail</div>
                <br />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="input-container">
                <Field type={inputType} id="password" name="password" required />
                <div className='lable-line'>Enter your password</div> 
                <span className='show-password'> {Icon} </span>
                <br />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {serverError && <div className={serverError.includes("erfolgreich") ? "info-message" : "error-message"}>
                {serverError}
              </div>}

              <div className="box-3">
                <button type="submit" className="btn btn-three" disabled={isSubmitting}>
                  <span>{formSwitch === "Login" ? "Login" : "Register"}</span>
                </button>
              </div>

              <div className="box-3">
                <button type="button" className="btn btn-three" onClick={() => setFormSwitch(formSwitch === "Login" ? "Registration" : "Login")}>
                  <span>{formSwitch === "Login" ? "Switch to Registration" : "Switch to Login"}</span>
                </button>
              </div>

              {formSwitch === "Login" && (
                <p onClick={() => setFormSwitch("ForgotPassword")} className="forgot-password">
                  Forgot password ?
                </p>
              )}
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};