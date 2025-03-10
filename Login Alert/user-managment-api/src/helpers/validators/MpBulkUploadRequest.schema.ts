// import yup
import * as yup from "yup";

let MpBulkUploadRequestValidator = yup.object().shape({
  fileId: yup.string().required("File ID is required"),
});

export { MpBulkUploadRequestValidator };
