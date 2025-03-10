import { errorIcon, successImage } from "@/assets/index";
import { SurveyToolbar } from "@/components/atoms";
import { SurveyItem } from "@/components/atoms/SurveyItem/SurveyItem";
import {
  ModelDialog,
  SideBar,
  SurveyResponseDialog,
} from "@/components/molecules";
import { SurveyWrapper } from "@/components/organism";
import ISurvey from "@/service/Surveys/ISurveys.interface";
import SurveyService from "@/service/Surveys/Surveys.service";
import { ISurveyResponseItem } from "@/types/ISurveyResponse";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import withAuth from "src/hoc/withAuth";

const PendingSurveys = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);

  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setSuccess] = useState(false);
  const [showEmptyError, setShowEmptyError] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, data, error } = useQuery<ISurvey[], Error>(
    "user-survey-items",
    async () => {
      return await SurveyService.getUserSurveys();
    },
    {
      onSuccess: () => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const { mutateAsync, error: createError } = useMutation(
    SurveyService.sendResponse,
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user-survey-items"]);
        console.log("success", res);
        setSuccess(true);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const validateResponse = (submitted: ISurveyResponseItem[]): boolean => {
    for (const item of submitted) {
      if (item.answers.length > 0) {
        return true;
      }
    }

    return false;
  };

  const submitResponse = async (submitted: ISurveyResponseItem[]) => {
    if (!validateResponse(submitted)) {
      setShowEmptyError(true);
      return;
    }
    setShowPreview(false);
    try {
      await mutateAsync({
        surveyID: selectedSurvey?.surveyID || "",
        questions: submitted,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>Pending Survey</title>
      </Head>
      <SurveyWrapper childrenLeft={<SideBar />}>
        <SurveyToolbar selected="pending" />

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
            <Typography variant="h6">Pending Surveys</Typography>
            <Stack marginTop={2}>
              {data &&
                data?.map((e) => {
                  return (
                    <SurveyItem
                      key={e.surveyID}
                      surveyItem={e}
                      onClick={() => {
                        setShowPreview(true);
                        setSelectedSurvey(e);
                      }}
                      actionType="getStarted"
                    />
                  );
                })}
              {!data ||
                (data?.length == 0 && (
                  <Typography textAlign="center" m={4}>
                    No surveys are available for the moment
                  </Typography>
                ))}
              {isLoading && <Skeleton height={150} />}
            </Stack>
            {error && <Alert severity="error">{error?.message}</Alert>}
          </Stack>
        </Box>

        {createError && (
          <Alert sx={{ marginX: 10, marginTop: 2 }} severity="error">
            {createError.message}
          </Alert>
        )}
      </SurveyWrapper>

      <ModelDialog
        open={showSuccess}
        title={"Thank you for completing the survey!"}
        onClickAction={() => {
          setSuccess(false);
        }}
        imageUrl={successImage}
        buttonText="Done"
      />

      <ModelDialog
        open={showEmptyError}
        title={"Can't submit without any responses"}
        onClickAction={() => {
         
          setShowEmptyError(false);
        }}
        imageUrl={errorIcon }
        buttonText="Done"
      />

      <SurveyResponseDialog
        open={showPreview && selectedSurvey ? true : false}
        onClose={() => {
          setShowPreview(false);
        }}
        onClickAction={submitResponse}
        questions={selectedSurvey?.questions}
        title={selectedSurvey?.surveyTitle}
        description={selectedSurvey?.surveyDesc}
        expiration={selectedSurvey?.expireDate}
      />
    </>
  );
};

export default withAuth(PendingSurveys);
