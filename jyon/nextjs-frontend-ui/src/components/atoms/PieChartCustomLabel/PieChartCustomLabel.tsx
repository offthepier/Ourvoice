import IAnswer from "@/types/IAnswer";
import React from "react";

const RADIAN = Math.PI / 180;

const PieChartCustomLabel = (props: any) => {
  console.log("rendered");
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, answers } =
    props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const filteredAnswersWithCount = answers.filter(
    (answer: IAnswer) => answer.count !== 0
  );
  console.log(filteredAnswersWithCount);
  const filteredAnswersLength = filteredAnswersWithCount.length;
  let styles = {};

  if (filteredAnswersLength >= 0 && filteredAnswersLength <= 3) {
    styles = { fontSize: "15px" };
  } else if (filteredAnswersLength >= 4 && filteredAnswersLength <= 6) {
    styles = { fontSize: "13px" };
  } else if (filteredAnswersLength >= 7 && filteredAnswersLength <= 10) {
    styles = { fontSize: "11px" };
  }

  return (percent * 100).toFixed(0) != "0" ? (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      style={styles}
      dominantBaseline="central"
    >
      {filteredAnswersLength ? `${(percent * 100).toFixed(0)}%` : "0%"}
    </text>
  ) : (
    <text></text>
  );
};

const CustomPieChartLabel = React.memo(PieChartCustomLabel);

export default CustomPieChartLabel;
