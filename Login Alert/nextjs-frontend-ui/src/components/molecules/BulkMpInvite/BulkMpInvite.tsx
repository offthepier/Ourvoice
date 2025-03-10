"use client";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ModelDialog } from "@/components/molecules";
import {
  FormInputWrapper,
  FormWrapper,
  MpUploadTooltip,
} from "@/components/atoms";
import { FileUploadOutlined, InfoRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { useMutation } from "react-query";

import AdminService from "@/service/AdminService/Admin.service";
import COLORS from "@/themes/colors";
import IS3FileType from "src/pages/proposals/newProposal/Logic/IFileType";
import S3UploadService from "@/aws/S3Service/S3UploadService";
import { successImage } from "@/assets/index";
import { SendInvitesButton } from "@/components/atoms/SendInvitesButton/SendInvitesButton";

const BulkMpInvite = () => {
  const [fileData, setFileData] = useState<IS3FileType | null>(null);
  const [errorUpload, setErrorUpload] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [postingSuccess, setPostingSuccess] = useState(false);

  const handelFileUpload = async (event: any) => {
    console.log(event.target.files);

    setIsUploading(true);

    console.log("uploading", event.target.files[0]);

    if (event.target.files[0]) {
      const result = await S3UploadService.handleCSVUpload(
        event.target.files[0]
      );
      if (result) {
        setFileData({ name: event.target.files[0].name, url: result });
        setErrorUpload("");
      } else {
        setErrorUpload("Unable to upload CSV, Please try again later!");
      }
    }

    setIsUploading(false);
  };

  //on submit
  const onSubmit = async () => {
    if (!fileData) {
      //  setError()
      setErrorUpload("Please upload a file before sending!");
    } else {
      try {
        // Type error is gone
        await mutateAsync(fileData.url);
      } catch (e) {
        // Something went wrong
        setErrorUpload("Something went wrong!,  Please try again later");
        console.log(e);
      }
    }
  };

  const { mutateAsync } = useMutation(AdminService.createNewMPBulk, {
    onSuccess: (res) => {
      console.log("success", res);
      if (!res) {
        setErrorUpload("Something went wrong!,  Please try again later");
      } else {
        setPostingSuccess(true);
        setFileData(null);
      }
    },
    onError: () => {
      setErrorUpload("Something went wrong!,  Please try again later");
    },
  });

  return (
    <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: "12px" }}>
      <FormWrapper component="form">
        <Box marginX={4}>
          <Typography
            sx={{ fontWeight: 600, fontSize: "21px", color: "#231F20" }}
          >
            Sending Bulk Invitations
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              color: COLORS.greyIcon,
            }}
          >
            Upload CSV file below to send bulk invitations
          </Typography>
          <Box mt={2} />
          <Stack
            direction="column"
            // alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center">
              <FormLabel>Upload CSV File</FormLabel>
              <Tooltip title={<MpUploadTooltip />} placement="right" arrow>
                <IconButton>
                  <InfoRounded
                    fontSize="small"
                    sx={{ color: "#231F20", fontSize: "1rem" }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction="column" alignItems="start">
              {!isUploading ? (
                fileData && (
                  <Typography textAlign="start" mt={1} ml={2}>
                    {fileData.name}
                  </Typography>
                )
              ) : (
                <CircularProgress sx={{ marginLeft: 4, marginY: 2 }} />
              )}
              <input
                data-testid="file-input"
                accept=".csv"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handelFileUpload}
                disabled={isUploading}
              />
              <label htmlFor="raised-button-file">
                <Button
                  startIcon={<FileUploadOutlined />}
                  variant="contained"
                  size="small"
                  sx={{
                    marginTop: "8px",
                    bgcolor: "black",
                    width: "150px",
                    marginBottom: 2,
                    marginLeft: 1,
                  }}
                  component="span"
                  disabled={isUploading}
                >
                  Choose File
                </Button>
              </label>
            </Stack>
          </Stack>

          {errorUpload && (
            <Typography color="error" sx={{ marginY: 1, fontSize: 14 }}>
              {errorUpload}
            </Typography>
          )}

          <FormInputWrapper marginTop={2}>
            <SendInvitesButton onClick={onSubmit} />
          </FormInputWrapper>
        </Box>
      </FormWrapper>

      <ModelDialog
        open={postingSuccess}
        title="Invitations sent successfully!"
        onClickAction={() => {
          setPostingSuccess(false);
        }}
        buttonText="Done"
        imageUrl={successImage}
      />
    </Box>
  );
};

export { BulkMpInvite };
