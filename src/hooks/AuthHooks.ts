import { TUser } from "../types/user";
import * as StorageKeys from "../constants/StorageKeys";

type signInType = {
    token: string,
    user: TUser,
    tokenType: string
}
export const useSignIn = () => {
    
    return ({
        token: token,
        user: user,
        tokenType: tokenType
    }: signInType) => {
        localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
        localStorage.setItem(StorageKeys.TOKEN, token);
        localStorage.setItem(StorageKeys.TOKEN_TYPE, tokenType);

        return true
    };
}

export const useAuthUser = () => {
    return (): TUser => JSON.parse(localStorage.getItem(StorageKeys.USER) ?? "{}") as TUser;
}

export const useAuthToken = () => {
    return localStorage.getItem(StorageKeys.TOKEN);
}

export const useSignOut = () => {
    return () => {
        localStorage.removeItem(StorageKeys.USER);
        localStorage.removeItem(StorageKeys.TOKEN);
        localStorage.removeItem(StorageKeys.TOKEN_TYPE);
    }
}

export const useIsAuthenticated = () => {

    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (token === null) {
        return false
    }

    return true
}
