const path = require('path');

const cors = require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URL = process.env.MONGODB_URL || require('./private/mongoose');


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./controllers/error')

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: 'saltysaltsalt', resave: false, saveUninitialized: false, store: store })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    next(new Error(err));
  });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

const corsOptions = {
  orgin: "https://powerful-bayou-42719.herokuapp.com/",
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
}



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorRoutes.get500);

app.use(errorRoutes.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


mongoose.connect(MONGODB_URL, options)
  .then(result => {
    app.listen(port);
  })
  .catch(err => console.log(err));
