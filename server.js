const path = require('path');
const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
const cors = require('cors');
dotenv.config({path: 'config.env'});

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorMiddleWare = require('./middleware/errorMiddleWare');

// -------------------- Routes ---------------------
const AuthRoutes = require('./routes/AuthRoutes');
const DiseaseRoutes = require('./routes/DiseaseRoutes');
const BookServices = require('./routes/BookServices');
const UserRoutes = require('./routes/UserRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');


// express app
const app = express();

// Connect To DataBase
dbConnection();

// Enable All Domain To Access The API
app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/Auths", AuthRoutes);
app.use("/api/v1/diseases", DiseaseRoutes);
app.use("/api/v1/books", BookServices);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/reservations", ReservationRoutes);




app.all('*', (req, res,next)=>{
    next(new ApiError(`Can't Find This Route ${req.originalUrl}`, 400));
});


// Global Error Handling MiddleWare
app.use(globalErrorMiddleWare);



const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`App Running On Port ${PORT}`);
})