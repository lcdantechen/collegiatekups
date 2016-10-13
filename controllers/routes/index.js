var express = require('express');
var router = express.Router();
var Cart = require('../../models/cart');

var Product = require('../../models/kup');
var Order = require('../../models/order');

var cartHelper = {
  add: function(cart, item, qty, id) {
     var storedItem = cart.items[id];
     console.log('storedItem', storedItem);
     console.log(item, qty, id)
     if (!storedItem) {
         storedItem = cart.items[id] = {item: item, qty: qty, price: 0};
         storedItem.price = storedItem.item.price * storedItem.qty;
         cart.totalQty += qty;
         cart.totalPrice += storedItem.price;
     } else {
        storedItem.qty += qty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        cart.totalQty += qty;
        cart.totalPrice += storedItem.item.price * qty;

     }

     cart.plusShipping = cart.totalPrice + 5;

  },
  generateArray : function(cart) {
     var arr = [];
     for (var id in cart.items) {
         arr.push(cart.items[id]);
     }
     return arr;
  }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var quantityValue = 1;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        /*cart.add(product, product.id);*/
        cartHelper.add(cart, product, quantityValue, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

/*router.get('/cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});*/

router.get('/cart', function(req, res) {
  
    console.log('session', req.session);
    //render req.session
    var CartTotals = req.session;
    //
    var cart = req.session.cart || new Cart();
    req.session.cart = cart;    
    var cartItems = cartHelper.generateArray(cart);
    cartItems.forEach(function(item) {
      console.log('item------------------------------', item);
    });
    res.render('cart', {
      cartItems: cartItems,
      //render req.session
      CartTotals: CartTotals

    });
  });

/*router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});*/

router.get('/checkout', function(req, res) {
     if (!req.session.cart) {
      return res.redirect('/cart');
    }
    //render req.session
    var CartTotals = req.session;
    //
    var cart = req.session.cart || new Cart();
    req.session.cart = cart;    
    var errMsg = req.flash('error')[0];
    var cartItems = cartHelper.generateArray(cart);
    cartItems.forEach(function(item) {
      console.log('item------------------------------', item);
    });
    res.render('checkout', {
      cartItems: cartItems,
      //render req.session
      CartTotals: CartTotals,
      errMsg: errMsg,
      noError: !errMsg
    });
  });

/*router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_RP5bVjSS5qmDKNrzNoI1jpxY"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
});*/

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_RP5bVjSS5qmDKNrzNoI1jpxY"
    );

    stripe.charges.create({
        amount: req.session.cart.plusShipping * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: req.session.cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    req.flash('error', 'Please sign in first.');
    res.redirect('/signin');
}
