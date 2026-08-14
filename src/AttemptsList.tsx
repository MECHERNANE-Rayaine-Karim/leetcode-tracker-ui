import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "./api/client";

interface Attempt {
  id: number;
  problem_id: number;
  used_language: string;
  code_source: string;
  attempted_at: string;
  time_complexity: string;
  space_complexity: string;
  status: string;
}

function AttemptsList() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [detailedAttempt, setDetailedAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<Attempt[]>(`/problems/${problemId}/attempts`)
      .then((data) => setAttempts(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [problemId]);

  async function handleDelete(attemptId: number) {
    setError(null);
    try {
      await apiFetch(`/problems/${problemId}/attempts/${attemptId}`, { method: "DELETE" });
      setAttempts((prev) => prev.filter((a) => a.id !== attemptId));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function cancel() {
    setDetailsId(null);
    setDetailedAttempt(null);
  }

  async function handleDetails(attemptId: number) {
    setError(null);
    try {
      const response = await apiFetch<Attempt>(`/problems/${problemId}/attempts/${attemptId}`, {
        method: "GET",
      });
      setDetailedAttempt(response);
      setDetailsId(attemptId);
    } catch (err) {
      setError((err as Error).message);
    }
  }
  function addAttempt(){
      navigate(`/problems/${problemId}/attempts/add`);
  }
  function notes(attemptId: number){
      navigate(`/problems/${problemId}/attempts/${attemptId}/notes`);
  }

  function renderRow(attempt: Attempt) {
    if (detailsId === attempt.id) {
      return (
        <>
          {detailedAttempt?.code_source}
          <button type="button" onClick={cancel}>Cancel</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      );
    }

    return (
      <>
        {attempt.id} — {attempt.attempted_at}
        {attempt.used_language} — {attempt.status}
        {attempt.space_complexity} — {attempt.time_complexity}
        <button type="button" onClick={() => handleDelete(attempt.id)}>Delete</button>
        <button type="button" onClick={() => handleDetails(attempt.id)}>Details</button>
        <button type="button" onClick={() => notes(attempt.id)}>Notes</button>
      </>
    );
  }

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <ul>
        {attempts.map((attempt) => (
          <li key={attempt.id}>{renderRow(attempt)}</li>
        ))}
      </ul>
      <button type="button" onClick={addAttempt}>Add</button>
    </>
  );
}

export default AttemptsList;