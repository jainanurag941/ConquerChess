import React from "react";
import { css } from "@emotion/react";
import { PacmanLoader } from "react-spinners";
import "./GameApp.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import UserForm from "./components/UserForm";
import GameApp from "./GameApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../src/firebaseconfig/firebase";
import HighScoreScreen from "./screens/HighScoreScreen";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (loading) {
    return (
      <PacmanLoader color="#36d7b7" loading={true} css={override} size={50} />
    );
  }
  if (error) {
    return "There was an error";
  }
  if (!user) {
    return <UserForm />;
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route exact path="/high-score" element={<HighScoreScreen />} />
        <Route path="/game/:id" element={<GameApp />} />
      </Routes>
    </Router>
  );
};

export default App;
