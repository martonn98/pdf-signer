"use server";

import { type drive_v3, google } from "googleapis";
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

export const loadFile = async (id: string): Promise<{ file: Blob; fileMeta: drive_v3.Schema$File }> => {
  const auth = await authorize();
  const drive = google.drive({ version: "v3", auth });

  try {
    const fileMeta = await drive.files.get({
      fileId: id,
      supportsAllDrives: true,
      fields: "name, mimeType, size",
    });

    const file = await drive.files.get(
      {
        fileId: id,
        alt: "media",
      },
      {
        responseType: "stream",
      },
    );

    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      file.data.on("data", (chunk) => {
        chunks.push(chunk);
      });

      file.data.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        resolve({ file: blob, fileMeta: fileMeta.data });
      });

      file.data.on("error", (error) => {
        reject(new Error(`Error reading file stream: ${error.message}`));
      });
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(`Error loading file from Google Drive: ${error.message}`);
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
