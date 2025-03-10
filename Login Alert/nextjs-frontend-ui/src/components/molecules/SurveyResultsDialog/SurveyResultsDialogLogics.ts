import IQuestion from "@/types/Question.interface";
import ExcelJS from "exceljs";

export const exportExcelFile = (
  apiData: IQuestion[],
  fileName: string,
  getSum: (e: IQuestion) => number
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet 1");
  sheet.properties.defaultRowHeight = 40;

  sheet.getRow(1).border = {
    bottom: { style: "thin", color: { argb: "000000" } },
  };

  sheet.getRow(1).font = {
    size: 14,
    bold: true,
  };

  sheet.columns = [
    {
      header: "Question",
      key: "question",
      width: 35,
    },
    { header: "Respondents", key: "respondents", width: 15 },
    {
      header: "Responses",
      key: "responses",
      width: 15,
    },
    {
      header: "Question Type",
      key: "questionType",
      width: 35,
    },
    {
      header: "Answer",
      key: "answer",
      width: 35,
    },
    {
      header: "Total(n)",
      key: "count",
      width: 15,
    },
    {
      header: "Total(%)",
      key: "total",
      width: 20,
    },
  ];
  let currentRowIdx = 0;
  const promise = Promise.all(
    apiData.flatMap((d) =>
      d.answers.map(async (answer, index) => {
        if (index === 0) {
          let row = sheet.addRow({
            question: d.questionTitle,
            responses: getSum(d),
            respondents: d.respondedCount,
            questionType:
              d.questionType === "MC" ? "Single-select" : "Multi-select",
            answer: answer.answer,
            count: answer.count === 0 ? "0" : answer.count,
            total:
              (answer.count && (answer.count / getSum(d)) * 100)?.toFixed(2) +
              "%",
          });
          row.border = {
            top: { style: "thin", color: { argb: "000000" } },
          };
          row.height = 40;
          currentRowIdx = sheet.rowCount;
          sheet.mergeCells(
            `A${currentRowIdx}:A${currentRowIdx + d.answers.length - 1}`
          );
          sheet.mergeCells(
            `B${currentRowIdx}:B${currentRowIdx + d.answers.length - 1}`
          );
          sheet.mergeCells(
            `C${currentRowIdx}:C${currentRowIdx + d.answers.length - 1}`
          );
          sheet.mergeCells(
            `D${currentRowIdx}:D${currentRowIdx + d.answers.length - 1}`
          );
        } else {

          sheet.getRow(currentRowIdx += 1).getCell(5).value =
            answer.answer;
          sheet.getRow(currentRowIdx).getCell(6).value =
            answer.count === 0 ? "0" : answer.count;
          sheet.getRow(currentRowIdx).getCell(7).value =
            (answer.count && (answer.count / getSum(d)) * 100)?.toFixed(2) +
            "%";
            sheet.getRow(currentRowIdx).height = 40;
            sheet.getRow(currentRowIdx).height = 40;
            sheet.getRow(currentRowIdx).height = 40;
        }
        sheet.eachRow(function (row, rowNumber) {
          row.eachCell(function (cell, colNumber) {
            if (cell.value && rowNumber !== 1) {
              row.getCell(colNumber).font = { size: 12 };
              row.getCell(colNumber).alignment = {
                vertical: "top",
                horizontal: "left",
              };
            }
          });
        });
      })
    )
  );

  promise.then(() => {
    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${fileName}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  });
};
