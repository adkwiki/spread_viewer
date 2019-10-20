var obApiCallerAidosMarket = function (exchangeCurrencyPair) {
    console.log("obApiCallerAidosMarket");

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
        var orderBooks = obMapperAidosMaket(json);
        console.log(orderBooks);
        return orderBooks;
      })
      .catch(error => console.log(error));
}


function obMapperAidosMaket(json) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderAidosMaket(json, "bid");
    //console.log(bidOrders);

    // ask : sell
    var askOrders = parseOrderAidosMaket(json, "ask");
    //console.log(askOrders);

    return new OrderBook(bidOrders, askOrders);
}
  
function parseOrderAidosMaket(json, bidOrAsk) {
    var orderBook = json["order-book"];

    var orderArray = [];
    for (let order of orderBook[bidOrAsk]) {
        orderArray.push(new Order(EXCHANGE_ID.AidosMarket, order.price, order.order_amount));
    }

    return orderArray;
}