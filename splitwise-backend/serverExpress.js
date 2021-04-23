require('dotenv').config();
const express = require("express");
const app = express();
const port = 3002;
const multer = require('multer');
const cors=require('cors');
const mongodb=require("./database/database")
// const {kafka} = require('./kafka');

// (async()=>{
// const k=await kafka();
//     callAndWait=await k.callAndWait;
// })();

//var upload = multer({ storage: storage })

var upload = multer();
//app.use(upload.single()); 
const bodyParser = require("body-parser");
app.use(bodyParser.json());
//const querystring = require("querystring");
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "http://3.143.240.199:3000", credentials: true }));
app.use((req, res, next) => {
//  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "http://3.143.240.199:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

let captureRequests = (req, res, next) => {
  console.log("Logging Request");
  console.log(req.url);
  next();
};
app.use(captureRequests);
//app.get("/", (req, res) => res.send("Hello World!"));

let userRoutes = require("./routes/userRoutes.js");
app.use('/users', userRoutes);



// app.post("/signup", async (req,res)=>{

//   const response= await callAndWait('createCustomer', req.body);
//   if(response.code==='S01')
//   res.status(201).send(response);
//   else
//   res.status(500).send(response);
// })


app.post("/configDtls",upload.single("file"),(req,res)=>{
console.log(req.file.originalname);
  console.log(req.file)
  console.log(String(req.file.buffer));

   })
app.get("/error", (req, res, next) => {
  // some error in this request
  let err = true;
  if (err) {
    next("Error in the API");
  } else {
    res.json({
      result: "success"
    });
  }
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//app.get("/", (req, res) => res.send("Hello World!"));
// let loginRoutes = require("./Routes/loginSignupRoutes.js");
// console.log("after routes import");
// app.use("/users", loginRoutes);

// const db = require("./models");
// db.sequelize.sync();

// let loginSignupRoutes = require("./Routes/loginSignupRoutes.js");
// app.use("/user", loginSignupRoutes);
// let profRoutes = require("./Routes/groupRoutes.js");

// app.use("/profile", profRoutes);

//app.get("/", (req, res) => res.send("Hello World!"));