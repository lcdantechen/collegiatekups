var express = require('express');
var Product = require('../models/kup');


//code before 
/*module.exports = {
	renderHome: function(req, res){
		res.render('index');
	}
}*/
//++++++++++++++++++++++

module.exports = {
	renderHome: function(req, res){
		var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
	}
}


/*module.exports = {
	renderHome: function(req, res){
		Product.find(function(err, docs) {
    res.render('index', {title:'Collegiatekups', products: docs});
	 });
	}
}
*/











