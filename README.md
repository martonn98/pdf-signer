# PDF Signer

This is a [Next.js](https://nextjs.org) project that able to sign pdf files by appending a new page to an existing file, that contains the signer's name, IP address, date and time.
The signed file is getting uploading to Google Drive. It's possible to load a file from Google Drive via passing it's ID to the route.

## Getting Started

Create a project, enable Google Drive API and create a service account on [Google Cloud Console](https://console.cloud.google.com/). Create a shared directory that has write access for everyone, the files will be uploaded to this directory.

## Configure Environment

Copy or rename .env.example to .env

```bash
SERVICE_ACCOUNT_EMAIL=client_email from service account json
PRIVATE_KEY=private_key from service account json
FOLDER_ID=path from the Drive folder URL
```

https://drive.google.com/drive/folders/XXXXX you only need the last dynamic part as ID

## Run the application

```bash
# use correct node.js version
nvm use
# install dependencies
pnpm i
# start dev server
pnpm dev
# build if needed
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To preload a pdf file from Google Drive, add the file ID to the path, like\
https://drive.google.com/file/d/XXXXX/view?usp=drive_link \
http://localhost:3000/XXXXX \
You can get the file ID by generating a sharing link on Google Drive.

## Limitations

The maximum file size supported by Google Drive simple upload is 5 MB. Vercel support only 4.5 MB as request body. If you need support for larger files, you have to implement resumable upload to Google Drive and sending the file to Vercel Blob for example, instead of putting it to the request body.
