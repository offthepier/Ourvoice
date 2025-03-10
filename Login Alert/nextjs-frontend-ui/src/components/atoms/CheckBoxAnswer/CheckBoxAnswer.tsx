import { AddCircleRounded, Delete } from "@mui/icons-material";
import { Checkbox, IconButton, TextField } from "@mui/material";
import React, { useImperativeHandle, useState } from "react";

import COLORS from "@/themes/colors";
import ICheckBoxAnswer from "./ICheckBoxAnswer";
import { RefInAnswer } from "../RadioAnswer/RadioAnswer";
import { SURVEY_ANSWER_LENGTH } from "@/constants/SurveyTextLengths.const";
import { Stack } from "@mui/system";

const CheckboxAnswer = React.forwardRef<RefInAnswer, ICheckBoxAnswer>(
  (props: ICheckBoxAnswer, ref) => {
    const [answer, setAnswer] = useState("");

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
        onAddAnswer?.(answer, auto, submissionDone);
        setAnswer("");
        return true;
      } else {
        onRemoveAnswer?.(index);
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      handleSubmitAuto(submissionDone: boolean) {
        if (answer.trim() != "") {
          return handleAddRemove(true, submissionDone);
        } else {
          console.log("returning true");
          return false;
        }
      },
    }));

    return (
      <Stack direction="row" marginTop={1} maxWidth={500}>
        <Checkbox value={false} disabled={disabled} />
        <TextField
          spellCheck={true}
          placeholder="Option"
          fullWidth
          size="small"
          value={disabled ? text : answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          disabled={disabled}
          inputProps={{ maxLength: SURVEY_ANSWER_LENGTH }}
        />
        {!hideButton && (
          <IconButton
            size="medium"
            sx={{
              // backgroundColor: disabled ? COLORS.dangerColor : COLORS.primary,
              marginLeft: 2,
            }}
            onClick={() => handleAddRemove(false, false)}
          >
            {disabled ? (
              <Delete
                data-testid="checkbox-delete-icon"
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

CheckboxAnswer.displayName = "CheckBoxAnswer";

export { CheckboxAnswer };
