//requiring the npm packages
const express = require('express');

const bp = require('body-parser');

//setting an instance of express
const app = express();
//setting the dynamic port
const PORT = process.env.PORT || 3000;

//using a static route for the public directory for css content
app.use(express.static("public"));

//setting express to use bodyParser
app.use(bp.urlencoded({
    extended: true
}));

app.use(bp.json());

//requiring the javascript files with the data
// const beer = require('./app/data/beer.js');
// const mt = require('./app/data/mtBottle.js');

//requiring handlebars
const exphb = require('express-handlebars');

//set express to use handlebars as a view engine
app.engine('handlebars', exphb({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//requiring mysql
const mysql = require('mysql');

//setting the mysql connection object
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'beersDB'
});

//establish the connection for mysql
conn.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('connected as id ' + conn.threadId);
});

// conn.on('error', (err) => {

//     console.log('shiz, I errored', err.code);
// });

app.get('/', (req, res) => {

    conn.query('SELECT * FROM beer;', (error, data) => {

        if (error) throw error;

        //console.log(data);
        res.render('index', {
            beer: data
        });
    });
});

app.post('/new', (req, res) => {

    console.log(req.body.beer);

    conn.query('INSERT INTO beer (beer) VALUES (?)', [req.body.beer], (error, result) => {

        if (error) {

            throw error;
        }

        res.redirect('/');
    });
});

app.post('/new/chug', (req, res) => {

    console.log(req.body);

    var beerId = parseInt(req.body.id);

    console.log(beerId);

    conn.query('UPDATE beer SET chugged = (?) WHERE id = (?)', ["1", beerId], (error, data) => {

        if (error) {

            throw error;
        }

        res.redirect('/');
    });
});

app.post('/new/recycling', (req, res) => {

    conn.query('DELETE FROM beer;', (error, data) => {

        if (error) {

            throw error;
        }

        res.redirect('/');
    });
});
//importing my route modules & calling the functions that house them
// const htmlR = require('./app/routing/htmlRoutes.js');
// htmlR(app, __dirname);

// const apiR = require('./app/routing/apiRoutes.js');
// apiR(app, __dirname);

//setting the server to listen to the dynamic port
app.listen(PORT, () => {

    console.log('listening to PORT: ' + PORT);
});