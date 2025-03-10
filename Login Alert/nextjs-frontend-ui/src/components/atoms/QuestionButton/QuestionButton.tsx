import { AddCircleRounded, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import COLORS from "@/themes/colors";
import React from "react";
import IQuestion from "@/types/Question.interface";

interface QuestionButtonProps {
  questionObj?: IQuestion;
  handleAddRemove: () => void;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({
  questionObj,
  handleAddRemove,
}) => {
  return (
    <Button
      size="small"
      sx={{
        color: questionObj ? COLORS.dangerColor : COLORS.primary,
        marginLeft: 2,
        margin: "0 auto",
        marginTop: 2,
        marginBottom: 3,
        width: "125px",
        borderColor: questionObj ? COLORS.dangerColor : COLORS.primary,
        ":hover": {
          borderColor: "transparent",
          backgroundColor: questionObj ? COLORS.dangerColor : COLORS.primary,
          color: "white",
        },
      }}
      variant="outlined"
      onClick={handleAddRemove}
      startIcon={questionObj ? <Delete /> : <AddCircleRounded />}
    >
      {questionObj ? "Delete" : "Add"}
    </Button>
  );
};

export default QuestionButton;
