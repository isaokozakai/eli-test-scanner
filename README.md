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
* Jest

### Features

* Take a photo of a test strip using the device camera
* Upload image to backend API
* View history of uploaded test strips

### Running the Mobile App

```bash
cd mobile
yarn install
yarn start
```

Make sure the backend is running at `http://localhost:3000` or configure the endpoint accordingly.

To run tests:

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

### Running the Backend

```bash
cd backend
yarn install
yarn dev
```

To run tests:

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

* **Mobile:** Uses `@testing-library/react-native` and Jest.
* **Backend:** Uses Jest and Supertest. Includes integration tests for upload and list APIs.

---

## ✅ Integration Test Coverage

The test in `server/tests/upload.test.ts` simulates the upload flow from a client, making it an integration test. It covers the full flow:

* sending an image to the backend
* mocking the database
* verifying response and saved metadata

---

## 📸 Sample Image for Testing

Place your sample image `test-strip-valid-1.png` inside the `server/tests/` folder to test the upload flow.

---

## 🛠️ Notes

* Ensure required native modules are installed and properly linked when running the mobile app.
* Image uploads are stored locally in `uploads/`.
* Thumbnail generation uses Sharp.
* No external DB required — in-memory mock used.

