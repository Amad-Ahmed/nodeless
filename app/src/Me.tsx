import { FC } from "react";
import { useMe } from "./Authenticator";

const Me: FC = () => {
  const { data, loading } = useMe();
  if (loading) return <div>Loading...</div>;
  const { address, email, name } = data || {};
  const resolvedName = name || email || address?.substring(0, 6);
  return <div>Yo yo, {resolvedName}</div>;
};
export default Me;
