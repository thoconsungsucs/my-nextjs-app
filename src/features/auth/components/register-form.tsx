'use client';

import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useRegister, registerInputSchema } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

  return (
    <div>
      <Form
        onSubmit={(values) => {
          registering.mutate(values);
        }}
        schema={registerInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="text"
              label="User Name"
              error={formState.errors['userName']}
              registration={register('userName')}
            />

            <Input
              type="text"
              label="Full Name"
              error={formState.errors['fullName']}
              registration={register('fullName')}
            />

            <Input
              type="tel"
              label="Phone"
              error={formState.errors['phone']}
              registration={register('phone')}
            />

            <Input
              type="email"
              label="Email Address"
              error={formState.errors['email']}
              registration={register('email')}
            />

            <Input
              type="text"
              label="Address"
              error={formState.errors['address']}
              registration={register('address')}
            />

            <Input
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />

            <div>
              <Button
                isLoading={registering.isPending}
                type="submit"
                className="w-full"
              >
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <NextLink
            href={paths.auth.login.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </NextLink>
        </div>
      </div>
    </div>
  );
};
