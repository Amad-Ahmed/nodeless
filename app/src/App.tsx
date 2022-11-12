import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authenticator from "./Authenticator";
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
      <ToastContainer
        limit={4}
        hideProgressBar
        autoClose={1000}
        position="bottom-right"
        bodyClassName={"text-sm font-medium"}
      />
    </BrowserRouter>
  );
}

export default App;
