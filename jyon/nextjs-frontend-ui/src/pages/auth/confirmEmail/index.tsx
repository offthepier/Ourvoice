import {
  Alert,
  Button,
  CssBaseline,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthPageWrapper, ModelDialog } from "../../../components";
import {
  FormInputWrapper,
  FormWrapper,
} from "../../../components/atoms/StyledComponents";
import React, { useState } from "react";

import { EmailVerifySuccessImage } from "../../../assets";
import { FEEDBACK_VERIFY_EMAIL } from "./Logic/feedbacks.const";
import Head from "next/head";
import IConfirmEmail from "./ConfirmEmail.interface";
import { ISignUpResult } from "amazon-cognito-identity-js";
import { Stack } from "@mui/system";
import VerifyEmailService from "@/service/Authentication/VerifyEmail/VerifyEmail.service";
import { confirmEmailValidations } from "./Logic/confirmCodeValidations";
import { makeStyles } from "@mui/styles";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles({
  input: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
});

const ConfirmEmail = () => {
  const classes = useStyles();
  //state for errors
  const [error, setError] = useState("");
  //state for track loading request
  const [loading, setLoading] = useState(false);
  //show resend code message
  const [codeAlert, setCodeAlert] = useState("");
  //show success message
  const [showSuccess, setShowSuccess] = useState(false);

  //React Router Navigator
  const navigate = useRouter();

  const { email } = navigate.query as { email: string };

  //get location params
  // const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IConfirmEmail>({
    resolver: yupResolver(confirmEmailValidations),
  });

  //Called when SignIn Failed
  const onVerifyFailure = (err: any) => {
    setError(err.message);
    setLoading(false);
    setCodeAlert("");
  };

  //Called when SignIn Success
  const onVerifySuccess = (results: ISignUpResult) => {
    setLoading(false);
    setShowSuccess(true);
  };

  //Called when SignIn Failed
  const onResendCodeFailure = (err: any) => {
    setError(err.message);
    setCodeAlert("");
    setLoading(false);
  };

  //Called when SignIn Success
  const onResendCodeSuccess = (results: any) => {
    setLoading(false);
    setError("");
    setCodeAlert("Resent Code Successful, Please check your email!");
  };

  // OnSubmit the form
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    console.log(data);
    VerifyEmailService.verifyEmail(
      { email: email, code: data.code },
      onVerifyFailure,
      onVerifySuccess
    );
  });

  const handleResendCode = () => {
    VerifyEmailService.sendVerificationCode(
      { email: email },
      onResendCodeFailure,
      onResendCodeSuccess
    );
  };

  return (
    <>
      <Head>
        <title>Confirm Email</title>
      </Head>
      <AuthPageWrapper>
        <CssBaseline />
        <FormWrapper
          component="form"
          onSubmit={(e: any) => {
            onSubmit(e);
          }}
        >
          {error && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {error}
            </Alert>
          )}
          {codeAlert && (
            <Alert severity="success" sx={{ marginBottom: 4 }}>
              {codeAlert}
            </Alert>
          )}

          <Typography variant="h1" fontWeight="bold" marginTop={4}>
            Verify Email
          </Typography>
          <Typography variant="body1" marginTop={3}>
            Please enter the code you received in the email to verify your
            Email.
          </Typography>
          {/* <Stack direction="row"> */}

          <FormInputWrapper marginTop={8}>
            <FormLabel
              sx={{
                marginBottom: {
                  xs: 2,
                  sm: 0,
                  md: 2,
                  lg: errors.code ? "24px" : 0,
                },
              }}
            >
              Code*
            </FormLabel>
            <TextField
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              type="number"
              className={classes.input}
              placeholder="Code"
              {...register("code")}
              error={errors.code ? true : false}
              helperText={errors.code?.message}
            />
          </FormInputWrapper>

          <Stack
            direction="row"
            marginTop={6}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography marginRight={1}>Didn&apos;t get the code?</Typography>
            <Link
              onClick={handleResendCode}
              sx={{
                color: "black",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Resend
            </Link>
          </Stack>

          <Stack direction="row" justifyContent="end" marginTop={4}>
            <Button
              variant="contained"
              size="medium"
              type="submit"
              disabled={loading}
              sx={{ padding: 1.5, paddingX: 6 }}
            >
              Verify Email
            </Button>
          </Stack>

          <Stack direction="row" marginTop={6} justifyContent="flex-end">
            <Typography marginRight={1}>Already have an account?</Typography>
            <Link
              href="/auth/login"
              sx={{
                color: "black",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </Stack>
        </FormWrapper>
      </AuthPageWrapper>

      <ModelDialog
        title={FEEDBACK_VERIFY_EMAIL.emailVerificationSuccess.title}
        description={FEEDBACK_VERIFY_EMAIL.emailVerificationSuccess.description}
        buttonText="Back to Sign In"
        imageUrl={EmailVerifySuccessImage}
        onClickAction={() => {
          navigate.push("/auth/login");
        }}
        open={showSuccess}
      />
    </>
  );
};

export default ConfirmEmail;
