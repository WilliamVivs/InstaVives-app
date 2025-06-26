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

#### 🏠 Home Page with Stories
![Home Page](public/images/home_page.jpeg)

#### 🖼️ Create Post
![Create Page](public/images/create_page.jpeg)  
*(Empty state)*  
![Create Page Empty](public/images/create_page_empty.jpeg)

#### 🌟 Create Story
![Create Story](public/images/create_story.jpeg)

#### 📺 Story Viewer
![Story Slider](public/images/story_slider.jpeg)  
*Story check before creation:*  
![Story Checker Create](public/images/stories_checker_create.jpeg)  
*After story is created:*  
![Story Checker Created](public/images/stories_checker_created.jpeg)

#### 💬 Comments Section
![Comments Section](public/images/comments_section.jpeg)  
*Comment deletion UI:*  
![Delete Comments](public/images/delete_comments.jpeg)

#### 📌 Bookmarks
![Bookmarks Page](public/images/bookmarks_page.jpeg)

#### 🔔 Notifications
![Notification Page](public/images/notificacion_page.jpeg)  
*Delete notification action:*  
![Delete Notifications](public/images/delete_notifications.jpeg)

#### 👤 Profile Page
![Profile Page](public/images/profile_page.jpeg)

#### 👥 Following Modal
![Following Modal](public/images/following_modal.jpeg)

#### 🔐 Login Page
![Login Page](public/images/login_page.jpeg)

---

## 📂 Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/InstaVives.git
cd InstaVives
