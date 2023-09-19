import { createContext, useContext } from "react";
import { UserModel } from "./UserModel";
import { LocalStorage } from "../core/Storage";

export const UserContext = createContext(new UserModel(new LocalStorage()));

export const useUserModel = () => {
  return useContext(UserContext);
};
