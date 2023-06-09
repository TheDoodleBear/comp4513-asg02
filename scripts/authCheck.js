// uses passport authentication infrastructure to check if authentication is
// needed at some point in middleware pipeline.
function checkAuthentication(req, resp, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("info", "Please log in to view that resource");
    resp.render("login.ejs", {message: req.flash("info")});
  }
}

module.exports = {checkAuthentication};
