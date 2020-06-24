/*setup*/
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp_v",{
	useNewUrlParser:true,
    useUnifiedTopology:true
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
		secret:"Once again Rusty wins cute dog",
	    resave:false,
	    saveUninitialized:false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

//ROUTES

//INDEX ROUTE
app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
	//get all the campgrounds from the databsa
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/Index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	});
});

//CREATE ROUTE
app.post("/campgrounds",function(req,res){
	
//get data from form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name:name,image:image,description:description};
	//create a new campground and save it to the database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
	    //redirect to the campgrounds page
	    res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE
app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});

//SHOW ROUTE -shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render show template with that campground
	        res.render("campgrounds/show",{campground:foundCampground});  
		}
	});
});

//====================
//COMMENT ROUTES
//====================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	//find campground by ID
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
});

app.post("/campgrounds/:id/comments",function(req,res){
	//lookup campgrounds usingID
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(eerr);
		    res.redirect("/campgrounds");
		}else{
			//create new comments
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					//connect new comments to campgrounds
					campground.comments.push(comment);
					campground.save();
					//redirect to campgrounds/:id page
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

//==================
//AUTH ROUTES
//==================

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds");
			});
		}
	});
});

app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next;
	}else{
		res.redirect("/login");
	}
}

app.listen(3000,function(){
	console.log("App has Started!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});
