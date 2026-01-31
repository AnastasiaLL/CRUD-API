import { User, UserWithoutId } from "./types/user"
import { v4 as uuidv4 } from 'uuid';

const users: User[] = []

export const db = {
    getAllUsers: async (): Promise<User[]> => users,

    getUserByID: async (id: string):  Promise<User | undefined> => users.find(user=> user.id === id),

    createUser: async (user: UserWithoutId):  Promise<User> => {
        const newUser: User = {
        ...user,
        id: uuidv4()
      };
      users.push(newUser);
      return newUser;
    },

    updateUser: async (id: string, user: UserWithoutId ):  Promise<User | undefined> => {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return undefined;
        users[index] = { ...user, id };
        return users[index];
    },

     deleteUser: async (id: string): Promise<boolean> => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return false;
        users.splice(index, 1);
        return true;
    }

}