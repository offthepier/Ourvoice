// import yup
import * as yup from "yup";

let PostSignUpValidation = yup.object().shape({
  "custom:firstName": yup.string().required("First_Name is required"),
  "custom:lastName": yup.string().required("Last Name is required"),
  "custom:country": yup.string().required("Country is required"),
});

export { PostSignUpValidation };
