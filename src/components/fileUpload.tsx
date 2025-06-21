"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
// import { UploadButton } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string | undefined;
  // fit the core.ts in uploadImage
  endpoint: "messageFile" | "serverImage";
}

function FileUpload({ onChange, value, endpoint }: FileUploadProps) {
  // TODO: 判断类型是否为图片/pdf，如果是图片的话，则

  const [isImage, setIsImage] = useState<boolean | null>(null);

  useEffect(() => {
    if (!value) {
      setIsImage(null);
      return;
    }
    fetch(value, { method: "HEAD" })
      .then((res) => {
        const contentType = res.headers.get("Content-Type") || "";
        setIsImage(contentType.startsWith("image/"));
      })
      .catch((err) => {
        console.error("Failed to fetch content type:", err);
        setIsImage(false); // 出错时默认为非图片
      });
  }, [value]);

  if (value && isImage) {
    return (
      <div className="relative h-40 w-40">
        <Image src={value} fill alt="Upload" className="rounded-full" />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value && isImage === false) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          // eslint-disable-next-line react/no-string-refs
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
        >
          {value}
        </a>
        <button
          className="bg-rose-500 text-white p-1 absolute -top-2 -right-2 shadow-sm rounded-full"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // Do something with the response
        onChange(res[0]?.ufsUrl);
        //console.log(res);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}

export default FileUpload;
