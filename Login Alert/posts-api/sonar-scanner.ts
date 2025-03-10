import * as scanner from "sonarqube-scanner";

// config the environment

// The URL of the SonarQube server. Defaults to http://localhost:9000
const serverUrl = "https://sonarqube.swiveltech.lk";
// const serverUrl = "http://localhost:9000";


// The token used to connect to the SonarQube/SonarCloud server. Empty by default.
const token = "squ_35fb288867731f094ecf3164c389b208d6da18a9";
// const token = "sqp_d02bbde674081651e7820648ffeccf024e81579a";

// projectKey must be unique in a given SonarQube instance

const projectKey = "our-voice-posts-api";

const options = {

  "sonar.projectKey": projectKey,

  // projectName - defaults to project key

  "sonar.projectName": "our-voice-posts-api",

  // Path is relative to the sonar-project.properties file. Defaults to .

  "sonar.sources": "src",

  // source language

  "sonar.language": "ts",

  "sonar.projectVersion": "1.0.0",

  "sonar.javascript.lcov.reportPaths": "tests/coverage/lcov.info",

  // Encoding of the source code. Default is default system encoding

  "sonar.sourceEncoding": "UTF-8",

};

// parameters for sonarqube-scanner

const params = {

  serverUrl,

  token,

  options,

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