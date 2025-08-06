"use client";
import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

interface IProps {
    type: string;
    extension: string;
    url?: string;
    imageClassName?: string;
    className?: string;
}

export default function Thumbnail({ type, extension, url, imageClassName,
    className }: IProps) {
    const isImage = type === "image" && extension !== "svg";
    return (
        <figure className={cn('thumbnail', className)}>
            <Image
                src={(isImage ? url : getFileIcon(extension, type)) as string}
                alt='Thumbnail'
                height={100}
                width={100}
                className={cn(
                    "size-8 object-contain",
                    imageClassName,
                    isImage && "thumbnail-image"
                )}
                onError={(e) => {
                    e.currentTarget.src = getFileIcon(extension, type);
                }}
                unoptimized={true}
            />
        </figure>
    )
}
