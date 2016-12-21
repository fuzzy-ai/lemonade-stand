require('../sass/app.sass');
require('./main.js');

var state = {
  buyers: [],
  temperature: 0,
  sunny: 1,
  price: 1.00,

  addBuyer: function() {
    newBuyer = new buyer();
    this.buyers.push(newBuyer);
  },

  removeBuyer: function() {
    oldBuyer = this.buyers.shift();
  }
};

var buyer = function () {
  return {
    evaluate: function() {
      var data = {
        price: state.price,
        numBuyers: state.buyers.length,
        temperature: state.temperature,
        sunny: state.sunny
      }

      $.post("/data/buyer/evaluate", data, function(data) {
        console.log("show buy / no buy");
      })
    }
  }
};

$('.add-buyer-inline').click(function() {
  state.addBuyer();
});
