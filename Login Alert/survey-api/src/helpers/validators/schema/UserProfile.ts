import * as yup from "yup";

let ProfileUpdate = yup.object({
  id: yup.string().email("Valid Email"),
});

export { ProfileUpdate };
