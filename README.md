# ConquerChess
Multiplayer chess game that can be played online

---

Conquer Chess is a web-based chess game application that allows users to play chess locally or invite friends to play online. It offers a rich gaming experience with features such as user registration, local gameplay, online multiplayer, a leaderboard, and detailed game result summaries. Built using <strong>React.js, chess.js, RxJS, Firebase, Tailwind css and various npm libraries</strong>, Conquer Chess provides a seamless and enjoyable chess gaming experience.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Online Multiplayer](#online-multiplayer)
- [Leaderboard](#leaderboard)
- [Gameplay](#gameplay)
- [Sign In/Sign Out](#sign-in-and-sign-out)
- [Demo](#demo)
- [Deployment](#deployment)

## Getting Started

To get started with Conquer Chess, follow these steps:

1. Visit the [Conquer Chess Website](https://conquer-chess.netlify.app/) or clone the repository to your local machine.
2. Register as a new user or sign in with your existing account.
3. Choose between playing locally or online.
4. Enjoy a game of chess with friends or against the computer!

## Features

### User Registration and Authentication

- New users can register with a name, email, and password.
- Existing users can sign in with their email and password.
- User authentication is handled securely using Firebase.

### Local Gameplay

- Play chess locally.
- The board automatically flips for each player's turn.
- Reset the game at any time.

### Online Multiplayer

- Share a game link with a friend to play chess online.
- Choose your preferred color (Black, White, or Random) before starting the game.
- Enjoy a real-time chess experience with friends.

### Leaderboard

- View the leaderboard to see your ranking among all users.
- Scores are assigned based on wins, losses, and draws according to chess rules.

### Detailed Game Results

- After the game ends, you can see which piece won and how they won.
- Get insights into the game's outcome and strategies.

### Data Persistence

- **Local Game Data:** The user's local game state is stored in local storage. If a user signs out or closes the browser and then signs in, they can continue from where they left off.
- **Online Game Data:** In the case of online games, data is stored in Firebase. Users can continue from where they left off if they sign out or close the browser.

## Sign In and Sign Out

- Easily sign in or sign out of your account to access the game.
- Your progress and leaderboard ranking are tied to your account.

## Demo

For a live demo of Conquer Chess, visit the [Conquer Chess Website](https://conquer-chess.netlify.app/).

## Deployment

Conquer Chess is hosted on Netlify and can be accessed at [https://conquer-chess.netlify.app/](https://conquer-chess.netlify.app/).

---
