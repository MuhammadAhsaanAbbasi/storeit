"use client";
import { Models } from 'node-appwrite'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Thumbnail from '../shared/Thumbnail';
import ActionDropDown from './ActionDropDown';
import Image from 'next/image';
import ReactAudioPlayer from 'react-audio-player';
import { getFileIcon } from '@/lib/utils';
import Link from 'next/link';

const ImageDialog = ({ file }: { file: Models.Document }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const renderDialogContent = () => {
        return (
            <DialogContent
                className="!w-full !min-w-[100vw] !max-w-[100vw] !h-screen max-h-[95vh] bg-transparent border-none"
                icon='hidden'
            >
                <DialogHeader className="flex flex-row items-start justify-between">
                    <div className="flex flex-row items-center gap-4">
                        <Image
                            src={"/icons/close.svg"}
                            alt={file.name}
                            width={32}
                            height={32}
                            className="cursor-pointer"
                            onClick={() => setIsDialogOpen(false)}
                        />
                        <DialogTitle className="flex flex-row items-center gap-2">
                            <Image
                                src={getFileIcon(file.extension, file.type)}
                                alt={file.name}
                                width={28}
                                height={28}
                            />
                            <span className='h2 text-light-300'>
                                {file.name}
                            </span>
                        </DialogTitle>
                    </div>
                    <ActionDropDown file={file} />
                </DialogHeader>
                <div className="flex flex-col items-center justify-center">
                    {
                        file.type == "image" ? (
                            <Image
                                src={file.url}
                                alt={file.name}
                                width={800}
                                height={600}
                                className="w-full max-w-[800px] h-auto object-contain"
                            />
                        ) : file.type == "video" ? (
                            <video
                                src={file.url}
                                controls
                                className="w-full max-w-[800px] h-auto object-contain"
                            />
                        ) : file.type == "audio" && (
                            <ReactAudioPlayer
                                src={file.url}
                                controls
                            />
                        )
                    }
                </div>
            </DialogContent>
        )
    };
    return (
        <>
            {
                ["image", "video", "audio"].includes(file.type) ? (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger>
                            <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="!size-16"
                                imageClassName="!size-11"
                            />
                        </DialogTrigger>
                        {renderDialogContent()}
                    </Dialog>
                )
                    :
                    (
                        <Link target="_blank" className="file-card" href={file.url}>
                            <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="!size-16"
                                imageClassName="!size-11"
                            />
                        </Link>
                    )
            }
        </>
    )
}

export default ImageDialog;