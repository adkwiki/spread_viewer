var obApiCallerExrates = async function (exchangeCurrencyPair) {
  console.log("obApiCallerExrates");
  
  var obUrl = exchangeCurrencyPair.obUrl[0].url;
  console.log(obUrl);

  var convertPrice = 1;
  if (exchangeCurrencyPair.right !== CURRENCY_NAME.BTC) {
    // need converter
    convertPrice = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(exchangeCurrencyPair.priceConvertUrl)}`)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var convertPrice = priceConverterMapperExrates(json);
      console.log(convertPrice);
      return convertPrice;
    })
    .catch(error => console.log(error));
  }

  console.log(convertPrice);

  return fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(obUrl)}`)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(json => {
      var orderBooks = obMapperExrates(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right, convertPrice);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));

}

function priceConverterMapperExrates(json) {
  return json[0].last;
}

function obMapperExrates(json, currencyLeft, currencyRigh, convertPrice) {
  // json -> raw json

  // bid : buy
  var bidOrders = parseOrderExrates(json, "BUY", currencyLeft, currencyRigh, convertPrice);
  //console.log(bidOrders);

  // ask : sell
  var askOrders = parseOrderExrates(json, "SELL", currencyLeft, currencyRigh, convertPrice);
  //console.log(askOrders);

  return new OrderBook(bidOrders, askOrders);
}

function parseOrderExrates(json, bidOrAsk, currencyLeft, currencyRigh, convertPrice) {

  var orderArray = [];
  for (let order of json[bidOrAsk]) {
      var price = parseFloat(order.rate) * convertPrice;
      var amount = parseFloat(order.amount);
      orderArray.push(new Order(EXCHANGE_ID.EXRATES, price, amount, currencyLeft, currencyRigh));
  }

  return orderArray;
}