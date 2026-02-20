# APKPAC Backend

## Features
- Express.js REST API
- MongoDB with Mongoose
- Multer + Cloudinary for image upload
- JWT admin authentication
- CRUD for Apps, Blogs, Topics
- .env config

## Scripts
- `npm run dev` — Start server with nodemon
- `npm start` — Start server

## API Endpoints
- POST   /api/admin/login
- POST   /api/apps
- GET    /api/apps
- GET    /api/apps/:id
- PUT    /api/apps/:id
- DELETE /api/apps/:id
- POST   /api/blogs
- GET    /api/blogs
- GET    /api/blogs/:id
- PUT    /api/blogs/:id
- DELETE /api/blogs/:id
- POST   /api/topics
- GET    /api/topics
- GET    /api/topics/:id
- PUT    /api/topics/:id
- DELETE /api/topics/:id

## .env Example
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@apkpac.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
