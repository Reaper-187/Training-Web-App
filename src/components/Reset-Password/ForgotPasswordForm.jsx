import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useState } from "react";
import './reset-form.css';

const ONETIMEOTP = import.meta.env.VITE_API_ONETIMEOTP;
const VERIFYOTP = import.meta.env.VITE_API_VERIFYOTP;
const RESETUPW = import.meta.env.VITE_API_RESETUPW;

export const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [serverMessage, setServerMessage] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); 
  const [isCodeVerified, setIsCodeVerified] = useState(false); 
  const [email, setEmail] = useState(""); 
  const [resetCode, setResetCode] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 

  const handleEmailSubmit = async (values, { setSubmitting }) => {
    setServerMessage("");
    try {
      const response = await axios.post(ONETIMEOTP, { email: values.email });

      setServerMessage(response.data.message || "Falls deine E-Mail existiert, wurde ein Reset-Link gesendet.");
      setIsCodeSent(true);
      setEmail(values.email);
    } catch (error) {
      setServerMessage(error.response?.data?.message || "Ein Fehler ist aufgetreten.");
    }
    setSubmitting(false);
  };

  const handleCodeSubmit = async (values, { setSubmitting }) => {
    setServerMessage("");
    try {
      const response = await axios.post(VERIFYOTP, {
        email,
        resetCode: values.resetCode,
      });

      setServerMessage(response.data.message || "Code verifiziert. Du kannst nun dein Passwort ändern.");
      setIsCodeVerified(true);
    } catch (error) {
      setServerMessage(error.response?.data?.message || "Ein Fehler ist aufgetreten.");
    }
    setSubmitting(false);
  };

  const handlePasswordSubmit = async (values, { setSubmitting }) => {
    setServerMessage("");
    try {
      const response = await axios.post(RESETUPW, {
        email,
        resetCode,
        newPassword: values.newPassword,
      });

      setServerMessage(response.data.message || "Passwort erfolgreich geändert.");
    } catch (error) {
      setServerMessage(error.response?.data?.message || "Ein Fehler ist aufgetreten.");
    }
    setSubmitting(false);
  };

  return (
    <div className="reset-form form-container">
      <Formik
        initialValues={{ email: email, resetCode: "", newPassword: "" }}
        onSubmit={isCodeVerified ? handlePasswordSubmit : isCodeSent ? handleCodeSubmit : handleEmailSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="client-data">
            <h1 className="reset-headline">
              {isCodeVerified ? "Change Password" : isCodeSent ? "Enter Reset Code" : "Reset Password"}
            </h1>

            {!isCodeSent && (
              <div className="input-container">
                <Field type="text" id="email" name="email" required />
                <div className='lable-line'>Enter your E-Mail</div>
                <br />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
            )}

            {isCodeSent && !isCodeVerified && (
              <div className="input-container">
                <Field type="text" id="resetCode" name="resetCode" required maxLength={4} />
                <ErrorMessage name="resetCode" component="div" className="error-message" />
              </div>
            )}

            {isCodeVerified && (
              <div className="input-container">
                <Field type="password" id="newPassword" name="newPassword" required />
                <ErrorMessage name="newPassword" component="div" className="error-message" />
              </div>
            )}

            {serverMessage && <div className="info-message">{serverMessage}</div>}

            <div className="box-3">
              <button type="submit" className="btn btn-three" disabled={isSubmitting}>
                <span>{isCodeVerified ? "Change Password" : isCodeSent ? "Verify Code" : "Send Reset-Link"}</span>
              </button>
            </div>

            <div className="box-3">
              <button type="button" className="btn btn-three" onClick={onBackToLogin}>
                <span>Back to Login</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
