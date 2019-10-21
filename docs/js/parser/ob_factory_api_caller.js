function obFactoryApiCaller(exchangeId) {
    var obApiCaller;

    switch( exchangeId ) {
        case EXCHANGE_ID.AidosMarket:
            obApiCaller = obApiCallerAidosMarket;
            break;
        case EXCHANGE_ID.EXRATES:
            obApiCaller = obApiCallerExrates;
            break;
        case EXCHANGE_ID.HitBTC:
            obApiCaller = obApiCallerHitbtc;
            break;
        case EXCHANGE_ID.IDAX:
            obApiCaller = obApiCallerIdax;
            break;
        case EXCHANGE_ID.STEX:
            obApiCaller = obApiCallerStex;
            break;
        case EXCHANGE_ID.CoinTiger:
            obApiCaller = obApiCallerCointiger;
            break;
        case EXCHANGE_ID.Coineal:
            obApiCaller = obApiCallerCoineal;
            break;
        case EXCHANGE_ID.CoinBene:
            obApiCaller = obApiCallerCoinbene;
            break;
        case EXCHANGE_ID.P2PB2B:
            obApiCaller = obApiCallerP2pb2b;
            break;
        case EXCHANGE_ID.fatbtc:
            obApiCaller = obApiCallerFatbtc;
            break;
        default:
            console.error(`UNKNOWN EXCHANGE ${exchangeId}`);
            break;
    }

    return obApiCaller;
}

async function apiCallerBase(
    exchangeCurrencyPair,
    processedPriceConvertUrl,
    processedObUrl,
    priceConverterFunction,
    obMapperFunction)
  {
  
  var convertPrice = 1;
  if (exchangeCurrencyPair.right !== CURRENCY_NAME.BTC) {

    var invertConvertPrice = isFiatCurrency(exchangeCurrencyPair.right);

    // need converter
    convertPrice = await fetchWithTimeout(
      processedPriceConvertUrl,
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
      var convertPrice = priceConverterFunction(json);
      if (invertConvertPrice) {
        convertPrice = 1 / convertPrice;
      }
      return convertPrice;
    })
    .catch(error => {
      return null;
    });
  }

  if (convertPrice === null) {
    // error
    return new OrderBook(exchangeCurrencyPair, false);
  }

  return fetchWithTimeout(
    processedObUrl,
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
    var orderBooks = obMapperFunction(json, exchangeCurrencyPair, convertPrice);
    return orderBooks;
  })
  .catch(error => {
    return new OrderBook(exchangeCurrencyPair, false);
  });
}