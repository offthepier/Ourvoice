import {
  Alert,
  Button,
  CssBaseline,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  AuthPageWrapper,
  EdgeTextField,
  PasswordTooltip,
  ShowPasswordButton,
} from "../../../components";
import {
  FormInputWrapper,
  FormWrapper,
} from "../../../components/atoms/StyledComponents";
import React, { useContext, useState } from "react";

import { AuthContext } from "../../../context/AuthContext";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import Head from "next/head";
import ISignIn from "@/service/Authentication/SignIn/SignIn.interface";
import ISignInInputs from "./SignInInputs.interface";
import SignInService from "@/service/Authentication/SignIn/SignIn.service";
import { Stack } from "@mui/system";
import { cloneDeepWith } from "lodash-es";
import { signInValidations } from "./Logic/signUpValidations";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = ({ redirectPath }: { redirectPath?: string }) => {
  //State to Manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  //state for errors
  const [error, setError] = useState("");
  //state for track loading request
  const [loading, setLoading] = useState(false);

  //React Router Navigator
  const navigate = useRouter();

  const { setUserSession } = useContext(AuthContext);

  //Use form validation hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInInputs>({
    resolver: yupResolver(signInValidations),
  });

  //Called when SignIn Failed
  const onSignInFailure = (err: any, data: ISignIn) => {
    setError(err.message);
    setLoading(false);
    if (err.code == "UserNotConfirmedException") {
      navigate.push("/auth/confirmEmail", {
        query: {
          email: data.email,
        },
      });
    }
  };

  //Called when SignIn Success
  const onSignInSuccess = (results: CognitoUserSession) => {
    setLoading(false);
    setUserSession(results);
    if (redirectPath) {
      navigate.push(redirectPath);
    } else {
      navigate.push("/");
    }
  };

  // OnSubmit the form
  const onSubmit = handleSubmit((data: any) => {
    setLoading(true);
    console.log(data);
    SignInService.login(data, onSignInFailure, onSignInSuccess);
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
        <title>Sign In</title>
      </Head>
      <CssBaseline />
      <FormWrapper
        onSubmit={handleSubmit(preSubmit)}
        component="form"
        target="none"
      >
        {error && (
          <Alert severity="error" sx={{ marginBottom: 4 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h1" fontWeight="bold">
          Sign In
        </Typography>
        <Typography variant="body1" marginTop={3}>
          Welcome to itsourvoice.com, please enter your login credentials below
          to start using the app.
        </Typography>
        {/* <Stack direction="row"> */}
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
            placeholder="Your Email "
            {...register("email")}
            error={errors.email ? true : false}
            helperText={errors.email?.message}
          />
        </FormInputWrapper>

        <FormInputWrapper marginTop={4}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ width: { sm: "20%", md: "100%", lg: "20%" } }}
          >
            <FormLabel
              sx={{
                marginBottom: {
                  lg: errors.password ? "24px" : 0,
                },
              }}
            >
              Password*
            </FormLabel>
            <PasswordTooltip isError={errors.password ? true : false} />
          </Stack>

          <EdgeTextField
            sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
            type={passwordVisible ? "text" : "password"}
            placeholder="Your Password"
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <ShowPasswordButton
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  visibility={passwordVisible}
                />
              ),
            }}
            {...register("password")}
            autoComplete="new-password"
            error={errors.password ? true : false}
            helperText={errors.password?.message}
          />
        </FormInputWrapper>
        <Typography
          marginTop={2}
          align="right"
          fontWeight="bold"
          variant="body1"
        >
          <Link
            href="/auth/resetPassword"
            sx={{ color: "black", fontWeight: "bold", textDecoration: "none" }}
          >
            Forgot Password?
          </Link>
        </Typography>

        <Stack direction="row" justifyContent="end" marginTop={8}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
          >
            Sign In
          </Button>
        </Stack>

        <Stack direction="row" marginTop={6} justifyContent="flex-end">
          <Typography marginRight={1}>Don&apos;t have an account?</Typography>
          <Link
            href="/auth/signUp"
            sx={{ color: "black", fontWeight: "bold", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </Stack>
      </FormWrapper>
    </AuthPageWrapper>
  );
};

export default Login;
