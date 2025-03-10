import { POST_TYPES } from "src/constants/PostTypes copy";
import * as yup from "yup";

export const CreatePostReqSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .when("postType", {
      is: POST_TYPES.PROPOSAL,
      then: yup.string().trim().required("Title is required"),
      otherwise: yup.string().trim(),
    })
    .test({
      name: "condition",
      test: function (value) {
        const { postType } = this.parent;
        if (postType !== POST_TYPES.PROPOSAL) {
          return value === undefined;
        }
        return true;
      },
      message: "Title should not be provided for non-PROPOSAL post types",
    }),

  postType: yup
    .string()
    .required("Post Type is required")
    .oneOf([POST_TYPES.GENERAL, POST_TYPES.PROPOSAL], "Not Allowed Post Type"),
  description: yup.string().required("Post Description is Required!"),
  challenge: yup.string().required("Challenge is Required!"),
  challengeID: yup.string().required("Challenge ID is Required!"),
  community: yup.string().required("Community is Required!"),
  tags: yup.array().optional(),
  images: yup.array().optional(),
});
