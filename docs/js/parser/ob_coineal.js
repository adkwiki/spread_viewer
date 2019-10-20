var obApiCallerCoineal = function (exchangeCurrencyPair) {
    console.log("obApiCallerCoineal");
  
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
      var orderBooks = obMapperCoineal(json);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  
  function obMapperCoineal(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderCoineal(json, "bids");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderCoineal(json, "asks");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderCoineal(json, bidOrAsk) {
    var orderBook = (json["data"])["tick"];
  
    var orderArray = [];
    for (let order of orderBook[bidOrAsk]) {
        var price = parseFloat(order[0]);
        var amount = parseFloat(order[1]);
        orderArray.push(new Order(EXCHANGE_ID.Coineal, price, amount));
    }
  
    return orderArray;
  }