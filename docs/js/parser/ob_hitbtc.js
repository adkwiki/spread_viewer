
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
      var orderBooks = obMapperHitBtc(json);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  function obMapperHitBtc(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderHitBtc(json, "bid");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderHitBtc(json, "ask");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderHitBtc(json, bidOrAsk) {
  
    var orderArray = [];
    for (let order of json[bidOrAsk]) {
        var price = parseFloat(order.price);
        var amount = parseFloat(order.size);
        orderArray.push(new Order(EXCHANGE_ID.HitBTC, price, amount));
    }
  
    return orderArray;
  }