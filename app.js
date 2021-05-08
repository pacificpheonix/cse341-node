const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000 // So we can run on heroku || (OR) localhost:3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./controllers/error')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorRoutes.get404);

app.listen(3000);
