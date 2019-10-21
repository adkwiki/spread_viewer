var obApiCallerFatbtc = function (exchangeCurrencyPair) {
    console.log("obApiCallerFatbtc");
  
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
      var orderBooks = obMapperFatbtc(json, exchangeCurrencyPair.left, exchangeCurrencyPair.right);
      console.log(orderBooks);
      return orderBooks;
    })
    .catch(error => console.log(error));
  }
  
  
  function obMapperFatbtc(json, currencyLeft, currencyRigh) {
    // json -> raw json
  
    // bid : buy
    var bidOrders = parseOrderFatbtc(json, "bids", currencyLeft, currencyRigh);
    //console.log(bidOrders);
  
    // ask : sell
    var askOrders = parseOrderFatbtc(json, "asks", currencyLeft, currencyRigh);
    //console.log(askOrders);
  
    return new OrderBook(bidOrders, askOrders);
  }
  
  function parseOrderFatbtc(json, bidOrAsk, currencyLeft, currencyRigh) {
  
    var orderArray = [];
    for (let order of json[bidOrAsk]) {
        var price = parseFloat(order[0]);
        var amount = parseFloat(order[1]);
        orderArray.push(new Order(EXCHANGE_ID.fatbtc, price, amount, currencyLeft, currencyRigh));
    }
  
    return orderArray;
  }