import { AddCircleRounded, Delete } from "@mui/icons-material";
import { IconButton, Radio, TextField } from "@mui/material";
import React, { useImperativeHandle, useState } from "react";
import { SURVEY_ANSWER_LENGTH } from "@/constants/SurveyTextLengths.const";

import COLORS from "@/themes/colors";
import IRadioAnswers from "./IRadioAnswer";
import { Stack } from "@mui/system";

export interface RefInAnswer {
  handleSubmitAuto: (submissionDone: boolean) => boolean;
}

const RadioAnswer = React.forwardRef<RefInAnswer, IRadioAnswers>(
  (props: IRadioAnswers, ref) => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");

    const {
      disabled,
      hideButton,
      index = 0,
      onAddAnswer,
      onRemoveAnswer,
      text,
    } = props;

    const handleAddRemove = (auto: boolean, submissionDone: boolean) => {
      if (!disabled) {
        if (!!!answer) {
          setError("Option is required!");
        }

        onAddAnswer?.(answer, auto, submissionDone);
        setAnswer("");
        return true;
      } else {
        onRemoveAnswer?.(index);
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      handleSubmitAuto(submissionDone) {
        if (answer.trim() != "") {
          return handleAddRemove(true, submissionDone);
        } else {
          console.log("returning true");
          return false;
        }
      },
    }));

    return (
      <Stack direction="row" marginTop={1} maxWidth={500} alignItems="start">
        <Radio value={false} disabled={disabled} />
        <TextField
          spellCheck={true}
          placeholder="Option"
          fullWidth
          value={disabled ? text : answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(e.target.value ? "" : "Option is required!");
          }}
          disabled={disabled}
          sx={{ padding: 0 }}
          error={error ? true : false}
          helperText={error}
          inputProps={{ maxLength: SURVEY_ANSWER_LENGTH }}
        />
        {!hideButton && (
          <IconButton
            size="medium"
            sx={{
              marginLeft: 2,
            }}
            onClick={() => handleAddRemove(false, false)}
          >
            {disabled ? (
              <Delete
                data-testid="remove-button"
                sx={{ color: COLORS.dangerColor }}
              />
            ) : (
              <AddCircleRounded sx={{ color: COLORS.primary }} />
            )}
          </IconButton>
        )}
      </Stack>
    );
  }
);

RadioAnswer.displayName = "RadioAnswer";

export { RadioAnswer };
