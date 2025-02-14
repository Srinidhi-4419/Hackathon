const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    media: {
        path: { type: String }, // Store the path to the uploaded file
        contentType: { type: String }, // Store content type (image/png, video/mp4, etc.)
    },
    mediaType: { 
        type: String, 
        enum: ["text", "image", "video"], 
        required: true,
    }, // Type of media
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    flags: { type: Number, default: 0 }, // Count of reports (flags)

    // Track user votes and flags
    votedUsers: { type: Map, of: String, default: {} }, 
    // Example: { "userId1": "upvote", "userId2": "downvote" }
    
    flaggedUsers: { type: Map, of: Boolean, default: {} }, 
    // Example: { "userId1": true, "userId2": true } (Users who flagged the news)

}, { timestamps: true });

const News = mongoose.model("News", newsSchema);
module.exports = News;
