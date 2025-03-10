import {
  Alert,
  Button,
  CssBaseline,
  FormLabel,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import {
  AuthPageWrapper,
  ModelDialog,
  PasswordStrengthTooltip,
  ShowPasswordButton,
  EdgeTextField,
} from "../../../components";
import {
  FormInputWrapper,
  FormWrapper,
} from "../../../components/atoms/StyledComponents";
import { InfoRounded } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import IConfirmPasswordInInputs from "./ConfirmPasswordInputs.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { confirmPasswordValidation } from "./Logic/confirmPassword";
import ConfirmPasswordService from "@/service/Authentication/ConfirmPassword/ConfirmPassword.service";
import { FEEDBACK_CONFIRM_PASSWORD } from "./Logic/feedbacks.const";
import { PasswordChangedImage } from "../../../assets";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import Head from "next/head";
import { cloneDeepWith } from "lodash-es";

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
const ConfirmPassword = () => {
  const classes = useStyles();

  //State to Manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  //State to Manage new password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  //Set error
  const [error, setError] = useState("");
  //Set Loading State
  const [loading, setLoading] = useState(false);
  //show success dialog
  const [openSuccess, setOpenSuccess] = useState(false);

  //navigation
  const navigate = useRouter();
  //location params
  // const location = useLocation();
  const { email } = navigate.query as { email: string };

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IConfirmPasswordInInputs>({
    resolver: yupResolver(confirmPasswordValidation),
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

  //Run on failure
  const onConfirmPasswordFailure = (err: any) => {
    console.error(err);
    setError(err.message);
    setLoading(false);
  };

  //Called when SignIn Success
  const onConfirmPasswordSuccess = (results: string) => {
    setLoading(false);
    setOpenSuccess(true);
  };

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    ConfirmPasswordService.confirmPassword(
      {
        email: email,
        code: data.code,
        newPassword: data.newPassword,
      },
      onConfirmPasswordFailure,
      onConfirmPasswordSuccess
    );
  });

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <AuthPageWrapper>
        <CssBaseline />

        <FormWrapper component="form" onSubmit={handleSubmit(preSubmit)}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h1" fontWeight="bold">
            Reset your password
          </Typography>
          <Typography variant="body1" marginTop={3}>
            Check your email to get the reset code, If it doesn’t appear within
            a few minutes, Please check your spam folder.
          </Typography>

          <FormInputWrapper marginTop={5}>
            <FormLabel
              sx={{
                marginBottom: {
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
          <FormInputWrapper marginTop={4}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ width: { sm: "20%", md: "100%", lg: "20%" } }}
            >
              <FormLabel
                sx={{
                  marginBottom: {
                    lg: errors.newPassword ? "24px" : 0,
                  },
                }}
              >
                New Password*
              </FormLabel>
              <Tooltip
                title={<PasswordStrengthTooltip />}
                sx={{
                  marginBottom: {
                    lg: errors.newPassword ? "24px" : 0,
                  },
                }}
              >
                <IconButton>
                  <InfoRounded
                    fontSize="small"
                    sx={{ color: "#231F20", fontSize: "1rem" }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>

            <EdgeTextField
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              type={passwordVisible ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword")}
              error={errors.newPassword ? true : false}
              helperText={errors.newPassword?.message}
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
                    lg: errors.confirmPassword ? "24px" : 0,
                  },
                }}
              >
                Confirm Password*
              </FormLabel>
            </Stack>

            <EdgeTextField
              sx={{ width: { sm: "70%", md: "100%", lg: "70%" } }}
              type={newPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <ShowPasswordButton
                    onClick={() => {
                      setNewPasswordVisible(!newPasswordVisible);
                    }}
                    visibility={newPasswordVisible}
                  />
                ),
              }}
              {...register("confirmPassword")}
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message}
            />
          </FormInputWrapper>

          <Stack direction="row" justifyContent="end" marginTop={6}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
            >
              Update password
            </Button>
          </Stack>

          <Stack direction="row" marginTop={6} justifyContent="flex-end">
            <Typography marginRight={1}>Back to</Typography>
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
        {/* </Stack> */}
      </AuthPageWrapper>

      <ModelDialog
        title={FEEDBACK_CONFIRM_PASSWORD.password_changed.title}
        description={FEEDBACK_CONFIRM_PASSWORD.password_changed.description}
        buttonText="Sign In"
        imageUrl={PasswordChangedImage}
        onClickAction={() => {
          navigate.push("/auth/login");
        }}
        open={openSuccess}
      />
    </>
  );
};

export default ConfirmPassword;
