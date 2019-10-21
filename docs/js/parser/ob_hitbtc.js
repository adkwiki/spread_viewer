
var obApiCallerHitbtc = function (exchangeCurrencyPair) {
    console.log("obApiCallerHitbtc");
  
    var obUrl = exchangeCurrencyPair.obUrl[0].url;
    console.log(obUrl);
  
    return fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(obUrl)}`)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var orderBooks = obMapperHitBtc(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  function obMapperHitBtc(json, currencyLeft, currencyRigh) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderHitBtc(json, "bid", currencyLeft, currencyRigh);
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderHitBtc(json, "ask", currencyLeft, currencyRigh);
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderHitBtc(json, bidOrAsk, currencyLeft, currencyRigh) {
  
    var orderArray = [];
    for (let order of json[bidOrAsk]) {
        var price = parseFloat(order.price);
        var amount = parseFloat(order.size);
        orderArray.push(new Order(EXCHANGE_ID.HitBTC, price, amount, currencyLeft, currencyRigh));
    }
  
    return orderArray;
  }