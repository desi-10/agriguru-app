import React from "react";
import { useUser } from "./userContext";
import { Redirect } from "expo-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (!user) {
    return <Redirect href="/" />;
  }
  return children;
};

export default ProtectedRoute;
