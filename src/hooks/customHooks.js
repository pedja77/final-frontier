import { useEffect, useState } from "react";
import { decodeJwtPayload, getToken } from "../utils/token";
import { produce } from "immer";
import { useRef } from "react";
import { checkResponse } from "../utils/responseChecker";

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

export const usePropChange = (prop, dispatch, action, firstRender=null) => {
  return useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/students/grade/${prop}`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        }
      );
      checkResponse(response);
      if (!ignore) {
        const data = await response.json();
        dispatch({
          type: action,
          data: data,
          isFirst: firstRender
        });
      }
    };
    
    getData();
      
    return () => (ignore = true);
  }, [prop]);
};


