import { Alert, Box, Skeleton, Typography } from "@mui/material";
import {
  ModelDialog,
  SideBar,
  SurveyPreviewDialog,
} from "@/components/molecules";
import { SurveyItemMP, SurveyToolbarMP } from "@/components/atoms";

import Head from "next/head";
import ISurvey from "@/service/Surveys/ISurveys.interface";
import { Stack } from "@mui/system";
import { SurveyResultsDialog } from "@/components/molecules/SurveyResultsDialog/SurveyResultsDialog.component";
import SurveyService from "@/service/Surveys/Surveys.service";
import { SurveyWrapper } from "@/components/organism";
import { errorIcon } from "@/assets/index";
import { useQuery } from "react-query";
import { useState } from "react";
import withAuthMP from "src/hoc/withAuthMP";

const PublishedSurveys = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);
  const [showResult, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const { isLoading, data, error } = useQuery<ISurvey[], Error>(
    "published-survey-items",
    async () => {
      return await SurveyService.getMPSurveys();
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  //Get Sum of responses from survey
  const getSum = (e: ISurvey) => {
    let sum = 0;

    if (e.questions) {
      for (const question of e.questions) {
        for (const answer of question.answers) {
          sum += answer.count || 0;
        }
      }
    }

    return sum;
  };

  return (
    <>
      <Head>
        <title>Published Survey</title>
      </Head>
      <SurveyWrapper childrenLeft={<SideBar />}>
        <SurveyToolbarMP selected="viewSurveys" />
        <Box
          bgcolor="white"
          width="100%"
          borderRadius={"16px"}
          border="0.911773px solid #E7E8F2"
          padding={2}
          paddingX={4}
          marginTop={2}
        >
          <Stack>
            <Typography variant="h6">Published Surveys</Typography>
            <Stack marginTop={2}>
              {data &&
                data?.map((e) => {
                  return (
                    <SurveyItemMP
                      key={e.surveyID}
                      surveyItem={e}
                      onClickResults={() => {
                        if (getSum(e) > 0) {
                          setShowResults(true);
                          setSelectedSurvey(e);
                        } else {
                          setNoResults(true);
                        }
                      }}
                      onClickView={() => {
                        setShowPreview(true);
                        setSelectedSurvey(e);
                      }}
                    />
                  );
                })}

              {isLoading && <Skeleton height={150} />}
            </Stack>
          </Stack>
        </Box>
        {error && <Alert severity="error">{error?.message}</Alert>}
      </SurveyWrapper>

      <SurveyPreviewDialog
        open={showPreview && selectedSurvey ? true : false}
        onClose={() => {
          setShowPreview(false);
        }}
        questions={selectedSurvey?.questions}
        title={selectedSurvey?.surveyTitle}
        description={selectedSurvey?.surveyDesc}
        expiration={selectedSurvey?.expireDate}
        disabled={true}
      />

      <SurveyResultsDialog
        open={showResult}
        onClose={() => setShowResults(false)}
        title={selectedSurvey?.surveyTitle}
        description={selectedSurvey?.surveyDesc}
        questions={selectedSurvey?.questions}
      />

      <ModelDialog
        open={noResults}
        title="No results yet!"
        onClickAction={() => {
          setNoResults(false);
        }}
        onClose={() => {
          setNoResults(false);
        }}
        imageUrl={errorIcon}
        buttonText="Back"
      />
    </>
  );
};

export default withAuthMP(PublishedSurveys);
