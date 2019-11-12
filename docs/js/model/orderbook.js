class Exchange {
    constructor(exchangeId, name) {
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
    fatbtc : 10,
    DEXTRADE : 11,
    BITLOCUS : 12
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
    new Exchange(EXCHANGE_ID.DEXTRADE, "DEXTRADE"),     
    new Exchange(EXCHANGE_ID.BITLOCUS, "BITLOCUS"),     
];

function getExchangeName(exchangeId) {
    for (exchange of EXCHANGES) {
        if (exchange.exchangeId === exchangeId) {
            return exchange.name;
        }
    }
}

class Currency {
    constructor(currencyId, name) {
        this.currencyId = currencyId;
        this.name = name;
    } 
}

let CURRENCY_ID = {
    ADK : 1,
    BTC : 2,
    ETH : 3,
    USD : 4,
    EUR : 5,
    USDT : 6
};

let CURRENCIES = [
    new Currency(CURRENCY_ID.ADK, "ADK"),
    new Currency(CURRENCY_ID.BTC, "BTC"),
    new Currency(CURRENCY_ID.ETH, "ETH"),
    new Currency(CURRENCY_ID.USD, "USD"),
    new Currency(CURRENCY_ID.EUR, "EUR"),
    new Currency(CURRENCY_ID.USDT, "USDT"),
];

function getCurrencyName(currencyId) {
    for (const currency of CURRENCIES) {
        if (currency.currencyId === currencyId) {
            return currency.name;
        }
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

class ExchangeCurrencyPair {
    constructor(exchangeId, left, right) {
        this.exchangeId = exchangeId;
        this.left = left;
        this.right = right;
    }

    getPairName() {
        return `${this.left}/${this.right}`
    }
}

let EXCHANGE_CURRENCY_PAIRS = [
    new ExchangeCurrencyPair(EXCHANGE_ID.AidosMarket, CURRENCY_ID.ADK, CURRENCY_ID.BTC),

    new ExchangeCurrencyPair(EXCHANGE_ID.Coineal, CURRENCY_ID.ADK, CURRENCY_ID.BTC),

    new ExchangeCurrencyPair(EXCHANGE_ID.CoinTiger, CURRENCY_ID.ADK, CURRENCY_ID.BTC),

    // TODO EXRATES has hard api call limit : need proxy api cache feature
    //new ExchangeCurrencyPair(EXCHANGE_ID.EXRATES, CURRENCY_ID.ADK, CURRENCY_ID.BTC),
    //new ExchangeCurrencyPair(EXCHANGE_ID.EXRATES, CURRENCY_ID.ADK, CURRENCY_ID.ETH),
    
    new ExchangeCurrencyPair(EXCHANGE_ID.HitBTC, CURRENCY_ID.ADK, CURRENCY_ID.BTC),
        
    new ExchangeCurrencyPair(EXCHANGE_ID.IDAX, CURRENCY_ID.ADK, CURRENCY_ID.BTC),
    new ExchangeCurrencyPair(EXCHANGE_ID.IDAX, CURRENCY_ID.ADK, CURRENCY_ID.ETH),

    new ExchangeCurrencyPair(EXCHANGE_ID.P2PB2B, CURRENCY_ID.ADK, CURRENCY_ID.BTC),

    new ExchangeCurrencyPair(EXCHANGE_ID.STEX, CURRENCY_ID.ADK, CURRENCY_ID.BTC),
    new ExchangeCurrencyPair(EXCHANGE_ID.STEX, CURRENCY_ID.ADK, CURRENCY_ID.ETH),
    new ExchangeCurrencyPair(EXCHANGE_ID.STEX, CURRENCY_ID.ADK, CURRENCY_ID.USD),
    new ExchangeCurrencyPair(EXCHANGE_ID.STEX, CURRENCY_ID.ADK, CURRENCY_ID.EUR),

    new ExchangeCurrencyPair(EXCHANGE_ID.CoinBene, CURRENCY_ID.ADK, CURRENCY_ID.BTC),
    
    new ExchangeCurrencyPair(EXCHANGE_ID.fatbtc, CURRENCY_ID.ADK, CURRENCY_ID.BTC),

    new ExchangeCurrencyPair(EXCHANGE_ID.BITLOCUS, CURRENCY_ID.ADK, CURRENCY_ID.EUR),
];

