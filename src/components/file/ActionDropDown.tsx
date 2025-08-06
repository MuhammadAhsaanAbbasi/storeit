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
import React, { act, useState, useTransition } from 'react';
import { actionsDropdownItems } from '@/constants';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { usePathname } from 'next/navigation';
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/files.actions';
import { toast } from '@/hooks/use-toast';
import FileDetails from './FileDetails';
import ShareInput from './ShareInput';

const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const [isDropDown, setIsDropDown] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [newName, setNewName] = useState(file.name);
    const [emails, setEmails] = useState<string[]>([]);

    const [isPending, startTransition] = useTransition();

    const path = usePathname();

    const handleAction = async () => {
        const actions = {
            rename: () => renameFile({ fileId: file.$id, name: newName, path: path }),
            share: () => updateFileUsers({ fileId: file.$id, emails, path }),
            delete: () => deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
        };
        startTransition(async () => {
            await actions[action?.value as keyof typeof actions]()
                .then((data) => {
                    if (data.error) {
                        toast({
                            title: "Error",
                            description: data.error.message,
                            variant: "destructive",
                        });
                    }
                    if (data.success) {
                        toast({
                            title: "Success",
                            description: data.success,
                            variant: "default",
                        });
                    }
                })
                .catch((error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    });
                })
                .finally(() => {
                    setIsDialogOpen(false);
                    setIsDropDown(false);
                    setAction(null);
                    setNewName(file.name);
                });
        });
    };

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);

        await updateFileUsers({
          fileId: file.$id,
          emails: updatedEmails,
          path,
        }).then((data) => {
          if (data.error) {
            toast({
              title: "Error",
              description: data.error.message,
              variant: "destructive",
            });
          }
          if (data.success) {
            toast({
              title: "Success",
              description: data.success,
              variant: "default",
            });
            setEmails(updatedEmails);
          }
        }).finally(() => {
          setIsDialogOpen(false);
          setIsDropDown(false);
          setAction(null);
          setNewName(file.name);
        });
    };

    const renderDialogContent = () => {
        if (!action) return null;

        const { label, value } = action;
        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>
                </DialogHeader>
                {
                    value === "rename" && (
                        <Input
                            type="text"
                            placeholder="Enter new name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    )
                }
                {
                    value === "details" && (
                        <FileDetails file={file} />
                    )
                }
                {
                    value === "share" && (
                        <ShareInput file={file}
                            onInputChange={setEmails}
                            onRemove={handleRemoveUser}
                        />
                    )
                }
                {
                    value === "delete" && (
                        <p className="delete-confirmation">
                            Are you sure you want to delete{` `}
                            <span className="delete-file-name">{file.name}</span>?
                        </p>
                    )
                }
                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className='flex flex-col gap-3 w-full'>
                        <Button
                            onClick={() => setIsDialogOpen(false)}
                            className="modal-cancel-button h-12"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleAction}
                            className="modal-submit-button h-12"
                        >
                            {
                                isPending ? (
                                    <Image
                                        src="/icons/loader.svg"
                                        alt="loader"
                                        width={24}
                                        height={24}
                                        className="ml-2 animate-spin"
                                    />
                                ) : (
                                    label
                                )
                            }
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    };
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
                                    setAction(action);

                                    if (
                                        ["rename", "share", "delete", "details"].includes(
                                            action.value,
                                        )
                                    ) {
                                        setIsDialogOpen(true);
                                    }

                                }}
                            >
                                {
                                    action.value === "download" ? (
                                        <Link href={constructDownloadUrl(file.bucketFileId)}
                                            download={file.name}
                                            className='flex items-center gap-2'
                                        >
                                            <Image
                                                src={action.icon}
                                                alt={action.label}
                                                width={30}
                                                height={30}
                                            />
                                            <span className="truncate">
                                                {action.label}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <Image
                                                src={action.icon}
                                                alt={action.label}
                                                width={30}
                                                height={30}
                                            />
                                            <span className="truncate">
                                                {action.label}
                                            </span>
                                        </div>
                                    )
                                }
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropDown;