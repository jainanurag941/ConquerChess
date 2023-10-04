import React, { useEffect, useState } from "react";
import { auth } from "../firebaseconfig/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

// This component displays a form to user to register on the website
const UserSignUpForm = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);
  
  // The name holds the name of the user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential && auth.currentUser) {
      try {
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        localStorage.setItem("username", name);
      } catch (error) {}
    }

    navigate("/");
  }

  const productImg = require("../assets/chess-board-img.jpg");

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-gray-200 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-2xl text-[#432201]">Register</h2>
            <p className="has-text-weight-bold text-lg mt-4 text-[#432201]">
              Welcome To ConquerChess
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="name"
                name="name"
                id="name"
                className="p-2 mt-8 rounded-xl border"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                name="email"
                id="email"
                className="p-2 rounded-xl border"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="p-2 rounded-xl border w-full"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="gray"
                  className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              </div>
              <button
                className="bg-[#432201] rounded-xl text-white py-2 hover:scale-105 duration-300"
                type="submit"
              >
                Register
              </button>
            </form>

            <div className="mt-4 text-xs flex justify-evenly items-center">
              <p>Already have an account!</p>
              <Link
                to="/"
                className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="md:block hidden w-1/2">
            <img className="rounded-2xl" src={productImg} alt="product-img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSignUpForm;
