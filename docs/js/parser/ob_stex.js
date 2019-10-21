var obApiCallerStex = async function (exchangeCurrencyPair) {
  console.log("obApiCallerStex");

  var obUrl = exchangeCurrencyPair.obUrl[0].url;
  console.log(obUrl);

  var convertPrice = 1;
  if (exchangeCurrencyPair.right !== CURRENCY_NAME.BTC) {
    // need converter
    convertPrice = await fetch(exchangeCurrencyPair.priceConvertUrl, { mode:"cors" })
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var convertPrice = priceConverterMapperStex(json);
      console.log(convertPrice);
      return convertPrice;
    })
    .catch(error => console.log(error));
  }

  console.log(convertPrice);

  return fetch(obUrl, { mode:"cors" })
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var orderBooks = obMapperStex(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right, convertPrice);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
}

function priceConverterMapperStex(json) {
  return parseFloat(json.data.last);
}


function obMapperStex(json, currencyLeft, currencyRigh, convertPrice) {
  // json -> raw json

  // bid : buy
  var bidOrders = parseOrderStex(json, "bid", currencyLeft, currencyRigh, convertPrice);
  //console.log(bidOrders);

  // ask : sell
  var askOrders = parseOrderStex(json, "ask", currencyLeft, currencyRigh, convertPrice);
  //console.log(askOrders);

  return new OrderBook(bidOrders, askOrders);
}

function parseOrderStex(json, bidOrAsk, currencyLeft, currencyRigh, convertPrice) {
  var orderBook = json["data"];

  var orderArray = [];
  for (let order of orderBook[bidOrAsk]) {
      var price = parseFloat(order.price) * convertPrice;
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(EXCHANGE_ID.STEX, price, amount, currencyLeft, currencyRigh));
  }

  return orderArray;
}