const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
let gfs;
// Connect To Database
mongoose.Promise = require('bluebird');
mongoose.connect(config.database, {  promiseLibrary: require('bluebird') })
  .then(
    () =>
      {
        console.log(`Connected to database ${config.database}`);
        // gfs = Grid(config.database, mongoose.mongo);
        // gfs.collection('uploads'); 
      }
    )
    .catch((err) => console.log(`Database error: ${err}`));
// const conn = mongoose.createConnection(config.database);

// // Init gfs


// conn.once('open', () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
  
// });

const app = express();

const users = require('./routes/users');
const categories = require('./routes/category');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/category', categories);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
