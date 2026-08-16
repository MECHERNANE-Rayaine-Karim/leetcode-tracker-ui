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
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  function startEdit(note: Note) {
      setEditingId(note.id);
      setContent(note.content);
  }

  function cancelEdit() {
      setEditingId(null);
      setContent("");
  }

  async function handleEditSubmit(e: React.FormEvent, noteId: number) {
      e.preventDefault();
      setError(null);
      try {
        const updated = await apiFetch<Note>(`/problems/${problemId}/attempts/${attemptId}/notes/${noteId}`, {
          method: "PATCH",
          body: JSON.stringify({ content }),
        });
        setNotes((prev) =>
            prev.map((n) => (n.id === noteId ? updated : n))
        );
        setEditingId(null);
      } catch (err) {
        setError((err as Error).message);
      }
  }





  function addNote(){
      navigate(`/problems/${problemId}/attempts/${attemptId}/notes/add`);
  }


  function renderRow(note: Note) {
     if( note.id == editingId){
       return (
           <form onSubmit={(e) => handleEditSubmit(e, note.id)}>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} required />
            <button type="submit">Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
       );

     }

      return (
        <>
            {note.id} — {note.written_at}
            {note.content}
            <button type="button" onClick={() => handleDelete(note.id) }>Delete</button>
            <button type="button" onClick={() => startEdit(note)}>Edit</button>
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