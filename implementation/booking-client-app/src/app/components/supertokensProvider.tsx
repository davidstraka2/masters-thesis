"use client";

import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent, PropsWithChildren } from 'react';
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig, setRouter } from "../config/frontend";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

export const SuperTokensProvider: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  setRouter(useRouter(), usePathname() || window.location.pathname);

  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
