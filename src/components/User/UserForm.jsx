import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseconfig/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

// This component displays a login form to user when they first visit the website
const UserForm = () => {
  // getting user information from firebase
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // useEffect is used to check if a user is already logged in, we will redirect them to home page
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  // below function gets triggered when user clicks on login button
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // provided user information is checked in firebase and if it matches, user is logged in else invalid credentials are shown
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      localStorage.setItem("username", userCredential.user.displayName);
      navigate("/home");
    } catch (error) {
      setInvalidCredentials(true);
    }
  }

  const productImg = require("../../assets/chess-board-img.jpg");

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-gray-200 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-2xl text-[#432201]">Login</h2>
            <p className="has-text-weight-bold text-lg mt-4 text-[#432201]">
              Welcome To ConquerChess
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                id="email"
                className="p-2 mt-8 rounded-xl border"
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
                Login
              </button>
              {invalidCredentials && (
                <p className="font-semibold text-base text-red-600">
                  Invalid Credentials !!
                </p>
              )}
            </form>

            <div className="mt-4 text-xs flex justify-evenly items-center">
              <p>Don't Have An Account</p>
              <Link
                to="/register"
                className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
              >
                Register
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

export default UserForm;
