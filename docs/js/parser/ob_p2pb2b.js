var obApiCallerP2pb2b = async function (exchangeCurrencyPair) {

  var obUrlArray = exchangeCurrencyPair.obUrl;

  var buyOrders;
  var sellOrders;
  for (let obUrl of obUrlArray) {
    var orderBooks = await fetchWithTimeout(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(obUrl.url)}`,
      {},
      API_CALL_TIMEOUT_MS
    )
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var orderBooks = obMapperP2pb2b(json, exchangeCurrencyPair);
      return orderBooks;
    })
    .catch(error => {
      return new OrderBook(exchangeCurrencyPair, false);
    });

    if (obUrl.urlType === OB_URL_TYPE.BUY) {
      buyOrders = orderBooks;
    } else {
      sellOrders = orderBooks;
    }
  }
  
  return new OrderBook(exchangeCurrencyPair, true, buyOrders, sellOrders);
}
  
function obMapperP2pb2b(json, exchangeCurrencyPair) {

  var orders = parseOrderP2pb2b(json, "orders", exchangeCurrencyPair);

  return orders;
}
  
function parseOrderP2pb2b(json, targetItemName, exchangeCurrencyPair) {
  var orderBook = json["result"];

  var orderArray = [];
  for (let order of orderBook[targetItemName]) {
      var price = parseFloat(order.price);
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(exchangeCurrencyPair.exchangeId, price, amount, exchangeCurrencyPair.right));
  }

  return orderArray;
}