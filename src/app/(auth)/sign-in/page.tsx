
import { SignInForm } from '@/components/auth/SignInForm';
import React, { Suspense } from 'react'

const SignIn = () => {
  return (
    <main className='w-full'>
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  )
}

export default SignIn;