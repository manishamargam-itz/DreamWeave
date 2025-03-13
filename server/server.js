import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js'; // Import the user routes
import imageRouter from './routes/imageRoutes.js';

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 4000;

// Create an Express application
const app = express();

// Middleware for JSON request handling
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)

app.use(cors());


// Register user routes before starting the server
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Define a simple route
    app.get('/', (req, res) => {
      res.send("✅ API is working!");
    });

    // Start the server and listen on PORT
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error(`❌ Server Error: ${error.message}`);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();
