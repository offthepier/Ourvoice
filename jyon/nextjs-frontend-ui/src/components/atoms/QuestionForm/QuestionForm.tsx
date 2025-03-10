// QuestionForm.tsx
import {
  FormLabel,
  MenuItem,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import IQuestion from "@/types/Question.interface";
import { SURVEY_QUESTION_LENGTH } from "@/constants/SurveyTextLengths.const";
import { RadioButtonChecked, FormatListBulleted } from "@mui/icons-material";

interface QuestionFormProps {
  index: number;
  question: string;
  qType: string;
  questionObj: IQuestion | undefined;
  errors: any;
  setQuestion: (question: string) => void;
  setQType: (qType: string) => void;
  setErrors: (errors: any) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  index,
  question,
  qType,
  questionObj,
  errors,
  setQuestion,
  setQType,
  setErrors,
}) => {
  return (
    <Stack
      sx={{ flexDirection: { sm: "column-reverse", md: "row" } }}
      justifyContent="space-between"
      gap={2}
      marginTop={1.5}
    >
      <Stack width="100%">
        <FormLabel sx={{ color: questionObj ? "grey" : "black" }}>
          Question {index + 1}
        </FormLabel>
        <TextField
          spellCheck={true}
          value={questionObj?.questionTitle ?? question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setErrors((prevState: any) => ({
              ...prevState,
              question: e.target.value ? "" : "Question is required!",
            }));
          }}
          disabled={questionObj ? true : false}
          sx={{ marginTop: 0.5 }}
          fullWidth
          error={errors.question ? true : false}
          helperText={errors.question}
          multiline={true}
          rows={2}
          inputProps={{
            maxLength: SURVEY_QUESTION_LENGTH,
            "data-testid": "question-input",
          }}
        />
      </Stack>
      <Stack>
        <FormLabel sx={{ color: questionObj ? "grey" : "black" }}>
          Question {index + 1} Type{" "}
        </FormLabel>
        <TextField
          inputProps={{ "data-testid": "question-type" }}
          id="demo-simple-select"
          sx={{ width: 350, marginTop: 0.5 }}
          value={questionObj?.questionType ?? qType}
          onChange={(e) => {
            setQType(e.target.value);
            setErrors((prevState: any) => ({
              ...prevState,
              qType: "",
            }));
          }}
          disabled={questionObj ? true : false}
          select
          error={errors.qType ? true : false}
          helperText={errors.qType}
        >
          <MenuItem value={"MC"}>
            <Stack flexDirection="row" gap={1} component="div">
              <RadioButtonChecked />
              <Typography>Single-select</Typography>
            </Stack>
          </MenuItem>
          <MenuItem value={"CB"}>
            <Stack flexDirection="row" gap={1} component="div">
              <FormatListBulleted />
              <Typography>Multi-select</Typography>
            </Stack>
          </MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
};

export default QuestionForm;
