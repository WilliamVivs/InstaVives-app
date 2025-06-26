# 📸 InstaVives – Mobile Social Media App (React Native + Expo)

Welcome to **InstaVives**, a modern mobile social media platform where users can **share moments in real time**.

Built using a robust mobile-first tech stack, InstaVives is a fully functional and dynamic social app that emphasizes **clean UI/UX**, **smooth user interactions**, and **real-time engagement**.

---

## 🚀 Features

✅ Post creation with image upload  
✅ Stories 
✅ Real-time post & story feed  
✅ Bookmarks for saving content  
✅ Like, comment, and follow system  
✅ Edit profile with Clerk auth integration  
✅ Google OAuth login  
✅ Notification center (with deletion support)  
✅ Story viewer with seen-tracking  
✅ Fully dynamic user feed and interactions  
✅ Responsive and intuitive mobile UI  
✅ Clean and eye-pleasing color palette  

> 💡 All content is dynamically fetched, displayed, and updated via Convex backend. No content is hardcoded.

---

## ⚙️ Tech Stack

### 📱 Frontend

- ⚛️ [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- 🧠 [TypeScript](https://www.typescriptlang.org/) – safer, typed development
- 📦 [FlatList](https://reactnative.dev/docs/flatlist) – high-performance scrolling lists
- 🖼️ [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) – optimized image rendering
- 🔐 [Clerk](https://clerk.dev/) – user authentication and session handling
- ☁️ [Svix](https://www.svix.com/) – webhook support for real-time Clerk events

### ☁️ Backend

- ⚡ [Convex](https://www.convex.dev/) – real-time backend with live queries
- 🧠 Convex database schema with relationships, indexes, and access control
- 📲 Live updates with no manual polling needed

---

## 🖼️ Screenshots
<p align="center">
  <strong>🔐 Login Page</strong><br/>
  <img src="public/images/login_page.jpeg" alt="Login Page" width="300"/>
</p>

<p align="center">
  <strong>🏠 Home Page with Stories</strong><br/>
  <img src="public/images/home_page.jpeg" alt="Home Page" width="300"/>
</p>

<p align="center">
  <strong>🖼️ Create Post</strong><br/>
  <img src="public/images/create_page.jpeg" alt="Create Page" width="300"/><br/>
  <em>(Empty state)</em><br/>
  <img src="public/images/create_page_empty.jpeg" alt="Create Page Empty" width="300"/>
</p>

<p align="center">
  <strong>🌟 Create Story</strong><br/>
  <img src="public/images/create_story.jpeg" alt="Create Story" width="300"/>
</p>

<p align="center">
  <strong>📺 Story Viewer</strong><br/>
  <img src="public/images/story_slider.jpeg" alt="Story Slider" width="300"/><br/>
  <em>Story check before creation:</em><br/>
  <img src="public/images/stories_checker_create.jpeg" alt="Story Checker Create" width="300"/><br/>
  <em>After story is created:</em><br/>
  <img src="public/images/stories_checker_created.jpeg" alt="Story Checker Created" width="300"/>
</p>

<p align="center">
  <strong>💬 Comments Section</strong><br/>
  <img src="public/images/comments_section.jpeg" alt="Comments Section" width="300"/><br/>
  <em>Comment deletion UI:</em><br/>
  <img src="public/images/delete_comments.jpeg" alt="Delete Comments" width="300"/>
</p>

<p align="center">
  <strong>📌 Bookmarks</strong><br/>
  <img src="public/images/bookmarks_page.jpeg" alt="Bookmarks Page" width="300"/>
</p>

<p align="center">
  <strong>🔔 Notifications</strong><br/>
  <img src="public/images/notificacion_page.jpeg" alt="Notification Page" width="300"/><br/>
  <em>Delete notification action:</em><br/>
  <img src="public/images/delete_notifications.jpeg" alt="Delete Notifications" width="300"/>
</p>

<p align="center">
  <strong>👤 Profile Page</strong><br/>
  <img src="public/images/profile_page.jpeg" alt="Profile Page" width="300"/>
</p>

<p align="center">
  <strong>👥 Following Modal</strong><br/>
  <img src="public/images/following_modal.jpeg" alt="Following Modal" width="300"/>
</p>




---

## 📂 Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/InstaVives.git
cd InstaVives
