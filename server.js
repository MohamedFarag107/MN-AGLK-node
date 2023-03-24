const path = require('path');
const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
dotenv.config({path: 'config.env'});

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorMiddleWare = require('./middleware/errorMiddleWare');

// -------------------- Routes ---------------------
const doctorAuthRoutes = require('./routes/doctorAuthRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');


// express app
const app = express();

// Connect To DataBase
dbConnection();



// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/doctorAuths", doctorAuthRoutes);
app.use("/api/v1/userAuths", userAuthRoutes);



app.all('*', (req, res,next)=>{
    next(new ApiError(`Can't Find This Route ${req.originalUrl}`, 400));
});


// Global Error Handling MiddleWare
app.use(globalErrorMiddleWare);



const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`App Running On Port ${PORT}`);
})