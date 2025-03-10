import { SurveyToolbar } from "@/components/atoms";
import { SurveyItem } from "@/components/atoms/SurveyItem/SurveyItem";
import { SideBar, SurveyPreviewDialog } from "@/components/molecules";
import { SurveyWrapper } from "@/components/organism";
import ISurvey from "@/service/Surveys/ISurveys.interface";
import SurveyService from "@/service/Surveys/Surveys.service";
import { Box, Skeleton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Head from "next/head";
import { useState } from "react";
import { useQuery } from "react-query";
import withAuth from "src/hoc/withAuth";

const CompletedSurveys = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);

  const { isLoading, data } = useQuery<ISurvey[], Error>(
    "completed-survey-items",
    async () => {
      return await SurveyService.getUserCompletedSurveys();
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Completed Survey</title>
      </Head>
      <SurveyWrapper childrenLeft={<SideBar />}>
        <SurveyToolbar selected="viewSurveys" />
        <Box
          bgcolor="white"
          width="100%"
          borderRadius={"16px"}
          border="0.911773px solid #E7E8F2"
          padding={2}
          paddingX={4}
          marginTop={2}
          // maxWidth="790px"
        >
          <Stack>
            <Typography variant="h6">Completed Surveys</Typography>
            <Stack marginTop={2}>
              {!data ||
                (data?.length == 0 && (
                  <Typography textAlign="center" m={4}>
                    No surveys are available for the moment
                  </Typography>
                ))}
              {isLoading && <Skeleton height={150} />}

              {data &&
                data?.map((e) => {
                  return (
                    <SurveyItem
                      key={e.surveyID}
                      surveyItem={e}
                      // onClickResults={() => {
                      //   // setShowResults(true);
                      //   setSelectedSurvey(e);
                      // }}
                      onClick={() => {
                        setShowPreview(true);
                        setSelectedSurvey(e);
                      }}
                      actionType="preview"
                    />
                  );
                })}
            </Stack>
          </Stack>
        </Box>
      </SurveyWrapper>

      <SurveyPreviewDialog
        open={showPreview}
        onClose={() => {
          setShowPreview(false);
        }}
        questions={selectedSurvey?.questions}
        title={selectedSurvey?.surveyTitle}
        description={selectedSurvey?.surveyDesc}
        expiration={selectedSurvey?.expireDate}
        disabled={true}
      />
    </>
  );
};

export default withAuth(CompletedSurveys);
