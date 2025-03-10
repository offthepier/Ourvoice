import * as yup from "yup";

export const SurevyLimitValidator = yup.object().shape({
  limit: yup.number().required("Limit is required"),
});
