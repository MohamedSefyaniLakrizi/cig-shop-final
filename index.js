const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const jwtgenerator = require('./utils/jwtGenerator');
//middleware
app.use(cors());
app.use(express.json());

//ROUTES//


//register into db//
app.use("/auth", require("./routes/jwtAuth"));


//log in//
app.use("/home", require("./routes/home"));

app.use("/product", require("./routes/product"));

app.use("/user", require("./routes/user"));

app.use("/displayMonth", require("./routes/displayMonth"));

//update the db//
app.use("/cart", require("./routes/cart"));

//delete from db//



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

