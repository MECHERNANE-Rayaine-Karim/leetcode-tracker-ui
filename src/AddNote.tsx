import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "./api/client";


function AddNote(){
    const navigate = useNavigate();
    const { problemId,attemptId } = useParams();
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const isFormValid =
      content.trim() !== ""

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
          await apiFetch(
            `/problems/${problemId}/attempts/${attemptId}/notes`,
            {
              method: "POST",
              body: JSON.stringify({
                  content,
              })
            }
          );
          setSuccess(true);
          setTimeout(() => navigate(`/problems/${problemId}/attempts/${attemptId}/notes`), 1000);
        } catch (err) {
          setError((err as Error).message);
        }
    }
    if (success) return <p>Note added!</p>;

    return (
        <form onSubmit={handleSubmit}>
          <textarea
              placeholder="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
              style={{ width: "100%" }}
          />
          <button type="submit" disabled={!isFormValid}>Add Note</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );


}
export default AddNote;