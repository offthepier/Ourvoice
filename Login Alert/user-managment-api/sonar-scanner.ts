import * as scanner from "sonarqube-scanner";

// config the environment

// The URL of the SonarQube server. Defaults to http://localhost:9000
const serverUrl = "https://sonarqube.swiveltech.lk";

// The token used to connect to the SonarQube/SonarCloud server. Empty by default.
const token = "squ_35fb288867731f094ecf3164c389b208d6da18a9";

// projectKey must be unique in a given SonarQube instance

// parameters for sonarqube-scanner
const params = {
  serverUrl,
  token,
};

const sonarScanner = async () => {
  console.log(serverUrl);

  if (!serverUrl) {
    console.log("SonarQube url not set. Nothing to do...");
    return;
  }

  //  Function Callback (the execution of the analysis is asynchronous).
  const callback = (result) => {
    console.log("Sonarqube scanner result:", result);
  };

  scanner(params, callback);
};

sonarScanner().catch((err) => console.error("Error during sonar scan", err));
