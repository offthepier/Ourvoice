import {
  Alert,
  Button,
  CssBaseline,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import React, { useState } from "react";
import { AuthPageWrapper } from "../../../components";
import {
  FormInputWrapper,
  FormWrapper,
} from "../../../components/atoms/StyledComponents";
import { useForm } from "react-hook-form";
import IResetInputs from "./ResetPassword.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordValidation } from "./Logic/resetPasswordValiation";
import ResetPasswordService from "@/service/Authentication/ResetPassword/ResetPassword.service";
import IResetPassword from "@/service/Authentication/ResetPassword/ResetPassword.interface";
import { useRouter } from "next/router";
import Head from "next/head";
import { cloneDeepWith } from "lodash-es";

function ResetPassword() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  //Use form validation hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetInputs>({
    resolver: yupResolver(resetPasswordValidation),
  });

  //Handle cognito call failure
  const onForgotPasswordFailure = (err: any, data: IResetPassword) => {
    setError(err.message);
    setLoading(false);
    if (
      err.code === "InvalidParameterException" ||
      err.code === "UserNotFoundException"
    ) {
      setError("Cannot find a user registered with this email!");
    }
  };

  //handle cognito call success
  const onForgotPasswordSuccess = (
    results: CognitoUserSession,
    data: IResetPassword
  ) => {
    setLoading(false);
    navigate.push({
      pathname: "/auth/confirmPassword",
      query: {
        email: data.email,
      },
    });
  };

  // OnSubmit the form
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    console.log(data);
    ResetPasswordService.resetPassword(
      data,
      onForgotPasswordFailure,
      onForgotPasswordSuccess
    );
  });

  //Remove unwanted white spaces from request object
  const preSubmit = (formValues: object) => {
    const trimmedFormValues = cloneDeepWith(formValues, (p) => {
      console.log(p);
      return typeof p === "string" ? p.trim() : undefined;
    });

    // return trimmedFormValues to on submit
    onSubmit(trimmedFormValues);
  };

  return (
    <AuthPageWrapper>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <CssBaseline />
      <FormWrapper onSubmit={handleSubmit(preSubmit)} component="form">
        {error && (
          <Alert severity="error" sx={{ marginBottom: 4 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h1" fontWeight="bold">
          Forgot password
        </Typography>
        <Typography variant="body1" marginTop={3}>
          Please enter the email you used to create the account, and we’ll send
          you a reset code.
        </Typography>
        <FormInputWrapper marginTop={6}>
          <FormLabel
            sx={{
              marginBottom: {
                xs: 2,
                sm: 0,
                md: 2,
                lg: errors.email ? "24px" : 0,
              },
            }}
          >
            Email*
          </FormLabel>
          <TextField
            sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
            type="text"
            placeholder="Your Email"
            {...register("email")}
            error={errors.email ? true : false}
            helperText={errors.email?.message}
          />
        </FormInputWrapper>

        <Stack direction="row" justifyContent="end" marginTop={6}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
          >
            Reset password
          </Button>
        </Stack>

        <Stack direction="row" marginTop={6} justifyContent="flex-end">
          <Typography marginRight={1}>Back to</Typography>
          <Link
            href="/auth/login"
            sx={{ color: "black", fontWeight: "bold", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </Stack>
      </FormWrapper>
    </AuthPageWrapper>
  );
}

export default ResetPassword;
