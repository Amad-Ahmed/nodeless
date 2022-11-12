import React, { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Authenticator from "./Authenticator";
import Main from "./Main";
import Login from "./Login";
import Signup from "./Signup";
import Base from "./Base";
function App() {
  return (
    <BrowserRouter>
      <Authenticator
        fallback={
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        }
      >
        <Base />
      </Authenticator>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;