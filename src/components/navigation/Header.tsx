import React from 'react'
import FileSearch from '@/components/file/FileSearch';
import FileUploader from '@/components/file/FileUploader';
import SignOutButton from '@/components/auth/SignOutButton';

const Header = ({ownerId, accountId}: {ownerId: string, accountId: string}) => {
  return (
    <header className='header'>
      <FileSearch />
      <div className='header-wrapper'>
        <FileUploader
          className=''
          ownerId={ownerId}
          accountId={accountId}
        />
        <SignOutButton />
      </div>
    </header>
  )
}

export default Header;