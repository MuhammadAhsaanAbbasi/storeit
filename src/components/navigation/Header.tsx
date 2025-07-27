import React from 'react'
import FileSearch from '@/components/file/FileSearch';
import FileUploader from '@/components/file/FileUploader';
import SignOutButton from '@/components/auth/SignOutButton';

const Header = () => {
  return (
    <header className='header'>
      <FileSearch />
      <div className='header-wrapper'>
        <FileUploader />
        <SignOutButton />
      </div>
    </header>
  )
}

export default Header;