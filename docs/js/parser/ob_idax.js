var obApiCallerIdax= async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return parseFloat((json["ticker"][0])["last"]);
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderIdax(json, "bids", exchangeCurrencyPair, convertPrice);
  
    // ask : sell
    var askOrders = parseOrderIdax(json, "asks", exchangeCurrencyPair, convertPrice);
  
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

function parseOrderIdax(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {

  var orderArray = [];
  for (let order of json[bidOrAsk]) {
      var price = parseFloat(order[0]) * convertPrice;
      var amount = parseFloat(order[1]);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}