interface SurveyResult {
  question: string;
  type: "MC" | "CB";
  answers: {
    option: string;
    count: number;
  }[];
}

const SampleDataResults: {
  title: string;
  description: string;
  questions: SurveyResult[];
} = {
  questions: [
    {
      question: "Do you own a vehicle?",
      type: "MC",
      answers: [
        { option: "Yes", count: 54 },
        { option: "No", count: 12 },
      ],
    },
    {
      question: "What year you brought your vehicle?",
      type: "MC",
      answers: [
        { option: "2015", count: 78 },
        { option: "2016", count: 90 },
        { option: "2017", count: 23 },
        { option: "2021", count: 7 },
      ],
    },
    {
      question: "When you use your vehicle?",
      type: "CB",
      answers: [
        { option: "Go to office", count: 54 },
        { option: "Go out with family", count: 32 },
        { option: "Go Trips", count: 4 },
      ],
    },
  ],
  title: "Survey Regarding Vehicle Usage Among Employees",
  description:
    "A vehicle (from Latin: vehiculum) is a machine that transports people or cargo. Vehicles include wagons, bicycles, motor vehicles railed vehicles",
};

export { SampleDataResults };
