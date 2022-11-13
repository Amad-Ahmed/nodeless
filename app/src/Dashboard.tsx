import { FC } from "react";
import { useUpdatePath } from "./Base";
const Dashboard: FC = () => {
  useUpdatePath();
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};
export default Dashboard;
