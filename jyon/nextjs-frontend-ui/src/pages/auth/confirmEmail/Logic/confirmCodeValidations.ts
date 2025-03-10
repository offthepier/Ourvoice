import * as Yup from "yup";

const confirmEmailValidations = Yup.object().shape({
  code: Yup.string().required("Code is required").length(6, "Invalid Code"),
});

export { confirmEmailValidations };
