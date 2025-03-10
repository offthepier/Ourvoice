
import { CheckboxAnswer } from "../CheckBoxAnswer/CheckBoxAnswer";
import { RadioAnswer } from "../RadioAnswer/RadioAnswer";
import { RadioGroup, Stack } from "@mui/material";
import React from "react";
import IAnswerOptionsComponent from "./IAnswerOption";

const AnswerOptions: React.FC<IAnswerOptionsComponent> = ({
  qType,
  questionObj,
  answers,
  handleAddAnswer,
  handleRemoveAnswer,
  myRef,
}) => {
  if (qType === "MC" || questionObj?.questionType === "MC") {
    return (
      <RadioGroup>
        {questionObj
          ? questionObj?.answers?.map((e, i) => (
              <RadioAnswer
                disabled
                text={e.answer}
                key={e.answerId}
                index={i}
                hideButton
                onRemoveAnswer={handleRemoveAnswer}
              />
            ))
          : answers?.map((e, i) => (
              <RadioAnswer
                disabled
                text={e.answer}
                key={e.answerId}
                index={i}
                onRemoveAnswer={handleRemoveAnswer}
              />
            ))}
        {!questionObj && (
          <RadioAnswer onAddAnswer={handleAddAnswer} ref={myRef} />
        )}
      </RadioGroup>
    );
  } else if (qType === "CB" || questionObj?.questionType === "CB") {
    return (
      <Stack>
        {questionObj
          ? questionObj?.answers?.map((e, i) => (
              <CheckboxAnswer
                disabled
                text={e.answer}
                key={e.answerId}
                index={i}
                hideButton
                onRemoveAnswer={handleRemoveAnswer}
              />
            ))
          : answers?.map((e, i) => (
              <CheckboxAnswer
                disabled
                text={e.answer}
                key={e.answerId}
                index={i}
                onRemoveAnswer={handleRemoveAnswer}
              />
            ))}
        {!questionObj && (
          <CheckboxAnswer ref={myRef} onAddAnswer={handleAddAnswer} />
        )}
      </Stack>
    );
  } else {
    return null;
  }
};

export default AnswerOptions;
