import {
  FC,
  ReactElement,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { eth_requestAccounts } from "@raydeck/metamask-ts";
import { ethers } from "ethers";
import { toast } from "react-toastify";
const ethereum = (window as unknown as { ethereum: any }).ethereum;
const baseUrl = "https://xw8v-tcfi-85ay.n7.xano.io/api:58vCnoV0";
const context = createContext({
  isAuthenticated: false,
  token: "",
  loginWithPassword: async (email: string, password: string) => {},
  loginWithWallet: async () => {},
  signupWithPassword: async (email: string, password: string) => {},
  signupWithWallet: async (email: string) => {},
  logout: () => {},
});
const { Provider } = context;
const Authenticator: FC<{
  children: ReactElement;
  fallback: ReactElement;
}> = ({ children, fallback }) => {
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    console.log("Authenticator useEffect");
    //lets get my xano token from the localStorage
    const token = localStorage.getItem("xano-token");
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
    }
  }, []);
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem("xano-token");
  }, []);
  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      //reach out to the server for a login
      console.log("I will post to ", `${baseUrl}/auth/login`);
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        const { authToken } = await response.json();
        setToken(authToken);
        setIsAuthenticated(true);
        localStorage.setItem("xano-token", authToken);
      } else {
        const body = await response.text();
        toast.error("Could not log in with these credentials");
        throw new Error(body);
      }
    },
    []
  );
  const loginWithWallet = useCallback(async () => {
    //Make sure the wallet is connected
    await eth_requestAccounts();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const message = JSON.stringify(
      { message: "Authenticate me to Nodeless", exp: Date.now() + 1000 * 60 },
      null,
      2
    );
    const signature = await signer.signMessage(message);
    const obj = { message, signature, address };
    const response = await fetch(`${baseUrl}/auth/walletlogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: window.btoa(JSON.stringify(obj)) }),
    });
    if (response.status === 200) {
      const { authToken } = await response.json();
      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem("xano-token", authToken);
    } else {
      const body = await response.text();
      toast.error("Could not log in with these credentials");
      throw new Error(body);
    }
  }, []);
  const signupWithPassword = useCallback(
    async (email: string, password: string) => {
      //reach out to the server for a login
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        const { authToken } = await response.json();
        setToken(authToken);
        setIsAuthenticated(true);
        localStorage.setItem("xano-token", authToken);
      } else {
        const body = await response.text();
        throw new Error(body);
      }
    },
    []
  );
  const signupWithWallet = useCallback(async (emailAddress: string) => {
    //Make sure the wallet is connected
    await eth_requestAccounts();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const message = JSON.stringify(
      { message: `Sign up ${emailAddress} to Nodeless` },
      null,
      2
    );
    const signature = await signer.signMessage(message);
    const obj = { message, signature, address };
    const response = await fetch(`${baseUrl}/auth/walletsignup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailAddress,
        token: window.btoa(JSON.stringify(obj)),
      }),
    });
    if (response.status === 200) {
      const { authToken } = await response.json();
      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem("xano-token", authToken);
    } else {
      const body = await response.text();
      throw new Error(body);
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const value = useMemo(() => {
    return {
      isAuthenticated,
      token,
      logout,
      loginWithPassword,
      loginWithWallet,
      signupWithPassword,
      signupWithWallet,
    };
  }, [
    isAuthenticated,
    token,
    logout,
    loginWithPassword,
    loginWithWallet,
    signupWithPassword,
    signupWithWallet,
  ]);
  if (isAuthenticated) {
    return <Provider value={value}>{children}</Provider>;
  } else {
    return <Provider value={value}>{fallback}</Provider>;
  }
};
export const useAuthentication = () => {
  const contextValue = useContext(context);
  return contextValue;
};

export const useAuthenticatedFetch = () => {
  const { token, logout } = useAuthentication();
  return useCallback(
    async (path: string, options: RequestInit = {}) => {
      const url = baseUrl + path;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        logout();
      }
      return response;
    },
    [token, logout]
  );
};

export const useAuthenticatedQuery = <T,>(
  path: string,
  options?: RequestInit
) => {
  const fetch = useAuthenticatedFetch();
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const refresh = useCallback(async () => {
    // const fetchData = async () => {
    try {
      const response = await fetch(path, optionsRef.current);
      const data: T = await response.json();
      setData(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
    // };
    // fetchData();
  }, [fetch, path]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { data, error, loading, refresh };
};
export type User = {
  name: string;
  email: string;
  address: string;
};
export const useMe = () => {
  const fetch = useAuthenticatedFetch();
  const { data, loading, refresh } = useAuthenticatedQuery<User>(`/auth/me`);
  const update = useCallback(
    async (options: { name: string; password?: string }) => {
      const response = await fetch("/auth/me", {
        method: "POST",
        body: JSON.stringify({
          name: options.name,
          password: options.password || "",
        }),
      });
      if (response.status === 200) {
        refresh();
        const json = (await response.json()) as User;
        return json;
      } else throw new Error(response.statusText);
    },
    [fetch, refresh]
  );

  return useMemo(
    () => ({ data, loading, refresh, update }),
    [data, loading, refresh, update]
  );
};
export default Authenticator;
