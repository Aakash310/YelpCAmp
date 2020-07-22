var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");

router.get("/",function(req,res){
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
router.post("/",function(req,res){
	
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
router.get("/new",function(req,res){
	res.render("campgrounds/new");
});

//SHOW ROUTE -shows more info about one campground
router.get("/:id",function(req,res){
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

module.exports = router;
