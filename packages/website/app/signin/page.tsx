"use server";

import React from "react";
import { login } from './actions'
import Signin from '../../components/ui/Signin';

export default async function LoginPage() {
  return (
    <Signin onSubmit={login} submitText='Sign in'></Signin>
  );
}
