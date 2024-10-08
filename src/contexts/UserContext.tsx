import * as React from 'react';
import { IUserManager } from "../interfaces/ServerResponse"
import * as storageKeys from '../constants/StorageKeys'
import { TUser } from '../types/user';

export const UserContext = React.createContext<IUserManager>(null as any)
interface Props {
  children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = React.useState<TUser>(() => JSON.parse(localStorage.getItem(storageKeys.USER) as string) as TUser || null as any)

    const storeUser = (user: TUser) => {
      setUser(user)
    }

    return (
        <UserContext.Provider value={{user, storeUser }}>
          {children}
        </UserContext.Provider>
      )
}

export default UserProvider;