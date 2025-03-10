import IUser from "../../src/models/User";

const getTestUser = () => {
  const user: IUser = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@gmail.com",
    electorate: {
      federalElectorate: "Higgins",
      localElectorate: "Monash",
      stateElectorate: "Ashwood - Chadstone",
    },
    geoLocation: {
      country: "Australia",
      postCode: "3147",
      suburb: "ashwood",
    },
    id: "e964ae31-bf12-4bc5-8f81-a089fc1de42a",
    imageUrl:
      "https://ourvoice-assets-dev.s3.ap-southeast-2.amazonaws.com/e85c9e88-bf37-4034-be41-039df299ca970_UGfqDrqdmzso8Gdq.jpeg",
    role: "MP",
    score: 21,
    gender: "MALE"
  };

  return user;
};

export { getTestUser };
