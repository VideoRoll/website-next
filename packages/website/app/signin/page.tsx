"use server";

import React from "react";
import { login, loginWithGoogle } from './actions'
import Signin from '../../components/ui/Signin';
import { Title } from "@mantine/core";

export default async function LoginPage() {
  return (
    <div>
      <Title order={2}>Sign in to Video Roll</Title>
      <Signin onSubmit={login} onGoogleSignin={loginWithGoogle} submitText='Sign in'></Signin>
    </div>
    
  );
}
