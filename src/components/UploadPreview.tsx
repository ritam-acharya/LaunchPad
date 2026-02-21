import React, { useRef } from "react";
import type { DragEvent } from 'react';
import { BsImages } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function UploadPreview({file, previewUrl, setFile, setPreviewUrl}: {file: File | null, previewUrl: string | null, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>> }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleFile(selectedFile: File) {
        setFile(selectedFile);

        // Generate preview URL
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
    };

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
        handleFile(selectedFile);
        }
    };

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
        handleFile(droppedFile);
        }
    };

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
    };

    function openFileDialog() {
        fileInputRef.current?.click();
    };

    function deleteFile() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
    <div 
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    className="h-auto min-h-[250px] flex flex-col items-center justify-center w-full border-[2px] border-[#444] border-dashed rounded-lg px-4 py-4 md:py-6 cursor-pointer ">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*,video/*"/>
        {
            !previewUrl && 
            <>
                <span className="text-[20px] md:text-[26px] lg:text-[32px] my-3 ">
                    <BsImages />
                </span>
                <p className="text-sm md:text-[16px] lg:text-lg font-medium px-2">Select video or image to upload</p>
                <p className="text-sm md:text-[16px] lg:text-lg font-medium px-2 text-[#9CA3AF] ">or drag and drop it here</p>
                <div 
                onClick={openFileDialog}
                className="bg-[#78D99C] px-3 py-4 my-5 rounded-lg cursor-pointer text-black text-sm md:text-[16px] leading-[14px] md:leading-[16px] font-medium tracking-tight ">Select file</div>
            </>
        }

        {previewUrl && file && (
            <div className="w-full h-auto flex items-center justify-center flex-col">
                {file.type.startsWith("image") && (
                    <div className="max-w-[100%] w-auto h-auto max-h-[300px] border relative border-[#444] p-4 rounded-lg overflow-hidden flex items-center justify-center ">
                        <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-center"
                        />
                        <div 
                        onClick={deleteFile}
                        className="p-1 cursor-pointer bg-[#444] overflow-hidden absolute top-1 right-1 z-10 flex items-center justify-center rounded-md text-red-500">
                            <RiDeleteBin6Line />
                        </div>
                    </div>
                )}

                {file.type.startsWith("video") && (
                    
                    <div className="max-w-[100%] w-auto h-auto max-h-[300px] border relative border-[#444] p-4 rounded-lg overflow-hidden flex items-center justify-center ">
                        <video
                        src={previewUrl}
                        controls
                        className="h-full w-full object-center"
                        />
                        <div 
                        onClick={deleteFile}
                        className="p-1 cursor-pointer bg-[#444] overflow-hidden absolute top-1 right-1 z-10 flex items-center justify-center rounded-md text-red-500">
                            <RiDeleteBin6Line />
                        </div>
                    </div>
                )}
                <p className="mt-5 ">{file.name}</p>
            </div>
        )}
    </div>
  );
};
