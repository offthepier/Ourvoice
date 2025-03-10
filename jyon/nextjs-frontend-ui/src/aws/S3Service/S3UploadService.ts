import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateUUID } from "src/util/generateUniqueKey";
import {
  resizeProfilePicFile,
  resizeProfilePicThumbnail,
} from "src/util/imageResizer";

class S3UploadService {
  handleUpload = async (selectFile: any): Promise<string | null> => {
    try {
      const client = new S3Client({
        region: process.env.NEXT_PUBLIC_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY_TOKEN || "",
        },
      });
      const generatedName = generateUUID() + selectFile.name;

      const params = {
        Bucket: process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME,
        Key: generatedName,
        Body: selectFile /** object body */,
      };

      const command = new PutObjectCommand(params);
      const data = await client.send(command);
      if (data) {
        console.log(
          "file uploaded " +
            encodeURI(process.env.NEXT_PUBLIC_S3_URL + generatedName)
        );
        return encodeURI(
          "https://" +
            process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME +
            ".s3." +
            process.env.NEXT_PUBLIC_REGION +
            ".amazonaws.com/" +
            generatedName
        );
        // https://ourvoice-assets-dev.s3.ap-southeast-2.amazonaws.com/0dc67e95-1aa1-4514-9a85-f2d4944062b7Wed+Address+Gradient.jpg
      }
      console.log(data);
    } catch (e) {
      console.log(e);
      return null;
    }
    return null;
  };

  handleProfilePictureUpload = async (
    selectFile: any
  ): Promise<{ fullUrl: string; thumbnail: string } | null> => {
    try {
      const client = new S3Client({
        region: process.env.NEXT_PUBLIC_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY_TOKEN || "",
        },
      });
      const uniqueKey = generateUUID();
      const generatedFullPictureName = uniqueKey + selectFile.name;
      const generatedThumbnailName = "thumbnail_" + uniqueKey + selectFile.name;

      //upload full picture
      const fullFile = (await resizeProfilePicFile(selectFile)) as any;
      const params = {
        Bucket: process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME,
        Key: generatedFullPictureName,
        Body: fullFile /** object body */,
      };

      const command = new PutObjectCommand(params);
      const data = await client.send(command);

      //upload thumbnail
      const thumbnailFile = (await resizeProfilePicThumbnail(
        selectFile
      )) as any;

      const paramsThumbnail = {
        Bucket: process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME,
        Key: generatedThumbnailName,
        Body: thumbnailFile /** object body */,
      };

      const commandThumbnail = new PutObjectCommand(paramsThumbnail);
      const dataThumbnail = await client.send(commandThumbnail);

      if (data && dataThumbnail) {
        console.log("Files uploaded");
        return {
          fullUrl: encodeURI(
            "https://" +
              process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME +
              ".s3." +
              process.env.NEXT_PUBLIC_REGION +
              ".amazonaws.com/" +
              generatedFullPictureName
          ),
          thumbnail: encodeURI(
            "https://" +
              process.env.NEXT_PUBLIC_ASSETS_BUCKET_NAME +
              ".s3." +
              process.env.NEXT_PUBLIC_REGION +
              ".amazonaws.com/" +
              generatedThumbnailName
          ),
        };
      }
      console.log(data);
    } catch (e) {
      console.log(e);
      return null;
    }
    return null;
  };

  handleCSVUpload = async (selectFile: any): Promise<string | null> => {
    try {
      const client = new S3Client({
        region: process.env.NEXT_PUBLIC_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY_TOKEN || "",
        },
      });
      const generatedName = generateUUID() + selectFile.name;

      const params = {
        Bucket: process.env.NEXT_PUBLIC_FILES_BUCKET_NAME,
        Key: generatedName,
        Body: selectFile /** object body */,
      };

      const command = new PutObjectCommand(params);
      const data = await client.send(command);
      if (data) {
        return generatedName;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new S3UploadService();
