/*setup*/
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp_v3",{
	useNewUrlParser:true,
    useUnifiedTopology:true
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
seedDB();

/*Database*/


//Campground.create({
	//name: "Granite Hill",
	//image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
	//description: "This is a huge granite hill. No bathrooms. No water . Beautiful granite!"
     //},function(err,campground){
	//if(err){
	//console.log(err);
	//}else{
	//	console.log("Newly Created Campground");
	//	console.log(campground);
	//}
//});

/*Routes*/
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
			res.render("Index",{campgrounds:allCampgrounds});
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
	res.render("new");
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
	        res.render("show",{campground:foundCampground});  
		}
	});
});

app.listen(3000,function(){
	console.log("App has Started!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});
