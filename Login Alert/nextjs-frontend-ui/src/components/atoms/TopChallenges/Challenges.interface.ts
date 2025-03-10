import ITopChallenge from "src/service/Challenges/Challenges.interface";

interface Icontent {
  text: string;
  challenges: ITopChallenge[];
  btnText?: string;
  btnAltText?: string;
}

export default Icontent;
