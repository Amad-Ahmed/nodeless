import { FC, useEffect } from "react";
import { useMe } from "./Authenticator";
import { useBase } from "./Base";

const Me: FC = () => {
  const { setTitle } = useBase();
  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);
  const { data, loading } = useMe();
  if (loading) return <div>Loading...</div>;
  const { address, email, name } = data || {};
  const resolvedName = name || email || address?.substring(0, 6);
  return <div>Yo yo, {resolvedName}</div>;
};
export default Me;
