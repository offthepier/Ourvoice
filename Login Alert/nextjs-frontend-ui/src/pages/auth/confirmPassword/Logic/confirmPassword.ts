import * as Yup from "yup";

const confirmPasswordValidation = Yup.object().shape({
  code: Yup.string().required("Code is required").length(6, "Invalid Code"),
  newPassword: Yup.string()
    .trim()
    .required("New Password is required")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*[a-z])/, "Password must have at least one lowercase")
    .matches(/^(?=.*[A-Z])/, "Password must have at least one uppercase")
    .matches(/^(?=.*[0-9])/, "Password must have at least one number")
    .matches(
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must have at least one special character"
    ),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .min(8, "Password must have at least 8 characters")
    .max(40, "Password must not exceed 40 characters")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

export { confirmPasswordValidation };
