const express = require('express').Router();
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const routes = require('./controllers');
const fileUpload = require('express-fileupload');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Handlebars js with custom helpers
const hbs = exphbs.create({ helpers });

app.use(express.static(initialPath));
app.use(fileUpload());

const sess = {
    secret: 'I solemlly swear that I am up to no good',
    cookie: {
        maxAge: 3600000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store : new SequelizeStore({
        db: sequelize,
    })
}

app.use(session(sess));

// Inform express which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
    try {
        await res.sendFile(path.join(initialPath, 'homepage.handlebars'));
    } catch (error) {
        res.status(500).json(error);
    }
});

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});