import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { MpTag, camera } from "@/assets/index";
import React, { useState } from "react";
import { useMutation } from "react-query";
import COLORS from "@/themes/colors";
import IS3FileType from "src/pages/proposals/newProposal/Logic/IFileType";
import IUser from "./UserProfile.interface";
import Image from "next/image";
import S3UploadService from "@/aws/S3Service/S3UploadService";
import { Stack } from "@mui/system";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import UserSession from "@/aws/cognito/UserSession";
import { capitalizeFirstLetter } from "src/util/setCapital";
import { useRouter } from "next/router";
import { ProfileSideBar } from "@/components/atoms";
import { encrypt } from "src/util/encrypt";
import { useAuth } from "@/context/AuthContext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    border: `4px solid linear-gradient(to right, #F44336, #E91E63)`,
  },
}));

//profile
const UserProfile = ({ list, type }: IUser) => {
  const [image, setImage] = useState<IS3FileType>();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const { mutateAsync } = useMutation(UserProfileService.updateUserPic, {
    onSuccess: (res) => {
      UserSession.refreshSession();
    },
    onError: (err: any) => {},
  });

  //HandleUpload
  const handelFileUpload = async (event: any) => {
    console.log(event.target.files);
    setIsUploading(true);

    const result = await S3UploadService.handleProfilePictureUpload(
      event.target.files[0]
    );
    console.log(result, "result");

    if (result) {
      setImage({ name: event.target.files[0].name, url: result.fullUrl });
      await mutateAsync({
        imageUrl: result.thumbnail,
        imageFullUrl: result.fullUrl,
      });

      setImageUrl(result.fullUrl);
      router.reload();
    }
    setIsUploading(false);
  };

  const { getUser } = useAuth();

  const loggedEmail = getUser()?.email;

  return (
    <Box
      bgcolor="white"
      width="100%"
      height="100%"
      marginTop={4}
      borderRadius="10px"
      border={COLORS.border}
    >
      {list?.role === "MP" ? (
        <Box>
          <Stack direction="row" justifyContent="center" marginTop={4}>
            <Box
              sx={{
                background:
                  "linear-gradient(90deg, #EA3CD5 -2.12%, #E5FE57 100.77%),linear-gradient(0deg, #D9D9D9, #D9D9D9)",
                borderRadius: 199,
                padding: 1,
              }}
            >
              <Avatar
                src={list?.imageFullUrl || list.imageUrl}
                style={{
                  borderWidth: "4px",
                }}
                sx={{
                  height: 199,
                  width: 199,
                }}
              />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Stack direction="row" justifyContent="center" marginTop={4}>
          <Avatar
            src={list?.imageFullUrl || list?.imageUrl || imageUrl}
            sx={{
              height: 199,
              width: 199,
            }}
          />
        </Stack>
      )}

      <Stack direction="column" justifyContent="center">
        {type === "Private" ? (
          <Box>
            <Box marginTop={1}>
              <Typography align="center">
                {!isUploading ? (
                  <Stack
                    alignItems="flex-start"
                    alignContent="flex-start"
                    width={"100%"}
                    paddingTop={image ? 1 : 0}
                    paddingBottom={image ? 2 : 0}
                    direction="row"
                    gap={1}
                  />
                ) : (
                  <Box marginTop={1} alignItems="center">
                    <CircularProgress />
                  </Box>
                )}
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    data-testid="file-input"
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={handelFileUpload}
                  />
                  <Image src={camera} alt={"Profile"} width={30} height={30} />
                </IconButton>
              </Typography>
            </Box>
            <Typography
              align="center"
              sx={{
                fontWeight: 600,
                fontSize: "21px",
                lineHeight: "26px",
                marginX: 1,
              }}
              textTransform="capitalize"
              marginTop={1}
            >
              {`${capitalizeFirstLetter(
                list?.firstName
              )} ${capitalizeFirstLetter(list?.lastName)}`}
            </Typography>
            {list?.role == "MP" && (
              <Stack direction="row" justifyContent="center">
                <Box mt={1}>
                  <Image src={MpTag} alt={"MpTag"} />
                </Box>
              </Stack>
            )}
          </Box>
        ) : (
          <Stack mt={2}>
            <Typography
              align="center"
              sx={{ fontWeight: 600, fontSize: "21px", lineHeight: "26px" }}
              textTransform="capitalize"
            >
              {`${capitalizeFirstLetter(
                list?.firstName
              )} ${capitalizeFirstLetter(list?.lastName)}`}
            </Typography>
            {list?.role === "MP" && (
              <Stack direction="row" justifyContent="center">
                <Box mt={3}>
                  <Image src={MpTag} alt={"MpTag"} />
                </Box>
              </Stack>
            )}

            {loggedEmail !== list?.email && (
              <Stack
                sx={{
                  borderRadius: 3,
                  height: 44,
                  justifyContent: "center",
                  width: 170,
                  alignItems: "center",
                  marginLeft: 6,
                }}
              >
                <Button
                  sx={{
                    fontSize: 12,
                    borderRadius: "15px",
                    textTransform: "none",
                    width: 100,
                  }}
                  variant="outlined"
                >
                  Follow
                </Button>
              </Stack>
            )}
          </Stack>
        )}

        <ProfileSideBar
          profile={list}
          userId={encrypt(loggedEmail as string)}
        />
      </Stack>
    </Box>
  );
};

export { UserProfile };
