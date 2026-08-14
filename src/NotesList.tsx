import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "./api/client";

interface Note {
  id: number;
  attempt_id: number;
  content: string;
  written_at: string;
}


function  NotesList(){
  const navigate = useNavigate();
  const { problemId,attemptId } = useParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Note[]>(`/problems/${problemId}/attempts/${attemptId}/notes`)
      .then((data) => setNotes(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [attemptId]);


  async function handleDelete(noteId: number) {
    setError(null);
    try {
      await apiFetch(`/problems/${problemId}/attempts/${attemptId}/notes/${noteId}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((a) => a.id !== noteId));
    } catch (err) {
      setError((err as Error).message);
    }
  }



  function addNote(){
      navigate(`/problems/${problemId}/attempts/${attemptId}/notes/add`);
  }


  function renderRow(note: Note) {




      return (
        <>
            {note.id} — {note.written_at}
            {note.content}
            <button type="button" onClick={() => handleDelete(note.id) }>Delete</button>
        </>
      );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>{renderRow(note)}</li>
      ))}
      <button type="button" onClick={addNote}>add note</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </ul>
  );

}

export default NotesList;