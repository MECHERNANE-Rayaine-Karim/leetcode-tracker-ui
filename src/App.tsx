import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ProblemsList from "./ProblemsList";
import AddProblem from "./AddProblem";
import ProtectedRoute from "./ProtectedRoute";
import AttemptsList from "./AttemptsList";
import AddAttempt from "./AddAttempt";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/problems" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <ProblemsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/add"
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route
            path="/problems/:problemId/attempts"
              element={
                <ProtectedRoute>
                    <AttemptsList />
                </ProtectedRoute>
            }
        />
        <Route
            path="/problems/:problemId/attempts/add"
              element={
                <ProtectedRoute>
                    <AddAttempt />
                </ProtectedRoute>
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;