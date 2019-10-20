var obApiCallerCointiger = function (exchangeCurrencyPair) {
    console.log("obApiCallerCointiger");
  
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
      var orderBooks = obMapperCointiger(json);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  function obMapperCointiger(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderCointiger(json, "buys");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderCointiger(json, "asks");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderCointiger(json, bidOrAsk) {
    var orderBook = ((json["data"])["depth_data"])["tick"];
  
    var orderArray = [];
    for (let order of orderBook[bidOrAsk]) {
        var price = parseFloat(order[0]);
        var amount = parseFloat(order[1]);
        orderArray.push(new Order(EXCHANGE_ID.CoinTiger, price, amount));
    }
  
    return orderArray;
  }