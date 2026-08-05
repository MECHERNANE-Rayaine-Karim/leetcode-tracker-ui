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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <ul>
      {problems.map((problem) => (
        <li key={problem.id}>
          {problem.title} — {problem.difficulty}
        </li>
      ))}
    </ul>
  );
}

export default ProblemsList;