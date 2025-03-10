import { CheckBoxQuestion, RadioQuestion } from "../../atoms";
import { Button, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";

import ISurveyPreviewDialog from "./SurveyPreviewDialog.interface";
import { ISurveyResponseItem } from "@/types/ISurveyResponse";
import { Stack } from "@mui/system";
import moment from "moment";
import SurveyDialogWrapper from "../../organism/SurveyDialogWrapper/SurveyDialogWrapper";

const SurveyPreviewDialog = ({
  title = "Your Survey Title Goes Here",
  description = "Your Survey Description Goes Here",
  onClickAction,
  onClose,
  open = false,
  questions,
  expiration,
  disabled,
}: ISurveyPreviewDialog) => {
  const [submitted, setSubmitted] = useState<ISurveyResponseItem[]>([]);

  const radioQuestionAnswerHandle = (
    answer: { answerId: string },
    q: string
  ) => {
    let index = submitted.findIndex((x) => x.questionId == q);

    // alert(index)
    if (index != -1) {
      let temp = submitted.slice();
      if (temp?.[index]) {
        console.log("setting ", answer.answerId);
        temp[index].answers = [answer];
        setSubmitted(temp);
      }
    } else {
      setSubmitted([...submitted, { questionId: q, answers: [answer] }]);
    }
    console.log(submitted);
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
        <Stack marginLeft={1}>
          {questions?.map((e, i) => {
            if (e.questionType == "MC")
              return (
                <RadioQuestion
                  question={{
                    ...e,
                    answers: e.answers.map((a, i) => {
                      return {
                        answerId: i.toString(),
                        answer: a.answer,
                        status: a.status,
                      };
                    }),
                  }}
                  index={i}
                  disabled={
                    moment(expiration, "YYYY-MM-DD").isBefore(new Date()) ||
                    disabled
                  }
                  value={
                    submitted
                      .find((o) => o.questionId === i.toString())
                      ?.answers?.[0]?.answerId.toString() ?? null
                  }
                  onChangeAnswer={(answer: any) => {
                    // alert(answer.answerId)
                    radioQuestionAnswerHandle(answer, i.toString());
                  }}
                />
              );
            else if (e.questionType == "CB")
              return (
                <CheckBoxQuestion
                  question={e}
                  index={i}
                  disabled={
                    moment(expiration, "YYYY-MM-DD").isBefore(new Date()) ||
                    disabled
                  }
                />
              );
          })}
        </Stack>
        <Button sx={{ alignSelf: "flex-end", marginX: 2 }}>Submit</Button>
      </DialogContent>
      <DialogActions sx={{ alignSelf: "center", marginBottom: 4 }}>
        <Stack flexDirection="row" justifyContent="center" marginTop={4}>
          {onClickAction && (
            <Button
              variant="contained"
              sx={{
                alignSelf: "flex-end",
                padding: 1,
                paddingX: 8,
                height: 42,
              }}
              onClick={onClickAction}
            >
              Publish
            </Button>
          )}
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

export { SurveyPreviewDialog };
