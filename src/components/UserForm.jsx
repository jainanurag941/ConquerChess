import React, { useState } from "react";
import { auth } from "../firebaseconfig/firebase";
import { signInAnonymously } from "firebase/auth";

const UserForm = () => {
  const [name, setName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("username", name);
    await signInAnonymously(auth);
  }

  const productImg = require("../assets/chess-board-img.jpg");

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-gray-200 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-16">
            <h2 className="font-bold text-2xl text-[#432201]">Login</h2>
            <p className="has-text-weight-bold text-lg mt-4 text-[#432201]">
              Welcome To ConquerChess
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                id="username"
                className="p-2 mt-8 rounded-xl border"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <button
                className="bg-[#432201] rounded-xl text-white py-2 hover:scale-105 duration-300"
                type="submit"
              >
                Start
              </button>
            </form>
          </div>
          <div className="md:block hidden w-1/2">
            <img className="rounded-2xl" src={productImg} alt="product-img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm;
