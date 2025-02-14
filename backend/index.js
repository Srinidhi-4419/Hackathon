const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const News = require("./models/db");
const cors = require('cors');
const path = require('path');
const app = express();
const router = express.Router();
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { authmiddleware } = require('./models/authmidlleware');
const { JWT_SECRET } = require('./models/config');
const { User } = require('./models/User');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Set up Multer to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Adjusted path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API to upload news with text, image, or video
router.post("/api/news", upload.single("media"), async (req, res) => {
  try {
    const { title, description, location, mediaType } = req.body;

    let media = null;
    if (req.file) {
      // Ensure no double slashes in the file path
      const filePath = 'uploads/' + req.file.filename;
      media = {
        path: filePath, // Store the relative path
        contentType: req.file.mimetype,
      };
    }

    const newNews = new News({
      title,
      description,
      location,
      mediaType,
      media,
    });

    await newNews.save();
    res.status(201).json({ message: "News uploaded successfully!", data: newNews });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const signupbody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstname: zod.string(),
  lastname: zod.string()
});

// API to update vote (upvote, downvote, or reported)
// Assuming you're using Express.js


app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find();  // Fetch all news from the database
    res.status(200).json(news);      // Send the news as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get("/news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid news ID" });
    }

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Route to get news by location
// Serve media files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

router.get("/api/news/:location", async (req, res) => {
  try {
    let { location } = req.params;
    location = location.trim();

    const newsReports = await News.find({
      location: { $regex: new RegExp(location, 'i') }
    });

    if (newsReports.length === 0) {
      return res.status(404).json({ message: "No news reports found for this location." });
    }

    res.status(200).json({
      message: "News reports fetched successfully!",
      data: newsReports.map(report => ({
        ...report.toObject(),
        mediaPath: `http://localhost:3000/${report.media.path}` // Full URL to the image or video
      }))
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});


// Signup route
router.post('/api/signup', async (req, res) => {
  const { success } = signupbody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ msg: "Incorrect inputs" });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(411).json({ msg: "Email already taken" });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });

  const token = jwt.sign({ userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    msg: "User created successfully",
    token: token
  });
});

// Signin route
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string()
});
router.post('/api/signin', async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ msg: "Invalid email or password format" });
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user || user.password !== req.body.password) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    msg: "Signin successful",
    token: token
  });
});


router.post("/api/news/vote", async (req, res) => {
  const { id, voteType } = req.body; // voteType can be "upvote" or "downvote"
  const userId = req.user?.id; // Get user ID from auth middleware

  if (!id || !voteType) {
    return res.status(400).json({ message: "Missing news ID or vote type" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }

  if (!["upvote", "downvote"].includes(voteType)) {
    return res.status(400).json({ message: "Invalid vote type" });
  }

  try {
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }

    const previousVote = newsItem.votedUsers?.[userId]; // Check if user already voted

    // Adjust counts based on the previous and new vote
    if (previousVote === voteType) {
      return res.status(400).json({ message: "You have already voted this way" });
    }

    if (previousVote === "upvote") {
      newsItem.upvotes -= 1; // Remove previous upvote
    } else if (previousVote === "downvote") {
      newsItem.downvotes -= 1; // Remove previous downvote
    }

    // Apply new vote
    if (voteType === "upvote") {
      newsItem.upvotes += 1;
    } else if (voteType === "downvote") {
      newsItem.downvotes += 1;
    }

    // Store user's new vote
    newsItem.votedUsers[userId] = voteType;
    await newsItem.save();

    res.status(200).json({
      message: "Vote updated successfully",
      overallVotes: {
        upvotes: newsItem.upvotes,
        downvotes: newsItem.downvotes,
      },
      userVote: voteType,
    });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/api/news/user-votes/:newsId", authmiddleware, async (req, res) => {
  const userId = req.user.id;
  const { newsId } = req.params;

  if (!mongoose.isValidObjectId(newsId)) {
    return res.status(400).json({ error: "Invalid news ID format" });
  }

  try {
    const newsItem = await News.findById(newsId);
    if (!newsItem) {
      return res.status(404).json({ error: "News not found" });
    }

    const userVote = newsItem.votedUsers?.[userId] || null;
    const userReported = newsItem.reportedUsers?.[userId] || false; // NEW

    res.json({
      userVote,
      userReported, // NEW: Send user report status
      overallVotes: {
        upvotes: newsItem.upvotes,
        downvotes: newsItem.downvotes,
      },
      flags: newsItem.flags, // NEW: Send report count
    });
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Error fetching votes" });
  }
});

router.post("/api/news/report", async (req, res) => {
  const { id } = req.body;
  const userId = req.user?.id; // Get user ID from auth middleware

  if (!id) {
    return res.status(400).json({ message: "Missing news ID" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }

  try {
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }

    // Check if user already reported
    if (newsItem.reportedUsers[userId]) {
      return res.status(400).json({ message: "You have already reported this news" });
    }

    // Increment report count and store user report
    newsItem.flags += 1;
    newsItem.reportedUsers[userId] = true;
    await newsItem.save();

    res.status(200).json({
      message: "News reported successfully",
      flags: newsItem.flags,
    });
  } catch (error) {
    console.error("Error reporting news:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/api/news/flag", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing news ID" });
    }

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }

    // Increase the flag count
    newsItem.flags += 1;

    if (newsItem.flags > 2) {
      await News.findByIdAndDelete(id); // Delete the news item
      return res.status(200).json({ message: "News deleted due to excessive flags" });
    }

    await newsItem.save(); // Save updated flag count

    res.status(200).json({
      message: "News flagged successfully",
      flags: newsItem.flags,
    });
  } catch (error) {
    console.error("Error flagging news:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

// Use the router
app.use(router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
