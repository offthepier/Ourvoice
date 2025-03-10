// import yup
import * as yup from "yup";

let PreSignUpValidation = yup.object().shape({
  "custom:First_Name": yup.string().required("First_Name is required"),
  "custom:Last_Name": yup.string().required("Last Name is required"),
  "custom:Country": yup.string().required("Country is required"),
  "custom:Postal_Code": yup
    .string()
    .required("Postal Code is required")
    .length(4, "Invalid Postal Code"),
  "custom:Suburb": yup.string().required("Suburb is required"),
  email: yup
    .string()
    .required("Suburb is required")
    .email("Invalid Email Address"),
});

export { PreSignUpValidation };
