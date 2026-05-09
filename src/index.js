// load environment variables
import dotenv from "dotenv";

// express app
import app from "./app.js";

// configure dotenv
dotenv.config({
  path: "./.env",
});


// define server port
const PORT = process.env.PORT || 8000;


// start server
app.listen(PORT, () => {
  console.log(`⚙️ Server is running at port : ${PORT}`);
});