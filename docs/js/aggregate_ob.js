const LIMIT_RANGE = 20;
const ORDERBOOK_LIMIT = 100;

function renderOb(choppedOrderbookBuy, choppedOrderbookSell) {
    //var depthArray = [];
    
    // bid
    let bidArray = choppedOrderbookBuy; //orderbook["bid"];
    var bidTotalBtc = 0;
    var bidTotalAdk = 0;
    
    let headBidPrice = bidArray[0].price;
    let bidLimitPrice = headBidPrice / LIMIT_RANGE;
    
    for (let bid of bidArray) {
        if (bid.price < bidLimitPrice) {
            break;
        }
        //bidTotalBtc = bidTotalBtc + bid.order_value;
        bidTotalAdk = bidTotalAdk + bid.amount; //bid.order_amount;
    
        let spritPrice = splitBtcPrice(bid.price);
        var priceDiv = $('<div class="col-5 px-1 text-right"></div>')
        .append($('<span class="price-left"></span>').text(spritPrice.left))
        .append($('<span class="price-buy"></span>').text(spritPrice.right))
        ;
    
        var exchangeName = getExchangeName(bid.exchangeId);

        $("#ob_bid_list").append(
            $('<div class="row order"></div>')
            .append($(`<div class="col-1 px-1"><img class="ex-icon" src="./image/exchange/${exchangeName.toLowerCase()}.svg"></div>`))
            //.append($('<div class="col-3 px-1"></div>').text(exchangeName))
            //.append($(`<div class="col-1 px-1 text-right"><img class="ex-icon" src="./image/currency/${bid.currencyRight.toLowerCase()}.svg"></div>`))
            .append($(`<div class="col-2 px-1 text-right"></div>`).text(bid.currencyRight))
            .append($('<div class="col-4 px-1 text-right"></div>').text(bid.amount.toFixed(2))) //text(bid.order_amount.toFixed(2)))
            .append(priceDiv)
        );
    
        // depth
        //var depth = {};
        //depth["value"] = bid.price;
        //depth["bidsvolume"] = bid.order_value;
        //depth["bidstotalvolume"] = bidTotalBtc;
        //depthArray.unshift(depth);
    }
    
    //let bidCount = depthArray.length;
    
    $("#ob_bid_btc").text(bidTotalBtc.toFixed(0));
    $("#ob_bid_adk").text(bidTotalAdk.toFixed(0));
    
    
    // ask
    let askArray = choppedOrderbookSell; //orderbook["ask"];
    var askTotalBtc = 0;
    var askTotalAdk = 0;
    
    let headAskPrice = askArray[0].price;
    let askLimitPrice = headAskPrice * LIMIT_RANGE;
    
    for (let ask of askArray) {
    
        if (ask.price > askLimitPrice) {
            break;
        }
    
        //askTotalBtc = askTotalBtc + ask.order_value;
        askTotalAdk = askTotalAdk + ask.amount; //ask.order_amount;
    
        let spritPrice = splitBtcPrice(ask.price);
        var priceDiv = $('<div class="col-5 px-1 text-right"></div>')
        .append($('<span class="price-left"></span>').text(spritPrice.left))
        .append($('<span class="price-sell"></span>').text(spritPrice.right))
        ;
    
        var exchangeName = getExchangeName(ask.exchangeId);

        $("#ob_ask_list").append(
            $('<div class="row order"></div>')
            .append(priceDiv)
            .append($('<div class="col-4 px-1 text-right"></div>').text(ask.amount.toFixed(2))) //.text(ask.order_amount.toFixed(2)))
            //.append($(`<div class="col-1 px-1 text-right"><img class="ex-icon" src="./image/currency/${ask.currencyRight.toLowerCase()}.svg"></div>`))
            .append($(`<div class="col-2 px-1 text-right"></div>`).text(ask.currencyRight))
            //.append($('<div class="col-3 px-1"></div>').text(exchangeName))
            .append($(`<div class="col-1 px-1"><img class="ex-icon" src="./image/exchange/${exchangeName.toLowerCase()}.svg"></div>`))
        );
    
        // depth
        //var depth = {};
        //depth["value"] = ask.price;
        //depth["asksvolume"] = ask.order_value;
        //depth["askstotalvolume"] = askTotalBtc;
        //depthArray.push(depth);
    }
    
    //let askCount = depthArray.length - bidCount;
    
    $("#ob_ask_btc").text(askTotalBtc.toFixed(0));
    $("#ob_ask_adk").text(askTotalAdk.toFixed(0));
}

function aggregateOb() {

    const promises = Object.keys(EXCHANGE_CURRENCY_PAIRS).map((key) => {
        const exchangeCurrencyPair = EXCHANGE_CURRENCY_PAIRS[key];
        console.log(exchangeCurrencyPair);

        // call api
        var obApiCaller = obFactoryApiCaller(exchangeCurrencyPair.exchangeId);
        var orderbooks = obApiCaller(exchangeCurrencyPair);
        
        return orderbooks;
    });

    // async call apis
    Promise.all(promises).then( function (orderbookArray) {
        console.log( orderbookArray ) ;	// rejectedがある場合は実行されない

        // merge orderbooks
        var mergedOrderbookBuy = [];
        var mergedOrderbookSell = [];
        for (let orderbook of orderbookArray) {
            Array.prototype.push.apply(mergedOrderbookBuy, orderbook.buyOrders);
            Array.prototype.push.apply(mergedOrderbookSell, orderbook.sellOrders);
        }

        // sort & chop
        mergedOrderbookBuy.sort(SORTER_BUY_ORDERS);
        mergedOrderbookSell.sort(SORTER_SELL_ORDERS);

        choppedOrderbookBuy = mergedOrderbookBuy.slice(0, ORDERBOOK_LIMIT);
        choppedOrderbookSell = mergedOrderbookSell.slice(0, ORDERBOOK_LIMIT);

        console.log(choppedOrderbookBuy);
        console.log(choppedOrderbookSell);

        renderOb(choppedOrderbookBuy, choppedOrderbookSell);

    })
    .catch( function (reason) {
        console.log(reason);
    });
    
}
