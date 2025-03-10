import {
  Alert,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormHelperText,
  FormLabel,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  AuthPageWrapper,
  EdgeTextField,
  ModelDialog,
  PasswordTooltip,
  ShowPasswordButton,
} from "../../../components";
import {
  FormInputWrapper,
  FormWrapper,
} from "../../../components/atoms/StyledComponents";
import React, { useEffect, useState } from "react";

import { AUTH_FLOW_LAMBDA_ERRORS } from "@/constants/ErrorCodes.const";
import { COUNTRY_LIST } from "../../../constants/CountryList.const";
import { FEEDBACK_SIGNUP } from "./Logic/feedbacks.const";
import Head from "next/head";
import ISignUp from "@/service/Authentication/SignUp/SignUp.interface";
import { ISignUpResult } from "amazon-cognito-identity-js";
import { NotAvailableCountryImage } from "@/assets/index";
import SignUpInputs from "./SignUpInputs.interface";
import SignUpService from "@/service/Authentication/SignUp/SignUp.service";
import { Stack } from "@mui/system";
import { cloneDeepWith } from "lodash-es";
import { signUpValidations } from "./Logic/signUpValidations";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import COLORS from "@/themes/colors";
import { TERMS_CONDITIONS_PAGE_URL } from "@/constants/SignUpPageData";

const SignUp = () => {
  //State to Manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  //state for errors
  const [error, setError] = useState("");
  //state to show country dialog
  const [naCountry, setNaCountry] = useState(false);

  const [country, setCountry] = useState("Australia");
  //React Router Navigator
  const navigate = useRouter();

  //Get Query Params
  //SignUp Ref Code
  // const refToken = searchParams.get("refToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<SignUpInputs>({
    resolver: yupResolver(signUpValidations),
  });

  //Called when SignIn Failed
  const onSignUpFailure = (err: any) => {
    if (
      err.message == AUTH_FLOW_LAMBDA_ERRORS.PRE_SIGNUP_FAILED_INVALID_LOCATION
    ) {
      setError(FEEDBACK_SIGNUP.invalidLocation);
      setFormError("suburb", { message: "Please check again" });
      setFormError("postalCode", { message: "Please check again" });
    } else setError(err.message);
  };

  //Called when SignIn Success
  const onSignUpSuccess = (results: ISignUpResult, data: ISignUp) => {
    navigate.push({
      pathname: "/auth/confirmEmail",
      query: {
        email: data.email,
      },
    });
  };

  // OnSubmit the form
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    SignUpService.signUp({ ...data }, onSignUpFailure, onSignUpSuccess);
  });

  //Check country is available or not
  useEffect(() => {
    if (country != "def" && country != "Australia") {
      setNaCountry(true);
      setCountry("Australia");
    }
  }, [country]);

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
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <AuthPageWrapper>
        <CssBaseline />
        <FormWrapper
          component="form"
          onSubmit={handleSubmit(preSubmit)}
          width={"100%"}
        >
          {error && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h1" fontWeight="bold">
            Sign Up
          </Typography>
          <Typography variant="body1" marginTop={2}>
            Get access to exclusive features by creating an account.
          </Typography>
          {/* <Stack direction="row"> */}
          <FormInputWrapper marginTop={5}>
            <FormLabel
              sx={{
                marginBottom: {
                  lg: errors.firstName || errors.lastName ? "24px" : 0,
                },
              }}
            >
              Name*
            </FormLabel>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              gap={2}
            >
              <TextField
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                fullWidth
              />
              <TextField
                type="text"
                placeholder="Last Name"
                fullWidth
                {...register("lastName")}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            </Stack>
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <FormLabel
              sx={{
                marginBottom: {
                  lg: errors.email ? "24px" : 0,
                },
              }}
            >
              Email*
            </FormLabel>
            <TextField
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              type="email"
              placeholder="Email"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <FormLabel
              sx={{
                marginBottom: {
                  lg: errors.country ? "24px" : 0,
                },
                width: { sm: "20%", md: "100%", lg: "20%" },
              }}
            >
              Registered Address *
            </FormLabel>
            <TextField
              select
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              inputProps={register("country")}
              defaultValue="Australia"
              error={Boolean(errors.country)}
              helperText={errors.country?.message}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            >
              {/* <MenuItem key={999} value={"def"}>
                Your Country
              </MenuItem> */}
              {COUNTRY_LIST.map((e) => {
                return (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <Box />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              gap={2}
            >
              <TextField
                type="text"
                placeholder="Suburb"
                fullWidth
                {...register("suburb")}
                error={Boolean(errors.suburb)}
                helperText={errors.suburb?.message}
              />
              <TextField
                type="text"
                placeholder="Postal Code"
                fullWidth
                {...register("postalCode")}
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode?.message}
              />
            </Stack>
          </FormInputWrapper>

          <FormInputWrapper marginTop={2}>
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
              placeholder="Password"
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
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </FormInputWrapper>

          <FormInputWrapper marginTop={2}>
            <FormLabel
              sx={{
                width: { sm: "20%", md: "100%", lg: "20%" },
                marginBottom: { lg: errors.confirmPassword ? "24px" : 0 },
              }}
            >
              Confirm Password*
            </FormLabel>
            <EdgeTextField
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <ShowPasswordButton
                    onClick={() => {
                      setConfirmPasswordVisible(!confirmPasswordVisible);
                    }}
                    visibility={confirmPasswordVisible}
                  />
                ),
              }}
            />
          </FormInputWrapper>

          <FormInputWrapper marginTop={2.7}>
            <FormLabel
              sx={{
                width: { sm: "20%", md: "100%", lg: "20%" },
              }}
            ></FormLabel>
            <Stack
              direction="column"
              sx={{ width: { sm: "100%", md: "100%", lg: "70%" } }}
            >
              <Stack direction="row" gap={2}>
                <Checkbox
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: "22px",
                      color: "gray",
                    },
                    padding: "0px",
                  }}
                  {...register("acceptedTerms")}
                />
                <Typography component={"span"}>
                  I accept the{" "}
                  <a
                    style={{ color: COLORS.neutralTextBlack }}
                    target="_blank"
                    href={TERMS_CONDITIONS_PAGE_URL}
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              </Stack>
              {errors.acceptedTerms?.message && (
                <FormHelperText
                  sx={{
                    marginLeft: "9%",
                    paddingTop: "0px",
                    color: COLORS.dangerColor,
                  }}
                >
                  {errors.acceptedTerms?.message}
                </FormHelperText>
              )}
            </Stack>
          </FormInputWrapper>

          <Stack direction="row" justifyContent="end" marginTop={4}>
            <Button variant="contained" size="large" type="submit">
              Sign Up
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
        title={FEEDBACK_SIGNUP.notAvailableCountry.title}
        description={FEEDBACK_SIGNUP.notAvailableCountry.description}
        imageUrl={NotAvailableCountryImage}
        onClose={() => {
          setNaCountry(false);
        }}
        open={naCountry}
      />
    </>
  );
};

export default SignUp;
