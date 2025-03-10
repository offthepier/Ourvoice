import * as Yup from "yup";
import { FEEDBACK_SIGNUP } from "./feedbacks.const";

const signUpValidations = Yup.object().shape({
  firstName: Yup.string().trim().required("First Name is required"),
  lastName: Yup.string().trim().required("Last Name is required"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Email is invalid"),
  postalCode: Yup.string()
    .trim()
    .required("Postal Code is required")
    .matches(/^[0-9]{4}$/, "Must be exactly 4 digits"),
  suburb: Yup.string().trim().required("Suburb is required"),
  country: Yup.string()
    .trim()
    .required("Country is required")
    .oneOf(
      ["Australia", "def"],
      FEEDBACK_SIGNUP.notAvailableCountryValidationError
    )
    .not(["def"], "Please Select Your Country"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*[a-z])/, "Password must have at least one lowercase")
    .matches(/^(?=.*[A-Z])/, "Password must have at least one uppercase")
    .matches(/^(?=.*[0-9])/, "Password must have at least one number")
    .matches(
      /^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/,
      "Password must have at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .trim()
    .min(8, "Password must have at least 8 characters")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  acceptedTerms: Yup.bool().oneOf(
    [true],
    "Accepting the terms and conditions is required."
  ),
});

export { signUpValidations };
