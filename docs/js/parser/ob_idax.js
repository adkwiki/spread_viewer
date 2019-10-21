var obApiCallerIdax = async function (exchangeCurrencyPair) {
  console.log("obApiCallerIdax");

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
      var convertPrice = priceConverterMapperIdax(json);
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
      var orderBooks = obMapperIdax(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right, convertPrice);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
}

function priceConverterMapperIdax(json) {
  return parseFloat((json["ticker"][0])["last"]);
}

function obMapperIdax(json, currencyLeft, currencyRight, convertPrice) {
  // json -> raw json

  // bid : buy
  var bidOrders = parseOrderIdax(json, "bids", currencyLeft, currencyRight, convertPrice);
  //console.log(bidOrders);

  // ask : sell
  var askOrders = parseOrderIdax(json, "asks", currencyLeft, currencyRight, convertPrice);
  //console.log(askOrders);

  return new OrderBook(bidOrders, askOrders);
}

function parseOrderIdax(json, bidOrAsk, currencyLeft, currencyRight, convertPrice) {

  var orderArray = [];
  for (let order of json[bidOrAsk]) {
      var price = parseFloat(order[0]) * convertPrice;
      var amount = parseFloat(order[1]);
      orderArray.push(new Order(EXCHANGE_ID.IDAX, price, amount, currencyLeft, currencyRight));
  }

  return orderArray;
}