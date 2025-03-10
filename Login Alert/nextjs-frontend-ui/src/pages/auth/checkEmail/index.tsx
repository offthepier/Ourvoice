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

    const {email} = navigate.query as { email: string};

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
            setError("This is not your registered email!");
        }
    };

    //handle cognito call success
    const onForgotPasswordSuccess = (
        results: CognitoUserSession,
        data: IResetPassword
    ) => {
        setLoading(false);
        if (email == data.email){
            navigate.push({
                pathname: "/auth/confirmEmail",
                query: {
                    email: data.email,
                },
            });
        } else {
            setError("This is not your registered email!");
        }

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
                <title>Abnormal Login</title>
            </Head>
            <CssBaseline />
            <FormWrapper onSubmit={handleSubmit(preSubmit)} component="form">
                {error && (
                    <Alert severity="error" sx={{ marginBottom: 4 }}>
                        {error}
                    </Alert>
                )}

                <Typography variant="h1" fontWeight="bold">
                    Abnormal Login
                </Typography>
                <Typography variant="body1" marginTop={3}>
                    We Observe abnormal login of your account, please enter your email used to create the account
                    and reset your password for further login.
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
                        Send Code
                    </Button>
                </Stack>

                {/*<Stack direction="row" marginTop={6} justifyContent="flex-end">*/}
                {/*    <Typography marginRight={1}>Back to</Typography>*/}
                {/*    <Link*/}
                {/*        href="/auth/login"*/}
                {/*        sx={{ color: "black", fontWeight: "bold", textDecoration: "none" }}*/}
                {/*    >*/}
                {/*        Sign In*/}
                {/*    </Link>*/}
                {/*</Stack>*/}
            </FormWrapper>
        </AuthPageWrapper>
    );
}

export default ResetPassword;
