import * as Yup from "yup";

const newProposalValidations = Yup.object().shape({
  title: Yup.string()
    .trim()
    .when("postType", {
      is: "PROPOSAL",
      then: Yup.string().trim().required("Title is required"),
      otherwise: Yup.string().trim()
    }),
  description: Yup.string().trim().required("Description is required"),
  postType: Yup.string()
    .trim()
    .required("Post type is required")
    .not(["def"], "Please select your Post Type"),
});

export { newProposalValidations };
