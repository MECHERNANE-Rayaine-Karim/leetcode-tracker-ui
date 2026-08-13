import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "./api/client";





function AddAttempt(){
    const navigate = useNavigate();
    const { problemId } = useParams();
    const [usedLanguage, setUsedLanguage] = useState("");
    const [codeSource, setCodeSource] = useState("");
    const [timeComplexity, setTimeComplexity] = useState("O(n)");
    const [spaceComplexity, setSpaceComplexity] = useState("O(n)");
    const [status, setStatus] = useState("attempted");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const isFormValid =
      usedLanguage !== "" &&
      codeSource.trim() !== "" &&
      timeComplexity !== "" &&
      spaceComplexity !== "" &&
      status !== "";







    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
          await apiFetch(
            `/problems/${problemId}/attempts`,
            {
              method: "POST",
              body: JSON.stringify({
                  used_language: usedLanguage,
                  code_source: codeSource,
                  time_complexity: timeComplexity,
                  space_complexity: spaceComplexity,
                  status,
              })
            }
          );
          setSuccess(true);
          setTimeout(() => navigate(`/problems/${problemId}/attempts`), 1000);
        } catch (err) {
          setError((err as Error).message);
        }
    }

    if (success) return <p>Attempt added!</p>;
    return(

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="code" value={codeSource} onChange={(e) => setCodeSource(e.target.value)} required/>
          <select value={usedLanguage} onChange={(e) => setUsedLanguage(e.target.value)} required>
              <option value="">Select language</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="JavaScript">JavaScript</option>
              <option value="C">C</option>
              <option value="C#">C#</option>
              <option value="Go">Go</option>
              <option value="Ruby">Ruby</option>
              <option value="Rust">Rust</option>
              <option value="TypeScript">TypeScript</option>
              <option value="PHP">PHP</option>
              <option value="Kotlin">Kotlin</option>
              <option value="Swift">Swift</option>
              <option value="Scala">Scala</option>
              <option value="Dart">Dart</option>
              <option value="Elixir">Elixir</option>
              <option value="Erlang">Erlang</option>
              <option value="R">R</option>
              <option value="MATLAB">MATLAB</option>
              <option value="Perl">Perl</option>
              <option value="Haskell">Haskell</option>
              <option value="Cangjie">Cangjie</option>
              <option value="other">Other</option>
          </select>
          <select  value={timeComplexity} onChange={(e) => setTimeComplexity(e.target.value)} required>
              <option value="O(1)">O(1)</option>
              <option value="O(log n)">O(log n)</option>
              <option value="O(n)">O(n)</option>
              <option value="O(n log n)">O(n log n)</option>
              <option value="O(n²)">O(n²)</option>
              <option value="O(n³)">O(n³)</option>
              <option value="O(2ⁿ)">O(2ⁿ)</option>
              <option value="O(n!)">O(n!)</option>
          </select>
          <select value={spaceComplexity} onChange={(e) => setSpaceComplexity(e.target.value)} required>
              <option value="O(1)">O(1)</option>
              <option value="O(log n)">O(log n)</option>
              <option value="O(n)">O(n)</option>
              <option value="O(n log n)">O(n log n)</option>
              <option value="O(n²)">O(n²)</option>
              <option value="O(n³)">O(n³)</option>
              <option value="O(2ⁿ)">O(2ⁿ)</option>
              <option value="O(n!)">O(n!)</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="attempted">Attempted</option>
              <option value="solved">Solved</option>
          </select>
          <button type="submit" disabled={!isFormValid}>Add Attempt</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>




    );
}
export default AddAttempt;