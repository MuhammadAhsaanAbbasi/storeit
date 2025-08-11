import { SignUpForm } from '@/components/auth/SignUpForm';
import React, { Suspense } from 'react'

const SignUp = () => {
  return (
    <main className='w-full font-poppins'>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </main>
  )
}

export default SignUp;