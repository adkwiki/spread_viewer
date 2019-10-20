var obApiCallerStex = function (exchangeCurrencyPair) {
  console.log("obApiCallerStex");

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
    var orderBooks = obMapperStex(json);
    console.log(orderBooks);
    return orderBooks;
  })
  .catch(error => console.log(error));
}


function obMapperStex(json) {
  // json -> raw json

  // bid : buy
  var bidOrders = parseOrderStex(json, "bid");
  //console.log(bidOrders);

  // ask : sell
  var askOrders = parseOrderStex(json, "ask");
  //console.log(askOrders);

  return new OrderBook(bidOrders, askOrders);
}

function parseOrderStex(json, bidOrAsk) {
  var orderBook = json["data"];

  var orderArray = [];
  for (let order of orderBook[bidOrAsk]) {
      var price = parseFloat(order.price);
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(EXCHANGE_ID.STEX, price, amount));
  }

  return orderArray;
}