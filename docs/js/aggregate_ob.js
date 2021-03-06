const LIMIT_RANGE = 20;
const ORDERBOOK_LIMIT = 100;

function renderStats(pairStatsList) {
    // Exchange icon. name :: pair :: status :: best buy/sell (amount?) :: bridge pair(price)
    for (const pairStats of pairStatsList) {

        var exchangeName = getExchangeName(pairStats.exchangeId);
        var pairName = `${getCurrencyName(pairStats.right)}`;
        var bridgeName = "DIRECT";
        var bridgePrice = "";
        //console.log(`${exchangeName}::${pairName}::${pairStats.bridge}`);
        if (typeof pairStats.bridge !== 'undefined') {
            bridgeName = `${getCurrencyName(pairStats.bridge.left)}/${getCurrencyName(pairStats.bridge.right)}`;
            if (pairStats.bridgePrice !== null) {
                bridgePrice = `${pairStats.bridgePrice.toFixed(4)}`;
            }
        }

        var statuscolor = "#D9544F";
        var status = "x";
        let buyPriceDiv = $('<div class="col-2 px-1 text-right"></div>');
        let sellPriceDiv = $('<div class="col-2 px-1 text-right"></div>');
        let spreadPriceDiv = $('<div class="col-2 px-1 text-right"></div>');
        if (pairStats.success === true) {
            statuscolor = "#0FB387";
            status = "o";

            //console.log(pairStats.buy);
            if (pairStats.buy !== null) {
                let buySpritPrice = splitBtcPrice(pairStats.buy);
                buyPriceDiv = buyPriceDiv
                    .append($('<span class="price-left"></span>').text(buySpritPrice.left))
                    .append($('<span class="price-buy"></span>').text(buySpritPrice.right))
                    ;
            }

            //console.log(pairStats.sell);
            if (pairStats.sell !== null) {
                let sellSpritPrice = splitBtcPrice(pairStats.sell);
                sellPriceDiv = sellPriceDiv
                    .append($('<span class="price-left"></span>').text(sellSpritPrice.left))
                    .append($('<span class="price-sell"></span>').text(sellSpritPrice.right))
                    ;
            }

            if (pairStats.buy !== null && pairStats.sell !== null) {
                let spreadSpritPrice = splitBtcPrice(pairStats.sell - pairStats.buy);
                spreadPriceDiv = spreadPriceDiv
                    .append($('<span class="price-left"></span>').text(spreadSpritPrice.left))
                    .append($('<span></span>').text(spreadSpritPrice.right))
                    ;
            }
        }

        $("#pair_list").append(
            $('<div class="row order"></div>')
                .append($(` <div class="col-2 px-1">
                            <font color="${statuscolor}">${status}</font> <img class="ex-icon" src="./image/exchange/${exchangeName.toLowerCase()}.svg"> ${exchangeName}
                        </div>`))
                .append($(`<div class="col-2 px-1 text-left"></div>`).text(`${pairName} - ${bridgeName}`))
                .append($('<div class="col-2 px-1 text-right"></div>').text(bridgePrice))
                .append(buyPriceDiv)
                .append(spreadPriceDiv)
                .append(sellPriceDiv)
        );
    }
}

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
        var currencyName = getCurrencyName(bid.right);

        $("#ob_bid_list").append(
            $('<div class="row order"></div>')
                .append($(`<div class="col-1 px-1"><img class="ex-icon" src="./image/exchange/${exchangeName.toLowerCase()}.svg"></div>`))
                //.append($('<div class="col-3 px-1"></div>').text(exchangeName))
                //.append($(`<div class="col-1 px-1 text-right"><img class="ex-icon" src="./image/currency/${bid.currencyRight.toLowerCase()}.svg"></div>`))
                .append($(`<div class="col-2 px-1 text-right"></div>`).text(currencyName))
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
        var currencyName = getCurrencyName(ask.right);

        $("#ob_ask_list").append(
            $('<div class="row order"></div>')
                .append(priceDiv)
                .append($('<div class="col-4 px-1 text-right"></div>').text(ask.amount.toFixed(2))) //.text(ask.order_amount.toFixed(2)))
                //.append($(`<div class="col-1 px-1 text-right"><img class="ex-icon" src="./image/currency/${ask.currencyRight.toLowerCase()}.svg"></div>`))
                .append($(`<div class="col-2 px-1 text-right"></div>`).text(currencyName))
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

    // create parm
    const pairs = Object.keys(EXCHANGE_CURRENCY_PAIRS).map((key) => {
        const pair = EXCHANGE_CURRENCY_PAIRS[key];
        //console.log(pair);
        return `${pair.exchangeId}_${pair.left}_${pair.right}`;
    });
    //console.log(pairs);

    // api call
    let reqParam = "";
    for (const pair of pairs) {
        if (reqParam === "") {
            reqParam = "?";
        } else {
            reqParam = reqParam + "&";
        }
        reqParam = reqParam + `cp[]=${pair}`
    }

    //console.log(reqParam);

    var dummyParam = new Date().getTime();
    fetch(`https://adk-aggregator.herokuapp.com/proxy_exchange_api${reqParam}&dummy=${dummyParam}`)
        //fetch(`http://localhost:3000/proxy_exchange_api${reqParam}&dummy=${dummyParam}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonObj) {
            //console.log(JSON.stringify(jsonObj));
            aggregateParser(jsonObj);
        });

    return;

    function aggregateParser(currencyPairArray) {
        //console.log( currencyPairArray ) ;

        var pairStatsList = [];

        // merge orderbooks
        var mergedOrderbookBuy = [];
        var mergedOrderbookSell = [];
        for (let pair of currencyPairArray) {

            let bridgeCoefficient = 1;
            if (pair.currencyPair.right !== CURRENCY_ID.BTC) {
                // calc adjusted price
                bridgeCoefficient = pair.bridgeCoefficient;
            }

            let buyArray = [];
            let buyHeadPrice = null;
            for (const order of pair.orderbook.buy) {
                const price = order.price * bridgeCoefficient;
                if (!buyHeadPrice) {
                    buyHeadPrice = price;
                }
                buyArray.push({
                    exchangeId: pair.exchangeId,
                    right: pair.currencyPair.right,
                    price: price,
                    amount: order.volume,
                });
            }

            let sellArray = [];
            let sellHeadPrice = null;
            for (const order of pair.orderbook.sell) {
                const price = order.price * bridgeCoefficient;
                if (!sellHeadPrice) {
                    sellHeadPrice = price;
                }
                sellArray.push({
                    exchangeId: pair.exchangeId,
                    right: pair.currencyPair.right,
                    price: order.price * bridgeCoefficient,
                    amount: order.volume,
                });
            }

            Array.prototype.push.apply(mergedOrderbookBuy, buyArray);
            Array.prototype.push.apply(mergedOrderbookSell, sellArray);

            pairStatsList.push({
                exchangeId: pair.exchangeId,
                left: pair.currencyPair.left,
                right: pair.currencyPair.right,
                buy: buyHeadPrice,
                sell: sellHeadPrice,
                success: pair.orderbook.success,
                bridge: pair.currencyPair.bridge,
                bridgePrice: pair.bridgePrice,
            });
        }

        // sort & chop
        mergedOrderbookBuy.sort(SORTER_BUY_ORDERS);
        mergedOrderbookSell.sort(SORTER_SELL_ORDERS);

        choppedOrderbookBuy = mergedOrderbookBuy.slice(0, ORDERBOOK_LIMIT);
        choppedOrderbookSell = mergedOrderbookSell.slice(0, ORDERBOOK_LIMIT);

        //console.log(choppedOrderbookBuy);
        //console.log(choppedOrderbookSell);

        renderStats(pairStatsList);
        renderOb(choppedOrderbookBuy, choppedOrderbookSell);
    }
}
