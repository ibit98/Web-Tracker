var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/mydb" , {useNewUrlParser: true , useUnifiedTopology: true ,  useCreateIndex: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{collection: 'log'});

var User = mongoose.model('User', UserSchema);
module.exports = User;

// user profile edit
app.get("/user",function (req, res) {
    var userName = req.cookies.user;//console.log("hello "+ userName);
    if(userName){
        User.findOne({username: userName}).exec( function (err, result) {
            if(err) throw err;
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('user.ejs', result);
        });
    }
    else{
        res.status(403).send("You have just logged out !");
    }
});

app.get("/logout", function (req, res) {
    res.clearCookie('user');
    res.redirect("/");
});

//user dash board
app.get("/dashboard",function (req, res) {
    var userName = req.cookies.user;//console.log("hello "+ userName);
    if(userName){
        User.findOne({username: userName}).exec( function (err, result) {
            if(err) throw err;
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('dashboard.ejs', result);
        });
    }
    else{
        res.status(403).send("You have just logged out !");
    }
});

// Validating Credentials
app.post('/validate',function (req, res) {
    //console.log(req.body);
    var userData = {
        "username": req.body.username,
        "password": req.body.password,
    };

    User.findOne({username: userData.username}).exec(function (err, result) {
        if(err) throw err;
        else if(!result){
            res.send("User not found");
        }
        bcrypt.compare(userData.password, result.password, function (err, rest) {
            if(rest == true){
                res.cookie('user', result.username, { expires: new Date(Date.now() + 900000) })
                res.redirect("/");
            }
            else{
                res.send("Invalid Credential !");
            }
        });
    });
});



//Adding new User
app.post('/create',function (req, res) {
    //console.log(req.body);
    var userData = new User({
        "username": req.body.username,
        "name": req.body.name,
        "password": req.body.password,
    });
    var salt = 10;

    bcrypt.hash(userData.password, salt, function (err, hash) {
        if (err) throw err;

        //Set Hashed Password
        userData.password = hash;//console.log(hash);
        userData.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(409).send("Username already exist!");
                }
                return res.status(400).send({ "message": "Server Error!", "err": err });
            }

            return res.status(200).send("<script> alert('New User Successfully Added ! Redirect to Log In Page');" +
                "window.location.href = 'signIn'</script>");

        });
    });
});

//index
app.get('/', function (req, res) {
    //console.log('Cookies: ', req.cookies);
    if(req.cookies.user ){
        res.redirect("/dashboard");
    }
    else{
        res.redirect("/signIn");
    }
});

app.get('/signUp', function (req, res) {
    res.render("signUp.ejs");
});

app.get('/signIn', function (req, res) {
    res.render("signIn.ejs");
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));