import { useEffect, useState } from "react";
import { decodeJwtPayload } from "../utils/token";
import { produce } from "immer";

export const useLogin = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  return [
    user,
    async (username, password) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/login?user=${username}&password=${password}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const u = await response.json();
        const newUser = produce(u, (draft) => {
          draft.token = u.token.split(" ")[1];
          draft["role"] = JSON.parse(decodeJwtPayload(u.token)).authorities[0];
        });
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
      } else {
        // setUser(null);
        // localStorage.setItem("user", JSON.stringify(newUser));
        return null;
      }
    },
    () => {
      setUser(null);
      localStorage.removeItem("user");
    },
  ];
};

export const useFetchData = (url, config) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const res = await fetch(url, config);
      if (!ignore) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    };
    fetchData();
    return () => ignore = true;
  }, [url]);
  return data;
};
