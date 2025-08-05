import FileCard from '@/components/file/FileCard';
import SortFiles from '@/components/file/SortFiles';
import { getFiles } from '@/lib/actions/files.actions';
import { getFileTypesParams } from '@/lib/utils';
import React from 'react'

const FileTypePage = async ({ searchParams, params }: SearchParamProps) => {
    const type = (await params)?.type as string;

    const types = getFileTypesParams(type) as FileType[];

    const files = await getFiles({ types });
    return (
        <div className='page-container'>
            <section className='w-full'>
                <h1 className='h1 capitalize'>
                    {type}
                </h1>
                <div className='total-size-section'>
                    <p className="body-1">
                        Total: <span className="h5">50 MB</span>
                    </p>

                    <div className='sort-container'>
                        <p className="body-1 hidden text-light-200 sm:block">
                            Sort by:
                        </p>
                        <SortFiles />
                    </div>
                </div>
            </section>
            {
                (files?.data?.total as number) > 0 ? (
                    <section className="file-list">
                        {files?.data?.documents?.map((file) => (
                            <FileCard key={file.$id} file={file} />
                        ))}
                    </section>
                ) : (
                    <p className="empty-list">
                        No files found
                    </p>
                )
            }
        </div>
    )
}

export default FileTypePage;