"use server";

import { google } from "googleapis";
import { Readable } from "node:stream";

const authorize = async () => {
  const auth = new google.auth.JWT(
    process.env.SERVICE_ACCOUNT_EMAIL,
    "",
    process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/drive"],
  );

  try {
    await auth.authorize();
    return auth;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(`Error authorizing Google Drive API: ${error.message}`);
  }
};

export const uploadFile = async (file: Blob, fileName: string) => {
  const auth = await authorize();
  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.FOLDER_ID || ""],
      },
      media: {
        mimeType: "application/pdf",
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        body: Readable.fromWeb(file.stream() as any),
      },
      fields: "id",
    });

    console.log("File uploaded successfully. File ID:", response.data.id);
    return response.data;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(`Error uploading file to Google Drive: ${error.message}`);
  }
};
