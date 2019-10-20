var obApiCallerExrates = function (exchangeCurrencyPair) {
    console.log("obApiCallerExrates");
    
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
      var orderBooks = obMapperExrates(json);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  
  function obMapperExrates(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderExrates(json, "BUY");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderExrates(json, "SELL");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderExrates(json, bidOrAsk) {
  
    var orderArray = [];
    for (let order of json[bidOrAsk]) {
        var price = parseFloat(order.rate);
        var amount = parseFloat(order.amount);
        orderArray.push(new Order(EXCHANGE_ID.EXRATES, price, amount));
    }
  
    return orderArray;
  }