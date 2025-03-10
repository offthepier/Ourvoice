import * as Yup from "yup";

const userDetailsValidation = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .trim()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\'\-]*)$/gi,
      "Please enter your first name."
    ),
  lastName: Yup.string()
    .required("Last Name is required")
    .trim()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\'\-]*)$/gi,
      "Please enter your last name."
    ),

  addressLine1: Yup.string().trim(),
  geoLocation: Yup.object().shape({
    suburb: Yup.string().required("Suburb is required"),
    postCode: Yup.string().required("PostCode is required"),
  }),
  addressLine2: Yup.string().trim(),
  phoneNumber: Yup.string().matches(
    /^\d{0,10}$/,
    "Please enter a valid phone number"
  ),
  city: Yup.string().trim(),
  dob: Yup.string().trim(),
});

export { userDetailsValidation };
