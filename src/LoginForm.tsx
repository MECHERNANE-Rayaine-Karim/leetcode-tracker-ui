import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "./api/client";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const token = await apiFetch<string>("/users/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem("token", token);
      setLoggedIn(true);
      setTimeout(() => navigate("/problems"), 1000);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function register(){
     navigate("/register");
  }

  if (loggedIn) {
    return <p>Logged in successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">login</button>
      <button type="button" onClick={register}>register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginForm;