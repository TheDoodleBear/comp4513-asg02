// uses passport authentication infrastructure to check if authentication is
// needed at some point in middleware pipeline.
function checkAuthentication(req, resp, next) {
  console.log("checking authentication " + req.user);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("User logged in successfully");
    return next();
  } else {
    req.flash("info", "Please log in to view that resource");
    resp.render("login", {message: req.flash("info")});
  }
}

module.exports = {checkAuthentication};
