import { FC } from "react";
import { useAuthentication } from "./Authenticator";

const Me: FC = () => {
  const { token } = useAuthentication();
  return <div>Yo yo, {token}</div>;
};
export default Me;
