# Test Strip Scanner App

This project is a full-stack mobile and backend application for scanning and uploading test strip images, generating thumbnails, and managing scanned history. It consists of two main parts:

* **Mobile app (React Native)**
* **Backend server (Express.js)**

---

## 📱 Mobile App

### Tech Stack

* React Native
* TypeScript
* VisionCamera
* Testing Library + Jest (testing)

### Features

* Take a photo of a test strip using the device camera
* Upload image to backend API
* View history of uploaded test strips


## 🛠️ Mobile Setup Instructions

### 📱 Android Setup

1. **Install dependencies**
  
```bash
yarn install
```
   
2. **Start Metro bundler**

```bash
npx react-native start
```
3. **Run the Android app**

```bash
npx react-native run-android
```

<br />

### 📱 iOS Setup
1. **Install CocoaPods (if not already installed)**

```bash
sudo gem install cocoapods
```

2. **Install iOS dependencies**

```bash
cd ios
pod install
cd ..
```

3. **Start Metro bundler**

```bash
npx react-native start
```

4. **Run the iOS app**

```bash
npx react-native run-ios
```

<br />

**To run tests:**

```bash
yarn test
```

---

## 🌐 Backend API

### Tech Stack

* Node.js
* Express.js
* Multer (file upload)
* Sharp (image thumbnailing)
* TypeScript
* Jest + Supertest (testing)

### API Endpoints

#### `POST /api/test-strips/upload`
* Accepts an image file in form-data under `image`
* Saves image and creates a thumbnail
* Returns JSON metadata

#### `GET /api/test-strips`
* Returns list of uploaded test strips

#### `GET /api/test-strips/:id`
* Returns details of a uploaded test strip

### Running the Backend

To start the backend server and database using Docker Compose:

```bash
docker-compose up --build
```

This will:

Build and start the backend server

Start a PostgreSQL instance

Expose the API at http://localhost:3000

<br />

**To run tests:**

```bash
yarn test
```

---

## 📁 Folder Structure

```
project-root/
│
├── mobile/              # React Native mobile app
│   ├── App.tsx
│   ├── components/
│   ├── __tests__/
│   └── ...
│
├── backend/             # Express.js backend
│   ├── index.ts         # Main server entry
│   ├── database.ts      # Data access layer
│   ├── routes/          # Express routes
│   └── tests/           # Integration tests using Supertest
│
└── README.md
```

---

## 🧪 Testing

* **Mobile:** Uses Testing Library and Jest.
* **Backend:** Uses Jest and Supertest. Includes integration tests for upload and list APIs.

---

## ✅ Integration Test Coverage

The test in `backend/src/routes/__tests__/test_strips.test.ts` simulates the upload flow from a client, making it an integration test. It covers the full flow:

* sending an image to the backend
* mocking the database
* verifying response and saved metadata

---

## 🛠️ Notes

* Ensure required native modules are installed and properly linked when running the mobile app.
* Image uploads are stored locally in `uploads/`.
* No external DB required.

