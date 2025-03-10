import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import IQuestionComponent from "./IRadioQuestion";
import { Stack } from "@mui/system";
import IQuestion from "@/types/Question.interface";

const RadioQuestion = ({
  question,
  onChangeAnswer,
  value,
  index = 0,
  disabled,
}: IQuestionComponent) => {
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

  return (
    <Stack marginBottom={3}>
      <FormControl>
        <FormLabel
          id="demo-radio-buttons-group-label"
          data-testid="demo-radio-buttons-group-label"
          sx={{
            color: "black",
            fontSize: 14,
            ":focus": {
              color: "black",
            },
          }}
        >
          {`${index + 1}) `}
          {question?.questionTitle}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={value}
          onChange={(event) => {
            onChangeAnswer?.({ answerId: event.target.value });
          }}
        >
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
                  marginBottomStyle = { mb: 1.5 };
                }
                return (
                  <Box key={e.answerId} sx={marginBottomStyle}>
                    <FormControlLabel
                      value={e.answerId}
                      control={
                        <Radio
                          size="small"
                          disabled={disabled}
                          checked={e.status}
                        />
                      }
                      label={e.answer}
                      sx={{ marginBottom: -1, marginLeft: 1 }}
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
                      value={e.answerId}
                      control={
                        <Radio
                          size="small"
                          disabled={disabled}
                          checked={e.status}
                        />
                      }
                      label={e.answer}
                      sx={{ marginBottom: -1, marginLeft: 1 }}
                    />
                  </Box>
                );
              })}
        </RadioGroup>
      </FormControl>

      <RadioGroup></RadioGroup>
    </Stack>
  );
};

export { RadioQuestion };
