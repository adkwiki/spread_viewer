var obApiCallerHitbtc = async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return null;
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderHitbtc(json, "bid", exchangeCurrencyPair, convertPrice);

    // ask : sell
    var askOrders = parseOrderHitbtc(json, "ask", exchangeCurrencyPair, convertPrice);

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

function parseOrderHitbtc(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {

  var orderArray = [];
  for (let order of json[bidOrAsk]) {
      var price = parseFloat(order.price) * convertPrice;
      var amount = parseFloat(order.size);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}