import IQuestion from "@/types/Question.interface";

const SampleData: { questions: IQuestion[] } = {
  questions: [
    {
      questionTitle: "Do you own a vehicle?",
      questionType: "MC",
      answers: [{ answer: "Yes" }, { answer: "No" }],
    },
    {
      questionTitle: "What year you brought your vehicle?",
      questionType: "MC",
      answers: [
        { answer: "2015" },
        { answer: "2107" },
        { answer: "2018" },
        { answer: "2020" },
      ],
    },
    {
      questionTitle: "When you use your vehicle?",
      questionType: "CB",
      answers: [
        { answer: "Go to office" },
        { answer: "Go for out" },
        { answer: "Go Trips" },
      ],
    },
  ],
};

export { SampleData };
