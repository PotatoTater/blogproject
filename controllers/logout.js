module.exports = (req, res) => {
  if (req.session.userId) {
    req.session.destroy(() => {
        res.redirect('/')
    })
  }
  else{
      return  res.redirect('/auth/login')
  }
}
