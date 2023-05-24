angular.module('myApp')
    .controller('mainCtrl', [
            '$scope', '$http', 'ngCart', '$rootScope', 'ngCart.lottoyard.api', '$q', '$timeout', function ($scope, $http, ngCart, $rootScope, LottoYardService, $q, $timeout) {
            	$ = jQuery;
                //setting globals
                ngCart.setFastProcessingTax(0.79);
                // ngCart.setShipping(2.99);
                ngCart.setAffiliateCode(parseInt(CONFIG.affiliateId));
                ngCart.setOlapAffiliateCode(parseInt(CART_CONFIG.CART_OLAP_AFFILIATE_CODE));
                ngCart.setReedemCode(CONFIG.cartPromoCode);
                $rootScope.isFirstTimePurchase = parseInt(CART_CONFIG.CART_IS_FIRSTTIME_PURCHASE);
                $rootScope.isAuthenticated = CONFIG.isLogin;
                $rootScope.cartPartialsPath = CART_CONFIG.CART_PARTIALS_URI;
                $rootScope.language = CONFIG.siteLang;
                $rootScope.cartUrlWithLang = ($rootScope.language !== "en") ? "/" + $rootScope.language + '/cart/' : "/cart/";
                $rootScope.sessionId = CONFIG.sessionId;
                console.log('$rootScope.language', $rootScope.language);
                $rootScope.topJacktop = {};

                // console.log('isFirstTimePurchase', $rootScope.isFirstTimePurchase);

                var cartUrlWithLang = $rootScope.cartUrlWithLang;

                if ($rootScope.isFirstTimePurchase) {
                    console.log('Getting free ticket:');
                    LottoYardService.getFreeTicket().then(function (resp) {
                        console.log(resp);
                        console.log("got free ticket");
                    });
                }

                $scope.initCartCalls = function () {

                    LottoYardService.getAllBrandDraws().then(function (data) {
                        //console.log(data);
                        //debugger;
                        var top = data[0];
                        angular.forEach(function (item) {
                            if (item.Jackpot > top.Jackpot) {
                                top = item;
                            }
                        });
                        $rootScope.topJacktop = top;
                        console.log('Top jacktop lottery: ', top);
                    });
                    LottoYardService.getAllLotteriesRules()
                        .then(LottoYardService.getAllProductsRules())
                        .then(LottoYardService.getProductPrices())
                        .then(function () {
                            console.log("init loaded");
                            $("body").find(".loading").removeClass("loading");
                        });
                }

                $scope.saveToCartPredefined = function (item, parsedProductsHash, redirectToCart) {

                    console.log(item);

                    LottoYardService.getAllLotteriesRules()
                        .then(LottoYardService.getAllProductsRules())
                        .then(LottoYardService.getProductPrices())
                        .then(function () {
                            ngCart.addItemPredifined(item.ProductId, item.LotteryID, item.Lines, item.Draws, item.Amount, parsedProductsHash, item.SelectedNumbers);
                            if (redirectToCart) window.location = cartUrlWithLang;
                        });
                }

                $scope.setPromoCode = function (code) {
                    ngCart.setReedemCode(code);
                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.emptyCart = function () {
                    ngCart.empty();
                }

                $scope.clearCart = function () {
                    ngCart.setIframePaymentMethods(null);
                    ngCart.setPaymentMethodId(null);
                    ngCart.setProcessor(null);

                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.saveToCartProduct = function (item, redirectToCart) {

                    console.log(item);

                    LottoYardService.getAllLotteriesRules()
                        .then(LottoYardService.getAllProductsRules())
                        .then(LottoYardService.getProductPrices())
                        .then(function () {
                            //this is group
                            //debugger;
                            //old  4
                            if (item.LotteryId === 4) {
                                ngCart.addItem(item.id, 0, 0, 0, 0, item.Draws, 1, item.Price / item.Draws,
                                    item.Price, item.LotteryId, 0, 0, "", item.Price / item.Draws, 0, 0, "product", item.Price, 0, 0, 0, item.ProductId, 0);

                            } else if (item.ProductId === 3) {
                                ngCart.addItem(item.id, 0, 0, 0, 0, item.Draws, 1, (item.Price / item.Draws) * 8,
                                   item.Price, item.LotteryId, 0, 0, "", item.Price / item.Draws, 0, 0, "groupselection", item.Price, 0, 0, 0, item.ProductId, 0);

                            } else {
                                ngCart.addItem(item.id, 0, 0, 0, 0, 0, 0, 0, 0, item.LotteryId, item.Draws, 0, "", item.Price / item.Draws, 0, 0, "product", item.Price, 0, 0, 0, item.ProductId, "", item.Qty);
                            }
                            if (redirectToCart) window.location = cartUrlWithLang;
                        });
                }

                $scope.saveToCartNavidad = function (item, redirectToCart) {
                    //debugger;
                    //console.log(item);

                    LottoYardService.getAllLotteriesRules().then(function(){
                        LottoYardService.getAllProductsRules().then(function(){
                            LottoYardService.getProductPrices().then(function(){
                                ngCart.addItem(item.id, parseFloat(item.discount), 0, item.groupSettingsIndex, 0, 0, 0, 0,
                                    0, item.lotteryType, item.noofdraws, item.nooflines, item.numbers, item.originalprice, 0, 0, "single", item.totalCost, 0, 0, item.ticketNumberIds, item.productType, item.timestamp);
                                if (redirectToCart) window.location = cartUrlWithLang;
                            })
                        })
                    });
                };

                $scope.saveToCart = function (item, redirectToCart) {

                    LottoYardService.getAllLotteriesRules()
                        .then(LottoYardService.getAllProductsRules())
                        .then(LottoYardService.getProductPrices())
                        .then(function () {
                            //debugger;
                            ngCart.addItem(item.id, item.discount, item.groupComboBoxSelectionIndex, item.groupSettingsIndex, item.groupdiscount, item.groupnodraws, item.groupnoshares, item.grouporiginalprice,
                                item.grouptotal, item.lotteryType, item.noofdraws, item.nooflines, item.numbers, item.originalprice, item.personalComboBoxSelectionIndex, item.personalSettingsIndex, item.selectedTab, item.totalCost,
                                item.isSubscription, item.isQuickPick, item.ticketsNumbers, item.productType, item.productExpire, item.productIdSpecial, item.quantity, item.guid, item.evenLinesOnly);
                            if (redirectToCart) window.location = cartUrlWithLang;
                        });
                }

                $scope.initCartCalls();
            }]);
