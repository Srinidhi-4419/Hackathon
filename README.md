# *Crowdsourced Local News Platform*  

## *Overview*  
This is a *news platform API* that enables users to:  
- *Post* news in multiple formats (text, images, videos, etc.).  
- *Sign up and log in* securely.  
- *Upvote or downvote* news articles to reflect opinions.  
- *Fetch news articles* by their unique ID.  

## *Features*  
✔ *User Authentication* – Secure sign-up and login system.  
✔ *News Management* – Users can create, read, update, and delete news articles.  
✔ *Voting System* – Allows users to upvote or downvote articles.  

## *Installation*  
### *Prerequisites*  
Ensure you have the following installed:  
- *Node.js* (v16 or later)  
- *MongoDB* (running locally or on a cloud service)  

### *Steps to Run*  
1. *Clone the repository:*  
   sh
   git clone https://github.com/your-repo/news-platform-api.git
     
2. *Navigate to the project directory:*  
   sh
   cd news-platform-api  
     
3. *Install dependencies:*  
   sh
   npm install  
     
4. *Set up environment variables:*  
   - Create a .env file in the root directory and add:  
     env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key

NOTE: You have a uploads folder in your backend directory.
5. *Start the server:*  
   sh
   npm start  
     
   
## *API Endpoints*  
### *Authentication*  
- POST /api/auth/signup – Register a new user  
- POST /api/auth/login – Log in to the platform  

### *News Management*  
- POST /api/news – Create a news article  
- GET /api/news/:id – Fetch a news article by ID  
- GET /api/news – Fetch all news articles  
- PUT /api/news/:id – Update a news article  
- DELETE /api/news/:id – Delete a news article  

### *Voting System*  
- POST /api/news/:id/upvote – Upvote a news article  
- POST /api/news/:id/downvote – Downvote a news article  

## *Debugging Tips*  
- If you get a *404 Not Found error* for a specific news ID, verify that the ID exists in the database.  
- *Check console logs* for any API request errors.  
- Ensure *MongoDB is running* and the connection string in .env is correct.  

## *Contributing*  
Contributions are welcome! Feel free to *fork* this repository, create a new branch, and submit a *pull request* with your improvements.  

## *Author*  
👨‍💻 *Srinidhi Kulkarni, Neil Landge, Tanmay Patil*  

## *License*  
📝 This project is licensed under the *MIT License*.
