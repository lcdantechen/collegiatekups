var Product = require('../models/kup');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/collegiatekups');


var products = [
	  new Product({
	  	  imagePath: 'http://collegiatekups.com/wp-content/uploads/2015/06/8cup-new.png',
	  	  title: 'Brew Cube',
	  	  description: '8 pods of our delicious Scarlet Select medium roast coffee, freshly packed in our custom-designed box to show off your Rutgers spirit!',
        price: 10

	}),
	  new Product({
	  	  imagePath: 'http://collegiatekups.com/wp-content/uploads/2015/06/27cup-new.png',
	  	  title: 'Party Cube',
	  	  description: '27 pods of our delicious Scarlet Select medium roast coffee, including 19 loose pods and our 8-pack “Brew Cube” to show off your Rutgers Spirit. Perfect for graduation parties, family gatherings and tailgating any time of year!',
        price: 25

	}),
	  new Product({
	  	  imagePath: 'http://collegiatekups.com/wp-content/uploads/2015/06/64mega-new.png',
	  	  title: 'Mega Cube',
	  	  description: '64 pods of our delicious Scarlet Select medium roast coffee, freshly packed in 8 individual Brew Cubes.',
        price: 50

	})
];

var done = 0;
for (var i=0; i < products.length; i++) {
	products[i].save(function(err, result) {
		done++;
		if (done === products.length) {
			  exit();
		}
	});
}

function exit() {
  mongoose.disconnect();
}

