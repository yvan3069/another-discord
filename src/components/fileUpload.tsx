"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
// import { UploadButton } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string | undefined;
  // fit the core.ts in uploadImage
  endpoint: "messageFile" | "serverImage";
}

function FileUpload({ onChange, value, endpoint }: FileUploadProps) {
  // TODO: 判断类型是否为图片/pdf，如果是图片的话，则
  if (value) {
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
