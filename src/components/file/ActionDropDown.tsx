import Image from 'next/image';
import { Models } from 'node-appwrite';
import React from 'react'

const ActionDropDown = ({file}: {file: Models.Document}) => {
    return (
        <div>
            <Image 
            src={"/icons/dots.svg"}
            alt="dots"
            width={34}
            height={34}
            />
        </div>
    )
}

export default ActionDropDown;