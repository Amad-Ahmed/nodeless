import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CodePreview from "./CodePreview";
import Dashboard from "./Dashboard";
import Me from "./Me";
import Oracle from "./Oracle";
import Oracles from "./Oracles";
import Requests from "./Requests";

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/oracles" element={<Oracles />} />
      <Route path="/oracle/:id" element={<Oracle />} />
      <Route path="/code/:id" element={<CodePreview />} />
      <Route path="/me" element={<Me />} />
      <Route path="*" element={<Navigate to="/oracles" />} />
    </Routes>
  );
};

export default AppRouter;
