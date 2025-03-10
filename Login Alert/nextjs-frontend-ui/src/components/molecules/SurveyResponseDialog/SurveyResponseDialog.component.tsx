import { CheckBoxQuestion, RadioQuestion } from "../../atoms";
import { Button, DialogActions, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import IQuestion from "@/types/Question.interface";
import ISurveyPreviewDialog from "./SurveyResponseDialog.interface";
import { ISurveyResponseItem } from "@/types/ISurveyResponse";
import { Stack } from "@mui/system";
import SurveyDialogWrapper from "../../organism/SurveyDialogWrapper/SurveyDialogWrapper";
import moment from "moment";

const SurveyResponseDialog = ({
  title = "Your Survey Title Goes Here",
  description = "Your Survey Description Goes Here",
  onClickAction,
  onClose,
  open = false,
  questions,
  expiration,
}: ISurveyPreviewDialog) => {
  const [submitted, setSubmitted] = useState<ISurveyResponseItem[]>([]);

  useEffect(() => {
    let submittedTemp: ISurveyResponseItem[] = [];
    questions?.forEach((question) => {
      submittedTemp.push({
        questionId: question?.questionId || "",
        answers: [],
      });
    });

    setSubmitted(submittedTemp);
  }, [questions]);

  const submitResponse = async () => {
    onClickAction?.(submitted);
  };

  const radioQuestionAnswerHandle = (
    answer: { answerId: string },
    e: IQuestion
  ) => {
    let index = submitted.findIndex((x) => x.questionId === e.questionId);

    if (index != -1) {
      let temp = submitted.slice();
      if (temp?.[index]) {
        temp[index].answers = [answer];
        setSubmitted(temp);
      }
    }
  };

  const cbQuestionAnswerHandle = (
    answer: { answerId: string }[],
    e: IQuestion
  ) => {
    let index = submitted.findIndex((x) => x.questionId === e.questionId);

    if (index != -1) {
      let temp = submitted.slice();
      if (temp?.[index]) {
        temp[index].answers = answer;
        setSubmitted(temp);
      }
    }
  };

  return (
    <SurveyDialogWrapper
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      expiration={expiration}
    >
      <DialogContent>
        <Stack marginLeft={1} marginTop={1}>
          {questions?.map((e, i) => {
            if (e.questionType == "MC")
              return (
                <RadioQuestion
                  question={e}
                  onChangeAnswer={(answer) => {
                    radioQuestionAnswerHandle(answer, e);
                  }}
                  value={
                    submitted.find((o) => o.questionId === e.questionId)
                      ?.answers?.[0]?.answerId ?? null
                  }
                  disabled={moment(expiration, "YYYY-MM-DD").isBefore(
                    new Date()
                  )}
                  index={i}
                />
              );
            else if (e.questionType == "CB")
              return (
                <CheckBoxQuestion
                  question={e}
                  onChangeAnswer={(answers) => {
                    cbQuestionAnswerHandle(answers, e);
                  }}
                  disabled={moment(expiration, "YYYY-MM-DD").isBefore(
                    new Date()
                  )}
                  index={i}
                />
              );
          })}
        </Stack>
        <Button sx={{ alignSelf: "flex-end", marginX: 2 }}>Submit</Button>
      </DialogContent>
      <DialogActions sx={{ alignSelf: "center", marginBottom: 4 }}>
        <Stack flexDirection="row" justifyContent="center" marginTop={4}>
          <Button
            variant="contained"
            data-testid="submit-button"
            sx={{
              alignSelf: "flex-end",
              padding: 1,
              paddingX: 8,
              height: 42,
            }}
            onClick={() => {
              submitResponse();
            }}
            disabled={moment(expiration, "YYYY-MM-DD").isBefore(new Date())}
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            sx={{
              alignSelf: "flex-end",
              padding: 1,
              paddingX: 8,
              marginLeft: 2,
              height: 42,
            }}
            onClick={onClose}
          >
            Back
          </Button>
        </Stack>
      </DialogActions>
    </SurveyDialogWrapper>
  );
};

export { SurveyResponseDialog };
