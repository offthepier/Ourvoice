import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useImperativeHandle, useRef, useState } from "react";

import { FEEDBACK_SURVEY } from "src/pages/survey/create/Logic/feedbacks.const";
import IAnswer from "@/types/IAnswer";
import IQuestion from "@/types/Question.interface";
import IQuestionComponent from "./IQuestion";
import { Stack } from "@mui/system";
import AnswerOptions from "@/components/atoms/AnswerOption/AnswerOption";
import QuestionButton from "@/components/atoms/QuestionButton/QuestionButton";
import QuestionForm from "@/components/atoms/QuestionForm/QuestionForm";
import COLORS from "@/themes/colors";

export interface RefInQuestion {
  handleSubmitAuto: (submissionDone: boolean) => boolean;
}

const Question = React.forwardRef<RefInQuestion, IQuestionComponent>(
  (props: IQuestionComponent, ref) => {
    const [question, setQuestion] = useState("");
    const [qType, setQType] = useState("");
    const [randomize, setRandomize] = useState(false);
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [errors, setErrors] = useState({
      question: "",
      qType: "",
      options: "",
    });

    const myRef = useRef<RefInQuestion>({
      handleSubmitAuto(submissionDone: boolean) {
        return true;
      },
    });

    const { onAddQuestion, onRemoveQuestion, questionObj, index = 0 } = props;

    const validateInputs = (
      question: string,
      qType: string,
      answers: any[],
      answer: string | undefined
    ) => {
      if (!question.trim()) {
        setErrors((prevState) => ({
          ...prevState,
          question: "Question is required!",
        }));
        return false;
      }

      if (!qType.trim()) {
        setErrors((prevState) => ({
          ...prevState,
          qType: "Question type is required!",
        }));
        return false;
      }

      if (answers.length <= 0 && answer == null) {
        setErrors((prevState) => ({
          ...prevState,
          options: "Options are required!",
        }));
        return false;
      }

      return true;
    };

    const createQuestionObject = (
      question: string,
      qType: string,
      answers: any[],
      answer: string | undefined,
      randomize: boolean
    ): IQuestion => ({
      questionTitle: question,
      questionType: qType,
      answers: answer ? [...answers, { answer }] : answers,
      randomize: randomize,
    });

    const handleAddQuestion = ({
      auto,
      answer,
      submitted,
    }: {
      auto?: boolean;
      answer?: string;
      submitted?: boolean;
    }) => {
      let autoUpdated = false;

      if (!auto) {
        autoUpdated = myRef?.current?.handleSubmitAuto(submitted ?? false);
      }

      if (!autoUpdated) {
        if (!validateInputs(question, qType, answers, answer)) {
          return false;
        }

        const qObject = createQuestionObject(
          question,
          qType,
          answers,
          answer,
          randomize
        );

        onAddQuestion?.(qObject, submitted ?? false);

        setQuestion("");
        setQType("");
        setAnswers([]);
        setRandomize(false);
        console.log(randomize);

        setErrors((prevState) => ({
          ...prevState,
          options: "",
        }));

        return auto ? true : false;
      }

      return false;
    };

    const checkAnswerRequiredError = (
      answer: string,
      setErrors: (
        value: React.SetStateAction<{
          question: string;
          qType: string;
          options: string;
        }>
      ) => void
    ) => {
      if (!answer) {
        setErrors((prevState) => ({
          ...prevState,
          options: FEEDBACK_SURVEY.SURVEY_ANSWER_REQUIRED,
        }));
        return true;
      }
      return false;
    };

    const updateErrors = (
      setErrors: (
        value: React.SetStateAction<{
          question: string;
          qType: string;
          options: string;
        }>
      ) => void
    ) => {
      setErrors((prevState) => ({
        ...prevState,
        options: "",
      }));
    };

    const handleAddAnswer = (
      answer: string,
      auto: boolean,
      submissionDone: boolean
    ) => {
      if (checkAnswerRequiredError(answer, setErrors)) return;

      setAnswers([...answers, { answer }]);
      updateErrors(setErrors);

      if (auto) {
        handleAddQuestion({
          auto: true,
          answer: answer,
          submitted: submissionDone,
        });
      }
    };

    const handleRemoveAnswer = (index: number) => {
      setAnswers((answers) => {
        return answers.filter((value, i) => i !== index);
      });
    };

    const handleAddRemove = () => {
      if (!questionObj) {
        handleAddQuestion({});
      } else {
        onRemoveQuestion?.(index);
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmitAuto(submissionDone) {
        if (question.trim() != "" || qType.trim() != "" || answers.length > 0) {
          return handleAddQuestion({ submitted: submissionDone });
        } else {
          console.log("returning true from question");
          return true;
        }
      },
    }));

    return (
      <>
        <QuestionForm
          index={index}
          question={question}
          qType={qType}
          questionObj={questionObj}
          errors={errors}
          setQuestion={setQuestion}
          setQType={setQType}
          setErrors={setErrors}
        />
        <Stack marginTop={0.5}>
          <AnswerOptions
            qType={qType}
            questionObj={questionObj}
            answers={answers}
            handleAddAnswer={handleAddAnswer}
            handleRemoveAnswer={handleRemoveAnswer}
            myRef={myRef}
          />
        </Stack>
        {!questionObj && errors.options != "" && (
          <Typography
            color="red"
            m={0.5}
            marginBottom={0}
            marginX={1}
            fontSize="12px"
          >
            {errors.options}
          </Typography>
        )}
        <Stack marginTop={2}>
          <FormControlLabel
            disabled={questionObj ? true : false}
            control={
              <Checkbox
                checked={questionObj?.randomize ?? randomize}
                sx={{ color: COLORS.primary, fontSize: "14px"  }}
                defaultChecked={false}
                onChange={(e) => {
                  setRandomize(e.target.checked);
                }}
              />
            }
            sx={{ color: COLORS.primary, fontSize: "14px" }}
            label={
              <Typography variant="body1" fontSize={14} color={COLORS.primary}>
                Shuffle options display order
              </Typography>
            }
          />
        </Stack>
        <QuestionButton
          questionObj={questionObj}
          handleAddRemove={handleAddRemove}
        />
      </>
    );
  }
);

Question.displayName = "Question";

export { Question };
