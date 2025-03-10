import * as yup from "yup";

export const CreateSurveyReqSchema = yup.object().shape({
  surveyTitle: yup.string().required("Survey Description is Required!"),
  surveyDesc: yup.string().required("surveyDescription is Required!"),
  expireDate: yup.string().required("expireDate is Required!"),
  questions: yup
    .array()
    .of(
      yup.object().shape({
        questionTitle: yup.string(),
        questionType: yup.string(),
        answers: yup.array().of(
          yup.object().shape({
            answerType: yup.string(),
          })
        ),
      })
    )
    .required("Questions are required"),
});
