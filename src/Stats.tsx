import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { apiFetch } from "./api/client";

interface Stat {
  total_problems_solved: number;
  solved_problems_by_difficulty: Record<string, number>;
  total_attempts: number;
  attempts_by_status: Record<string, number>;
  attempts_by_language: Record<string, number>;
  current_streak: number;
  longest_streak: number;
}


function Stats(){
    const navigate = useNavigate();
    const [stat, setStat] = useState<Stat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Stat>("/stats")
        .then((data) => setStat(data))
        .catch((err) => {
            setError((err as Error).message);
            setStat(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    function problems(){
        navigate("/problems");
    }



    if (loading) return <p>Loading...</p>;
    if (!stat) return <p>{error ?? "Failed to load statistics."}</p>;
    return(
      <>
          <h2>problem solved:{stat.total_problems_solved}</h2>
          <div>
            <h2>problems by difficulty</h2>
            <ul>
                {Object.entries(stat.solved_problems_by_difficulty).map(([difficulty, count]) => (
                <li key={difficulty}>
                    <span>{difficulty}: {count}</span>
                </li>
                ))}
            </ul>
          </div>
          <h2>number of attempts:{stat.total_attempts}</h2>
          <div>
            <h2>attempts by status</h2>
            <ul>
                {Object.entries(stat.attempts_by_status).map(([status, count]) => (
                <li key={status}>
                    <span>{status}: {count}</span>
                </li>
                ))}
            </ul>
          </div>
          <div>
            <h2>attempts by language</h2>
            <ul>
                {Object.entries(stat.attempts_by_language).map(([language, count]) => (
                <li key={language}>
                    <span>{language}: {count}</span>
                </li>
                ))}
            </ul>
          </div>

          <h2>current streak:{stat.current_streak}</h2>
          <h2>longest streak:{stat.longest_streak}</h2>

      <button type="button" onClick={problems}>problems</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      </>
    );

}
export default Stats;