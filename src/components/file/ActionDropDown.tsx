"use client";
import Image from 'next/image';
import { Models } from 'node-appwrite';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from 'react';
import { actionsDropdownItems } from '@/constants';
import { Dialog } from '../ui/dialog';

const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const [isDropDown, setIsDropDown] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actions, setActions] = useState<ActionType | null>(null);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu open={isDropDown} onOpenChange={setIsDropDown}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image
                        src={"/icons/dots.svg"}
                        alt="dots"
                        width={34}
                        height={34}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        actionsDropdownItems.map((action) => (
                            <DropdownMenuItem key={action.value}
                                className='shad-dropdown-item'
                                onClick={() => {
                                    setActions(action);

                                    if (
                                        ["rename", "share", "delete", "details"].includes(
                                            action.value,
                                        )
                                    ) {
                                        setIsDialogOpen(true);
                                    }

                                }}
                            >
                                {action.label}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    )
}

export default ActionDropDown;