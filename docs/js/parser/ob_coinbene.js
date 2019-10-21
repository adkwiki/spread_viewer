var obApiCallerCoinbene = async function (exchangeCurrencyPair) {

  var priceConverterFunction = function(json) {
    return null;
  };

  var obMapperFunction = function(json, exchangeCurrencyPair, convertPrice) {

    // bid : buy
    var bidOrders = parseOrderCoinbene(json, "bids", exchangeCurrencyPair, convertPrice);
  
    // ask : sell
    var askOrders = parseOrderCoinbene(json, "asks", exchangeCurrencyPair, convertPrice);
  
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

function parseOrderCoinbene(json, bidOrAsk, exchangeCurrencyPair, convertPrice) {
  var orderBook = json["data"];

  var orderArray = [];
  for (let order of orderBook[bidOrAsk]) {
      var price = parseFloat(order[0]) * convertPrice;
      var amount = parseFloat(order[1]);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}