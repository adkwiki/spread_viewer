var obApiCallerStex = async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return parseFloat(json.data.last);
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderStex(json, "bid", exchangeCurrencyPair, convertPrice);
  
    // ask : sell
    var askOrders = parseOrderStex(json, "ask", exchangeCurrencyPair, convertPrice);
  
    return new OrderBook(exchangeCurrencyPair, true, bidOrders, askOrders);
  };

  return apiCallerBase(
    exchangeCurrencyPair,
    exchangeCurrencyPair.priceConvertUrl,
    exchangeCurrencyPair.obUrl[0].url,
    priceConverterFunction,
    obMapperFunction
    );
}

function parseOrderStex(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {
  var orderBook = json["data"];

  var orderArray = [];
  for (let order of orderBook[bidOrAsk]) {
      var price = parseFloat(order.price) * convertPrice;
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}