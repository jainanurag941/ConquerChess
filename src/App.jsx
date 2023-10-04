import React from "react";
import { css } from "@emotion/react";
import { PacmanLoader } from "react-spinners";
import "./GameApp.css";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import UserForm from "./components/UserForm";
import GameApp from "./GameApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../src/firebaseconfig/firebase";
import HighScoreScreen from "./screens/HighScoreScreen";
import UserSignUpForm from "./components/UserSignUpForm";

// This component contains routing information so that user can be redirected to correct pages
const App = () => {
  // useAuthState is used to see if a user is registered in firebase or not. It returns user, loading and error
  const [user, loading, error] = useAuthState(auth);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  // If loading is true a spinner is shown in the UI
  if (loading) {
    return (
      <PacmanLoader color="#36d7b7" loading={true} css={override} size={50} />
    );
  }

  // If there is an error, user is shown this message
  if (error) {
    return "There was an error";
  }

  return (
    <Routes>
      <Route exact path="/home" element={<HomeScreen />} />
      <Route exact path="/" element={<UserForm />} />
      <Route exact path="/register" element={<UserSignUpForm />} />
      <Route exact path="/high-score" element={<HighScoreScreen />} />
      <Route path="/game/:id" element={<GameApp />} />
    </Routes>
  );
};

export default App;
