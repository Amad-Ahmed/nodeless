import { FC } from "react";
import { useParams } from "react-router-dom";

const Oracle: FC = () => {
  const { id } = useParams();
  return <div>Hi there, {id}</div>;
};
export default Oracle;
