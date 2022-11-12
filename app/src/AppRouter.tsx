import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Me from "./Me";
import Oracle from "./Oracle";
import Oracles from "./Oracles";

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Oracles />} />
      <Route path="/oracle/:id" element={<Oracle />} />
      <Route path="/me" element={<Me />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
