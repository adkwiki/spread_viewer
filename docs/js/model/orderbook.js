class Exchange {
    constructor(exchangeId, name, orderUrlGenerateCallback) {
        this.exchangeId = exchangeId;
        this.name = name;
    } 
}

let EXCHANGE_ID = {
    AidosMarket : 1,
    Coineal : 2,
    CoinTiger : 3,
    EXRATES : 4,
    HitBTC : 5,
    IDAX : 6,
    P2PB2B : 7,
    STEX : 8,
    CoinBene : 9,
    fatbtc : 10
};

let CURRENCY_NAME = {
    ADK : "ADK",
    BTC : "BTC",
    // ETH : "ETH",
    // USD : "USD",
};

let EXCHANGES = [
    new Exchange(EXCHANGE_ID.AidosMarket, "AidosMarket"),
    new Exchange(EXCHANGE_ID.Coineal, "Coineal"),
    new Exchange(EXCHANGE_ID.CoinTiger, "CoinTiger"),
    new Exchange(EXCHANGE_ID.EXRATES, "EXRATES"),
    new Exchange(EXCHANGE_ID.HitBTC, "HitBTC"),
    new Exchange(EXCHANGE_ID.IDAX, "IDAX"),
    new Exchange(EXCHANGE_ID.P2PB2B, "P2PB2B"),
    new Exchange(EXCHANGE_ID.STEX, "STEX"),
    new Exchange(EXCHANGE_ID.CoinBene, "CoinBene"),
    new Exchange(EXCHANGE_ID.fatbtc, "fatbtc"),    
];

function getExchangeName(exchangeId) {
    for (exchange of EXCHANGES) {
        if (exchange.exchangeId === exchangeId) {
            return exchange.name;
        }
    }
}

class Order {
    constructor(exchangeId, price, amount) {
        this.exchangeId = exchangeId;
        this.price = price;
        this.amount = amount;
    }
}

class OrderBook {
    constructor(buyOrders, sellOrders) {
        this.buyOrders = buyOrders;
        this.sellOrders = sellOrders;
    }
}

function SORTER_SELL_ORDERS(a, b) {
    if (a.price > b.price) {
      return 1;
    } else if (b.price > a.price) {
      return -1;
    }
}

function SORTER_BUY_ORDERS(a, b) {
    return SORTER_SELL_ORDERS(a, b) * -1;
}

let OB_URL_TYPE = {
    ALL : "ALL",
    BUY : "BUY",
    SELL : "SELL",
};

class OrderBookUrl {
    constructor(urlType, url) {
        this.urlType = urlType;
        this.url = url;
    }
}

class ExchangeCurrencyPair {
    constructor(exchangeId, left, right, obUrl) {
        this.exchangeId = exchangeId;
        this.left = left;
        this.right = right;
        this.obUrl = obUrl;
    }
}

let EXCHANGE_CURRENCY_PAIRS = [
    new ExchangeCurrencyPair(EXCHANGE_ID.AidosMarket, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://aidosmarket.com/api/order-book")]),

    // EXRATES has problem in CORS
    new ExchangeCurrencyPair(EXCHANGE_ID.EXRATES, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://api.exrates.me/openapi/v1/public/orderbook/adk_btc")]),
    
    // HitBTC has problem in CORS
    new ExchangeCurrencyPair(EXCHANGE_ID.HitBTC, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://api.hitbtc.com/api/2/public/orderbook/ADKBTC")]),
    
    new ExchangeCurrencyPair(EXCHANGE_ID.IDAX, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://openapi.idax.pro/api/v2/depth?pair=ADK_BTC")]),
    new ExchangeCurrencyPair(EXCHANGE_ID.STEX, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://api3.stex.com/public/orderbook/743")]),
    
    // CoinTiger has problem in CORS
    new ExchangeCurrencyPair(EXCHANGE_ID.CoinTiger, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://api.cointiger.com/exchange/trading/api/market/depth?api_key=100310001&symbol=adkbtc&type=step0")]),
    
    // Coineal has problem in CORS
    new ExchangeCurrencyPair(EXCHANGE_ID.Coineal, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://exchange-open-api.coineal.com/open/api/market_dept?symbol=adkbtc&type=step0")]),
    
    // CoinBene has problem in CORS
    new ExchangeCurrencyPair(EXCHANGE_ID.CoinBene, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "http://openapi-exchange.coinbene.com/api/exchange/v2/market/orderBook?symbol=ADK%2FBTC&depth=100")]),
    
    /* TODO await tow fetch
    new ExchangeCurrencyPair(EXCHANGE_ID.P2PB2B, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [
            new OrderBookUrl(OB_URL_TYPE.BUY, "https://api.p2pb2b.io/api/v1/public/book?market=ADK_BTC&side=buy&offset=0&limit=100"),
            new OrderBookUrl(OB_URL_TYPE.SELL, "https://api.p2pb2b.io/api/v1/public/book?market=ADK_BTC&side=sell&offset=0&limit=100"),
        ]),
    */
    /* fatbtc API locate under cloudflare DDOS protection
    new ExchangeCurrencyPair(EXCHANGE_ID.fatbtc, CURRENCY_NAME.ADK, CURRENCY_NAME.BTC,
        [new OrderBookUrl(OB_URL_TYPE.ALL, "https://www.fatbtc.com/m/depth/ADKBTC")]),
    */    
];