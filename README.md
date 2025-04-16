# 🧩 Socket Chat

**Socket Chat** is a real-time full-stack chat application built using the **MERN** stack with **Socket.IO** for live messaging and **JWT** authentication using cookies. It features 1-on-1 chat, image messaging, user listing, and protected routes — all wrapped in a responsive UI powered by **TailwindCSS**.

---

---

## 🚀 Features

- Real-time 1-on-1 messaging using **Socket.IO**
- User authentication (login, register) with **JWT & HTTP-only cookies**
- Sidebar showing all available users (except self)
- Image message support via **Cloudinary**
- MongoDB storage for chats and user data
- Responsive UI using **TailwindCSS**
- Production build served by Express

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/unais-08/socket-chat.git
   cd socket-chat
   ```
2. **go inside directory**

   ```bash
   cd socket-chat
   ```

3. **run build**
   ```bash
   npm run build
   ```
4. **run project**
   ```bash
   npm start
   ```
5. **add env variables in root of backend folder project**

   ```bash
   PORT=8080
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=production

   ```
