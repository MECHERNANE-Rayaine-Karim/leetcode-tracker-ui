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
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTopicsId, setEditingTopicsId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("easy");

  useEffect(() => {
    apiFetch<Problem[]>("/problems")
      .then((data) => setProblems(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));

    apiFetch<Topic[]>("/topics")
      .then((data) => setAllTopics(data))
      .catch((err) => setError((err as Error).message));
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

  function startTopicsEdit(problem: Problem) {
    setError(null);
    setEditingTopicsId(problem.id);
  }

  function cancelTopicsEdit() {
    setEditingTopicsId(null);
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
        prev.map((p) => (p.id === problemId ? { ...p, ...updated } : p))
      );
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleAddTopic(problem: Problem, topic: Topic) {
    setError(null);
    try {
      await apiFetch(
        `/problems/${problem.id}/topics`,
        { method: "POST" },
        { topic_id: topic.id }
      );
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problem.id ? { ...p, topics: [...p.topics, topic] } : p
        )
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function renderRow(problem: Problem) {
    if (editingId === problem.id) {
      return (
        <form onSubmit={(e) => handleEditSubmit(e, problem.id)}>
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <input type="text" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
          <select value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      );
    }

    if (editingTopicsId === problem.id) {
      const linkedIds = problem.topics.map((t) => t.id);
      return (
        <div>
          {allTopics.map((topic) => (
            <label key={topic.id}>
              <input
                type="checkbox"
                checked={linkedIds.includes(topic.id)}
                disabled={linkedIds.includes(topic.id)}
                onChange={() => handleAddTopic(problem, topic)}
              />
              {topic.name}
            </label>
          ))}
          <button type="button" onClick={cancelTopicsEdit}>Done</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      );
    }

    return (
      <>
        {problem.title} — {problem.difficulty}
        <button type="button" onClick={() => startEdit(problem)}>Edit</button>
        <button type="button" onClick={() => handleDelete(problem.id)}>Delete</button>
        <button type="button" onClick={() => startTopicsEdit(problem)}>Edit Topics</button>
      </>
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {problems.map((problem) => (
        <li key={problem.id}>{renderRow(problem)}</li>
      ))}
    </ul>
  );
}

export default ProblemsList;