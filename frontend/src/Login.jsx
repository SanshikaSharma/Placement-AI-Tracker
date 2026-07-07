import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log(email, password);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );

      alert(res.data.message);

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");
      console.log(res.data.token);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;