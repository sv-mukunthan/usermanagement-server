const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const connectDB = require('./db');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

dotenv.config()

//body parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//File Upload
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))

//connect DB
connectDB();

//cors
app.use(cors());

//morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/api/v1/auth', require('./routes/v1/auth.router'));

const PORT = process.env.PORT || 8000;

app.use(function(err,req,res,next){
  console.log('ErrorCatch', err);
  if(process.env.NODE_ENV === "production"){
    res.status(500).send({ desc: err.desc || "Something Went Wrong" });
    logger.error(JSON.stringify(log));
  }else{
    res.status(500).send({ desc: err.desc, stack: err.stack, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log("app listening on port "+ PORT);
})