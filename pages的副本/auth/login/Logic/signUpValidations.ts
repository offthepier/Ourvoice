import * as Yup from "yup";

const signInValidations = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Email is invalid"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(40, "Password must not exceed 40 characters"),
});

export { signInValidations };
