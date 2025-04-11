# Cyberpunk TODO App - React Native + Node.js/Redis

![image](https://github.com/user-attachments/assets/dd4e56f6-5465-461d-8e65-002ea0904dde)


A futuristic TODO list application with React Native frontend and Node.js/Redis backend, featuring cyberpunk styling and full CRUD operations with cloud sync.

## Features

- 🚀 **Full-stack architecture**:
  - Frontend: React Native (Expo)
  - Backend: Node.js/Express
  - Database: Redis
- 🔥 **Cyberpunk UI** with neon colors and glow effects
- ✅ **All required operations**:
  - Add, edit, delete todos
  - Save to Redis
  - Restore from cloud
  - Clear all data
- 📱 **Cross-platform** (iOS/Android)

## System Architecture

```mermaid
graph TD
    A[React Native App] -->|HTTP| B[Node.js Server]
    B -->|Redis Commands| C[(Redis Database)]
