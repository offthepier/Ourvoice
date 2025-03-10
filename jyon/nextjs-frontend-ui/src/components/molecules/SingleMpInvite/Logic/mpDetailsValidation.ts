import * as Yup from "yup";

const mpDetailsValidation = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required("Full name is required")
    .matches(
      /^[a-zA-Z\s'-]*$/,
      "Please enter a valid full name without special characters."
    ),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Email is invalid"),
  electorateName: Yup.string()
    .trim()
    .required("Electorate name is required")
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\'\-]*)$/gi,
      "Please enter your electorate name."
    ),
});

export { mpDetailsValidation };
