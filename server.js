const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
const dbConnection = require("./config/database");
dotenv.config({path: 'config.env'});

// Connect To DataBase
dbConnection();

// express app
const app = express();

// Middleware
app.use(express.json());
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`);
}






const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`App Running On Port ${PORT}`);
})