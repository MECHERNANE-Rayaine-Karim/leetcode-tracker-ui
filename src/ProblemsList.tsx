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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("easy");

  useEffect(() => {
    apiFetch<Problem[]>("/problems")
        .then((data) => setProblems(data))
        .catch((err) => setError((err as Error).message))
        .finally(() => setLoading(false));
  }, []);

  async function handleDelete(problemId: number) {
    setError(null);
    try {
      await apiFetch(`/problems/${problemId}`, {method: "DELETE"});
      setProblems((prev) => prev.filter((p) => p.id !== problemId));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEdit(problem: Problem) {
    setError(null);
    setEditingId(problem.id);
    setEditTitle(problem.title);
    setEditUrl(problem.url);
    setEditDifficulty(problem.difficulty);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleEditSubmit(e: React.FormEvent, problemId: number) {
    e.preventDefault();
    setError(null);
    try {
      const updated = await apiFetch<Problem>(`/problems/${problemId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle,
          url: editUrl,
          difficulty: editDifficulty,
        }),
      });
      setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? {...p, ...updated} : p))
      );
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
      <ul>
        {problems.map((problem) => (
            <li key={problem.id}>
              {editingId === problem.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, problem.id)}>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
                    <input type="text" value={editUrl} onChange={(e) => setEditUrl(e.target.value)}/>
                    <select value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value)}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelEdit}>Cancel</button>
                    {error && <p style={{color: "red"}}>{error}</p>}
                  </form>
              ) : (
                  <>
                    {problem.title} — {problem.difficulty}
                    <button type="button" onClick={() => startEdit(problem)}>Edit</button>
                    <button type="button" onClick={() => handleDelete(problem.id)}>Delete</button>
                  </>
              )}
            </li>
        ))}
      </ul>
  );
}

export default ProblemsList;