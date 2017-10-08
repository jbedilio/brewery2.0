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

//requiring handlebars
const exphb = require('express-handlebars');

//set express to use handlebars as a view engine
app.engine('handlebars', exphb({defaultLayout: 'main'}));
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

//establishing the connection for mysql
conn.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('connected as id ' + conn.threadId);
});

//home page GET route
app.get('/', (req, res) => {

    conn.query('SELECT * FROM beer;', (error, data) => {

        if (error) throw error;

        //console.log(data);
        res.render('index', {
            beer: data
        });
    });
});

//POST route for new beers
app.post('/new', (req, res) => {

    console.log(req.body.beer);

    conn.query('INSERT INTO beer (beer) VALUES (?)', [req.body.beer], (error, result) => {

        if (error) {

            throw error;
        }

        res.redirect('/');
    });
});

//POST route for beers that have been chugged
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

//POST route for clearing the table off (i.e. recycling)
app.post('/new/recycling', (req, res) => {

    conn.query('DELETE FROM beer;', (error, data) => {

        if (error) {

            throw error;
        }

        res.redirect('/');
    });
});

//setting the server to listen to the dynamic port
app.listen(PORT, () => {

    console.log('listening to PORT: ' + PORT);
});