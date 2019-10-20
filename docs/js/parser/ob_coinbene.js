var obApiCallerCoinbene = function (exchangeCurrencyPair) {
    console.log("obApiCallerCoinbene");
  
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
      var orderBooks = obMapperCoinbene(json);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  
  function obMapperCoinbene(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderCoinbene(json, "bids");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderCoinbene(json, "asks");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderCoinbene(json, bidOrAsk) {
    var orderBook = json["data"];
  
    var orderArray = [];
    for (let order of orderBook[bidOrAsk]) {
        var price = parseFloat(order[0]);
        var amount = parseFloat(order[1]);
        orderArray.push(new Order(EXCHANGE_ID.CoinBene, price, amount));
    }
  
    return orderArray;
  }