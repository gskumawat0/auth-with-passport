var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/users"),
    mongoose              = require("mongoose");
    mongoose.Promise      = global.Promise;

 mongoose.connect("mongodb://localhost/sites",{useMongoClient: true});
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");

        app.use(require("express-session")({
           secret :"fear makes the things most vulnearable",
           resave :false,
           saveUninitialized : false,
          }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //middleware
       function isLoggedIn(req,res,next){
       if (req.isAuthenticated()) {
           return next();
       }
       res.redirect("/login");
   }

// routes
    app.get("/",function(req,res){
       res.render("home");
    });

    app.get("/secret",isLoggedIn,function(req,res){
       res.render("secret");
    });

    //authentication route
    app.get("/signup",function(req,res){
       res.render("signup");
    });

    app.post("/signup",function(req,res){
       User.register(new User({username :req.body.username}),req.body.password,function(error,user){
           if (error) {
               console.log(error);
               return res.render("signup");
           }
           else{
               passport.authenticate("local")(req,res,function(){
                  res.redirect("/secret");
               });
           }
       }) ;
    });

//login route
app.get("/login",function(req,res){
   res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect :"/login",
}),function(req,res){});

//logout
app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

    app.listen(process.env.PORT,process.env.IP,function(){
       console.log("server started");
    });