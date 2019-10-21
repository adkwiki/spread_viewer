var obApiCallerAidosMarket = async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return null;
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderAidosMaket(json, "bid", exchangeCurrencyPair, convertPrice);
  
    // ask : sell
    var askOrders = parseOrderAidosMaket(json, "ask", exchangeCurrencyPair, convertPrice);
  
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

function parseOrderAidosMaket(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {
  var orderBook = json["order-book"];

  var orderArray = [];
  for (let order of orderBook[bidOrAsk]) {
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, order.price, order.order_amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}