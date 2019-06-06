const path = require('path');
const express = require('express');
const expressEdge = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");
const edge = require("edge.js");
const user = require('./database/models/User')
const Post = require('./database/models/Post');
const app = new express();

const logoutController = require("./controllers/logout");
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');

const auth = require("./middleware/auth");
const storePost = require('./middleware/storePost')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

var uri = "mongodb://reggie:potato@cluster0-shard-00-00-0sswl.gcp.mongodb.net:27017,cluster0-shard-00-01-0sswl.gcp.mongodb.net:27017,cluster0-shard-00-02-0sswl.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const mongoStore = connectMongo(expressSession);
app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(connectFlash());
app.use(fileUpload());
app.use(express.static('public'));
app.use(expressEdge);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.use('/posts/store', storePost)

app.set('views', __dirname + '/views');

app.get(['/', '/index.html'], homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", createPostController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.get("/posts/new", auth, createPostController);
app.get("/auth/logout", logoutController);

app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.post("/posts/store", storePostController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);

app.get('/about.html', (req, res) => {
    res.render('about')
 });

 app.get('/contact.html', (req, res) => {
     res.render('contact')
  });

// app.get(['/', '/index.html'], async (req, res) => {
//     const posts = await Post.find({})
//     res.render('index', {
//         posts
//     })
// });
//
// app.get('/posts/new', (req, res) => {
//     res.render('create')
// });
//
// app.get('/post/:id', async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     res.render('post', {
//         post
//     })
// });
// app.get('/about.html', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'pages/about.html'));
// });
//
// app.get('/contact.html', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
// });
// //
// // app.get('/post.html', (req, res) => {
// //     res.sendFile(path.resolve(__dirname, 'pages/post.html'));
// // });
//
// app.post("/posts/store", (req, res) => {
//     if(!req.files){
//       res.redirect('/posts/new');
//     }
//     const {
//         image
//     } = req.files
//
//     image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
//         Post.create({
//             ...req.body,
//             image: `/posts/${image.name}`
//         }, (error, post) => {
//             res.redirect('/');
//         });
//     })
// });

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
