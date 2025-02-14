import { createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const [user,setUser] = useState(null);
  const [accessToken,setAccessToken] = useState(null);
  const [refreshToken,setRefreshToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);
  
  return (
    <AuthContext.Provider
      value={{user,setUser,refreshToken,setRefreshToken,accessToken,setAccessToken}}>
      {props.children}
    </AuthContext.Provider>
  );
};

