import React, { Dispatch, SetStateAction } from 'react'
import { Models } from 'node-appwrite';
import { ImageThumbnail } from './FileDetails';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';

interface Props {
    file: Models.Document;
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
}

const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
    return (
        <div>
            <ImageThumbnail file={file} />
            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">
                    Share file with other users
                </p>
                <Input
                    type="email"
                    placeholder="Enter email addresses separated by commas"
                    onChange={(e) => onInputChange(e.target.value.trim().split(","))}
                    className="share-input-field"
                />

                <div className='pt-4'>
                    <div className='flex justify-between'>
                        <p className="subtitle-2 text-light-100">
                            Share with
                        </p>
                        <p className="subtitle-2 text-light-100">
                            {file.users.length} users
                        </p>
                    </div>

                    <ul className='pt-2'>
                        {
                            file.users.map((user: string, index: number) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <p className="subtitle-2">{user}</p>
                                    <Button
                                        onClick={() => onRemove(user)}
                                        className="share-remove-user"
                                    >
                                        <Image
                                            src="/icons/remove.svg"
                                            alt="Remove"
                                            width={24}
                                            height={24}
                                            className="remove-icon"
                                        />
                                    </Button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ShareInput;