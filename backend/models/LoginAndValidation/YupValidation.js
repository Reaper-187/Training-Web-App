const Yup = require('yup');

// ist kein Array oder Modell sondern nur ein ValidSchema, das keine Daten speichert
const userYupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(7, 'Password must be at least 7 characters').required('Password is required'),
  createdOn: Yup.date().default(() => new Date()),
});

const validateUser = async (userData) => {
  try {
    await userYupSchema.validate(userData);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { validateUser };
