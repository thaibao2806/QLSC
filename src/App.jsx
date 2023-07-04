import { React, useContext, useEffect } from "react";
import "./App.scss";
import { Header } from "./Components/Header/Header";
import { Outlet } from "react-router-dom";
import { UserContext } from "./Context/UseContext";

function App() {
  const { user, loginContext, loginContextUser } = useContext(UserContext);
  useEffect(() => {
    if (localStorage.getItem("email")) {
      loginContextUser(localStorage.getItem("email"));
    }
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <Header />
      </div>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
