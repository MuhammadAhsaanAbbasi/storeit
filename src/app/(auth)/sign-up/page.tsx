import { SignUpForm } from '@/components/auth/SignUpForm';
import React, { Suspense } from 'react'

const SignUp = () => {
  return (
    <main>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </main>
  )
}

export default SignUp;