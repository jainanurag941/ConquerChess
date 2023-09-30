import React, { useState } from "react";
import { auth } from "../firebaseconfig/firebase";
import { signInAnonymously } from "firebase/auth";
import "./UserForm.css";

const UserForm = () => {
  const [name, setName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("username", name);
    await signInAnonymously(auth);
  }

  return (
    <form className="user-data-form" onSubmit={handleSubmit}>
      <h1>Enter your name to start</h1>
      <br />
      <div className="field">
        <p className="control">
          <input
            type="text"
            name="username"
            id="username"
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>
      </div>
      <div className="field">
        <p className="control">
          <button className="button is-success" type="submit">
            Start
          </button>
        </p>
      </div>
    </form>
  );
};

export default UserForm;
