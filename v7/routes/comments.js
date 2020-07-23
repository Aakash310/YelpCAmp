var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//====================
//COMMENT ROUTES
//====================

router.get("/new",isLoggedIn,function(req,res){
	//find campground by ID
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
});

router.post("/",isLoggedIn,function(req,res){
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

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next;
	}else{
		res.redirect("/login");
	}
}

module.exports = router;
