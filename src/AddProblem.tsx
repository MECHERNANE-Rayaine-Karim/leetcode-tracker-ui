import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "./api/client";

interface Topic {
  id: number;
  name: string;
}

function AddProblem() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiFetch<Topic[]>("/topics")
      .then((data) => setTopics(data))
      .catch((err) => setError((err as Error).message));
  }, []);

  function toggleTopic(id: number) {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(
        "/problems",
        {
          method: "POST",
          body: JSON.stringify({ title, url, difficulty }),
        },
        { topic_ids: selectedTopicIds }
      );
      setSuccess(true);
      setTimeout(() => navigate("/problems"), 1000);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (success) return <p>Problem added!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <fieldset>
        <legend>Topics</legend>
        {topics.map((topic) => (
          <label key={topic.id}>
            <input
              type="checkbox"
              checked={selectedTopicIds.includes(topic.id)}
              onChange={() => toggleTopic(topic.id)}
            />
            {topic.name}
          </label>
        ))}
      </fieldset>

      <button type="submit">Add Problem</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default AddProblem;