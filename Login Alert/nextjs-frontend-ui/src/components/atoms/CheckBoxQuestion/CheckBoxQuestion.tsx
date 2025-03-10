import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import IQuestionComponent from "./ICheckBoxQuestion";
import { Stack } from "@mui/system";
import IQuestion from "@/types/Question.interface";

const CheckBoxQuestion = ({
  question,
  onChangeAnswer,
  index = 0,
  disabled,
}: IQuestionComponent) => {
  const [answers, setAnswers] = useState<{ answerId: string }[]>([]);

  const [shuffledQuestion, setShuffledQuestion] = useState<
    IQuestion | undefined
  >();
  const questionsBackup = question;

  const shuffleAnswers = (obj: IQuestion | undefined) => {
    let array = obj?.answers;
    if (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    return obj;
  };

  useEffect(() => {
    if (question?.randomize && question?.questionId) {
      setShuffledQuestion(shuffleAnswers(question));
    }
  }, []);

  const handleOnChange = (val: boolean, ansId: string) => {
    let answersTemp = answers.slice();
    if (val) {
      answersTemp.push({ answerId: ansId });
    } else {
      //filter array
      for (let i = answersTemp.length; i--; ) {
        if (answersTemp[i].answerId === ansId) answersTemp.splice(i, 1);
      }
    }
    onChangeAnswer?.(answersTemp);
    setAnswers(answersTemp);
  };

  return (
    <Stack marginBottom={3}>
      <FormControl>
        <FormLabel
          id="demo-radio-buttons-group-label"
          sx={{ color: "black", fontSize: 14 }}
          data-testid="demo-checkbox-buttons-group-label"
        >
          {`${index + 1}) `}
          {question?.questionTitle}
        </FormLabel>
        <FormGroup aria-labelledby="demo-radio-buttons-group-label">
          {question?.randomize && question?.questionId
            ? shuffledQuestion?.answers?.map((e, i) => {
                let marginBottomStyle = {};
                if (
                  i !== 0 &&
                  e.answer.length > 80 &&
                  shuffledQuestion.answers[i - 1].answer.length < 80
                ) {
                  marginBottomStyle = { mb: 1.5, mt: 1.2 };
                } else if (e.answer.length > 80) {
                  marginBottomStyle = { mb: 1. };
                }
                return (
                  <Box key={e.answerId} sx={marginBottomStyle}>
                    <FormControlLabel
                      value={e}
                      control={
                        <Checkbox
                          size="small"
                          // value={answers.find((o) => o.answerId === e.answerId)}
                          onChange={(ev) => {
                            handleOnChange(
                              ev.target.checked,
                              e?.answerId || ""
                            );
                          }}
                          disabled={disabled}
                          checked={e.status}
                          data-testid="answer-checkbox"
                        />
                      }
                      label={e.answer}
                      sx={{
                        marginBottom: -1,
                        marginLeft: 1,
                      }}
                    />
                  </Box>
                );
              })
            : questionsBackup?.answers?.map((e, i) => {
                let marginBottomStyle = {};
                if (
                  i !== 0 &&
                  e.answer.length > 80 &&
                  questionsBackup.answers[i - 1].answer.length < 80
                ) {
                  marginBottomStyle = { mb: 1.5, mt: 1.2 };
                } else if (e.answer.length > 80) {
                  marginBottomStyle = { mb: 1.5 };
                }
                return (
                  <Box key={e.answerId} sx={marginBottomStyle}>
                    <FormControlLabel
                      value={e}
                      control={
                        <Checkbox
                          size="small"
                          // value={answers.find((o) => o.answerId === e.answerId)}
                          onChange={(ev) => {
                            handleOnChange(
                              ev.target.checked,
                              e?.answerId || ""
                            );
                          }}
                          disabled={disabled}
                          checked={e.status}
                          data-testid="answer-checkbox"
                        />
                      }
                      label={e.answer}
                      sx={{
                        marginBottom: -1,
                        marginLeft: 1,
                      }}
                    />
                  </Box>
                );
              })}
        </FormGroup>
      </FormControl>

      <RadioGroup></RadioGroup>
    </Stack>
  );
};

export { CheckBoxQuestion };
