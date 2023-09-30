import React from "react";
import "./GameApp.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import UserForm from "./components/UserForm";
import GameApp from "./GameApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../src/firebaseconfig/firebase";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return "loading ...";
  }
  if (error) {
    return "There was an error";
  }
  if (!user) {
    return <UserForm />;
  }

  return "Success";
};

export default App;
