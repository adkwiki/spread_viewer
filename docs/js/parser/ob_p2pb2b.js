var obApiCallerP2pb2b = function (exchangeCurrencyPair) {
    console.log("obApiCallerP2pb2b");
  
    var obUrl = exchangeCurrencyPair.obUrl;
    console.log(obUrl);
  
    var orderBooks = obMapperP2pb2b(ob_p2pb2b_buy, ob_p2pb2b_sell);
    console.log(orderBooks);
  
    return new Promise((resolve, reject) => {
      // Promiseの結果を返す
      resolve(orderBooks);
    });
  }
  
  
  function obMapperP2pb2b(json_buy, json_sell) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderP2pb2b(json_buy, "orders");
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderP2pb2b(json_sell, "orders");
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderP2pb2b(json, bidOrAsk) {
    var orderBook = json["result"];
  
    var orderArray = [];
    for (let order of orderBook[bidOrAsk]) {
        var price = parseFloat(order.price);
        var amount = parseFloat(order.amount);
        orderArray.push(new Order(EXCHANGE_ID.P2PB2B, price, amount));
    }
  
    return orderArray;
  }