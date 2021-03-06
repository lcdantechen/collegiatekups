module.exports = function Cart(oldCart) {
    this.items = oldCart && oldCart.items || {};
    this.totalQty = oldCart && oldCart.totalQty || 0;
    this.totalPrice = oldCart && oldCart.totalPrice || 0;
    this.plusShipping = oldCart && oldCart.totalPrice || 0;

    /*this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };*/

  /*  this.add = function(cart, item, qty, id) {
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

  };*/

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;
        this.plusShipping = this.plusShipping - this.items[id].item.price + 5;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };
    
    this.increaseByOne = function(id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;
        this.plusShipping += this.items[id].item.price + 5;
        
    };
    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        this.plusShipping = this.plusShipping - this.items[id].price + 5;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};