import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper, TableCell } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ISurveyTable from "./SurveyTable.interface";

const SurveyTable = ({ questions, getSum }: ISurveyTable) => {
  const useStyles = makeStyles({
    cell: {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
  });
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="a dense table">
        <TableHead sx={{ backgroundColor: "rgba(206, 205, 205, 0.3)" }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "600",
                pt: "6px",
                pb: "6px",
                fontSize: "13.5px",
              }}
              className={classes.cell}
            >
              Question Title
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "600",
                pt: "6px",
                pb: "6px",
                fontSize: "13.5px",
              }}
              className={classes.cell}
            >
              Question Type
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "600",
                pt: "6px",
                pb: "6px",
                fontSize: "13.5px",
              }}
              className={classes.cell}
            >
              Answers
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "600",
                pt: "6px",
                pb: "6px",
                fontSize: "13.5px",
              }}
              className={classes.cell}
            >
              Total(n)
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "600",
                pt: "6px",
                pb: "6px",
                fontSize: "13.5px",
              }}
              className={classes.cell}
            >
              Total(%)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions?.map((row, questionIndex) => (
            <React.Fragment key={row.questionId}>
              {row.answers.map((answer, i) => (
                <TableRow key={answer.answerId}>
                  {i === 0 && (
                    <TableCell
                      className={classes.cell}
                      sx={{
                        alignItems: "flex-start",
                        verticalAlign: "baseline",
                      }}
                      rowSpan={row.answers.length}
                    >
                      {`${questionIndex + 1}) ${row.questionTitle}`}
                      {/* <span className="ml" style={{ display: "block" }}>
                        Total responses : {getSum(row)}
                      </span> */}
                      <Box
                        sx={{
                          // ml: 2.1,
                          color: "gray",
                          fontSize: "11.5px",
                          mt: 1,
                          fontWeight: "550",
                          marginTop: "16px",
                        }}
                      >
                        Total Responses : {getSum(row)}
                      </Box>
                      <Box
                        sx={{
                          // ml: 2.1,
                          color: "gray",
                          fontSize: "11.5px",
                          mt: 0.3,
                          fontWeight: "550",
                        }}
                      >
                        Total Respondents : {row.respondedCount}
                      </Box>
                    </TableCell>
                  )}
                  {i === 0 && (
                    <TableCell
                      className={classes.cell}
                      rowSpan={row.answers.length}
                      sx={{ verticalAlign: "baseline" }}
                    >
                      {row.questionType === "MC"
                        ? "Single-select"
                        : "Multi-select"}
                    </TableCell>
                  )}
                  <TableCell sx={{ verticalAlign: "baseline" }} className={classes.cell}>
                    {answer.answer}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "baseline" }} className={classes.cell}>{answer.count}</TableCell>
                  <TableCell sx={{ verticalAlign: "baseline" }} className={classes.cell}>
                    {(
                      answer.count && (answer.count / getSum(row)) * 100
                    )?.toFixed(2)}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SurveyTable;
