import * as yup from "yup";

export const ResponseBodyValidator = yup.object().shape({
  surveyID: yup.string().required("Survey ID is required"),
  questions: yup
    .array()
    .of(
      yup.object().shape({
        questionId: yup.string().required("Question ID is required"),
        answers: yup.array().of(
          yup.object().shape({
            answerId: yup.string().required("Answer ID is required"),
          })
        ),
      })
    )
    .required("Questions are required"),
});
