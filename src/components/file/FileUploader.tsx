"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'
import Image from 'next/image'
import { cn, convertFileToUrl, getFileIcon, getFileType } from '@/lib/utils'
import Thumbnail from '@/components/shared/Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { toast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/files.actions'
import { usePathname } from 'next/navigation'


interface IProps {
    className: string;
    ownerId: string;
    accountId: string;
}

const FileUploader = ({ className, ownerId, accountId }: IProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const path = usePathname();
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);
            const uploadPromises = acceptedFiles.map((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    setFiles((prev) => prev.filter((file) => file.name !== file.name))
                    toast({
                        title: "File too large",
                        description: (
                            <p className="body-2 text-white">
                                <span className="font-semibold">
                                    {file.name}
                                </span>
                                <span>
                                    {" "} is too large.
                                    Max file size is 50MB.
                                </span>
                            </p>
                        ),
                        variant: "destructive",
                    })
                }
                return uploadFile({ file, ownerId, accountId, path })
                    .then((data) => {
                        if (data.error) {
                            toast({
                                title: "Upload Failed!!",
                                description: (
                                    <p className="body-2 text-white">
                                        <span className="font-semibold">
                                            {file.name}
                                        </span>
                                        <span>
                                            {" "} {data.message}
                                        </span>
                                    </p>
                                ),
                                variant: "destructive",
                            });
                        }
                        if (data.success) {
                            setFiles((prevFiles) =>
                                prevFiles.filter((f) => f.name !== file.name),
                            );
                            toast({
                                title: "Upload Success!!",
                                description: (
                                    <p className="body-2 text-white">
                                        <span className="font-semibold">
                                            {data.success}
                                        </span>
                                    </p>
                                ),
                                variant: "default",
                            });
                        }
                    });
            });
            await Promise.all(uploadPromises);
        }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleRemoveFile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, fileName: string) => {
        e.stopPropagation();
        setFiles((prev) => prev.filter((file) => file.name !== fileName))
    }
    return (
        <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <Button type="button" className={cn("uploader-button", className)}>
                <Image
                    src={"/icons/upload.svg"}
                    alt="upload"
                    width={24}
                    height={24}
                />
                <span className='body-1'>
                    Upload
                </span>
            </Button>
            {
                files.length > 0 && (
                    <ul className='uploader-preview-list'>
                        <h4 className="h4 text-light-100">Uploading</h4>
                        {
                            files.map((file, index) => {
                                const { type, extension } = getFileType(file.name);
                                return (
                                    <li key={index} className='uploader-preview-item'>
                                        <div className='flex items-center gap-4'>
                                            <Thumbnail
                                                type={type}
                                                extension={extension}
                                                url={convertFileToUrl(file)}
                                            />
                                            <div className="preview-item-name">
                                                {file.name}
                                                {/* <span>
                                                </span> */}
                                                <Image
                                                    src="/icons/file-loader.gif"
                                                    width={80}
                                                    height={26}
                                                    alt="Loader"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='cursor-pointer'
                                            onClick={(e) => handleRemoveFile(e, file.name)}
                                        >
                                            <Image
                                                src={"/icons/remove.svg"}
                                                width={24}
                                                height={24}
                                                alt="Remove"
                                            />
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default FileUploader;