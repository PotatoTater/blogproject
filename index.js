const path = require('path');
const express = require('express');
const expressEdge = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');

var uri = "mongodb://reggie:potato@cluster0-shard-00-00-0sswl.gcp.mongodb.net:27017,cluster0-shard-00-01-0sswl.gcp.mongodb.net:27017,cluster0-shard-00-02-0sswl.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });

const app = new express();


app.use(express.static('public'));

app.use(expressEdge);
app.set('views', __dirname + '/views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index');
});


app.get('/index.html', (req, res) => {
    res.render('index');
});


app.set('views', __dirname + '/views');
app.get('/posts/new', (req, res) => {
    res.render('create')
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});

app.get('/post.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
});

app.post('/posts/store', (req, res) => {
    Post.create(req.body, (error, post) => {
        res.redirect('/')
    })
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
