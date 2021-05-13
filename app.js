const path = require('path');

const cors = require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./controllers/error')

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  orgin "",
  optionSuccessStatus:200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
}

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://Reece:4EXFe1okRBpP5Nhg@cluster0.pxbgq.mongodb.net/shop?retryWrites=true&w=majority';



app.use((req, res, next) => {
  User.findById('609ce11c1cb9264eb4e795a4')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorRoutes.get404);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


mongoose.connect(MONGODB_URL)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Guy',
          email: 'guy.guy@text.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });


    app.listen(port);
  })
  .catch(err => console.log(err));
