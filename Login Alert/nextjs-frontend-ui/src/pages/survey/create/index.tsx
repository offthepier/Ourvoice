import { successImage } from "@/assets/index";
import { Question, SurveyToolbarMP } from "@/components/atoms";
import { RefInQuestion } from "@/components/atoms/Question/Question";
import {
  ModelDialog,
  SideBar,
  SurveyPreviewDialog,
} from "@/components/molecules";
import { SurveyWrapper } from "@/components/organism";
import { SURVEY_DESCRIPTION_LENGTH } from "@/constants/SurveyTextLengths.const";
import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/context/AuthContext";
import SurveyService from "@/service/Surveys/Surveys.service";
import IQuestion from "@/types/Question.interface";
import {
  Alert,
  Box,
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  Menu,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useMutation } from "react-query";
import withAuthMP from "src/hoc/withAuthMP";
import { FEEDBACK_SURVEY } from "./Logic/feedbacks.const";
import EmojiPicker from "emoji-picker-react";
import { InsertEmoticon } from "@mui/icons-material";

const NewSurvey = () => {
  const [validations] = useState("");

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiration, setExpiration] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    expiration: "",
    questions: "",
  });

  const { getUser } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [anchorElDescription, setAnchorElDescription] =
    React.useState<null | HTMLElement>(null);
  const openDescription = Boolean(anchorElDescription);
  const handleCloseDescription = () => {
    setAnchorElDescription(null);
  };
  const handleClickDescription = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElDescription(event.currentTarget);
  };

  const router = useRouter();

  const isFieldEmpty = (field: string) => !!!field.trim();

  const setFieldError = (field: string, error: any) => {
    setErrors((prevState) => ({
      ...prevState,
      [field]: error,
    }));
  };

  const checkFieldErrors = () => {
    if (isFieldEmpty(title)) {
      setFieldError("title", FEEDBACK_SURVEY.SURVEY_TITLE_REQUIRED);
      return true;
    }
    if (isFieldEmpty(description)) {
      setFieldError("description", FEEDBACK_SURVEY.SURVEY_DESCRIPTION_REQUIRED);
      return true;
    }
    if (!!!expiration) {
      setFieldError("expiration", FEEDBACK_SURVEY.SURVEY_DATE_REQUIRED);
      return true;
    }
    return false;
  };

  const checkExpirationError = () => {
    if (
      moment(expiration, "YYYY-MM-DD").isBefore(
        moment(new Date()).add(1, "day")
      )
    ) {
      setFieldError("expiration", FEEDBACK_SURVEY.SURVEY_DATE_INVALID);
      return true;
    }
    return false;
  };

  const checkQuestionsError = (question: IQuestion | undefined) => {
    if (questions.length == 0 && !question) {
      setFieldError("questions", FEEDBACK_SURVEY.SURVEY_QUESTIONS);
      return true;
    }
    return false;
  };

  const myRef = useRef<RefInQuestion>({
    handleSubmitAuto() {
      return true;
    },
  });

  const submitSurvey = async ({
    auto,
    question,
  }: {
    auto?: boolean;
    question?: IQuestion;
  }) => {
    let updating = true;
    if (!auto) updating = myRef?.current?.handleSubmitAuto(true);

    if (updating) {
      if (
        checkFieldErrors() ||
        checkExpirationError() ||
        checkQuestionsError(question)
      ) {
        return;
      }

      if (
        errors.title !== "" ||
        errors.description !== "" ||
        errors.expiration !== ""
      ) {
        return;
      }

      setErrors({ title: "", description: "", expiration: "", questions: "" });

      console.log([...questions, question]);

      try {
        await mutateAsync({
          surveyTitle: title.trim(),
          surveyDesc: description.trim(),
          expireDate: expiration,
          questions: question ? [...questions, question] : questions,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const {
    mutateAsync,
    error: createError,
    isSuccess: postingSuccess,
  } = useMutation(
    getUser()?.role == USER_ROLES.ADMIN
      ? SurveyService.createSurveyAdmin
      : SurveyService.createSurvey,
    {
      onSuccess: (res) => {
        console.log("success", res);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const addQuestion = (question: IQuestion, auto: boolean) => {
    setQuestions([...questions, question]);
    if (auto) {
      submitSurvey({ auto, question });
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((answers) => {
      return questions.filter((value, i) => i !== index);
    });
  };
  return (
    <>
      <Head>
        <title>Create Survey</title>
      </Head>
      <SurveyWrapper childrenLeft={<SideBar />}>
        <SurveyToolbarMP selected="newSurvey" />
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
          <Stack marginTop={1}>
            <FormLabel>Survey Title*</FormLabel>
            <TextField
            spellCheck={true}
              sx={{
                width: "100%",
                marginTop: "4px",
              }}
              type="text"
              placeholder="Survey Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prevState) => ({
                  ...prevState,
                  title: e.target.value.trim()
                    ? ""
                    : FEEDBACK_SURVEY.SURVEY_TITLE_REQUIRED,
                }));
              }}
              //   {...register("email")}
              error={errors.title ? true : false}
              helperText={errors.title}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" component="div" style={{}}>
                    <IconButton
                      onClick={handleClick}
                      id="basic-button"
                      sx={{ width: 40 }}
                    >
                      <InsertEmoticon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{ backgroundColor: "transparent" }}
              PaperProps={{ sx: { padding: "0px", boxShadow: "none" } }}
            >
              <EmojiPicker
                searchDisabled={true}
                previewConfig={{ showPreview: false }}
                onEmojiClick={(e) => setTitle(title + e.emoji)}
                height={350}
                width="100%"
              />
            </Menu>
          </Stack>
          <Stack marginTop={1.5}>
            <FormLabel>Survey Description*</FormLabel>
            <TextField
            spellCheck={true}
              sx={{
                width: "100%",
                marginTop: "4px",
              }}
              type="text"
              placeholder="Survey Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prevState) => ({
                  ...prevState,
                  description: e.target.value.trim()
                    ? ""
                    : FEEDBACK_SURVEY.SURVEY_DESCRIPTION_REQUIRED,
                }));
              }}
              error={errors.description ? true : false}
              helperText={errors.description}
              multiline={true}
              rows={2}
              inputProps={{ maxLength: SURVEY_DESCRIPTION_LENGTH }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" component="div" style={{}}>
                    <IconButton
                      onClick={handleClickDescription}
                      id="basic-button"
                      sx={{ width: 40, marginBottom: 2.6 }}
                    >
                      <InsertEmoticon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorElDescription}
              open={openDescription}
              onClose={handleCloseDescription}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{ backgroundColor: "transparent" }}
              PaperProps={{ sx: { padding: "0px", boxShadow: "none" } }}
            >
              <EmojiPicker
                searchDisabled={true}
                previewConfig={{ showPreview: false }}
                onEmojiClick={(e) => setDescription(description + e.emoji)}
                height={350}
                width="100%"
              />
            </Menu>
          </Stack>
          <Stack marginTop={1.5}>
            <FormLabel>Survey Expiration Date*</FormLabel>
            <TextField
              sx={{
                width: "100%",
                marginTop: "4px",
                maxWidth: "500px",
              }}
              type="date"
              placeholder="Survey Expiration Date"
              onChange={(e) => {
                setExpiration(e.target.value);
                setErrors((prevState) => ({
                  ...prevState,
                  expiration: e.target.value
                    ? ""
                    : FEEDBACK_SURVEY.SURVEY_DATE_REQUIRED,
                }));
              }}
              error={errors.expiration ? true : false}
              helperText={errors.expiration}
            />
          </Stack>
          <Stack>
            {questions?.map((e, i) => {
              return (
                <Question
                  key={e.questionId}
                  questionObj={e}
                  index={i}
                  onRemoveQuestion={handleRemoveQuestion}
                />
              );
            })}

            <Question
              onAddQuestion={addQuestion}
              ref={myRef}
              index={questions.length > 0 ? questions.length : 0}
            />

            {validations && <Alert severity="error">{validations}</Alert>}
          </Stack>
        </Box>
        {errors.questions && (
          <Alert
            sx={{ marginX: 10, marginTop: 2, fontSize: "14px" }}
            severity="error"
          >
            {errors.questions}
          </Alert>
        )}
        {createError && (
          <Alert
            sx={{ marginX: 10, marginTop: 2, fontSize: "14px" }}
            severity="error"
          >
            {createError.message}
          </Alert>
        )}
        <Stack flexDirection="row" justifyContent="center" marginTop={2}>
          <Button
            variant="contained"
            sx={{
              alignSelf: "flex-end",
              padding: 1,
              paddingX: 8,
            }}
            onClick={() => submitSurvey({})}
          >
            Publish
          </Button>
          <Button
            variant="outlined"
            sx={{
              alignSelf: "flex-end",
              padding: 1,
              paddingX: 8,
              marginLeft: 2,
            }}
            onClick={() => {
              myRef?.current?.handleSubmitAuto(false);
              setShowPreview(true);
            }}
          >
            Preview
          </Button>
        </Stack>
      </SurveyWrapper>

      <ModelDialog
        open={postingSuccess}
        title="Your survey submitted successfully!"
        onClickAction={() => {
          router.replace("/");
        }}
        imageUrl={successImage}
        buttonText="Done"
      />

      <SurveyPreviewDialog
        open={showPreview}
        onClose={() => {
          setShowPreview(false);
        }}
        onClickAction={() => {
          setShowPreview(false);
          submitSurvey({});
        }}
        questions={questions}
        title={title}
        description={description}
        expiration={expiration}
      />
    </>
  );
};

export default withAuthMP(NewSurvey);
