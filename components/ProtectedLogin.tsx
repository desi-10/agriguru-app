import React from "react";
import { useUser } from "./userContext";
import { Redirect } from "expo-router";

const ProtectedLogin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (user) {
    return <Redirect href="/(tabs)/homepage" />;
  }
  return children;
};

export default ProtectedLogin;
