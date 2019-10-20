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