const path = require('path')
const Post = require('../database/models/Post')

module.exports = (req, res) => {
    if(!req.files){
      res.redirect('/posts/new');
    }
    const {
        image
    } = req.files

    image.mv(path.resolve(__dirname, '..', 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect("/");
        });
    })
}
