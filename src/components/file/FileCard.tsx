import { Models } from 'node-appwrite';
import React from 'react'
import ActionDropDown from './ActionDropDown';
import { convertFileSize } from '@/lib/utils';
import FormattedDateTime from './FormattedDateTime';
import ImageDialog from './ImageDialog';

const FileCard = ({ file }: { file: Models.Document }) => {
    return (
        <div className="file-card">
            <div className="flex justify-between">
                <ImageDialog file={file} />
                <div className="flex flex-col items-end justify-between">
                    <ActionDropDown file={file} />
                    <p className="body-1">{convertFileSize(file.size)}</p>
                </div>

            </div>
            <div className='file-card-details'>
                <p className="subtitle-2 line-clamp-1">{file.name}</p>
                <FormattedDateTime
                    date={file.$createdAt}
                    className="body-2 text-light-100"
                />
            </div>
        </div>
    )
}

export default FileCard;