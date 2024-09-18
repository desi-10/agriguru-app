import React from "react";
import { useUser } from "./userContext";
import { Redirect } from "expo-router";

const ProtectedLogin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (user && user?.role?.toLowerCase() === "admin") {
    return <Redirect href="/admin/(tabs)/homepage" />;
  } else if (user) {
    return <Redirect href="/farmer/(tabs)/dashboard" />;
  }
  return children;
};

export default ProtectedLogin;
