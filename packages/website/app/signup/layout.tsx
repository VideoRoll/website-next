// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import React from "react";
import classes from "./Signup.module.css"
import Banner from "../../components/icons/Banner"

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={classes.signin}>
      <div className={classes.siginBox}>{children}</div>
      <div className={classes.signinBanner}>
        <Banner></Banner>
      </div>
    </div>
  );
}
