import { useState } from "react";
import { apiFetch } from "./api/client";
import {useNavigate} from "react-router-dom";


function RegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await apiFetch<string>("/users/register", {
                method: "POST",
                body: JSON.stringify({ username, password,email }),
            });
            const token = await apiFetch<string>("/users/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem("token", token);
            setLoggedIn(true);
            setTimeout(() => navigate("/problems"), 1000);
        }  catch (err) {
        setError((err as Error).message);
    }
  }

  function login(){
        navigate("/login");
  }

  if (loggedIn) {
        return <p>Registered successfully!</p>;
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
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Register</button>
      <button type="button" onClick={login}>log in</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );

}
export default RegisterForm;