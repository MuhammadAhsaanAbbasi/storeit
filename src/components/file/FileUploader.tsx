"use client"
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'
import Image from 'next/image'

const FileUploader = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button className='uploader-button'>
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
        </div>
    )
}

export default FileUploader;