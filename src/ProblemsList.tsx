import { useState, useEffect } from "react";
import { apiFetch } from "./api/client";


interface Topic {
  id: number;
  name: string;
}

interface Problem {
  id: number;
  title: string;
  url: string;
  difficulty: string;
  topics: Topic[];
}




function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    apiFetch<Problem[]>("/problems")
      .then((data) => setProblems(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(problemId: number) {
  setError(null);
  try {
    await apiFetch(`/problems/${problemId}`, { method: "DELETE" });
    setProblems((prev) => prev.filter((p) => p.id !== problemId));
  } catch (err) {
    setError((err as Error).message);
  }
}

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <ul>
    {problems.map((problem) => (
      <li key={problem.id}>
        {problem.title} — {problem.difficulty}
        <button type="button" onClick={() => handleDelete(problem.id)}>
          Delete Problem
        </button>
      </li>
    ))}
  </ul>
);
}

export default ProblemsList;