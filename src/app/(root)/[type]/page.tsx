import React from 'react'

const FileTypePage = async ({ searchParams, params }: SearchParamProps) => {
    const type = (await params)?.type;
    return (
        <div>
            FileTypePage: {type}
        </div>
    )
}

export default FileTypePage;