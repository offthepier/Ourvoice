import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  YAxis,
} from "recharts";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { BasicModalDialog } from "../../atoms";
import { Close } from "@mui/icons-material";
import { CustomTooltip } from "@/components/atoms/CustomToolTip/CustomToolTip";
import IQuestion from "@/types/Question.interface";
import ISurveyPreviewDialog from "./SurveyResultsDialog.interface";
import Linkify from "linkify-react";
import { SampleDataResults } from "./SampleData";
import { Stack } from "@mui/system";
import COLORS from "@/themes/colors";
import SurveyTable from "@/components/atoms/SurveyTable/SurveyTable";
import Image from "next/image";
import { excelIcon } from "@/assets/index";
import { exportExcelFile } from "./SurveyResultsDialogLogics";
import CustomPieChartLabel from "@/components/atoms/PieChartCustomLabel/PieChartCustomLabel";

const SurveyResultsDialog = ({
  title = SampleDataResults.title,
  description = SampleDataResults.description,
  onClickAction,
  onClose,
  buttonText,
  imageUrl,
  open = false,
  questions,
}: ISurveyPreviewDialog) => {
  const [mode, setMode] = useState("pie");
  const [optionsOverChartLimit, setoptionsOverChartLimit] = useState(false);

  const COLORSARRAY = [
    "#6666FF",
    "#9999FF",
    "#EA3CD5",
    "#EF6ADF",
    "#F6AFEE",
    "#7BFC79",
    "#ACFDAB",
    "#CCCCCC",
    "#E5FE57",
    "#F1FEA3",
  ];

  const RADIAN = Math.PI / 180;

  useEffect(() => {
    if (questions) {
      let moreThanTenAnswers = false;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].answers.length >= 10) {
          setoptionsOverChartLimit(true);
          moreThanTenAnswers = true;
          setMode("table");
        } else if (!moreThanTenAnswers) {
          setoptionsOverChartLimit(false);
          setMode("pie");
        }
      }
    }
  }, [questions]);

  const getSum = (e: IQuestion) => {
    let sum = 0;

    for (const answer of e.answers) {
      sum += answer.count || 0;
    }
    return sum;
  };

  const handleMode = (mode: string) => {
    switch (mode) {
      case "bar":
        setMode(mode);
        break;
      case "pie":
        setMode(mode);
        break;
      case "table":
        setMode(mode);
        break;
    }
  };

  const handleGapForStack = () => {
    if (mode === "bar") {
      return 2;
    } else if (mode === "pie") {
      return "12%";
    }
  };

  const renderCharts = (e: IQuestion) => {
    if (mode === "bar") {
      return (
        <Stack>
          <BarChart
            width={420}
            height={220}
            data={e.answers.map((e) => {
              return {
                name: e.answer,
                count: e.count,
              };
            })}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* <XAxis dataKey="name" /> */}
            <YAxis />
            <Tooltip label="Data" content={<CustomTooltip />} />
            {/* <Legend /> */}
            <Bar dataKey="count" fill="#8884d8">
              {e.answers.map((entry, index) => (
                <Cell
                  key={`cell-${entry.answerId}`}
                  fill={COLORSARRAY[index % 20]}
                />
              ))}
            </Bar>
          </BarChart>
          <Typography
            color="grey"
            fontWeight="bold"
            fontSize="12px"
            textAlign="left"
            marginTop={1}
            marginLeft={23}
          >
            Total Responses :{" " + getSum(e)}
          </Typography>
          <Typography
            color="grey"
            fontWeight="bold"
            fontSize="12px"
            textAlign="left"
            marginTop={0}
            marginLeft={23}
          >
            Total Respondents :{" " + e.respondedCount}
          </Typography>
        </Stack>
      );
    } else if (mode === "pie") {
      return (
        <Stack>
          <PieChart width={200} height={200}>
            {renderPie(e)}
            <Tooltip content={<CustomTooltipForPieChart />} />
          </PieChart>
          <Typography
            color="grey"
            fontWeight="bold"
            fontSize="12px"
            textAlign="left"
            marginTop={-1}
            marginLeft={5.5}
          >
            Total Responses :{" " + getSum(e)}
          </Typography>
          <Typography
            color="grey"
            fontWeight="bold"
            fontSize="12px"
            textAlign="left"
            marginTop={0}
            marginLeft={5.5}
          >
            Total Respondents :{" " + e.respondedCount}
          </Typography>
        </Stack>
      );
    }
  };

  const CustomTooltipForPieChart = ({ active, payload, label }: any) => {
    if (active) {
      return (
        <Typography
          className="custom-tooltip"
          sx={{
            fontSize: "13px",
            backgroundColor: COLORS.secondary,
            padding: "3px",
            borderRadius: "5px",
          }}
        >
          <label>{`${payload[0].name}`}</label>
        </Typography>
      );
    }
    return null;
  };

  const renderPie = (e: IQuestion) => {
    if (getSum(e) == 0) {
      return (
        <Pie
          data={[{ name: "No Data", value: 1 }]}
          fill="#eeeeee"
          dataKey="value"
          label={<CustomPieChartLabel answers={e.answers} />}
        />
      );
    } else
      return (
        <Pie
          data={e.answers.map((e) => {
            return { name: e.answer, value: e.count };
          })}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={<CustomPieChartLabel answers={e.answers} />}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {e.answers.map((entry, index) => (
            <Cell
              key={`cell-${entry.answerId}`}
              fill={COLORSARRAY[index % COLORSARRAY.length]}
            />
          ))}
        </Pie>
      );
  };

  return (
    <BasicModalDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        )}

        {/* <Chip
          label="Expires in 2 Days"
          sx={{
            position: "absolute",
            right: 8,
            top: 45,
          }}
        /> */}
        <Typography
          variant="h6"
          marginTop={2}
          textAlign="justify"
          sx={{ ":first-letter": { textTransform: "capitalize" } }}
          fontSize="16px"
        >
          {title}
        </Typography>
        <Linkify options={{ target: "_blank" }}>
          <Typography textAlign="justify">{description.toString()}</Typography>
        </Linkify>
      </DialogTitle>
      <DialogContent>
        <Stack flexDirection="row" justifyContent="flex-start" marginTop={1}>
          {!optionsOverChartLimit && (
            <>
              <Button
                variant={mode === "pie" ? "contained" : "outlined"}
                sx={{
                  alignSelf: "flex-end",
                  paddingX: 3,
                }}
                onClick={() => {
                  handleMode("pie");
                }}
              >
                Pie Chart
              </Button>
              <Button
                variant={mode === "bar" ? "contained" : "outlined"}
                sx={{
                  alignSelf: "flex-end",
                  paddingX: 3,
                  marginLeft: 2,
                }}
                onClick={() => {
                  handleMode("bar");
                }}
              >
                Bar Chart
              </Button>
            </>
          )}

          <Button
            variant={mode === "table" ? "contained" : "outlined"}
            sx={{
              alignSelf: "flex-end",
              paddingX: 3,
              marginLeft: 2,
            }}
            onClick={() => {
              handleMode("table");
            }}
          >
            Table
          </Button>
          <Button
            variant="text"
            sx={{
              alignSelf: "flex-end",
              paddingX: 3,
              marginLeft: 2,
              fontWeight: "bold",
              color: COLORS.neutralTextBlack,
              ":hover": {
                borderColor: "transparent",
                backgroundColor: "transparent",
              },
            }}
            startIcon={
              <Image src={excelIcon} width={17} height={17} alt="excel logo" />
            }
            onClick={() => {
              questions &&
                exportExcelFile(questions, `${title} Survey Data`, getSum);
            }}
          >
            Export to Excel
          </Button>
        </Stack>
        <Stack marginLeft={1} marginTop={4} gap={2}>
          {/* <ResponsiveContainer width="100%" height="100%"> */}
          {mode !== "table" &&
            questions?.map((e, i) => {
              return (
                <Stack key={e.questionId}>
                  <Typography>{i + 1 + ")  " + e.questionTitle}</Typography>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    alignContent="start"
                    gap={handleGapForStack}
                    paddingX={4}
                  >
                    {renderCharts(e)}
                    <Stack>
                      {e.answers.map((e, i) => {
                        return (
                          <Stack
                            direction="row"
                            gap={2}
                            alignItems="start"
                            key={e.answerId}
                          >
                            <Box
                              minWidth={"15px"}
                              height={"15px"}
                              borderRadius={"20px"}
                              bgcolor={COLORSARRAY[i]}
                              marginTop={0.5}
                            />
                            <Typography>{e.answer}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}

          {/* </ResponsiveContainer> */}
          {mode === "table" && (
            <SurveyTable getSum={getSum} questions={questions} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{ alignSelf: "center", marginBottom: 4 }}
      ></DialogActions>
    </BasicModalDialog>
  );
};

export { SurveyResultsDialog };
