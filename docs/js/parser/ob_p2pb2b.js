var obApiCallerP2pb2b = async function (exchangeCurrencyPair) {
  console.log("obApiCallerP2pb2b");

  var obUrlArray = exchangeCurrencyPair.obUrl;
  console.log(obUrlArray);

  var buyOrders;
  var sellOrders;
  for (let obUrl of obUrlArray) {
    //var orderBooks = await fetch(obUrl.url, { mode:"cors" })
    var orderBooks = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(obUrl.url)}`)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var orderBooks = obMapperP2pb2b(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));

    if (obUrl.urlType === OB_URL_TYPE.BUY) {
      buyOrders = orderBooks;
    } else {
      sellOrders = orderBooks;
    }
  }
  
  return new OrderBook(buyOrders, sellOrders);
}
  
function obMapperP2pb2b(json, currencyLeft, currencyRigh) {
  // json -> raw json

  var orders = parseOrderP2pb2b(json, "orders", currencyLeft, currencyRigh);
  //console.log(bidOrders);

  return orders;
}
  
function parseOrderP2pb2b(json, targetItemName, currencyLeft, currencyRigh) {
  var orderBook = json["result"];

  var orderArray = [];
  for (let order of orderBook[targetItemName]) {
      var price = parseFloat(order.price);
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(EXCHANGE_ID.P2PB2B, price, amount, currencyLeft, currencyRigh));
  }

  return orderArray;
}