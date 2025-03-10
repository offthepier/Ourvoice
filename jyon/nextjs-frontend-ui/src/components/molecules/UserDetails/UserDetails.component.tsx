"use client";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Collapse,
  Divider,
  FormLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CloseOutlined, Help, InsertEmoticon } from "@mui/icons-material";
import {
  CustomSvgIcon,
  ElectorateTooltip,
  FormInputWrapper,
  FormWrapper,
  VerifiedBadge,
} from "@/components/atoms";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import COLORS from "@/themes/colors";
import CloseIcon from "@mui/icons-material/Close";
import IUser from "../UserPosts/UserPost.interface";
import IUserDetails from "./UserDetails.interface";
import KycVerificationService from "@/service/KYCVerification/KYCVerification.service";
import { ModelDialog } from "../ModelDialog/ModelDialog.component";
import { PROFILE_MESSAGE } from "./Logic/profile.const";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { VERIFICATION_STATUS } from "@/constants/verificationStatus";
import { makeStyles } from "@mui/styles";
import { successImage } from "@/assets/index";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { userDetailsValidation } from "./Logic/userDetailsValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import Crypto from "crypto-js";
import EmojiPicker from "emoji-picker-react";

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

  alert: {
    textAlign: "center",
    marginBottom: "2px",
  },
});

const UserDetails = ({ details }: IUser) => {
  const [interesets, setIntersts] = useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [selectedGender, setSelectedGender] = useState<unknown>(
    details?.gender || "Male"
  );
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openEmoji = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //Set values
  useEffect(() => {
    setValue("firstName", details?.firstName);
    setValue("lastName", details?.lastName);
    setValue("intro", details?.intro);
    setValue("phoneNumber", details?.phoneNumber);
    setSelectedGender(details?.gender);
    setValue("addressLine1", details?.addressLine1);
    setValue("addressLine2", details?.addressLine2);
    if (!interesets || interesets.length === 0) {
      setIntersts(details?.interests || []);
    }
    setValue("dob", details?.dob);
    setValue("city", details?.city);
    if (details?.geoLocation) {
      setValue("geoLocation.postCode", details.geoLocation.postCode);
      setValue("geoLocation.suburb", details.geoLocation.suburb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  useEffect(() => {
    if (!mounted) {
      const script = document.createElement("script");
      script.src = process.env.NEXT_PUBLIC_DIGITAL_ID_SDK_URL as string;
      script.async = true;

      //Set integrity property to prevent security issues
      // script.integrity = Crypto.MD5(
      //   Crypto.enc.Latin1.parse(process.env.NEXT_PUBLIC_ENCRYPT_KEY || "")
      // ).toString();

      document.body.appendChild(script);

      script.onload = () => {
        /* Verify with Digital iD */
        console.log("script loaded");
        (window as any)?.digitalId.init({
          clientId: process.env.NEXT_PUBLIC_DIGITAL_ID_CLIENT_ID,
          uxMode: "popup",
          onLoadComplete: () => {
            console.log("Digital ID Loaded!");
          },
          onComplete: async function (response: any) {
            console.log("Digital ID Verification Complete");
            console.log(response);
            // The OAuth grant code you need to pass to your backend;
            console.log(`Grant code: ${response.code}`);

            try {
              await verifyUser({
                grantToken: response.code,
                transactionID: response.transaction_id,
              });
              setOpenSuccessDialog(true);
            } catch (e) {
              console.log(e);
              setOpenDialog(true);
            }
            // Transaction id can be sent your backend for tracking
            //auditing purposes, or else can be ignored if not required.
            console.log(`Transaction id: ${response.transaction_id}`);
            // fetch('https://your-backend-api.example.com/digitalid', { body:
            // `code=${response.code}`, method: 'POST')
            // .then(response => response.json())
            // .then(json => console.log(`Verified as: ${json}`);
          },
          onClick: function (opts: any) {
            console.log("Clicked", opts);
          },
          onKeepAlive: function () {},
        });
      };

      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<IUserDetails>({
    resolver: yupResolver(userDetailsValidation),
    defaultValues: {},
  });

  const { mutateAsync } = useMutation(UserProfileService.updateUserdetails, {
    onSuccess: (res) => {
      setSubmitting(false); // Set submitting to false when done
      if (!res) {
        setError("Invalid suburb or postal code");
        setOpen(false); // Hide the success alert in case of error
      } else {
        setOpen(true); // Show the success alert only when mutation is successful
        setError(""); // Clear any existing error
      }
    },
    onError: (err: any) => {
      setError(err?.response?.data?.body);
      setSubmitting(false); // Set submitting to false when done
      setOpen(false); // Hide the success alert when there's an error
    },
  });

  const { mutateAsync: verifyUser } = useMutation(
    KycVerificationService.verifyUser,
    {
      onSuccess: (res) => {
        setOpenSuccessDialog(true);
        queryClient.invalidateQueries(["public-profile"]);
      },
      onError: (err: any) => {
        setOpenDialog(true);
      },
    }
  );

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      await mutateAsync({
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        intro: data.intro?.trim(),
        addressLine1: data.addressLine1?.trim(),
        addressLine2: data.addressLine2?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        gender: data.gender?.trim(),
        interests: interesets,
        city: data.city?.trim(),
        dob: data.dob?.trim(),
        geoLocation: {
          suburb: data.geoLocation?.suburb?.trim(),
          postCode: data.geoLocation?.postCode?.trim(),
        },
      });
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  });
  //
  const navigate = useRouter();

  return (
    <Box
      bgcolor="white"
      width="100%"
      height="100%"
      marginTop={4}
      borderRadius="15px"
      border={COLORS.border}
    >
      <FormWrapper component="form" margin={"auto"} marginTop={0}>
        {submitting ? null : error ? (
          <Collapse in={!!error}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError(""); // clear the error
                    setOpen(false); // also close the success alert
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Collapse>
        ) : open && !error ? ( // additional !error check here
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
              {PROFILE_MESSAGE.PROFILE_ALERT}
            </Alert>
          </Collapse>
        ) : null}

        <Box mt={2} />
        <FormInputWrapper>
          {/* <FormLabel sx={{ fontSize: "21px", fontWeight: 600 }}>
            Profile
          </FormLabel> */}
          <Box></Box>
          <Box textAlign="center">
            <Button
              disableElevation
              variant="contained"
              sx={{
                background: "#6666FF",
                borderColor: "#999999",
                fontSize: "16px",
                width: "156px",
                fontWeight: 600,
                color: "white",
                "&:hover": {
                  backgroundColor: "#6666FF",
                  color: "white",
                },
              }}
              onClick={() => navigate.push("/profile/public")}
            >
              Public View
            </Button>
          </Box>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>Name*</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            gap={3}
          >
            <TextField
              type="text"
              placeholder="First Name"
              fullWidth
              {...register("firstName")}
              error={errors.firstName ? true : false}
              helperText={errors.firstName?.message}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              type="text"
              placeholder="Last Name"
              fullWidth
              {...register("lastName")}
              error={errors.lastName ? true : false}
              helperText={errors.lastName?.message}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
          </Stack>
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>About me</FormLabel>
          <TextField
            sx={{
              width: {
                sm: "70%",
                md: "100%",
                lg: "80%",
              },
            }}
            inputProps={{ maxLength: 250 }}
            type="text"
            multiline
            spellCheck={true}
            rows={3}
            placeholder="About me"
            {...register("intro")}
            error={errors.intro ? true : false}
            helperText={errors.intro?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  component="div"
                  style={{ paddingLeft: "-14px" }}
                >
                  <IconButton
                    onClick={handleClick}
                    id="basic-button"
                    sx={{ width: 40, marginBottom: 5.5 }}
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
            open={openEmoji}
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
              onEmojiClick={(e: any) =>
                setValue("intro", getValues().intro + e.emoji)
              }
              height={350}
              width="100%"
            />
          </Menu>
        </FormInputWrapper>

        <FormInputWrapper marginTop={2}>
          <Stack
            direction="row"
            sx={{ width: { sm: "100%", md: "100%", lg: "20%" } }}
          >
            <FormLabel>Registered Address</FormLabel>
          </Stack>
          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            type="text"
            placeholder="Address Line 1"
            {...register("addressLine1")}
            error={errors.addressLine1 ? true : false}
            helperText={errors.addressLine1?.message}
          />
        </FormInputWrapper>

        <FormInputWrapper marginTop={2}>
          <FormLabel />
          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            type="text"
            placeholder="Address Line 2"
            {...register("addressLine2")}
            error={errors.addressLine2 ? true : false}
            helperText={errors.addressLine2?.message}
          />
        </FormInputWrapper>

        <FormInputWrapper marginTop={2}>
          <FormLabel />
          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            type="text"
            placeholder="City"
            {...register("city")}
            error={errors.city ? true : false}
            helperText={errors.city?.message}
            inputProps={{ style: { textTransform: "capitalize" } }}
          />
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <Stack
            direction="row"
            sx={{ width: { sm: "100%", md: "100%", lg: "25%" } }}
          >
            <FormLabel>Suburb / Postal code*</FormLabel>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
            gap={2}
          >
            <TextField
              type="text"
              placeholder="Suburb"
              fullWidth
              {...register("geoLocation.suburb")}
              error={errors.geoLocation?.suburb ? true : false}
              helperText={errors.geoLocation?.suburb?.message}
              variant="outlined"
            />
            <TextField
              type="text"
              placeholder="PostCode"
              fullWidth
              variant="outlined"
              {...register("geoLocation.postCode")}
              error={errors.geoLocation?.postCode ? true : false}
              helperText={errors.geoLocation?.postCode?.message}
            />
          </Stack>
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>Phone</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            gap={3}
          >
            <TextField
              sx={{
                width: { sm: "50%", md: "50%", lg: "50%" },
              }}
              select
              defaultValue="def"
              placeholder="Country"
              variant="outlined"
              disabled
              InputProps={{ inputProps: { style: { background: "#EFEFEF" } } }}
            >
              {[
                <MenuItem key={1} value={"def"}>
                  +61
                </MenuItem>,
                <MenuItem key={2} value={"others"}>
                  others
                </MenuItem>,
              ]}
            </TextField>
            <TextField
              type="number"
              placeholder="Phone Number"
              className={classes.input}
              fullWidth
              {...register("phoneNumber")}
              error={errors.phoneNumber ? true : false}
              helperText={errors.phoneNumber?.message}
            />
          </Stack>
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>Gender</FormLabel>
          <TextField
            select
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            value={selectedGender}
            {...register("gender")}
            onChange={(e: any) => {
              setSelectedGender(e.target.value);
            }}
            error={errors.gender ? true : false}
            helperText={errors.gender?.message}
          >
            {[
              <MenuItem key={1} value={"Male"}>
                Male
              </MenuItem>,
              <MenuItem key={2} value={"Female"}>
                Female
              </MenuItem>,
            ]}
          </TextField>
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>Date of birth</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
          >
            <TextField
              type="date"
              fullWidth
              {...register("dob")}
              error={errors.dob ? true : false}
              helperText={errors.dob?.message}
            />
          </Stack>
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>Interests</FormLabel>
          <Autocomplete
            multiple
            limitTags={3}
            id="multiple-limit-tags"
            options={["Politics", "Camping", "Reading"]}
            ChipProps={{
              variant: "outlined",
              deleteIcon: <CloseOutlined />,
            }}
            {...register("interests")}
            getOptionLabel={(option: any) => option}
            renderInput={(params) => (
              <TextField {...params} placeholder="Tags" spellCheck="true" />
            )}
            spellCheck={true}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            value={interesets}
            freeSolo={true}
            onChange={(e, val) => {
              setIntersts(val);
            }}
          />
        </FormInputWrapper>

        <Divider sx={{ marginY: 6 }} />

        <FormInputWrapper marginTop={2}>
          <FormLabel>Email</FormLabel>
          <TextField
            sx={{
              width: { sm: "100%", md: "100%", lg: "80%" },
            }}
            type="text"
            placeholder="Email"
            value={details?.email}
            disabled
            variant="outlined"
            InputProps={{ inputProps: { style: { background: "#EFEFEF" } } }}
          />
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <FormLabel>Country</FormLabel>
          <TextField
            sx={{
              width: { sm: "100%", md: "100%", lg: "80%" },
            }}
            placeholder="Country"
            variant="outlined"
            value={details?.geoLocation?.country}
            InputProps={{ inputProps: { style: { background: "#EFEFEF" } } }}
            disabled
          />
        </FormInputWrapper>

        <FormInputWrapper marginTop={2}>
          <Stack
            direction="row"
            sx={{ width: { sm: "100%", md: "100%", lg: "25%" } }}
          >
            <Stack flexDirection="row" sx={{ marginRight: 1 }}>
              <FormLabel>Federal Electorate</FormLabel>

              <Tooltip
                title={
                  <ElectorateTooltip text="Federal Electorate is assigned based on your Suburb and Postal code." />
                }
              >
                <IconButton>
                  <Help fontSize="small" sx={{ color: "#231F20" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
            type="text"
            placeholder="Federal Electorate"
            value={details?.electorate?.federalElectorate}
            error={errors.electorate?.federalElectorate ? true : false}
            InputProps={{
              inputProps: { style: { background: "#EFEFEF" } },
              style: { textTransform: "capitalize" },
            }}
            disabled
          />
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <Stack
            direction="row"
            sx={{ width: { sm: "100%", md: "100%", lg: "25%" } }}
          >
            <Stack flexDirection="row" marginRight={1}>
              <FormLabel>State Electorate</FormLabel>

              <Tooltip
                title={
                  <ElectorateTooltip text="State Electorate is assigned based on your Suburb and Postal code." />
                }
              >
                <IconButton>
                  <Help fontSize="small" sx={{ color: "#231F20" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
            type="text"
            placeholder="Federal Electorate"
            value={details?.electorate?.stateElectorate}
            error={errors.electorate?.stateElectorate ? true : false}
            InputProps={{
              inputProps: { style: { background: "#EFEFEF" } },
              style: { textTransform: "capitalize" },
            }}
            disabled
          />
        </FormInputWrapper>
        <FormInputWrapper marginTop={2}>
          <Stack flexDirection="row" marginRight={1}>
            <FormLabel>Local Electorate</FormLabel>
            <Stack
              flexDirection="row"
              style={{
                MozMarginStart: "-9px",
              }}
            >
              <Tooltip
                title={
                  <ElectorateTooltip text="Local Electorate is assigned based on your Suburb and Postal code." />
                }
              >
                <IconButton sx={{ marginLeft: "-5px" }}>
                  <Help fontSize="small" sx={{ color: "#231F20" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <TextField
            sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
            type="text"
            placeholder="Federal Electorate"
            value={details?.electorate?.localElectorate}
            InputProps={{
              inputProps: { style: { background: "#EFEFEF" } },
              style: { textTransform: "capitalize" },
            }}
            error={errors.electorate?.localElectorate ? true : false}
            disabled
          />
        </FormInputWrapper>
      </FormWrapper>

      <Stack maxWidth={640} marginX="auto" sx={{ padding: mobileView ? 0 : 3 }}>
        <Divider sx={{ marginY: 8 }} />
        <Typography sx={{ fontSize: "14px" }} variant="h6">
          Verify Your Identity
        </Typography>
        <Typography sx={{ fontSize: "14px" }} color="grey">
          We’re required to verify your identity for access full features of the
          App.
        </Typography>
        {details?.verificationStatus != VERIFICATION_STATUS.KYC_COMPLETE ? (
          <Stack
            flexDirection="row"
            marginTop={2}
            paddingBottom={2}
            paddingRight={3}
            alignSelf="start"
          >
            <div id="digitalid-verify"></div>
          </Stack>
        ) : (
          <VerifiedBadge />
        )}
        <Divider sx={{ marginY: 6 }} />
      </Stack>

      <Box textAlign="center">
        <Button
          variant="outlined"
          sx={{
            background: "#999999",
            borderColor: "#999999",
            fontSize: "16px",
            width: "160px",
            height: "44px",
            fontWeight: 400,
            color: "white",
            "&:hover": {
              backgroundColor: "#6666FF",
              color: "white",
            },
          }}
          startIcon={
            <CustomSvgIcon
              width={19}
              height={19}
              xmlns="http://www.w3.org/2000/svg"
              d="m8.172 13.095 6.368-6.368-1.035-1.012-5.333 5.332-2.7-2.7L4.46 9.36l3.712 3.735ZM9.5 18a8.708 8.708 0 0 1-3.487-.709 9.129 9.129 0 0 1-2.87-1.935 9.129 9.129 0 0 1-1.934-2.868A8.708 8.708 0 0 1 .5 9c0-1.245.236-2.415.709-3.51a8.994 8.994 0 0 1 1.935-2.858A9.226 9.226 0 0 1 6.013.71 8.708 8.708 0 0 1 9.5 0c1.245 0 2.415.236 3.51.709a9.089 9.089 0 0 1 2.857 1.923 9.089 9.089 0 0 1 1.924 2.858A8.764 8.764 0 0 1 18.5 9c0 1.23-.236 2.393-.709 3.488a9.225 9.225 0 0 1-1.924 2.868 8.994 8.994 0 0 1-2.857 1.935A8.764 8.764 0 0 1 9.5 18Zm0-1.35c2.13 0 3.938-.746 5.422-2.239C16.407 12.92 17.15 11.115 17.15 9c0-2.13-.742-3.938-2.227-5.422C13.436 2.092 11.63 1.35 9.5 1.35c-2.115 0-3.919.742-5.411 2.228C2.596 5.063 1.85 6.87 1.85 9c0 2.115.746 3.919 2.239 5.411C5.58 15.904 7.385 16.65 9.5 16.65Z"
              fill="#fff"
              sx={{ marginTop: 0.6 }}
            />
          }
          onClick={onSubmit}
        >
          Save
        </Button>
      </Box>
      {/* ) : (
          <VerifiedBadge />
        )} */}
      <ModelDialog
        open={openDialog}
        title="User information verification failed!"
        description="Please cross-check your profile information with DigitaliD and try again."
        onClickAction={() => {
          setOpenDialog(false);
        }}
        buttonText="Okay"
      />
      <ModelDialog
        open={openSuccessDialog}
        title="Verification Success"
        imageUrl={successImage}
        onClickAction={() => {
          setOpenSuccessDialog(false);
        }}
        buttonText="Done"
      />
    </Box>
  );
};

export { UserDetails };
