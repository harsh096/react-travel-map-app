import "./login.css";
import RoomIcon from "@mui/icons-material/Room";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

const Login = ({ setShowLogin, myLocalStorage, setCurrentUser }) => {
  const [failure, setFailure] = useState(false);
  const nameRef = useRef();

  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myLocalStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
        setShowLogin(false)
      setFailure(false);
    } catch (err) {
      setFailure(true);
      console.log(err);
    }
  };
  return (
    <div className="loginContainer">
      <div className="closeButton">
        <CloseIcon onClick={() => setShowLogin(false)} />
      </div>
      <div className="logo">
        <RoomIcon />
        Travel Pin App
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />

        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginButton">Login</button>

        {failure && (
          <span className="failure">
            Something went wrong. Please try again!
          </span>
        )}
      </form>
    </div>
  );
};

export default Login;
