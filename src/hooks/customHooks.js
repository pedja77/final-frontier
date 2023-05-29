import { useState } from "react";
import { decodeJwtPayload } from "../utils/token";

export const useLogin = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    return [
        user, 
        async (username, password) => {
            const u = await fetch(
                      `http://localhost:8080/api/v1/users/login?user=${username}&password=${password}`,
                      {
                        method: "POST",
                      }
                    );
            const user = await u.json();
            console.log('useLogin>login>user ' + JSON.stringify(user))
            const newUser = {
                ...user,
                token: user.token.split(" ")[1],
                role: JSON.parse(decodeJwtPayload(user.token)).authorities[0]
            };
            console.log('newUser ' + JSON.stringify(newUser));
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        },
        () => {
            setUser(null);
            localStorage.removeItem('user');
        }
    ]
}