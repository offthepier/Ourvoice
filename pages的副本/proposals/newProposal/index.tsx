"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CancelOutlined,
  CloseOutlined,
  FileUploadOutlined,
  InfoRounded,
  Login,
  InsertEmoticon,
  PostAddOutlined,
  PreviewOutlined,
} from "@mui/icons-material";
import {
  ChallengesView,
  LoadingDialog,
  ModelDialog,
  ProposalPreviewDialog,
  SideBar,
} from "@/components/molecules";
import { Controller, useForm } from "react-hook-form";
import {
  FileUploadPreview,
  FileUploadTooltip,
  NewProposalInputWrapper,
  TopProposals,
} from "@/components/atoms";
import React, { useState } from "react";
import { createProposal, successImage } from "@/assets/index";
import { useMutation, useQuery } from "react-query";
import EmojiPicker from "emoji-picker-react";
import COLORS from "@/themes/colors";
import ChallengesService from "@/service/Challenges/Challenges.service";
import Head from "next/head";
import IChallenge from "@/types/IChallenge";
import IProposalInputs from "./newProposalInputs.interface";
import IS3FileType from "./Logic/IFileType";
import Image from "next/image";
import { MainWrapper } from "@/components/organism";
import { NextComponentType } from "next";
import { POST_TYPES } from "@/constants/PostTypes";
import PetitionService from "@/service/Petitions/Petition.service";
import S3UploadService from "@/aws/S3Service/S3UploadService";
import { newProposalValidations } from "./Logic/newProposalValidations";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import IPostFull from "@/types/IPostFull";
import { capitalizeFirstLetter } from "@/util/setCapital";

const NewProposal = () => {
  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [filesList, setFilesList] = useState<IS3FileType[]>([]);
  const [errorUpload, setErrorUpload] = useState("");
  const [postingSuccess, setPostingSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const [disabled] = useState(true);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const { getUser } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [titleAnchorEl, setTitleAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const openTitle = Boolean(titleAnchorEl);
  const handleCloseTitle = () => {
    setTitleAnchorEl(null);
  };
  const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTitleAnchorEl(event.currentTarget);
  };
  const { postId } = router.query; // Retrieve the post ID from URL parameters

  /* Keep track of title text field visibility */
  const [showTitle, setShowTitle] = useState(false);

  const { isLoading, data } = useQuery<IChallenge[], Error>(
    "challenge-items",
    async () => {
      return await ChallengesService.getChallenges();
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const { isLoading: updateDataLoading, data: postFull } = useQuery<
    IPostFull,
    Error
  >(
    `post ${postId}`,
    async () => {
      return await NewsFeedService.getPostById(postId as string);
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
      enabled: postId != undefined,
    }
  );

  const setChallengeFromId = (event: any, value: any) => {
    setChallenge(value);
    clearErrors("challenge");
    console.log(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
    reset,
    control,
    setValue,
  } = useForm<IProposalInputs>({
    resolver: yupResolver(newProposalValidations),
    defaultValues: Boolean(postId) ? {} : { postType: POST_TYPES.GENERAL },
  });

  const { mutateAsync, isLoading: postingPetition } = useMutation(
    PetitionService.createNewPetition,
    {
      onSuccess: (res) => {
        if (!res) {
          setErrorUpload("Something went wrong!,  Please try again later");
        } else {
          setPostingSuccess(true);
          clearForm();
        }
      },
      onError: (err: any) => {
        setErrorUpload("Something went wrong!,  Please try again later");
      },
    }
  );

  const { mutateAsync: updatePostAsync, isLoading: updatePostLoading } =
    useMutation(PetitionService.updatePetition, {
      onSuccess: (res) => {
        if (!res) {
          setErrorUpload("Something went wrong!,  Please try again later");
        } else {
          setPostingSuccess(true);
          clearForm();
        }
      },
      onError: (err: any) => {
        setErrorUpload("Something went wrong!,  Please try again later");
      },
    });

  const clearForm = () => {
    reset();
    setChallenge(null);
    setTags([]);
    setFilesList([]);
  };

  //on submit
  const onSubmit = handleSubmit(async (data) => {
    if (!challenge) {
      //  setError()
      setError("challenge", {
        message: "Please select a topic before continue!",
        type: "validate",
      });
    } else {
      console.log(data);
      console.log(tags);
      try {
        let postData: any = {
          challenge: challenge.title,
          challengeID: challenge.challengeID,
          community: challenge.community,
          description: data.description,
          images: filesList.map((e) => {
            return e.url;
          }),
          tags: tags,
          title: data.title,
          postType: data.postType,
        };

        if (Boolean(postId)) {
          postData.postId = postFull?.post.postId;
          await updatePostAsync(postData);
          console.log(postData);
        } else {
          await mutateAsync(postData);
        }
      } catch (e) {
        // Something went wrong
        setErrorUpload("Something went wrong!,  Please try again later");
        console.log(e);
      }
    }
  });

  const validateFileCount = (filesCount: number) => {
    if (filesCount > 5) {
      setErrorUpload("Can't upload more than 5 Files!");
      return false;
    }
    return true;
  };

  const validateFileSize = (file: any) => {
    if (file && file.size >= 5 * 1024 * 1024) {
      setErrorUpload("Can't upload images larger than 5MB!");
      return false;
    }
    return true;
  };

  const uploadFile = async (file: any) => {
    const result = await S3UploadService.handleUpload(file);
    if (result) {
      return { name: file?.name, url: result };
    } else {
      setErrorUpload("Unable to upload image, Please try again later!");
      return null;
    }
  };

  const handelFileUpload = async (event: any) => {
    console.log(event.target.files);

    const filesCount = event.target.files.length + filesList.length;
    console.log("files Count", filesCount);

    if (!validateFileCount(filesCount)) return;

    setIsUploading(true);
    let uploaded = [];

    for (let x = 0; x < filesCount; x++) {
      const file = event.target.files[x];

      if (!file) {
        continue;
      }

      if (!validateFileSize(file)) {
        setIsUploading(false);
        break;
      }

      console.log("uploading", file);
      const result = await uploadFile(file);

      if (result) {
        uploaded.push(result);
      } else {
        break;
      }
    }

    setFilesList([...filesList, ...uploaded]);
    setIsUploading(false);
  };

  const removeImage = (file: IS3FileType) => {
    let imagesList = filesList.filter((e) => {
      return e != file;
    });

    setFilesList(imagesList);
  };

  /* Set Update Values */
  useEffect(() => {
    if (postFull?.post) {
      setChallenge({
        challengeID: postFull?.post.challengeID,
        community: postFull?.post.communityType,
        title: postFull?.post.challenge,
      });
      setTags(postFull?.post.tags);
      setFilesList(
        postFull?.post.images?.map((e, i) => {
          return { name: i.toString(), url: e };
        }) ?? []
      );
      setValue("title", postFull?.post.title);
      setValue("description", postFull?.post.description);
      setValue("postType", postFull?.post.postType);

      if (postFull.post.postType == POST_TYPES.GENERAL) {
        setShowTitle(false);
      } else {
        setShowTitle(true);
      }
    }
  }, [postFull]);

  return (
    <>
      <Head>
        <title>{Boolean(postId) ? "Edit Post" : "Create New Post"}</title>
      </Head>
      <MainWrapper
        childrenLeft={<SideBar disabled={disabled} />}
        childrenRight={
          <Stack>
            <ChallengesView disabled={disabled} />
            <TopProposals disabled={disabled} />
          </Stack>
        }
      >
        <Box
          bgcolor="white"
          width="100%"
          padding={4}
          borderRadius={"16px"}
          component="form"
          onSubmit={onSubmit}
          border={COLORS.border}
        >
          <Stack flexDirection="row" alignItems="center">
            {/* <PostAddOutlined sx={{ fontSize: 28 }} /> */}
            <Image src={createProposal} alt={"icon"} width={24} height={28} />
            <Typography marginLeft={1} variant="h6">
              {Boolean(postId) ? "Edit Post" : "Create New Post"}
            </Typography>
          </Stack>

          <NewProposalInputWrapper>
            <FormLabel>Select Topic*</FormLabel>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              disabled={isLoading || Boolean(postId)}
              options={
                data
                  ? data
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((e) => {
                        return { ...e, label: e.title, id: e.challengeID };
                      })
                  : []
              }
              isOptionEqualToValue={(option, value) =>
                option.challengeID === value.challengeID
              }
              onChange={setChallengeFromId}
              getOptionLabel={(option) => option.label || ""}
              sx={{ width: "auto", marginTop: "4px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    Boolean(postId) ? challenge?.title : "Select Topic"
                  }
                  error={errors.challenge?.message ? true : false}
                  helperText={errors.challenge?.message}
                />
              )}
            />
          </NewProposalInputWrapper>

          <NewProposalInputWrapper>
            <FormLabel>Select Community*</FormLabel>
            <TextField
              select
              defaultValue="def"
              value={challenge ? challenge.community : "def"}
              sx={{
                "& .MuiInputBase-input": { color: "gray" },
                marginTop: "4px",
              }}
              disabled
            >
              <MenuItem key={1} value={"def"}>
                Select Your Community
              </MenuItem>
              <MenuItem key={2} value={"FEDERAL"}>
                Federal Electorate
              </MenuItem>
              <MenuItem key={3} value={"STATE"}>
                State Electorate
              </MenuItem>
              <MenuItem key={4} value={"LOCAL"}>
                Local Electorate
              </MenuItem>
            </TextField>
          </NewProposalInputWrapper>

          <NewProposalInputWrapper>
            <FormLabel>Select Post Type*</FormLabel>
            <Controller
              control={control}
              name="postType"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  disabled={isLoading || Boolean(postId)}
                  options={[
                    { label: "General", id: POST_TYPES.GENERAL },
                    { label: "Proposal", id: POST_TYPES.PROPOSAL },
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, values) => {
                    if (values?.id == POST_TYPES.PROPOSAL) {
                      setShowTitle(true);
                    } else {
                      setShowTitle(false);
                    }
                    onChange(values?.id);
                  }}
                  getOptionLabel={(option) => option.label || ""}
                  sx={{
                    width: "auto",
                    marginTop: "4px",
                    textTransform: "lowercase",
                  }}
                  defaultValue={
                    Boolean(postId)
                      ? null
                      : { label: "General", id: POST_TYPES.GENERAL }
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        Boolean(postId)
                          ? capitalizeFirstLetter(getValues("postType"))
                          : "Select General or Proposal"
                      }
                      error={errors.postType?.message ? true : false}
                      helperText={errors.postType?.message}
                      FormHelperTextProps={{
                        sx: {
                          ":first-letter": { textTransform: "capitalize" },
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </NewProposalInputWrapper>

          {showTitle && (
            <NewProposalInputWrapper>
              <FormLabel>Proposal Title*</FormLabel>
              <TextField
                spellCheck={true}
                sx={{ marginTop: "4px" }}
                placeholder="Proposal Title"
                {...register("title")}
                error={errors.title ? true : false}
                helperText={errors.title?.message}
                inputProps={{ maxLength: 250 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      component="div"
                      style={{ paddingLeft: "-14px" }}
                    >
                      <IconButton
                        onClick={handleTitleClick}
                        id="basic-button"
                        sx={{ width: 40, marginBottom: 2.5 }}
                      >
                        <InsertEmoticon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                rows={2}
                multiline
              />
              <Menu
                id="basic-menu"
                anchorEl={titleAnchorEl}
                open={openTitle}
                onClose={handleCloseTitle}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{ backgroundColor: "transparent" }}
                PaperProps={{ sx: { padding: "0px", boxShadow: "none" } }}
              >
                <EmojiPicker
                  searchDisabled={true}
                  previewConfig={{ showPreview: false }}
                  onEmojiClick={(e) =>
                    setValue("title", getValues().title + e.emoji)
                  }
                  height={350}
                  width="100%"
                />
              </Menu>
            </NewProposalInputWrapper>
          )}

          <NewProposalInputWrapper>
            <FormLabel>Description*</FormLabel>
            <TextField
              spellCheck={true}
              sx={{ marginTop: "4px" }}
              multiline
              rows={6}
              placeholder="Description"
              {...register("description")}
              error={errors.description ? true : false}
              helperText={errors.description?.message}
              inputProps={{ maxLength: 2000 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    component="div"
                    style={{ marginBottom: "100px", marginLeft: "20px" }}
                  >
                    <IconButton
                      onClick={handleClick}
                      id="basic-button"
                      sx={{ width: 40, marginBottom: 1.5 }}
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
              open={open}
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
                  setValue("description", getValues().description + e.emoji)
                }
                height={350}
                width="100%"
              />
            </Menu>
          </NewProposalInputWrapper>

          <NewProposalInputWrapper>
            <FormLabel>Tags</FormLabel>
            <Autocomplete
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={["Wildlife", "Global Warming", "Economy"]}
              ChipProps={{
                variant: "outlined",
                deleteIcon: <CloseOutlined />,
              }}
              getOptionLabel={(option: any) => option}
              renderInput={(params) => (
                <TextField {...params} placeholder="Tags" spellCheck={true} />
              )}
              spellCheck={true}
              sx={{ width: "auto", marginTop: "4px" }}
              value={tags}
              freeSolo={true}
              onChange={(e, val) => {
                setTags(val);
              }}
            />
          </NewProposalInputWrapper>

          <NewProposalInputWrapper>
            <Stack direction="row" alignItems="center">
              <FormLabel>Upload Images</FormLabel>
              <Tooltip title={<FileUploadTooltip />} placement="right">
                <IconButton>
                  <InfoRounded
                    fontSize="small"
                    sx={{ color: "#231F20", fontSize: "1rem" }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
            {!isUploading ? (
              <Grid
                alignItems="flex-start"
                alignContent="flex-start"
                width={"100%"}
                paddingTop={filesList.length > 0 ? 1 : 0}
                paddingBottom={filesList.length > 0 ? 1 : 0}
                direction="row"
                gap={1}
                container
              >
                {filesList.map((e, i) => {
                  return (
                    <Grid item md={3} key={e.url}>
                      <FileUploadPreview file={e} onClickDelete={removeImage} />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <CircularProgress sx={{ marginLeft: 4 }} />
            )}
            {errorUpload && (
              <Typography color="error" sx={{ marginY: 1, fontSize: 14 }}>
                {errorUpload}
              </Typography>
            )}
            <Stack flexDirection="row" alignItems="center">
              <input
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handelFileUpload}
                multiple
                disabled={isUploading || filesList.length >= 5}
              />
              <label htmlFor="raised-button-file">
                <Button
                  startIcon={<FileUploadOutlined />}
                  variant="contained"
                  size="small"
                  sx={{ marginTop: "8px", bgcolor: "black", width: "150px" }}
                  component="span"
                  disabled={isUploading || filesList.length >= 5}
                >
                  Choose File
                </Button>
              </label>
            </Stack>
          </NewProposalInputWrapper>

          <Stack marginTop={4} direction="row" justifyContent="space-around">
            <Button
              startIcon={<CancelOutlined />}
              variant="outlined"
              sx={{ marginTop: "8px", color: "primary", width: "120px" }}
              disabled={postingPetition}
              onClick={() => {
                router.replace("/");
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<PreviewOutlined />}
              variant="outlined"
              sx={{ marginTop: "8px", color: "primary", width: "120px" }}
              disabled={postingPetition}
              onClick={() => {
                setShowPreview(true);
              }}
            >
              Preview
            </Button>
            <Button
              startIcon={<PostAddOutlined />}
              variant="outlined"
              sx={{ marginTop: "8px", color: "primary", width: "120px" }}
              type="submit"
              disabled={postingPetition}
            >
              {Boolean(postId) ? "Update" : "Post"}
            </Button>
          </Stack>
        </Box>
      </MainWrapper>
      <ModelDialog
        open={postingSuccess}
        title="Your post submitted successfully!"
        onClickAction={() => {
          router.replace("/");
        }}
        buttonText="Done"
        imageUrl={successImage}
      />

      <LoadingDialog open={updateDataLoading} description="Loading Post..." />

      <ProposalPreviewDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onClickPost={() => {
          setShowPreview(false);
          onSubmit();
        }}
        post={{
          postId: "1",
          title: getValues().title,
          description: getValues().description,
          postType: getValues().postType,
          challenge: challenge?.title || "",
          community: challenge?.community || "",
          userFirstName: getUser()?.firstName,
          userLastName: getUser()?.lastName,
          userImg: getUser()?.imageUrl,
          userRole: getUser()?.role,
          challengeID: "",
          userId: "",
          tags: tags,
          images: filesList.map((e) => {
            return e.url;
          }),
        }}
        editMode={Boolean(postId)}
      />
    </>
  );
};

function withAuth(Component: NextComponentType) {
  const Auth = () => {
    const { getUser } = useAuth();

    if (getUser()) {
      return <Component />;
    }
    return <Login />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth(NewProposal);
