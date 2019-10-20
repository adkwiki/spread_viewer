var obApiCallerIdax = function (exchangeCurrencyPair) {
    console.log("obApiCallerIdax");
  
    var obUrl = exchangeCurrencyPair.obUrl[0].url;
    console.log(obUrl);
  
    return fetch(obUrl, { mode:"cors" })
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(json => {
        var orderBooks = obMapperIdax(json);
        console.log(orderBooks);
        return orderBooks;
      })
      .catch(error => console.log(error));
  }
  
  
  function obMapperIdax(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderIdax(json, "bids");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderIdax(json, "asks");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderIdax(json, bidOrAsk) {
  
    var orderArray = [];
    for (let order of json[bidOrAsk]) {
        var price = parseFloat(order[0]);
        var amount = parseFloat(order[1]);
        orderArray.push(new Order(EXCHANGE_ID.IDAX, price, amount));
    }
  
    return orderArray;
  }