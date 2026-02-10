
# 🎮 PlayLog

PlayLog is a **full-stack game tracking and review platform** that allows users to discover games, manage personal game lists, and write reviews — all with secure authentication and a clean, modern UI.

This project was built to practice **real-world full-stack development**, focusing on clean architecture, authentication flows, database modeling, and scalable design patterns.

---

## ✨ Features

- 🔐 **User Authentication**
  - Secure login and session handling using NextAuth
  - Protected routes and user-specific data

- 🎮 **Game Discovery**
  - Browse and explore games
  - View detailed game information

- ❤️ **Favorites & Activity Tracking**
  - Add/remove games from favorites
  - Maintain personal game activity lists

- ✍️ **Reviews System**
  - Write and manage reviews
  - Reviews tied securely to authenticated users

- 🌙 **Modern UI**
  - Dark-themed, clean interface
  - Focused on usability and readability

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**

### Backend
- **Next.js Server Actions**
- **API Routes**

### Database & ORM
- **PostgreSQL**
- **Prisma ORM**

### Authentication
- **NextAuth.js**

### Other Tools
- **TypeScript**
- **ESLint**
- **Git & GitHub**

---

## 🧠 Project Architecture

```

PlayLog/
├── app/                # Next.js App Router
│   ├── api/            # API routes & auth
│   ├── (auth)/         # Authentication pages
│   ├── games/          # Game-related pages
│   └── profile/        # User profile & activity
│
├── components/         # Reusable UI components
├── lib/                # Prisma, auth, and helpers
├── prisma/             # Prisma schema & migrations
├── public/             # Static assets
└── README.md

````

---

## 🗄 Database Design

- **User**
  - Authentication details
  - Relationships to reviews and favorites

- **Game**
  - Game metadata
  - Linked to reviews and user activity

- **Review**
  - Content, rating
  - Linked to both User and Game

- **Favorites / Activity**
  - User-specific game relationships

Prisma is used to manage schema definitions, migrations, and database queries.

---

## 🔐 Authentication Flow

- Implemented using **NextAuth.js**
- Session-based authentication
- Protected routes ensure users can only access their own data
- Seamless integration with the App Router

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Anmol-0808/PlayLog.git
cd PlayLog
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🎯 Learning Outcomes

* Built a **production-style full-stack application**
* Gained hands-on experience with:

  * Authentication & authorization
  * Relational database modeling
  * Server Actions & API design
  * Clean UI architecture
* Learned to balance features without overengineering



---

## 📌 Author

**Anmol Srivastava**
GitHub: [https://github.com/Anmol-0808](https://github.com/Anmol-0808)




```
