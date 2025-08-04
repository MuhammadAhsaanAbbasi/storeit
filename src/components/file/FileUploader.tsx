"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'
import Image from 'next/image'
import { cn, convertFileToUrl, getFileIcon, getFileType } from '@/lib/utils'
import Thumbnail from './Thumbnail'


interface IProps {
    className: string;
}

const FileUploader = ({ className }: IProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
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