var obApiCallerExrates = async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return json[0].last;
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderExrates(json, "BUY", exchangeCurrencyPair, convertPrice);
  
    // ask : sell
    var askOrders = parseOrderExrates(json, "SELL", exchangeCurrencyPair, convertPrice);
  
    return new OrderBook(exchangeCurrencyPair, true, bidOrders, askOrders);
  };

  return apiCallerBase(
    exchangeCurrencyPair,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(exchangeCurrencyPair.priceConvertUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(exchangeCurrencyPair.obUrl[0].url)}`,
    priceConverterFunction,
    obMapperFunction
    );
}

function parseOrderExrates(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {

  var orderArray = [];
  for (let order of json[bidOrAsk]) {
      var price = parseFloat(order.rate) * convertPrice;
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}