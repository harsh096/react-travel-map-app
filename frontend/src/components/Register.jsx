import "./register.css";
import RoomIcon from "@mui/icons-material/Room";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/register", newUser);
      setFailure(false);
      setSuccess(true);
    } catch (err) {
      setFailure(true);
      console.log(err);
    }
  };

  
  return (
    <div className="registerContainer">
      <div className="closeButton">
        <CloseIcon onClick={() =>  setShowRegister(false)} />
      </div>
      <div className="registerLogo">
        <RoomIcon />
        Travel Pin App
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerButton">Register</button>
        {success && (
          <span className="success">Success. You can login now.</span>
        )}
        {failure && (
          <span className="failure">
            Something went wrong. Please try again!
          </span>
        )}
      </form>
    </div>
  );
};

export default Register;
