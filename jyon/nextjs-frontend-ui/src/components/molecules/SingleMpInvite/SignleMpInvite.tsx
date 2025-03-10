"use client";
import MpCreationService from "@/service/AdminService/Admin.service";
import {
  Alert,
  Box,
  Collapse,
  FormLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FormInputWrapper, FormWrapper } from "@/components/atoms";
import { useMutation } from "react-query";
import COLORS from "@/themes/colors";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mpDetailsValidation } from "./Logic/mpDetailsValidation";
import IAdmin from "./Logic/Admin.interface";
import CloseIcon from "@mui/icons-material/Close";
import { MP_INVITE } from "./Logic/profile.const";
import { SendInvitesButton } from "@/components/atoms/SendInvitesButton/SendInvitesButton";

const SingleMpInvite = () => {
  const [open, setOpen] = React.useState(false);
  const [error, setErrorText] = useState("");
  const [success, setSuccessText] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAdmin>({
    resolver: yupResolver(mpDetailsValidation),
    defaultValues: {},
  });

  const { mutateAsync: mpInvite, reset: mpReset } = useMutation(
    MpCreationService.createNewMP,
    {
      onSuccess: (res) => {
        if (!res) {
          setErrorText(MP_INVITE.ERROR);
          setSuccessText("");
          clearForm();
        } else {
          setErrorText("");
          setSuccessText(MP_INVITE.INVITE);
          clearForm();
        }
      },
      onError: (err: any) => {
        console.log(err);
      },
      // added
      onSettled: () => {
        mpReset(); // reset the loading state by calling mutateAsync again
      },
    }
  );

  //API implementation

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setOpen(true);

    try {
      await mpInvite({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        electorateType: data.electorateType.trim(),
        electorateName: data.electorateName.trim(),
      });
    } catch (error: any) {
      console.log(error, "came");
    }
  });

  const clearForm = () => {
    reset();
  };

  return (
    <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: "12px" }}>
      <FormWrapper component="form">
        {error ? (
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Collapse>
        ) : (
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {success}
            </Alert>
          </Collapse>
        )}

        <Box marginX={4}>
          <Typography
            sx={{ fontWeight: 600, fontSize: "21px", color: "#231F20" }}
          >
            Sending an Invitation
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              color: COLORS.greyIcon,
            }}
          >
            Enter an email address to send invitation
          </Typography>
          <Box mt={2} />
          <FormInputWrapper>
            <FormLabel>Name*</FormLabel>
            <TextField
              sx={{
                width: { sm: "100%", md: "100%", lg: "70%" },
              }}
              type="text"
              placeholder="Enter name"
              {...register("fullName")}
              error={errors.fullName ? true : false}
              helperText={errors.fullName?.message}
              inputProps={{ style: { textTransform: "capitalize" } }}
              variant="outlined"
            />
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <FormLabel>Email*</FormLabel>
            <TextField
              sx={{
                width: { sm: "100%", md: "100%", lg: "70%" },
              }}
              type="text"
              placeholder="Enter email"
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email?.message}
              variant="outlined"
            />
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <FormLabel>Electorate Type*</FormLabel>
            <TextField
              select
              sx={{ width: { sm: "100%", md: "100%", lg: "70%" } }}
              defaultValue="FEDERAL"
              {...register("electorateType")}
              // error={errors.electorateType ? true : false}
              // helperText={errors.electorateType?.message}
            >
              <MenuItem key={999} value={"FEDERAL"}>
                FEDERAL
              </MenuItem>
              <MenuItem key={999} value={"LOCAL"}>
                LOCAL
              </MenuItem>
              <MenuItem key={999} value={"STATE"}>
                STATE
              </MenuItem>
            </TextField>
          </FormInputWrapper>
          <FormInputWrapper marginTop={2}>
            <FormLabel>Electorate Name*</FormLabel>
            <TextField
              sx={{
                width: { sm: "100%", md: "100%", lg: "70%" },
              }}
              type="text"
              placeholder="Enter electorate name"
              variant="outlined"
              {...register("electorateName")}
              error={errors.electorateName ? true : false}
              helperText={errors.electorateName?.message}
            />
          </FormInputWrapper>
          <FormInputWrapper marginTop={3}>
            <SendInvitesButton onClick={onSubmit} />
          </FormInputWrapper>
        </Box>
      </FormWrapper>
    </Box>
  );
};

export { SingleMpInvite };
