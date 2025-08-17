import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";

// Define the file upload request payload
export interface FileUploadRequest {
  file: any; // File object from document picker or image picker
  fileType: "document" | "image";
  folderPath?: string; // Optional folder path
  customFilename?: string; // Optional custom filename
}

// Define the file upload response
export interface FileUploadResponse {
  id: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedAt: string;
  uploadedBy: string;
}

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // Upload file (requires auth)
    uploadFile: builder.mutation<FileUploadResponse, FileUploadRequest>({
      query: (body) => {
        // Create FormData for multipart/form-data
        const formData = new FormData();

        // Create a file object from the URI if needed
        let fileToUpload = body.file;

        // If it's a URI string, create a file object
        if (typeof body.file === "string") {
          // For React Native, we need to create a file object
          const fileName = body.file.split("/").pop() || "file";
          const fileType =
            body.fileType === "image" ? "image/jpeg" : "application/pdf";

          // Create a file object that can be sent
          fileToUpload = {
            uri: body.file,
            type: fileType,
            name: fileName,
          };
        }

        formData.append("file", fileToUpload);
        formData.append("fileType", body.fileType);

        // Add optional fields if provided
        if (body.folderPath) {
          formData.append("folderPath", body.folderPath);
        }
        if (body.customFilename) {
          formData.append("customFilename", body.customFilename);
        }

        return {
          url: API_ROUTES.file.upload,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
