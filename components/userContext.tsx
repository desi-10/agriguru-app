import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Platform } from "react-native";

interface User {
  user_id: string;
  username: string;
  token: string;
  farmer_id: number;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (Platform.OS === "web") {
          const token = localStorage.getItem("user");
          if (token) {
            const parseData = JSON.parse(token);
            setUser(parseData);
          }
        } else {
          const token = await AsyncStorage.getItem("user");
          if (token) {
            const parseData = JSON.parse(token);
            setUser(parseData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (Platform.OS === "web") {
          localStorage.removeItem("user");
        } else {
          await AsyncStorage.removeItem("user");
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
