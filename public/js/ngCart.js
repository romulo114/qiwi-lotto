(function() {
    'use strict';
    angular.module('ngCart', ['ngCart.directives'])
        .config([
            function() {

            }
        ])
        .provider('$ngCart', function() {
            this.$get = function() {};
        })
        .run([
            '$rootScope', 'ngCart', 'ngCartItem', 'store',
            function($rootScope, ngCart, ngCartItem, store) {

                $rootScope.$on('ngCart:change', function() {
                    ngCart.$save();
                });

                if (angular.isObject(store.get('cart'))) {
                    ngCart.$restore(store.get('cart'));

                } else {
                    ngCart.init();
                }
            }
        ])
        .service('ngCart', [
            '$rootScope', 'ngCartItem', 'store', 'ngCart.lottoyard.api', 'Products',
            function($rootScope, ngCartItem, store, LottoYardService, Products) {

                this.init = function() {
                    this.$cart = {
                        shipping: null,
                        taxRate: null,
                        tax: null,
                        paymentMethodId: null,
                        processor: null,
                        fastProcessingTax: null,
                        amountToPay: 0,
                        reedemCode: "",
                        isFastProcessing: false,
                        phoneOrEmail: null,
                        iframePaymentMethods: [],
                        items: []
                    };

                    // console.log(this.$cart);
                    // debugger;
                };

                this.addItem = function(id, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                    grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid, evenLinesOnly) {
                    var inCart = this.getItemById(id);
                    if (typeof inCart === 'object') {
                        //Update quantity of an item if it's already in the cart
                        inCart.setQuantity(quantity, false);
                    } else {
                        if (this.$cart.items.length === 10) {
                            //todo remove first element
                            this.$cart.items.shift();
                        }
                        //debugger
                        if (selectedTab === 'single') {
                            productType = 1;
                            var res = LottoYardService.getProductPriceByIds(productType, noofdraws, lotteryType, nooflines);
                            totalCost = res.Price;
                        }

                        discount = parseFloat(discount.toFixed(3));

                        if (selectedTab === 'single' && (typeof(productType) === 'undefined' || productType === "")) {
                            productType = 1;
                        } else if (selectedTab === 'groupselection') {
                            productType = 3;
                        }

                        if (selectedTab === 'product' && productType === 3) {
                            groupnoshares = groupnoshares === 0 ? 1 : groupnoshares;
                        }
                        if (this.getIsFastProcessing()) {
                            var isFastProcessing = true;
                            totalCost = parseFloat(totalCost) + this.getFastProcessingTax();
                        }

                        if (personalSettingsIndex === 2 || groupSettingsIndex === 2) {
                            isSubscription = true;
                        } else {
                            isSubscription = false;
                        }

                        quantity = quantity > 0 ? quantity : 1;

                        if (productType === 2 || productType === 4 || productType === 14 || productType === 19) {
                            //14 and 19
                            debugger
                            var product = LottoYardService.getProductById(productType);
                            console.log(product);
                            console.log(productType);

                            var productName = product.ProductName;
                            var productRules = product.ValidLotteries.filter(function(obj) {
                                if ('LotteryTypeId' in obj && typeof(obj.LotteryTypeId) === 'number' && obj.LotteryTypeId === lotteryType) {
                                    return true;
                                }
                                return false;
                            })[0];

                            if (productType === 2 || productType === 4 || productType === 19) {
                                if (quantity > 1) {
                                    totalCost = quantity * totalCost;
                                }
                            }
                            if (productType === 2) {
                                productName = LottoYardService.getLotteryById(lotteryType).LotteryType;
                            }
                            if (productType === 14 || productType === 19) {
                                nooflines = 1;
                            }
                            if (productType === 19) {
                                productName = "247Premium";
                            }
                            if (lotteryType === 7) {
                                rules = {
                                    SelectNumbers: 0,
                                    MinSelectNumber: 0,
                                    MaxSelectNumbers: 0,
                                    ExtraNumbers: 0,
                                    MaxExtraNumbers: 0,
                                    MinExtraNumber: 0,
                                    DrawsPerWeek: 0
                                };
                            } else {
                                var rules = LottoYardService.getLotteryById(lotteryType);
                            }

                            if (productType === 2 || productType === 4) {

                                nooflines = productRules.MinLines;

                                for (var i = 0; i < productRules.MinLines; i++) {
                                    if (i === productRules.MinLines - 1) {
                                        numbers += quickpick(rules);
                                    } else {
                                        numbers += quickpick(rules) + "|";
                                    }
                                }
                            }
                            // debugger
                            var newItem = new ngCartItem(id, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                                grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, productName,
                                rules.SelectNumbers, rules.MinSelectNumber, rules.MaxSelectNumbers, rules.ExtraNumbers, rules.MaxExtraNumbers, rules.MinExtraNumber, productRules.MinLines, productRules.MaxLines, rules.DrawsPerWeek, product.Draws, isFastProcessing, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid, evenLinesOnly);

                        } else {
                            var lotteryname = LottoYardService.getLotteryById(lotteryType).LotteryType;
                            var rules = LottoYardService.getLotteryById(lotteryType);

                            if (selectedTab === 'product' || productType === 3) {
                                //grouporiginalprice = LottoYardService.getProductPriceById(productType, 1, lotteryType).Price * 8;

                                groupdiscount = 0;
                                angular.forEach(rules.ProductsDrawOptions, function(item) {
                                    if (item.ProductId === productType && item.IsSubscription === isSubscription) {
                                        angular.forEach(item.MultiDrawOptions, function(drawOpt) {
                                            if (drawOpt.NumberOfDraws === parseInt(groupnodraws)) {
                                                groupdiscount = drawOpt.Discount;
                                            }
                                        });
                                    }
                                });
                            }

                            if (productType === 1) {
                                // debugger;
                                originalprice = LottoYardService.getProductPriceByIds(productType, 1, lotteryType, 1).Price;
                                noofdraws = parseInt(noofdraws);
                                discount = 0;
                                angular.forEach(rules.ProductsDrawOptions, function(item) {
                                    if (item.ProductId === productType && item.IsSubscription === isSubscription) {
                                        angular.forEach(item.MultiDrawOptions, function(drawOpt) {
                                            if (drawOpt.NumberOfDraws === parseInt(noofdraws)) {
                                                discount = drawOpt.Discount;
                                            }
                                        });
                                    }
                                });
                            }

                            //getting MinLines and MaxLines accoring draws

                            //rules.ProductsDrawOptions - productId & IsSubscription
                            if (productType === 15 || productType === 24 || productType === 26 || productType === 20) {
                                rules.MinLines = 1;
                                rules.MaxLines = ticketsNumbers.length;
                            } else {
                                angular.forEach(rules.ProductsDrawOptions, function(item) {
                                    if (item.ProductId === productType && item.IsSubscription === isSubscription) {
                                        angular.forEach(item.MultiDrawOptions, function(drawOpt) {
                                            if (drawOpt.NumberOfDraws === parseInt(noofdraws)) {
                                                rules.MinLines = drawOpt.MinLines;
                                                rules.MaxLines = drawOpt.MaxLines;
                                            }
                                        });
                                    }
                                });
                            }

                            var newItem = new ngCartItem(id, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                                grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, lotteryname,
                                rules.SelectNumbers, rules.MinSelectNumber, rules.MaxSelectNumbers, rules.ExtraNumbers, rules.MaxExtraNumbers, rules.MinExtraNumber, rules.MinLines, rules.MaxLines, rules.DrawsPerWeek, rules.ProductsDrawOptions, isFastProcessing, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid, evenLinesOnly);
                        }

                        this.$cart.items.push(newItem);
                        console.log(this.$cart.items)

                        $rootScope.$broadcast('ngCart:itemAdded', newItem);
                    }

                    $rootScope.$broadcast('ngCart:change', {});

                    function quickpick(rules) {
                        // debugger;
                        var generatedNumbers = [];
                        var generatedExtraNumbers = [];
                        var line = "";

                        var maxSelectExtraNumbers = rules.MaxExtraNumbers; // kolko extra number to generate

                        var startNumber = rules.MinSelectNumber; //otkolko da startirame chislata
                        var endNumber = rules.SelectNumbers;

                        var maxSelectNumbers = rules.MaxSelectNumbers; //kolko chisla da se generirat

                        var startExtraNumber = rules.MinExtraNumber;
                        var endExtraNumbers = rules.ExtraNumbers;

                        while (generatedNumbers.length < maxSelectNumbers) {
                            var number = getRandomInt(startNumber, endNumber);
                            if (generatedNumbers.indexOf(number) === -1) {
                                generatedNumbers.push(number);
                                console.log(number);
                            }
                        }
                        line += generatedNumbers.join(',');

                        if (maxSelectExtraNumbers > 0) {
                            while (generatedExtraNumbers.length < maxSelectExtraNumbers) {
                                var number = getRandomInt(startExtraNumber, endExtraNumbers);
                                if (generatedExtraNumbers.indexOf(number) === -1) {
                                    generatedExtraNumbers.push(number);
                                    console.log(number);
                                }
                            }

                            line += '#' + generatedExtraNumbers.join(',');
                        }
                        return line;

                        function getRandomInt(min, max) {
                            return Math.floor(Math.random() * (max - min + 1)) + min;
                        }
                    }
                };

                this.addItemPredifined = function(productId, lotteryType, lines, draws, amount, guid, selectedNumbers) {
                    // debugger;
                    if (!isNumeric(productId)) {
                        productId = parseInt(productId);
                    }

                    if (!isNumeric(lotteryType)) {
                        lotteryType = parseInt(lotteryType);
                    }

                    if (!isNumeric(lines)) {
                        lines = parseInt(lines);
                    }

                    if (!isNumeric(draws)) {
                        draws = parseInt(draws);
                    }

                    if (!isNumeric(amount)) {
                        amount = parseInt(amount);
                    }

                    //generating id
                    var productIdSpecial = 999;
                    var product = LottoYardService.getProductById(productId);
                    var productName,
                        selectedTab,
                        noofdraws,
                        nooflines,
                        rules,
                        personalComboBoxSelectionIndex,
                        personalSettingsIndex,
                        isSubscription,
                        isFastProcessing,
                        isQuickPick,
                        productExpire,
                        ticketsNumbers,
                        quanity;

                    var numbers = "";
                    var quantity = 1;
                    productIdSpecial = 999;
                    guid = guid;

                    if (typeof(product) === 'undefined') {
                        productName = LottoYardService.getLotteryById(lotteryType).LotteryType;
                    } else {
                        productName = product.ProductName;
                        selectedTab = 'product';
                    }

                    if (productId === 3) {
                        selectedTab = 'group';
                    } else if (productId === 1) {
                        selectedTab = 'personal';
                        nooflines = parseInt(lines);
                    } else if (draws === 0) {
                        selectedTab = 'raffle';
                    }

                    noofdraws = parseInt(draws);

                    var discount = 0,
                        groupComboBoxSelectionIndex = 0,
                        groupSettingsIndex = 0,
                        groupdiscount = 0,
                        groupnodraws = 0,
                        groupnoshares = 0,
                        grouporiginalprice = 0,
                        grouptotal = 0;

                    var productType = productId;
                    var originalprice = amount;
                    var totalCost = amount;

                    rules = {
                        SelectNumbers: 0,
                        MinSelectNumber: 0,
                        MaxSelectNumbers: 0,
                        ExtraNumbers: 0,
                        MaxExtraNumbers: 0,
                        MinExtraNumber: 0,
                        DrawsPerWeek: 0
                    };

                    switch (selectedTab) {
                        case 'personal':
                            if (typeof selectedNumbers !== 'undefined') {
                                numbers = linesChecker(selectedNumbers);
                            } else {
                                //get lottery rules for genereting lines
                                rules = LottoYardService.getLotteryById(lotteryType);
                                var minLines = rules.MinLines;
                                var maxLines = rules.MaxLines;

                                if (nooflines > maxLines || minLines > nooflines) {
                                    throw "Lines can not be greater than max lines or less then defined in rules";
                                }
                                for (var i = 0; i < nooflines; i++) {
                                    if (i === nooflines - 1) {
                                        numbers += quickpick(rules);
                                    } else {
                                        numbers += quickpick(rules) + "|";
                                    }
                                }
                            }

                            break;
                        case 'group':
                            groupnodraws = draws;
                            groupnoshares = lines;
                            break;
                        case 'raffle':
                            LottoYardService.getRaffleTicket(productId).then(
                                angular.bind(this, function(resp) {
                                    console.log(resp);

                                    //if response is array else throw error
                                    if (!Array.isArray(resp)) {
                                        throw ("OLA: raffle response is not array!: error:" + resp);
                                    }
                                    var ticket = resp[0];
                                    numbers = ticket.Number + "-" + ticket.Seat + "-" + ticket.Ticket;
                                    ticketsNumbers = [ticket.Id];

                                    var productExpire = [];
                                    var obj = {};
                                    var navidadExpiration = new Date();
                                    navidadExpiration.setMinutes(navidadExpiration.getMinutes() + RaffleExpiresInMin);
                                    obj.id = ticket.Id;
                                    obj.exp = navidadExpiration;
                                    productExpire.push(obj);

                                    nooflines = shares;

                                    var newItem = new ngCartItem(0, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                                        grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, productName,
                                        rules.SelectNumbers, rules.MinSelectNumber, rules.MaxSelectNumbers, rules.ExtraNumbers, rules.MaxExtraNumbers, rules.MinExtraNumber, rules.MinLines, rules.MaxLines,
                                        rules.DrawsPerWeek, noofdraws, isFastProcessing, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid);

                                    this.$cart.items.push(newItem);

                                    $rootScope.$broadcast('ngCart:itemAdded', newItem);

                                    $rootScope.$broadcast('ngCart:change', {});

                                }));
                            return;
                        case "product":
                            switch (productType) {
                                case 4:
                                    quanity = 1;
                                    noofdraws = draws;
                                    nooflines = 1;
                                    numbers = linesChecker(selectedNumbers);
                                    break;

                                case 14:
                                    quanity = 1;
                                    noofdraws = draws;

                                    break;

                                default:
                            }

                            break;
                        default:
                    }

                    var newItem = new ngCartItem(0, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                        grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, productName,
                        rules.SelectNumbers, rules.MinSelectNumber, rules.MaxSelectNumbers, rules.ExtraNumbers, rules.MaxExtraNumbers, rules.MinExtraNumber, rules.MinLines, rules.MaxLines,
                        rules.DrawsPerWeek, noofdraws, isFastProcessing, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid);

                    this.$cart.items.push(newItem);

                    $rootScope.$broadcast('ngCart:itemAdded', newItem);

                    $rootScope.$broadcast('ngCart:change', {});
                }

                function quickpick(rules) {
                    // debugger;
                    var generatedNumbers = [];
                    var generatedExtraNumbers = [];
                    var line = "";

                    var maxSelectExtraNumbers = rules.MaxExtraNumbers; // kolko extra number to generate

                    var startNumber = rules.MinSelectNumber; //otkolko da startirame chislata
                    var endNumber = rules.SelectNumbers;

                    var maxSelectNumbers = rules.MaxSelectNumbers; //kolko chisla da se generirat

                    var startExtraNumber = rules.MinExtraNumber;
                    var endExtraNumbers = rules.ExtraNumbers;

                    while (generatedNumbers.length < maxSelectNumbers) {
                        var number = getRandomInt(startNumber, endNumber);
                        if (generatedNumbers.indexOf(number) === -1) {
                            generatedNumbers.push(number);
                            console.log(number);
                        }
                    }
                    line += generatedNumbers.join(',');

                    if (maxSelectExtraNumbers > 0) {
                        while (generatedExtraNumbers.length < maxSelectExtraNumbers) {
                            var number = getRandomInt(startExtraNumber, endExtraNumbers);
                            if (generatedExtraNumbers.indexOf(number) === -1) {
                                generatedExtraNumbers.push(number);
                                console.log(number);
                            }
                        }

                        line += '#' + generatedExtraNumbers.join(',');
                    }
                    return line;

                    function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                }

                function isNumeric(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }

                function linesChecker(numbers) {
                    var numberSeperator = ',';
                    var linesSeperator = '|';
                    var specialNumberSeperator = "#";

                    var arrLength = numbers.length;

                    var numbersSanitized = "";
                    var currentNumbersInline = 1;

                    for (var i = 0; i < arrLength; i++) {
                        var currentElement = numbers[i];
                        var nextElement = numbers[i + 1];

                        if (i === 0) {
                            if (isNumeric(currentElement)) {
                                numbersSanitized += currentElement;
                                currentNumbersInline++;
                                continue;
                            } else {
                                continue;
                            }
                        }

                        if (isNumeric(currentElement)) {
                            numbersSanitized += currentElement;
                            currentNumbersInline++;
                            continue;
                        }

                        if (currentElement === numberSeperator || currentElement === linesSeperator || currentElement === specialNumberSeperator) {
                            if (typeof nextElement !== 'undefined') {
                                if (isNumeric(nextElement)) {
                                    numbersSanitized += currentElement;
                                    continue;
                                }
                            }
                        }
                    }

                    function isNumeric(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }

                    console.log(numbersSanitized);
                    return numbersSanitized;

                }

                this.getItemById = function(itemId) {
                    var items = this.getCart().items;
                    var build = false;

                    angular.forEach(items, function(item) {
                        if (item.getId() === itemId) {
                            build = item;
                        }
                    });
                    return build;
                };

                this.setShipping = function(shipping) {
                    this.$cart.shipping = shipping;
                    return this.getShipping();
                };

                this.getShipping = function() {
                    if (this.getCart().items.length === 0) return 0;
                    return this.getCart().shipping;
                };

                this.setTaxRate = function(taxRate) {
                    this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
                    return this.getTaxRate();
                };

                this.getTaxRate = function() {
                    return this.$cart.taxRate;
                };

                this.getTax = function() {
                    return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
                };

                this.setCart = function(cart) {
                    this.$cart = cart;
                    return this.getCart();
                };

                this.getCart = function() {
                    return this.$cart;
                };

                this.getItems = function() {
                    return this.getCart().items;
                };

                this.setItems = function(items) {
                    this.$cart.items = items;
                };

                this.getTopNItems = function(n) {
                    return this.getCart().items.slice(0, n);
                };

                this.getTotalItems = function() {
                    var count = 0;
                    var items = this.getItems();
                    angular.forEach(items, function(item) {
                        count += item.getQuantity();
                    });
                    return count;
                };

                this.getTotalUniqueItems = function() {
                    return this.getCart().items.length;
                };

                this.getSubTotal = function() {
                    var total = 0;
                    angular.forEach(this.getCart().items, function(item) {
                        total += item.getTotal();
                    });
                    return +parseFloat(total).toFixed(2);
                };

                this.totalCost = function() {
                    return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
                };

                this.setAmountToPay = function(price) {
                    this.$cart.amountToPay = price;
                };

                this.getAmountToPay = function() {
                    if (this.$cart.amountToPay >= 0) {
                        return this.$cart.amountToPay;
                    }
                    return this.totalCost();
                };

                this.removeItem = function(index) {
                    this.$cart.items.splice(index, 1);
                    $rootScope.$broadcast('ngCart:itemRemoved', {});
                    $rootScope.$broadcast('ngCart:change', {});

                };

                this.removeItemById = function(id) {
                    var cart = this.getCart();
                    angular.forEach(cart.items, function(item, index) {
                        if (item.getId() === id) {
                            cart.items.splice(index, 1);
                        }
                    });
                    this.setCart(cart);
                    $rootScope.$broadcast('ngCart:itemRemoved', {});
                    $rootScope.$broadcast('ngCart:change', {});
                };

                this.empty = function() {

                    $rootScope.$broadcast('ngCart:change', {});
                    this.$cart.items = [];
                    store.emptyCart();
                };

                this.isEmpty = function() {
                    return (this.$cart.items.length > 0 ? false : true);
                };

                this.setIframePaymentMethods = function(iframePaymentMethods) {
                    this.$cart.iframePaymentMethods = iframePaymentMethods;
                    return this.getIframePaymentMethods();
                };

                this.getIframePaymentMethods = function() {
                    return this.$cart.iframePaymentMethods;
                };

                this.setPaymentMethodId = function(paymentMethodId) {
                    this.$cart.paymentMethodId = paymentMethodId;
                }

                this.getPhoneOrEmail = function() {
                    return this.$cart.phoneOrEmail;
                }

                this.setPhoneOrEmail = function(phoneOrEmail) {
                    this.$cart.phoneOrEmail = phoneOrEmail;
                }

                this.getPaymentMethodId = function() {
                    return this.$cart.paymentMethodId;
                }

                this.setProcessor = function(processor) {
                    // debugger;
                    this.$cart.processor = processor;
                }

                this.getProcessor = function() {
                    return this.$cart.processor;
                }

                this.setReedemCode = function(reedem) {
                    this.$cart.reedemCode = reedem;
                    return this.getReedemCode();
                }

                this.getReedemCode = function() {
                    return this.$cart.reedemCode;
                }

                this.setReedemBonusAmount = function(reedemBonusAmount) {
                    this.$cart.reedemBonusAmount = reedemBonusAmount;
                    return this.getReedemBonusAmount();
                }

                this.getReedemBonusAmount = function() {
                    if (this.$cart.reedemBonusAmount < 0) {
                        return 0;
                    } else {
                        return this.$cart.reedemBonusAmount;
                    }

                }

                this.setAffiliateCode = function(aff) {
                    this.$cart.affiliateCode = aff;
                    return this.getAffiliateCode();
                }

                this.getAffiliateCode = function() {
                    return this.$cart.affiliateCode;
                }

                this.setIsFastProcessing = function(isFastProcessing) {
                    this.$cart.isFastProcessing = isFastProcessing;
                    return this.getIsFastProcessing();
                };

                this.getIsFastProcessing = function() {
                    return this.$cart.isFastProcessing;
                };

                this.setFastProcessingTax = function(fastProcessingTax) {
                    this.$cart.fastProcessingTax = fastProcessingTax;
                    return this.getFastProcessingTax();
                };

                this.getFastProcessingTax = function() {
                    return this.$cart.fastProcessingTax;
                };

                this.setOlapAffiliateCode = function(aff) {
                    this.$cart.olapAffiliateCode = aff;
                    return this.getOlapAffiliateCode();
                }

                this.getOlapAffiliateCode = function() {
                    return this.$cart.olapAffiliateCode;
                }

                this.toObject = function() {
                    if (this.getItems().length === 0) return false;
                    console.log(items);
                    //var items = [];
                    //angular.forEach(this.getItems(), function (item) {
                    //    items.push(item.toObject());
                    //});

                    //return {
                    //    shipping: this.getShipping(),
                    //    tax: this.getTax(),
                    //    taxRate: this.getTaxRate(),
                    //    subTotal: this.getSubTotal(),
                    //    totalCost: this.totalCost(),
                    //    items: items
                    //}
                    return items;
                };

                this.$restore = function(storedCart) {
                    var _self = this;
                    _self.init();
                    _self.$cart.shipping = storedCart.shipping;
                    _self.$cart.tax = storedCart.tax;
                    _self.$cart.iframePaymentMethods = storedCart.iframePaymentMethods;
                    _self.$cart.paymentMethodId = storedCart.paymentMethodId;
                    _self.$cart.processor = storedCart.processor;
                    _self.$cart.fastProcessingTax = storedCart.fastProcessingTax;
                    _self.$cart.amountToPay = storedCart.amountToPay;
                    _self.$cart.phoneOrEmail = storedCart.phoneOrEmail;
                    _self.$cart.reedemCode = storedCart.reedemCode;
                    _self.$cart.isFastProcessing = storedCart.isFastProcessing;
                    _self.$cart.affiliateCode = storedCart.affiliateCode;
                    _self.$cart.reedemBonusAmount = storedCart.reedemBonusAmount;
                    _self.$cart.olapAffiliateCode = storedCart.olapAffiliateCode;

                    angular.forEach(storedCart.items, function(item) {
                        _self.$cart.items.push(new ngCartItem(item._id, item._discount, item._groupComboBoxSelectionIndex, item._groupSettingsIndex, item._groupdiscount, item._groupnodraws, item._groupnoshares, item._grouporiginalprice,
                            item._grouptotal, item._lotteryType, item._noofdraws, item._nooflines, item._numbers, item._originalprice, item._personalComboBoxSelectionIndex, item._personalSettingsIndex, item._selectedTab, item._totalCost, item._lotteryName,
                            item._selectNumbers, item._minselectNumbers, item._maxselectNumbers, item._extraNumbers, item._maxExtraNumbers, item._minExtraNumber, item._minLines, item._maxLines, item._drawsPerWeek, item._productsDrawOptions, item._isFastProcessing, item._isSubscription, item._isQuickPick, item._ticketsNumbersId, item._productType, item._productExpire, item._productIdSpecial, item._quantity, item._guid, item._evenLinesOnly));
                    });
                    this.$save();
                };

                this.$save = function() {
                    return store.set('cart', JSON.stringify(this.getCart()));
                }

            }
        ])
        .factory('ngCartItem', [
            '$rootScope', '$log', /*'$timeout',*/
            function($rootScope, $log) {

                var item = function(id, discount, groupComboBoxSelectionIndex, groupSettingsIndex, groupdiscount, groupnodraws, groupnoshares, grouporiginalprice,
                    grouptotal, lotteryType, noofdraws, nooflines, numbers, originalprice, personalComboBoxSelectionIndex, personalSettingsIndex, selectedTab, totalCost, lotteryname,
                    selectNumbers, minSelectNumber, maxSelectNumbers, extraNumbers, maxExtraNumbers, minExtraNumber, minLines, maxLines, drawsPerWeek, productsDrawOptions, isFastProcessing, isSubscription, isQuickPick, ticketsNumbers, productType, productExpire, productIdSpecial, quantity, guid, evenLinesOnly) {

                    this.setId(id);
                    this.setDiscount(discount);
                    this.setGroupComboBoxSelectionIndex(groupComboBoxSelectionIndex);
                    this.setGroupSettingsIndex(groupSettingsIndex);
                    this.setGroupdiscount(groupdiscount);
                    this.setGroupnodraws(groupnodraws);
                    this.setGroupnoshares(groupnoshares);
                    this.setGrouporiginalprice(grouporiginalprice);
                    this.setGroupTotal(grouptotal);
                    this.setLotteryType(lotteryType);
                    this.setNumberOfDraws(noofdraws);
                    this.setNumberOfLines(nooflines);
                    this.setNumbers(numbers);
                    this.setOriginalPrice(originalprice);
                    this.setPersonalComboBoxSelectionIndex(personalComboBoxSelectionIndex);
                    this.setPersonalSettingsIndex(personalSettingsIndex);
                    this.setSelectedTab(selectedTab);
                    this.setTotalCost(totalCost);
                    this.setTotalDiscount();
                    this.setNumbersSantized(numbers);
                    this.setLotteryType(lotteryType);
                    this.setLotteryName(lotteryname);
                    this.setProductType(productType);
                    this.setProductExpire(productExpire);

                    //lottery rules
                    this.setSelectNumbers(selectNumbers);
                    this.setMinSelectNumbers(minSelectNumber);
                    this.setMaxSelectNumbers(maxSelectNumbers);
                    this.setExtraNumbers(extraNumbers);
                    this.setMaxExtraNumbers(maxExtraNumbers);
                    this.setMinExtraNumber(minExtraNumber);
                    this.setMinLines(minLines);
                    this.setMaxLines(maxLines);
                    this.setDrawsPerWeek(drawsPerWeek);
                    this.setProductsDrawOptions(productsDrawOptions);
                    this.setIsFastProcessing(isFastProcessing);
                    this.setIsSubscription(isSubscription);
                    this.setIsQuickPick(isQuickPick);
                    this.setTicketsNumbersId(ticketsNumbers);

                    //this.setPrice(price);
                    //this.setQuantity(quantity);
                    this.setProductIdSpecial(productIdSpecial);
                    this.setGuid(guid);

                    this.setQuantity(quantity);
                    this.setEvenLinesOnly(evenLinesOnly)
                };

                item.prototype.setId = function(id) {
                    if (id) this._id = id;
                    else {
                        this._id = generateUid();
                        $log.info('An ID is auto generated:' + this._id);
                    }
                };

                item.prototype.getId = function() {
                    return this._id;
                };

                item.prototype.setDiscount = function(discount) {
                    this._discount = (discount);
                };

                item.prototype.getDiscount = function() {
                    // debugger;
                    if (this._productType === 1) {
                        return this._discount.toFixed(3);
                    } else {
                        return this._groupdiscount.toFixed(2);
                    }

                };

                item.prototype.setGroupComboBoxSelectionIndex = function(groupComboBoxSelectionIndex) {
                    this._groupComboBoxSelectionIndex = (groupComboBoxSelectionIndex);
                };

                item.prototype.getGroupComboBoxSelectionIndex = function() {
                    return this._groupComboBoxSelectionIndex;
                };

                item.prototype.setGroupSettingsIndex = function(groupSettingsIndex) {
                    this._groupSettingsIndex = (groupSettingsIndex);
                };

                item.prototype.getGroupSettingsIndex = function() {
                    return this._groupSettingsIndex;
                };

                item.prototype.setGroupdiscount = function(groupdiscount) {
                    //todo check is group then should not be 0
                    this._groupdiscount = (groupdiscount);
                };

                item.prototype.getGroupdiscount = function() {
                    return this._groupdiscount;
                };

                item.prototype.setGroupnodraws = function(groupnodraws) {
                    this._groupnodraws = parseInt(groupnodraws);
                };

                item.prototype.getGroupnodraws = function() {
                    return this._groupnodraws;
                };

                item.prototype.setGroupnoshares = function(groupnoshares) {
                    this._groupnoshares = (groupnoshares);
                };

                item.prototype.getGroupnoshares = function() {
                    return this._groupnoshares;
                };

                item.prototype.setGrouporiginalprice = function(grouporiginalprice) {
                    this._grouporiginalprice = (grouporiginalprice);
                };

                item.prototype.getGrouporiginalprice = function() {
                    return this._grouporiginalprice;
                };

                item.prototype.setGroupTotal = function(grouptotal) {
                    this._grouptotal = (grouptotal);
                };

                item.prototype.getGroupTotal = function() {
                    return this._grouptotal;
                };

                item.prototype.setLotteryType = function(lotteryType) {
                    if (lotteryType) {
                        if (lotteryType <= 0) {
                            $log.error('A lotteryType must be over 0');
                        } else {
                            this._lotteryType = (lotteryType);
                        }
                    } else {
                        $log.error('A lotteryType must be provided');
                    }
                };

                item.prototype.getLotteryType = function() {
                    return this._lotteryType;
                };

                item.prototype.setLotteryName = function(lotteryname) {
                    if (lotteryname === 'NavidadPersonal') {
                        this._lotteryName = 'Navidad';
                    } else {
                        this._lotteryName = lotteryname;
                    }

                };

                item.prototype.getLotteryName = function() {
                    return this._lotteryName;
                };

                item.prototype.setNumberOfDraws = function(noofdraws) {
                    this._noofdraws = (noofdraws);
                };

                item.prototype.getNumberOfDraws = function() {
                    if (this._selectedTab === 'groupselection' || this._productType === 3) {
                        return this._groupnodraws;
                    }
                    return this._noofdraws;
                };

                item.prototype.getNumberOfLinesOrShares = function() {
                    if (this._productType !== 1) {
                        return this._groupnoshares;
                    }
                    return this._nooflines;
                };

                item.prototype.setNumberOfLines = function(nooflines) {
                    this._nooflines = (nooflines);
                };

                item.prototype.getNumberOfLines = function() {
                    return this._nooflines;
                };
                item.prototype.setEvenLinesOnly = function(evenLinesOnly) {
                    return this._evenLinesOnly = evenLinesOnly;
                }
                item.prototype.getEvenLinesOnly = function() {
                    return this._evenLinesOnly;
                }

                item.prototype.setNumbers = function(numbers) {
                    // debugger;
                    var newNumbers;
                    var currentLines;
                    if (typeof(numbers) !== 'undefined' && numbers !== "") {
                        newNumbers = "";
                        currentLines = 1;
                        for (var i = 0, len = numbers.length; i < len; i++) {
                            var pattern = '|';
                            var currentChar = numbers[i];
                            var nextChar = numbers[i + 1];

                            if (currentChar !== pattern) {
                                newNumbers += currentChar;
                            } else {

                                if (nextChar === pattern || typeof(nextChar) === 'undefined') {
                                    continue;
                                }

                                currentLines++;
                                newNumbers += pattern;
                            }
                        }

                        if (currentLines !== this._nooflines) {
                            console.warn('mismatching lines in numebrs');
                        }
                    }

                    this._numbers = newNumbers;
                };

                item.prototype.getNumbers = function() {
                    return this._numbers;
                };

                item.prototype.setNumbersSantized = function(numbers) {
                    //debugger;
                    if (typeof(numbers) !== 'undefined') {
                        if (numbers.indexOf(',') !== -1) {
                            if (numbers.length > 0) {
                                var lines = numbers.split('|');
                                lines = lines.filter(function(e) {
                                    return e.replace(/(\r\n|\n|\r)/gm, "")
                                });
                                this._numbersSantized = lines;
                            } else {
                                this._numbersSantized = [];
                            }
                        } else {
                            this._numbersSantized = [];
                            this._numbersSantized.push(numbers);
                        }
                    } else {
                        this._numbersSantized = [];
                        this._numbersSantized.push(numbers);
                    }


                };

                item.prototype.getNumbersSantized = function() {
                    return this._numbersSantized;
                };

                item.prototype.getLinesNumbers = function(line) {

                    // debugger;
                    if (this._lotteryType === 13) {
                        return line;
                    }
                    var lines = this._numbersSantized[line];
                    var numberslines = lines.split(',');

                    if (lines.indexOf('#') !== -1) {
                        numberslines = lines.split('#')[0].split(',');
                    }
                    return numberslines;
                };

                item.prototype.getLinesSpecialNumbers = function(line) {
                    //todo check if okay
                    var lines = this._numbersSantized[line];

                    if (lines.indexOf('#') !== -1) {
                        return lines.split('#')[1].split(',');
                    }
                    return 0;
                };

                item.prototype.setOriginalPrice = function(originalprice) {
                    this._originalprice = (originalprice);
                };

                item.prototype.getOriginalPrice = function() {
                    return this._originalprice;
                };

                item.prototype.setPersonalComboBoxSelectionIndex = function(personalComboBoxSelectionIndex) {

                    this._personalComboBoxSelectionIndex = (personalComboBoxSelectionIndex);

                };

                item.prototype.getPersonalComboBoxSelectionIndex = function() {
                    return this._personalComboBoxSelectionIndex;
                };

                item.prototype.setPersonalSettingsIndex = function(personalSettingsIndex) {

                    this._personalSettingsIndex = personalSettingsIndex;

                };

                item.prototype.getPersonalSettingsIndex = function() {
                    return this._personalSettingsIndex;
                };

                item.prototype.setSelectedTab = function(selectedTab) {
                    this._selectedTab = (selectedTab);
                }

                item.prototype.getSelectedTab = function() {
                    return this._selectedTab;
                };

                item.prototype.setTotalCost = function(totalCost) {
                    this._totalCost = parseFloat(totalCost);
                };

                item.prototype.getTotalCost = function() {
                    return this._totalCost;
                };

                item.prototype.setTotalDiscount = function(dis) {
                    if (typeof(dis) === 'undefined') {
                        if (this._groupdiscount > 0) {
                            var price = this._totalCost + ((this._totalCost / (1 - this._groupdiscount)) * this._groupdiscount);
                            this._totalDiscount = this._groupdiscount * price;
                        } else {
                            var price = this._totalCost;
                            this._totalDiscount = this._groupdiscount * price;
                        }
                    } else {
                        this._totalDiscount = dis;
                    }
                };

                item.prototype.getTotalDiscount = function() {
                    // debugger;
                    if (this._productType === 1) {
                        return ((this._nooflines * this._originalprice * parseInt(this._noofdraws)) * this._discount).toFixed(2);
                    } else {
                        //debugger;
                        return this._totalDiscount;
                    }
                };

                item.prototype.removeLastLine = function() {
                    var lastLine = this._numbers.lastIndexOf('|');


                    var newNumbers = this._numbers.substring(0, lastLine);
                    this._numbers = newNumbers;

                    this.setNumbersSantized(newNumbers);

                    $rootScope.$broadcast('ngCart:change', {});
                };

                item.prototype.updateSantizedLine = function(numbers, line) {
                    if (this._numbersSantized.length < line) {
                        console.log('new line');
                        this._numbers += '|' + numbers;
                        this._numbersSantized.push(numbers);
                        this._nooflines++;
                    } else {
                        this._numbersSantized[line - 1] = numbers;
                        var splited = this._numbers.split('|');
                        splited[line - 1] = numbers;
                        this._numbers = splited.join('|');
                    }

                    $rootScope.$broadcast('ngCart:change', {});
                }

                item.prototype.setProductType = function(productType) {
                    this._productType = productType;
                };

                item.prototype.getProductType = function() {
                    return this._productType;
                };

                item.prototype.getLineOrShareText = function() {
                    if (this._productType === 1) {
                        return "Line";
                    }
                    return "Share";
                }

                //lottery rules properties
                item.prototype.getSelectNumbers = function() {
                    return this._selectNumbers;
                };

                item.prototype.setSelectNumbers = function(selectNumbers) {
                    this._selectNumbers = selectNumbers;
                };

                item.prototype.getMinSelectNumbers = function() {
                    return this._minselectNumbers;
                };

                item.prototype.setMinSelectNumbers = function(minselectNumbers) {
                    this._minselectNumbers = minselectNumbers;
                };

                item.prototype.getMaxSelectNumbers = function() {
                    return this._maxselectNumbers;
                };

                item.prototype.setMaxSelectNumbers = function(maxselectNumbers) {
                    this._maxselectNumbers = maxselectNumbers;
                };

                item.prototype.getExtraNumbers = function() {
                    return this._extraNumbers;
                };

                item.prototype.setExtraNumbers = function(extraNumbers) {
                    this._extraNumbers = extraNumbers;
                };

                item.prototype.getMaxExtraNumbers = function() {
                    return this._maxExtraNumbers;
                };

                item.prototype.setMaxExtraNumbers = function(maxExtraNumbers) {
                    this._maxExtraNumbers = maxExtraNumbers;
                };

                item.prototype.getMinExtraNumber = function() {
                    return this._minExtraNumber;
                };

                item.prototype.setMinExtraNumber = function(minExtraNumber) {
                    this._minExtraNumber = minExtraNumber;
                };

                item.prototype.getMinLines = function() {

                    return this._minLines;
                };

                item.prototype.setMinLines = function(minLines) {
                    this._minLines = minLines;
                };

                item.prototype.getMaxLines = function() {
                    return this._maxLines;
                };

                item.prototype.setMaxLines = function(maxLines) {
                    this._maxLines = maxLines;
                };

                item.prototype.getDrawsPerWeek = function() {
                    return this._drawsPerWeek;
                };

                item.prototype.setDrawsPerWeek = function(drawsPerWeek) {
                    this._drawsPerWeek = drawsPerWeek;
                };

                item.prototype.setProductsDrawOptions = function(productsDrawOptions) {
                    //debugger;
                    this._productsDrawOptions = productsDrawOptions;
                };

                item.prototype.getProductsDrawOptions = function() {
                    //check what type is single or group
                    var toReturn = [];
                    var self = this;
                    if (this._productType === 1) {

                        angular.forEach(this._productsDrawOptions, function(value, key) {
                            if (value.ProductId === 1 && value.IsSubscription === self._isSubscription) {
                                toReturn = value.MultiDrawOptions;
                            }
                        });

                    } else if (this._productType === 3 || (this._selectedTab === "product" && this._productType === 3)) {
                        angular.forEach(this._productsDrawOptions, function(value, key) {
                            if (value.ProductId === 3 && value.IsSubscription === self._isSubscription) {
                                toReturn = value.MultiDrawOptions;
                            }
                        });
                    } else if (this._selectedTab === "product") {
                        //debugger;

                        var refactoredArray = [];
                        angular.forEach(this._productsDrawOptions, function(value, key) {
                            refactoredArray.push({
                                Discount: 0,
                                NumberOfDraws: value
                            });
                        });

                        return refactoredArray;
                    }

                    return toReturn;
                };

                item.prototype.getProductsSubscriptionOptions = function() {
                    //check what type is single or group
                    var toReturn = [];

                    if (this._productType === 1) {

                        angular.forEach(this._productsDrawOptions, function(value, key) {
                            if (value.ProductId === 1 && value.IsSubscription) {
                                toReturn = value.MultiDrawOptions;
                            }
                        });

                    } else {
                        angular.forEach(this._productsDrawOptions, function(value, key) {
                            if (value.ProductId === 3 && value.IsSubscription) {
                                toReturn = value.MultiDrawOptions;
                            }
                        });
                    }

                    return toReturn;
                };

                item.prototype.setProductExpire = function(productExpire) {
                    // console.log(productExpire);
                    this._productExpire = productExpire;
                };

                item.prototype.getProductExpire = function() {

                    var countDown = this._productExpire[0].exp;
                    var future = new Date(countDown);
                    var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);

                    return diff;
                };

                item.prototype.getNavidadTicket = function() {
                    return this._numbers.split("-");


                };

                item.prototype.setQuantity = function(qty) {
                    this._quantity = qty;
                };

                item.prototype.getQuantity = function() {
                    return this._quantity;
                };

                item.prototype.setTicketsNumbersId = function(ticketsNumbers) {
                    this._ticketsNumbersId = ticketsNumbers;
                };

                item.prototype.getTicketsNumbersId = function() {
                    return this._ticketsNumbersId;
                };

                item.prototype.getTotal = function() {
                    return +parseFloat(this.getTotalCost()).toFixed(2);
                };

                item.prototype.setIsFastProcessing = function(isFastProcessing) {
                    if (typeof(isFastProcessing) === 'undefined') {
                        isFastProcessing = false;
                    }
                    this._isFastProcessing = isFastProcessing;
                };

                item.prototype.getIsFastProcessing = function() {
                    return this._isFastProcessing;
                };

                item.prototype.setIsSubscription = function(isSubscription) {
                    if (typeof(isSubscription) === 'undefined') {
                        isSubscription = false;
                    }
                    this._isSubscription = isSubscription;
                };

                item.prototype.getIsSubscription = function() {
                    return this._isSubscription;
                };

                item.prototype.setIsQuickPick = function(isQuickPick) {
                    if (typeof(isQuickPick) === 'undefined') {
                        isQuickPick = false;
                    }
                    this._isQuickPick = isQuickPick;
                };

                item.prototype.getIsQuickPick = function() {
                    return this._isQuickPick;
                };

                item.prototype.setProductIdSpecial = function(productIdSpecial) {
                    this._productIdSpecial = productIdSpecial;
                }

                item.prototype.getProductIdSpecial = function() {
                    return this._productIdSpecial;
                }

                item.prototype.setGuid = function(guid) {
                    this._guid = guid;
                }

                item.prototype.getGuid = function() {
                    return this._guid;
                }

                item.prototype.toObject = function() {

                    return {
                        id: this.getId(),
                        lines: this.getNumberOfLines(),
                        draws: this.getNumberOfDraws(),
                        // name: this.getName(),
                        // price: this.getPrice(),
                        // quantity: this.getQuantity(),
                        // data: this.getData(),
                        total: this.getTotalCost()
                    }
                };

                function generateUid() {
                    return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                }

                return item;

            }
        ])
        .service('store', [
            '$window', 'CacheFactory',
            function($window, CacheFactory) {

                var dataCache = CacheFactory('cart', {
                    maxAge: 60 * 60 * 1000, // Items added to this cache expire after 60 minutes
                    // cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every 60 minutes
                    deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
                    storageMode: 'localStorage' // This cache will use `localStorage`.
                });

                return {
                    get: function(key) {
                        if (dataCache.get(key)) {
                            var cart = angular.fromJson(dataCache.get(key));
                            return JSON.parse(cart);
                        }
                        //if ($window.localStorage[key]) {
                        //    var cart = angular.fromJson($window.localStorage[key]);
                        //    return JSON.parse(cart);
                        //}
                        return false;

                    },

                    set: function(key, val) {

                        if (val === undefined) {
                            //$window.localStorage.removeItem(key);
                            dataCache.remove(key);
                        } else {
                            dataCache.put(key, angular.toJson(val));
                            //$window.localStorage[key] = angular.toJson(val);
                        }
                        //return $window.localStorage[key];
                        return dataCache.get(key);
                    },

                    emptyCart: function() {
                        CacheFactory.destroy('cart');
                    }
                }
            }
        ])
        .controller('CartController', [
            '$scope', 'ngCart', 'ngDialog', '$controller', '$rootScope', 'ngCart.lottoyard.api', '$location', 'PaymentSystems', 'ngCart.GetCountryByIpService', 'ngCart.translationService',
            function($scope, ngCart, ngDialog, $controller, $rootScope, LottoyardService, $location, PaymentSystems, GetCountryByIpService, translationService) {
                $scope.ngCart = ngCart;
                $scope.isFirstTimePurchase = $rootScope.isFirstTimePurchase;
                $scope.isAuthenticated = $rootScope.isAuthenticated;
                $scope.cartPartialsPath = $rootScope.cartPartialsPath;
                $scope.paymentSystems = PaymentSystems;
                $scope.extraInfo = "creditcard";
                $scope.promoCode = "";
                $scope.creditcard = {};
                $scope.paymentMethodError = false;
                $scope.country_code = '';
                $scope.signup = { mobileNumber: "", firstname: "", lastname: "", email: "", password: "" };
                $scope.terms = false;
                $scope.fastProcessing = ngCart.getIsFastProcessing();
                $scope.section = { selectionPaymentTemplate: "" };
                $scope.country_codes = CountryCodeNames;
                $scope.country_prefixes = CountryCodePrefixes;
                $scope.language = $rootScope.language;
                $scope.redeemCodeOk = false;
                $scope.redeemCodeWrong = false;
                $scope.showFreeTicket = false;
                $scope.hideEmptyCart = false;
                $scope.promoCode = ngCart.getReedemCode();
                var currentYear = new Date().getFullYear();
                var legalAgeOfPlay = currentYear - 18;
                $scope.currentYear = currentYear;
                $scope.creditCardExpirationYears = new Array(11).join().split(',').map(function(item, index) { return (index === 0 ? $scope.currentYear : ++$scope.currentYear); });
                $scope.creditCardExpirationMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                $scope.birthdayYears = new Array(90).join().split(',').map(function(item, index) { return (legalAgeOfPlay - index); });
                $scope.user = {};
                $scope.user.birthday = {};
                $scope.user.birthday.day = 1;
                $scope.user.birthday.month = $scope.creditCardExpirationMonths[0];
                $scope.user.birthday.year = $scope.birthdayYears[0];
                $scope.daysInMonth = makeArrayOfNumbers(daysInMonth(1, currentYear));
                $scope.toShowAddressFields = false;

                $scope.$watch(function() {
                    return $rootScope.progress;
                }, function() {
                    $scope.progress = $rootScope.progress;
                }, true);

                if ($scope.isAuthenticated && $scope.isFirstTimePurchase) {
                    $scope.showFreeTicket = true;
                    $scope.hideEmptyCart = true;
                } else if ($scope.isAuthenticated && !$scope.isFirstTimePurchase) {
                    $scope.showFreeTicket = false;
                    $scope.hideEmptyCart = false;
                } else {
                    $scope.showFreeTicket = true;
                    $scope.hideEmptyCart = true;
                }

                if (typeof $rootScope.language === 'undefined' || $rootScope.language === '') {
                    $rootScope.language = 'en';
                }

                //console.log('lang:', $rootScope.language);

                if (!$scope.isAuthenticated) {
                    clearPersonalInfo();
                }

                translationService.getTranslation($scope, $rootScope.language);

                $scope.redirectToCart = function($event) {
                    $event.preventDefault();
                    window.location = ($scope.language !== "en") ? "/" + $scope.language + '/cart/' : "/cart/";
                }

                $scope.redirectToPlayPageTopJackpot = function() {
                    window.location = CONFIG.homeURL + '/' + $rootScope.topJacktop.LotteryName.toLowerCase() + '-lottery/';
                }

                $scope.initCart = function() {
                    if ($scope.isAuthenticated) {

                        if (ngCart.getItems().length > 0) {
                            var mapper = new Mapper(ngCart.getCart());
                            var mappedItems = mapper.inputCart.items;
                            console.log(mappedItems);
                            var data = mapper.PrepareOrder();

                            LottoyardService.prepareOrder(data).then(function(resp) {
                                prepareOrderResponse(resp);
                                // debugger;
                                if (ngCart.getTotalItems() > 0 && $scope.isAuthenticated && ngCart.getIframePaymentMethods().length === 0) {
                                    $scope.section.selectionPaymentTemplate = 'new';
                                } else if (ngCart.getTotalItems() > 0 && $scope.isAuthenticated && ngCart.getIframePaymentMethods().length > 0) {
                                    $scope.section.selectionPaymentTemplate = 'exist';
                                }
                            });
                        }
                    } else {
                        if (ngCart.getTotalItems() > 0 && !$scope.isAuthenticated) {
                            $scope.section.selectionPaymentTemplate = 'signup';
                        }
                    }
                };

                $scope.removeItem = function(itemId) {
                    //debugger;
                    var item = itemId;
                    if (typeof itemId !== "object") {
                        item = ngCart.getItemById(itemId);
                    }

                    if ((typeof item === "object") && (item !== null)) {
                        var guid = item.getGuid();
                        if (typeof guid !== 'undefined') {
                            var items = ngCart.getItems();
                            var itemToRemove = [];
                            angular.forEach(items, function(item) {
                                if (item.getGuid() === guid) {
                                    itemToRemove.push(item.getId());
                                }
                            });
                            for (var i = 0; i < itemToRemove.length; i++) {
                                ngCart.removeItemById(itemToRemove[i]);
                            }
                        } else {
                            ngCart.removeItemById(item.getId());
                        }
                    }
                    $scope.initCart();
                };

                $scope.initSignUp = function() {
                    //console.log('init');

                    for (var i = 0; i < $scope.country_codes.length; i++) {
                        if ($scope.country_codes[i].code === CONFIG.countryCode) {
                            $scope.country_code = $scope.country_codes[i];
                            var code = $scope.country_codes[i].code;
                            $scope.signup.MobileNumber = $scope.country_prefixes[code];
                            break;
                        }
                    }
                    /*GetCountryByIpService.getCountryCodeByIp().then(function (data) {
                     $scope.signup.mobileNumber = $scope.country_prefixes[data];
                     $scope.$ = CountryCodeNames.filter(function (v) { return v.code === data })[0];
                     });*/
                };

                $scope.setPrefix = function(code) {
                    $scope.signup.MobileNumber = $scope.country_prefixes[code];
                };

                $scope.beforeCheckOutCall = beforeCheckOutCall;

                $scope.editPaymentMethods = function() {
                    $scope.creditCardError = false;
                    $scope.section.selectionPaymentTemplate = 'new';
                };

                $scope.signin = function($event, user) {
                    //debugger;
                    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    $event.preventDefault();
                    if (typeof(user) === 'undefined' || user === "") {
                        $scope.signinError = true;
                        $scope.errorText = "Email and Password should not be empty.";
                        return;
                    } else if (typeof(user.email) === 'undefined') {
                        $scope.signinError = true;
                        $scope.errorText = "Email should not be empty";
                        return;
                    } else if (!emailReg.test(user.email)) {
                        $scope.signinError = true;
                        $scope.errorText = "Email is not valid.";
                        return;
                    } else if (typeof(user.password) === 'undefined' || user.password === "") {
                        $scope.signinError = true;
                        $scope.errorText = "Password should not be empty.";
                        return;
                    }

                    $scope.signinError = false;
                    $scope.errorText = "";

                    LottoyardService.signIn(user).then(function(resp) {
                        if (resp.error_msg === 'Login failed') {
                            $scope.signinError = true;
                            $scope.errorText = "Email and Password miss match or does not exists.";
                        } else {
                            clearPersonalInfo();

                            //GTM functions for tracking.
                            // GTM_login(resp.MemberId);
                            window.location.reload();
                            // window.location.href = $rootScope.cartUrlWithLang + "?sessionId=" + resp.UserSessionId + "&bta=" + $rootScope.affiliateId;
                        }
                    });
                }

                $scope.forgotpass = function($event, user) {

                    $event.preventDefault();


                    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


                    if (typeof(user) === 'undefined' || user.forgotemail === '' || !user.forgotemail) {
                        $scope.signinError = true;
                        $scope.errorText = "Email address should not be empty";
                        return;
                    } else if (!emailReg.test(user.forgotemail)) {
                        $scope.signinError = true;
                        $scope.errorText = "Email is not valid.";
                        return;
                    }

                    $scope.signinError = false;
                    $scope.errorText = "";

                    LottoyardService.forgotPass(user).then(function(resp) {
                        //debugger;
                        //console.log('TUKA SME ' + resp);
                        if (resp.error_msg === "We cannot send you the password") {
                            $scope.signinError = true;
                            $scope.errorText = resp.error_msg;
                        } else if (resp.error_msg === 'Email not found') {
                            $scope.signinError = true;
                            $scope.errorText = resp.error_msg;
                        } else {
                            $scope.signinError = true;
                            $scope.errorText = resp.msg;
                            clearPersonalInfo();
                            /*
                             setTimeout(function() {
                             window.location = CONFIG.homeURL;
                             }, 500);
                             */
                        }
                    });
                }

                $scope.signUp = function($event, user) {
                    // debugger;
                    $scope.signupErrorText = [];
                    $event.preventDefault();
                    if (typeof(user) === 'undefined') {
                        $scope.signupError = true;
                        $scope.signupErrorText.push("Error");
                        return;
                    }
                    if (user.firstname === "") {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "First name should not be empty" });
                        return;
                    }
                    if (user.laststname === "") {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Last name should not be empty" });
                        return;
                    }
                    if (user.firstname.length < 2 || user.firstname.length > 20) {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Name must not include numbers and be 2-20 characters." });
                        return;
                    }
                    if (user.lastname.length < 2 || user.lastname.length > 20) {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Name must not include numbers and be 2-20 characters." });
                        return;
                    }
                    if (user.email === "") {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "'Email' should not be empty" });
                        return;
                    }
                    if (user.password === "") {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Password should not be empty" });
                        return false;
                    }
                    if (user.password.length < 7 || user.password.length > 20) {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Password length should be 7 to 20 characters" });
                        return false;
                    }

                    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    if (!emailReg.test(user.email)) {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Invalid Email format" });
                        return;
                    }

                    if (user.MobileNumber === '' || typeof(user.MobileNumber) === 'undefined') {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Phone should not be empty" });
                        return;
                    }

                    var phoneReg = /^\+?[0-9 \-()]{6,25}$/;
                    if (!phoneReg.test(jQuery.trim(user.MobileNumber))) {
                        $scope.signupError = true;
                        $scope.signupErrorText.push({ ErrorMessage: "Phone number is not valid" });
                        return;
                    }

                    // if(!user.terms){
                    //     $scope.signupError = true;
                    //     $scope.signupErrorText.push({ ErrorMessage: "Please agree with our Terms and Conditions!" });
                    //     return;
                    // }

                    $scope.signupError = false;

                    /*var splitedName = user.fullname.split(' ');
                     user.firstName = splitedName[0];
                     if (splitedName.length > 1) {
                     user.lastName = splitedName.slice(1).join(' ');
                     }*/

                    user.AffiliateId = $rootScope.affiliateId;
                    if (!$scope.signupError) {
                        jQuery('.hidesigninloader').show();
                        LottoyardService.signUp(user).then(function(resp) {
                            jQuery('.hidesigninloader').hide();
                            //console.log(resp);
                            //var resp = JSON.parse(response);
                            //debugger;

                            if (typeof(resp.Result) !== 'undefined' && typeof(resp.Result.UserSessionId) !== 'undefined') {
                                clearPersonalInfo();
                                // sessionStorage.setItem('firepixel', 'https://go.icelotto.com/dynamicpixels/LeadRegistered/?userId=' + resp.MemberId + '&IsoCountry=' + resp.isoCountry);

                                //GTM functions for tracking.
                                // GTM_signup(resp.MemberId);
                                window.location.reload();
                                // window.location.href = $rootScope.cartUrlWithLang + "?sessionId=" + resp.UserSessionId + "&bta=" + $rootScope.affiliateId;
                            } else {
                                $scope.signupError = true;

                                var err = { ErrorMessage: resp.error_msg };
                                $scope.signupErrorText.push(err);
                            }
                        });
                    }
                }

                $scope.paymentSelect = function(payment) {
                    //debugger;
                    console.log(payment);

                    ngCart.setProcessor(payment.processor);

                    if (payment.needmoreinfo) {
                        //load div

                        if ((ngCart.getAmountToPay() < 2) && (payment.name != "creditcard")) {
                            paymentSelect();
                        }
                        $scope.extraInfo = payment.name;
                        return;
                    }
                    paymentSelect();
                }

                $scope.paymentSelectMoreInfo = function($event, phoneOrEmail) {
                    $event.preventDefault();
                    // debugger;
                    console.log(phoneOrEmail);
                    ngCart.setPhoneOrEmail(phoneOrEmail);

                    paymentSelect();

                }
                $scope.checkPayment = function(payment, event, phoneOrEmail) {
                    if (payment.name == 'neteller') {
                        // debugger;
                        ngCart.setProcessor("neteller");
                        $scope.paymentSelectMoreInfo(event, phoneOrEmail)
                    }
                }

                $scope.submitOrderNewCreditCard = function(creditcard, user) {
                    $scope.creditCardError = [];
                    $scope.creditCard = false

                    if (typeof(creditcard.CardHolderName) === 'undefined' || creditcard.CardHolderName.length < 2) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please type your full name" });
                        return;
                    }

                    if (typeof(creditcard) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Enter credit card" });
                        return;
                    }

                    if (typeof(creditcard.CreditCardNumber) === 'undefined' || creditcard.CreditCardNumber.length == 0) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert credit card number." });
                        return;
                    }
                    if (creditcard.CreditCardNumber.length < 10) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Credit card number length is invalid" });
                        return;
                    }
                    if (typeof(creditcard.expiration) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Date" });
                        return;
                    }
                    if (typeof(creditcard.expiration.year) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Year" });
                        return;
                    }
                    if (typeof(creditcard.expiration.month) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Month" });
                        return;
                    }
                    if (typeof(creditcard.Cvv) === 'undefined' || creditcard.Cvv.length < 3) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert your cvv number" });
                        return;
                    }

                    if (!user.city) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please enter city." });
                        return;
                    }

                    if (!user.address) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please enter address." });
                        return;
                    }

                    if (!user.postalCode) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please enter postal code." });
                        return;
                    }

                    if (!creditcard.terms) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please agree with our Terms and Conditions!" });
                        return;
                    }

                    var lastDay = new Date(parseInt(creditcard.expiration.year), parseInt(creditcard.expiration.month), 0).getDate();
                    var expirationDate = creditcard.expiration.year + "-" + creditcard.expiration.month + "-" + lastDay;

                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    var creditCardDate = new Date(expirationDate);
                    creditCardDate.setHours(0, 0, 0, 0);

                    if (creditCardDate < today) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please enter valid card expiration date!" });
                        return;
                    }

                    var datastring = "action=lottery_data&m=userinfo/update-personal-details" +
                        '&city=' + user.city +
                        '&address=' + user.address +
                        '&zipcode=' + user.postalCode;

                    jQuery.ajax({
                        type: "POST",
                        url: CONFIG.adminURL,
                        data: datastring,
                        dataType: 'json',
                        success: function(data) {
                            var creditCardForSend = {
                                CardHolderName: creditcard.CardHolderName,
                                CreditCardNumber: creditcard.CreditCardNumber,
                                Cvv: creditcard.Cvv,
                                ExpirationDate: expirationDate
                            };

                            ngCart.setProcessor("CreditCard");

                            var mapper = new Mapper(ngCart.getCart(), creditCardForSend);
                            var data = mapper.ConfirmOrder();

                            LottoyardService.submitOrder(data).then(function(resp) {
                                console.log(resp);
                                if (resp && resp.IsSuccess) {
                                    window.location = '/thankyou/' + resp.Pmc + "/";
                                } else {
                                    $('#middle').removeClass('loading');
                                    $scope.creditCard = true;
                                    $scope.creditCardError.push({ ErrorMessage: resp.error_msg });
                                    return;
                                }
                            });
                        }
                    });
                }

                $scope.submitOrder = function(selectedMethod, terms) {
                    //debugger;
                    if (!terms) {
                        $scope.paymentMethodError = true;
                        $scope.paymentMethodErrorText = "Please agree with our Terms and Conditions!";
                        return;
                    }
                    if (typeof(selectedMethod) === 'undefined' || selectedMethod.MethodId === '') {
                        $scope.paymentMethodError = true;
                        $scope.paymentMethodErrorText = "Please select a payment method!";
                        return;
                    }

                    if (ngCart.getItems().length === 0) {
                        return;
                    }

                    console.log('submit order', ngCart);

                    var mapper = new Mapper(ngCart.getCart(), "");
                    var data = mapper.ConfirmOrder();

                    console.log(data);

                    LottoyardService.submitOrder(data).then(function(resp) {
                        console.log(resp);
                        //debugger;
                        $scope.creditCardError = [];
                        $scope.paymentMethodError = false;
                        if (resp.IsSuccess) {
                            if (ngCart.getProcessor() !== 'CreditCard') {
                                if (resp.StatusCode === 0) {
                                    $("#hiddenclicker").attr("href", resp.Url);
                                    $("#hiddenclicker").fancybox({
                                        'width': '95%',
                                        'height': '95%',
                                        'autoScale': true,
                                        'transitionIn': 'elastic',
                                        'transitionOut': 'elastic',
                                        'speedIn': 600,
                                        'speedOut': 200,
                                        'type': 'iframe'
                                    }).trigger("click");
                                } else {
                                    $scope.creditCard = true;
                                    $scope.creditCardError.push({ ErrorMessage: resp.error_msg });
                                }
                            } else {
                                window.location = '/thankyou/' + resp.Pmc + "/";
                            }
                        } else {
                            $('#middle').removeClass('loading');
                            if (resp.StatusCode === 0) {
                                $("#hiddenclicker").attr("href", resp.Url);
                                $("#hiddenclicker").fancybox({
                                    'width': '95%',
                                    'height': '95%',
                                    'autoScale': true,
                                    'transitionIn': 'elastic',
                                    'transitionOut': 'elastic',
                                    'speedIn': 600,
                                    'speedOut': 200,
                                    'type': 'iframe'
                                }).trigger("click");
                            } else {
                                $scope.creditCard = true;
                                $scope.creditCardError.push({ ErrorMessage: resp.error_msg });
                            }
                        }
                    });
                }

                $scope.paymentMethodSelected = function paymentMethodSelected(_methodId, _processor) {
                    if (typeof(_methodId) !== 'undefined' && typeof(_processor) !== 'undefined') {
                        ngCart.setPaymentMethodId(_methodId);
                        ngCart.setProcessor(_processor);

                        $rootScope.$broadcast('ngCart:change', {});
                        console.log('methodId', _methodId);
                    }
                }

                $scope.subscriptionChanged = function(_id) {
                    //debugger;
                    var item = ngCart.getItemById(_id);
                    if (item.getIsSubscription()) {
                        item.setIsSubscription(false);
                    } else {
                        item.setIsSubscription(true);
                    }

                    $rootScope.$broadcast('ngCart:change', {});

                    $scope.$broadcast('ngCart:itemSubscriptionChanged', { itemid: _id });

                    console.log(ngCart);
                }

                $scope.fastProcessingChanged = function() {
                    ngCart.setIsFastProcessing(!ngCart.getIsFastProcessing());
                    $scope.fastProcessing = ngCart.getIsFastProcessing();
                    var items = ngCart.getItems();
                    angular.forEach(items, function(item) {

                        item.setIsFastProcessing(ngCart.getIsFastProcessing());
                        if (ngCart.getIsFastProcessing()) {
                            item.setTotalCost(item.getTotalCost() + ngCart.getFastProcessingTax());
                            if (ngCart.getAmountToPay() > 0) {
                                ngCart.setAmountToPay(ngCart.getAmountToPay() + ngCart.getFastProcessingTax());
                            }
                        } else {
                            item.setTotalCost(item.getTotalCost() - ngCart.getFastProcessingTax());
                            if (ngCart.getAmountToPay() > 0) {
                                ngCart.setAmountToPay(ngCart.getAmountToPay() - ngCart.getFastProcessingTax());
                            }
                        }
                    });

                    $rootScope.$broadcast('ngCart:change', {});
                    console.log(ngCart);
                }

                $scope.beforeCheckout = function($event) {
                    $event.preventDefault();

                    console.log('before checkout');
                    //debugger;
                    beforeCheckOutCall();

                    window.location = $rootScope.cartUrlWithLang;

                }

                $scope.getRandomInt = getRandomInt;

                $scope.addQuantity = function addQuantity(item) {
                    //debugger;
                    if (item.getQuantity() < 1) {
                        return;
                    }
                    if ($scope.isAuthenticated) {
                        $('.linesdraws.lines').addClass('loading');
                    }
                    item.setQuantity(item.getQuantity() + 1); //service.getProductPriceById = function (productId, draws, lotteryType

                    var priceForDraws = LottoyardService.getProductPriceById(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType()).Price;
                    var price = priceForDraws * item.getQuantity();
                    var discount = 0;

                    item.setTotalCost(price - discount);
                    //discounts
                    item.setTotalDiscount();

                    $scope.initCart();
                    console.log(ngCart.getAmountToPay());
                    //$rootScope.$broadcast('ngCart:change', {});
                }

                $scope.removeQuantity = function removeQuantity(item) {
                    if (item.getQuantity() <= 1) {
                        return;
                    }
                    if ($scope.isAuthenticated) {
                        $('.linesdraws.lines').addClass('loading');
                    }
                    item.setQuantity(item.getQuantity() - 1);

                    var priceForDraws = LottoyardService.getProductPriceById(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType()).Price;
                    var price = priceForDraws * item.getQuantity();
                    var discount = 0;

                    //var price = parseFloat(item.getOriginalPrice() * item.getQuantity() * item.getNumberOfDraws()).toFixed(2);
                    //var discount = parseFloat(price * item.getDiscount()).toFixed(2);

                    item.setTotalCost(price - discount);
                    //discounts
                    item.setTotalDiscount();

                    $scope.initCart();

                    // $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.addShare = function addShare(item) {
                    // debugger;
                    if (item.getGroupnoshares() < 150) {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.lines').addClass('loading');
                        }
                        var currentShares = item.getGroupnoshares();

                        item.setGroupnoshares(currentShares + 1);
                        //calculate price

                        var data = LottoyardService.getProductPriceById(item.getProductType(), item.getGroupnodraws(), item.getLotteryType());

                        if (item.getGroupdiscount() > 0) {
                            var price = item.getGroupnoshares() * (data.Price + ((data.Price / (1 - item.getGroupdiscount())) * item.getGroupdiscount()));
                            var discount = item.getGroupdiscount() * price;
                        } else {
                            var price = item.getGroupnoshares() * data.Price;
                            var discount = item.getGroupdiscount() * price;
                        }

                        //var price = data.Price * item.getGroupnoshares();

                        //var discount = parseFloat(price * item.getGroupdiscount()).toFixed(2);

                        item.setTotalCost(price - discount);

                        item.setTotalDiscount();
                    }

                    $scope.initCart();
                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.removeShare = function removeShare(item) {
                    //debugger;
                    if (item.getGroupnoshares() > 1) {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.lines').addClass('loading');
                        }
                        var currentShares = item.getGroupnoshares();
                        item.setGroupnoshares(currentShares - 1);
                        //calculate price
                        var data = LottoyardService.getProductPriceById(item.getProductType(), item.getGroupnodraws(), item.getLotteryType());

                        if (item.getGroupdiscount() > 0) {
                            var price = item.getGroupnoshares() * (data.Price + ((data.Price / (1 - item.getGroupdiscount())) * item.getGroupdiscount()));
                            var discount = item.getGroupdiscount() * price;
                        } else {
                            var price = item.getGroupnoshares() * data.Price;
                            var discount = item.getGroupdiscount() * price;
                        }

                        //var price = data.Price * item.getGroupnoshares();

                        //var discount = parseFloat(price * item.getGroupdiscount()).toFixed(2);

                        item.setTotalCost(price - discount);

                        //discounts
                        item.setTotalDiscount(discount);
                    }

                    $scope.initCart();

                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.initpopuppromo = function(promo) {
                    if (promo) {
                        $scope.promoactive = true;
                    }
                }

                $scope.addLine = function addLine(item) {
                    //debugger;
                    console.log(item);
                    if (item.getMaxLines() > item.getNumberOfLines()) {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.lines').addClass('loading');
                        }
                        //generate random numbers
                        var generatedNumbers = [];
                        var generatedExtraNumbers = [];
                        var maxSelectNumber = item.getSelectNumbers();
                        var minSelectNumber = item.getMinSelectNumbers();
                        var minSelectExtraNumber = item.getExtraNumbers();
                        var maxSelectExtraNumber = item.getMaxExtraNumbers();

                        var itemToGenerate = item.getMaxSelectNumbers();

                        while (generatedNumbers.length < itemToGenerate) {
                            var randomnumber = getRandomInt(minSelectNumber, maxSelectNumber);
                            var found = false;
                            for (var k = 0; k < generatedNumbers.length; k++) {
                                if (generatedNumbers[k] === randomnumber) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) generatedNumbers[generatedNumbers.length] = randomnumber;
                        }

                        console.log('generatedNumbers', generatedNumbers);

                        //check if there are special numbers

                        //this is elgordo special numebr must be same
                        if (item.getLotteryType() === 10) {
                            var getFirstLine = item.getNumbersSantized()[0];
                            generatedExtraNumbers.push(getFirstLine.split('#')[1]);
                        } else {

                            if (item.getMaxExtraNumbers() > 0) {
                                var extraNumbersToGenerate = item.getMaxExtraNumbers();

                                while (generatedExtraNumbers.length < extraNumbersToGenerate) {
                                    var randomnumber = getRandomInt(minSelectExtraNumber, maxSelectExtraNumber);
                                    var found = false;
                                    for (var k = 0; k < generatedExtraNumbers.length; k++) {
                                        if (generatedExtraNumbers[k] === randomnumber) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) generatedExtraNumbers[generatedExtraNumbers.length] = randomnumber;
                                }

                            }

                            console.log('generatedExtraNumbers', generatedExtraNumbers);
                        }
                        //store it to item

                        var newLinesToStore = item.getNumbers() + '|' + generatedNumbers.join(',');

                        if (generatedExtraNumbers.length > 0) {
                            newLinesToStore += '#' + generatedExtraNumbers.join(',');
                        }

                        console.log('newLinesToStore', newLinesToStore);
                        item.setNumberOfLines(item.getNumberOfLines() + 1);
                        //if is navidad - ignore it
                        if (item.getProductType() !== 15) {
                            item.setNumbers(newLinesToStore);
                            item.setNumbersSantized(newLinesToStore);
                        }

                        console.log(ngCart);
                        //calcualte prices
                        var data = LottoyardService.getProductPriceByIds(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), item.getNumberOfLines());

                        if (item.getDiscount() > 0) {
                            var price = data.Price + ((data.Price / (1 - item.getDiscount())) * item.getDiscount());
                            var discount = item.getDiscount() * price;
                        } else {
                            var price = data.Price;
                            var discount = item.getDiscount() * price;
                        }

                        item.setTotalCost(price - discount);
                        //discounts
                        item.setTotalDiscount();
                    }

                    console.log(item)
                    if (item.getEvenLinesOnly() && item.getNumberOfLinesOrShares() % 2 !== 0) {
                        console.log("inside");
                        addLine(item);
                    }

                    $scope.initCart();

                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.removeLine = function removeLine(item) {
                    //debugger;
                    if (item.getMinLines() !== item.getNumberOfLines()) {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.lines').addClass('loading');
                        }
                        item.setNumberOfLines(item.getNumberOfLines() - 1);

                        item.removeLastLine();

                        //calculate prices

                        var data = LottoyardService.getProductPriceByIds(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), item.getNumberOfLines());

                        if (item.getDiscount() > 0) {
                            var price = data.Price + ((data.Price / (1 - item.getDiscount())) * item.getDiscount());
                            var discount = item.getDiscount() * price;
                        } else {
                            var price = data.Price;
                            var discount = item.getDiscount() * price;
                        }


                        //var price = parseFloat(item.getOriginalPrice() * item.getNumberOfLines() * parseInt(item.getNumberOfDraws())).toFixed(2);
                        //var discount = parseFloat(price * item.getDiscount()).toFixed(2);
                        item.setTotalCost(price - discount);
                    }
                    if (item.getEvenLinesOnly() && item.getNumberOfLinesOrShares() % 2 !== 0) {
                        console.log("inside");
                        removeLine(item);
                    }

                    $scope.initCart();

                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.addDraw = function(item) {
                    //debugger;
                    var drawOptions = item.getProductsDrawOptions();

                    var currentDraw = 0;
                    if (item.getProductType() === 3) {
                        currentDraw = item.getGroupnodraws();
                    } else {
                        currentDraw = item.getNumberOfDraws();
                    }

                    var nextDraws = drawOptions.filter(function(obj) {
                        if ('NumberOfDraws' in obj && typeof(obj.NumberOfDraws) === 'number' && !isNaN(obj.NumberOfDraws) && obj.NumberOfDraws > currentDraw) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var nextDraw = nextDraws[0];
                    addDraw(item, nextDraw);
                }

                $scope.removeDraw = function removeDraw(item) {
                    //debugger;
                    var drawOptionsNormal = item.getProductsDrawOptions();
                    var drawOptions = cleanArray(reverse(drawOptionsNormal));

                    var currentDraw = 0;

                    if (item.getSelectedTab() === "groupselection" || item.getProductType() === 3) {

                        currentDraw = item.getGroupnodraws();
                    } else {

                        currentDraw = item.getNumberOfDraws();
                    }

                    var nextDraws = drawOptions.filter(function(obj) {
                        if ('NumberOfDraws' in obj && typeof(obj.NumberOfDraws) === 'number' && !isNaN(obj.NumberOfDraws) && obj.NumberOfDraws < currentDraw) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (nextDraws.length > 1) {
                        nextDraws = nextDraws.sort(dynamicSortDescending('NumberOfDraws'));
                    }
                    var nextDraw = nextDraws[0];

                    if (typeof nextDraw !== 'undefined' && typeof(nextDraw.MinLines) !== 'undefined' && typeof(nextDraw.MaxLines) !== 'undefined') {
                        item.setMinLines(nextDraw.MinLines);
                        item.setMaxLines(nextDraw.MaxLines);
                    }

                    if (item.getProductType() !== 3) {
                        if (item.getMinLines() > item.getNumberOfLines()) {
                            console.log('generating new lines - remove draw');
                            while (item.getMinLines() > item.getNumberOfLines()) {
                                $scope.addLine(item);
                            }
                        }
                    }

                    if (typeof nextDraw !== 'undefined') {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.draws').addClass('loading');
                        }
                        var price = 0;
                        var discount = 0;

                        if (item.getProductType() === 3) {
                            item.setGroupnodraws(nextDraw.NumberOfDraws);

                            var data = LottoyardService.getProductPriceById(item.getProductType(), nextDraw.NumberOfDraws, item.getLotteryType());

                            if (nextDraw.Discount > 0) {
                                price = item.getGroupnoshares() * (data.Price + ((data.Price / (1 - nextDraw.Discount)) * nextDraw.Discount));
                                discount = nextDraw.Discount * price;
                            } else {
                                price = item.getGroupnoshares() * data.Price;
                                discount = nextDraw.Discount * data.Price;
                            }

                            item.setGroupdiscount(nextDraw.Discount);

                        } else if (item.getProductType() === 2 || item.getProductType() === 4 || item.getProductType() === 14) {
                            //productId, draws, lotteryType
                            item.setNumberOfDraws(nextDraw.NumberOfDraws);

                            var data = LottoyardService.getProductPriceById(item.getProductType(), nextDraw.NumberOfDraws, item.getLotteryType());

                            price = data.Price * item.getQuantity();
                            discount = 0;

                            item.setDiscount(nextDraw.Discount);

                        } else if (item.getProductType() === 1) {
                            item.setNumberOfDraws(nextDraw.NumberOfDraws);

                            var data = LottoyardService.getProductPriceByIds(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), item.getNumberOfLines());

                            if (nextDraw.Discount > 0) {
                                var price = data.Price + ((data.Price / (1 - nextDraw.Discount)) * nextDraw.Discount);
                                var discount = nextDraw.Discount * price;
                            } else {
                                var price = data.Price;
                                var discount = nextDraw.Discount * price;
                            }
                            item.setDiscount(nextDraw.Discount);
                        }

                        item.setTotalCost(price - discount);
                        item.setTotalDiscount(discount);
                        $scope.initCart();

                        $rootScope.$broadcast('ngCart:change', {});
                    }
                }

                $scope.addShareNavidad = function(item) {
                    //debugger;
                    if (item.getMaxLines() > item.getNumberOfLines()) {

                        item.setNumberOfLines(item.getNumberOfLines() + 1);
                        var price = item.getNumberOfLines() * item.getOriginalPrice();
                        var discount = item.getDiscount() * price;

                        item.setTotalCost(price - discount);

                        $scope.initCart();

                        $rootScope.$broadcast('ngCart:change', {});
                    }
                }

                $scope.removeShareNavidad = function(item) {
                    // debugger;
                    if (item.getMinLines() !== item.getNumberOfLines()) {
                        item.setNumberOfLines(item.getNumberOfLines() - 1);

                        var price = item.getNumberOfLines() * item.getOriginalPrice();
                        var discount = item.getDiscount() * price;

                        item.setTotalCost(price - discount);
                    }

                    $scope.initCart();

                    $rootScope.$broadcast('ngCart:change', {});
                }

                $scope.editLine = function editLine(index, item) {

                    ngDialog.open({
                        template: $scope.cartPartialsPath + 'ngCart/addnumbers.html',
                        scope: $scope,
                        controller: $controller('someCtrl', {
                            $scope: $scope,
                            item: item,
                            line: index
                        })
                    });

                    console.log(index, " ", item);
                }

                $scope.popuppromo = function() {
                    if ($scope.promoactive !== true) {
                        $scope.promoactive = true;
                    } else {
                        $scope.promoactive = false;
                    }
                }

                $scope.promoCodeValidator = function($event) {

                    var key = $event.charCode || $event.keyCode || 0;
                    // Auto-format- do not expose the mask as the user begins to type
                    if (key !== 8 && key !== 9) {

                        if (typeof($scope.promoCode) !== 'undefined' && $scope.promoCode !== null && $scope.promoCode.length === 3) {
                            $scope.promoCode += '-';
                        }
                        if (typeof($scope.promoCode) !== 'undefined' && $scope.promoCode !== null && $scope.promoCode.length === 7) {
                            $scope.promoCode += '-';
                        }
                    }
                }

                $scope.showDetail = function(_id) {
                    if ($scope.active !== _id) {
                        $scope.active = _id;
                    } else {
                        $scope.active = null;
                    }
                };

                $scope.showthetooltip = function(_id) {
                    if ($scope.tooltipshown !== _id) {
                        $scope.tooltipshown = _id;
                    } else {
                        $scope.tooltipshown = null;
                    }
                };

                $scope.hidethetooltip = function(_id) {
                    $scope.tooltipshown = null;
                };

                $scope.showtooltipcart = function(_id) {
                    if ($scope.tooltipcart !== _id) {
                        $scope.tooltipcart = _id;
                    } else {
                        $scope.tooltipcart = null;
                    }
                };

                $scope.hidetooltipcart = function(_id) {
                    $scope.tooltipcart = null;
                };

                $scope.showtooltippay = function(_id) {
                    if ($scope.paycart !== _id) {
                        $scope.paycart = _id;
                    } else {
                        $scope.paycart = null;
                    }
                };

                $scope.hidetooltippay = function(_id) {
                    $scope.paycart = null;
                };

                $scope.submitPromoCode = function($event, promoCode) {
                    $event.preventDefault();
                    // debugger;
                    //$scope.promoCode = null;
                    ngCart.setReedemCode(promoCode);
                    beforeCheckOutCall();
                }

                $scope.removePromoCode = function() {
                    ngCart.setReedemCode("");
                    beforeCheckOutCall();
                    $scope.popuppromo();
                }

                //events
                $scope.$on('ngCart:itemSubscriptionChanged', function(event, data) {
                    //debugger;
                    //get item
                    var item = ngCart.getItemById(data.itemid);
                    //get draw option
                    var drawOptions = item.getProductsDrawOptions();

                    //get current draw
                    var currentDraw = 0;
                    if (item.getSelectedTab() === 'groupselection' || item.getProductType() === 3) {
                        currentDraw = item.getGroupnodraws();
                    } else {
                        currentDraw = item.getNumberOfDraws();
                    }
                    //get nearest draw option in new subscription type
                    var drawOnlyArray = [];
                    angular.forEach(drawOptions, function(item) {
                        drawOnlyArray.push(item.NumberOfDraws);
                    });

                    var nextDrawOnly = closest(currentDraw, drawOnlyArray);

                    var nextDraw = drawOptions.filter(function(value) {
                        if (value.NumberOfDraws === nextDrawOnly) {
                            return true;
                        }
                    });

                    addDraw(item, nextDraw[0]);
                    console.log(data);
                });

                //private function

                function prepareOrderResponse(resp) {
                    ngCart.setIframePaymentMethods(resp.IframePaymentMethods);
                    //setting up default method id for drop down
                    if (resp.IframePaymentMethods.length > 0) {
                        //debugger;
                        $scope.selectedmethod = resp.IframePaymentMethods[0];
                        ngCart.setPaymentMethodId(resp.IframePaymentMethods[0].MethodId);
                        ngCart.setProcessor(resp.IframePaymentMethods[0].Processor);
                    }

                    // console.log('prepare oreder response:', resp);
                    var totalAmount = ngCart.totalCost();
                    if (totalAmount !== resp.AmountToPay) {
                        ngCart.setAmountToPay(resp.AmountToPay);
                        // console.log("warning prices missmatch!");
                    } else {
                        ngCart.setAmountToPay(ngCart.totalCost());
                    }

                    //setting ReedemBonusAmount
                    ngCart.setReedemBonusAmount(resp.ReedemBonusAmount);
                    if (resp.ReedemBonusAmount > 0) {
                        $scope.redeemCodeOk = true;
                        $scope.redeemCodeWrong = false;

                    } else {
                        $scope.redeemCodeWrong = true;
                        $scope.redeemCodeOk = false;
                    }

                    $rootScope.$broadcast('ngCart:change', {});
                    // console.log(ngCart);
                }

                function clearPersonalInfo() {
                    ngCart.setAmountToPay(0);
                    ngCart.setIframePaymentMethods(null);
                    ngCart.setIsFastProcessing(false);
                    ngCart.setPaymentMethodId(null);
                    ngCart.setPhoneOrEmail(null);
                    ngCart.setProcessor(null);

                    $rootScope.$broadcast('ngCart:change', {});
                };

                function closest(num, arr) {
                    var curr = arr[0];
                    var diff = Math.abs(num - curr);
                    for (var val = 0; val < arr.length; val++) {
                        var newdiff = Math.abs(num - arr[val]);
                        if (newdiff < diff) {
                            diff = newdiff;
                            curr = arr[val];
                        }
                    }
                    return curr;
                }

                function addDraw(item, nextDraw) {
                    //debugger;
                    if (typeof nextDraw !== 'undefined') {
                        if ($scope.isAuthenticated) {
                            $('.linesdraws.draws').addClass('loading');
                        }
                        //debugger;
                        var price = 0;
                        var discount = 0;
                        if (item.getSelectedTab() === "groupselection" || item.getProductType() === 3) {
                            item.setGroupnodraws(nextDraw.NumberOfDraws);
                            //calculate price
                            //debugger;

                            var data = LottoyardService.getProductPriceById(item.getProductType(), nextDraw.NumberOfDraws, item.getLotteryType());
                            // debugger;
                            if (nextDraw.Discount > 0) {
                                price = item.getGroupnoshares() * (data.Price + ((data.Price / (1 - nextDraw.Discount)) * nextDraw.Discount));
                                discount = nextDraw.Discount * price;
                            } else {
                                price = item.getGroupnoshares() * data.Price;
                                discount = nextDraw.Discount * price;
                            }

                            item.setGroupdiscount(nextDraw.Discount);

                        } else if (item.getProductType() === 2 || item.getProductType() === 4 || item.getProductType() === 14) {
                            //productId, draws, lotteryType
                            var data = LottoyardService.getProductPriceById(item.getProductType(), nextDraw.NumberOfDraws, item.getLotteryType());
                            item.setNumberOfDraws(nextDraw.NumberOfDraws);

                            price = data.Price * item.getQuantity();
                            discount = 0;

                            item.setDiscount(nextDraw.Discount);

                        } else if (item.getProductType() === 1) {
                            item.setNumberOfDraws(nextDraw.NumberOfDraws);
                            //calculate price

                            var data = LottoyardService.getProductPriceByIds(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), item.getNumberOfLines());

                            if (nextDraw.Discount > 0) {
                                var price = data.Price + ((data.Price / (1 - nextDraw.Discount)) * nextDraw.Discount);
                                var discount = nextDraw.Discount * price;
                            } else {
                                var price = data.Price;
                                var discount = nextDraw.Discount * price;
                            }

                            item.setDiscount(nextDraw.Discount);
                        }

                        item.setMinLines(nextDraw.MinLines);
                        item.setMaxLines(nextDraw.MaxLines);

                        item.setTotalCost(price - discount);

                        item.setTotalDiscount(discount);

                        $scope.initCart();

                        $rootScope.$broadcast('ngCart:change', {});
                    }
                }

                function beforeCheckOutCall() {
                    if (ngCart.getItems().length > 0) {

                        var mapper = new Mapper(ngCart.getCart());
                        var data = mapper.PrepareOrder();

                        LottoyardService.prepareOrder(data).then(function(resp) {
                            //setting up  payment methods
                            prepareOrderResponse(resp);

                            $rootScope.$broadcast('ngCart:change', {});
                        });
                    }
                }

                function reverse(array) {
                    var result = [];
                    var i = null;
                    var arrSize = array.length;
                    for (i = arrSize - 1; i >= 0; i -= 1) {
                        result.push(array[i]);
                    }

                    return result;
                }

                function cleanArray(actual) {
                    var newArray = new Array();
                    for (var i = 0; i < actual.length; i++) {
                        if (actual[i]) {
                            newArray.push(actual[i]);
                        }
                    }
                    return newArray;
                }

                function paymentSelect() {
                    var mapper = new Mapper(ngCart.getCart());
                    var mappedCart = mapper.ConfirmOrder();
                    console.log(mappedCart);
                    // debugger;
                    LottoyardService.submitOrder(mappedCart).then(function(resp) {
                        // debugger;
                        $scope.creditCardError = [];
                        console.log('submitOrder:' + resp);
                        console.log(resp);
                        if (resp.StatusCode === 0 && resp.Status === 0) {
                            // debugger;
                            if (ngCart.getProcessor() === 'PayboutiqueYandex') {

                                $scope.status = false;
                                window.open(resp.Url, '_blank');

                            } else if (ngCart.getProcessor() === 'Neteller') {
                                // debugger;
                                $scope.status = false;
                                window.location.href = resp.Url;
                                // window.open(resp.Url, '');
                            } else {
                                $("#hiddenclicker").attr("href", resp.Url);
                                $("#hiddenclicker").fancybox({
                                    'width': '95%',
                                    'height': '95%',
                                    'autoScale': true,
                                    'transitionIn': 'elastic',
                                    'transitionOut': 'elastic',
                                    'speedIn': 600,
                                    'speedOut': 200,
                                    'type': 'iframe'
                                }).trigger("click");
                            }
                        } else {
                            $scope.creditCard = true;
                            $scope.creditCardError = resp.ErrorMessage;
                            $scope.paymentMethodError = true;
                            $scope.paymentMethodErrorText = resp.ErrorMessage;
                        }
                    });
                };

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };

                function dynamicSortDescending(property) {
                    var sortOrder = 1;
                    if (property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1);
                    }
                    return function(a, b) {
                        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
                        return result * sortOrder;
                    }
                }

                function daysInMonth(month, year) {
                    return new Date(year, month, 0).getDate();
                }

                function makeArrayOfNumbers(numbers) {
                    return new Array(numbers).join().split(',').map(function(item, index) { return (index === 0 ? 1 : ++index); });
                }

                function validateEighteenYearsAge(date) {
                    var currentDate = new Date();
                    var dateToCheck = new Date(date);

                    //checking years
                    if ((currentDate.getFullYear() - dateToCheck.getFullYear()) > 18) {
                        return true;
                    }
                    if ((currentDate.getFullYear() - dateToCheck.getFullYear()) === 18) {
                        if (dateToCheck.getMonth() < currentDate.getMonth()) {
                            return true;
                        }
                        if (dateToCheck.getMonth() === currentDate.getMonth()) {
                            if ((currentDate.getDate() >= dateToCheck.getDate())) {
                                return true;
                            }
                        }
                    }

                    return false;
                }

                function validateAddressFields(user, birthday) {
                    if (typeof user === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "Enter additional data" });
                        return false;
                    }

                    if (typeof user.birthday === 'undefined' && (typeof user.birthday.day === 'undefined' || typeof user.birthday.month === 'undefined' || typeof user.birthday.year === 'undefined')) {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "Please insert valid date of birth" });
                        return false;
                    }

                    if (!validateEighteenYearsAge(birthday)) {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "TransactionDeclinedMustOver18" });
                        return false;
                    }

                    if (typeof user.city === 'undefined' || user.city.length < 3 || user.city.length > 35) {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "Please insert valid city" });
                        return false;
                    }

                    if (typeof user.address === 'undefined' || user.address.length < 4 || user.address.length > 35) {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "Please insert valid address" });
                        return false;
                    }

                    if (typeof user.postalCode === 'undefined' || user.postalCode.length < 3 || user.postalCode.length > 12) {
                        $scope.creditCard = true;
                        $scope.creditCardErrorArr.push({ ErrorMessage: "Please insert valid postal code" });
                        return false;
                    }
                    return true;
                }


                console.log(ngCart);

            }
        ])
        .controller('NavidadController', ['$rootScope', '$scope', 'ngCart', '$timeout', function($rootScope, $scope, ngCart, $timeout) {
            function Countdown(scope, item) {
                var timer,
                    itemId = item.getId(),
                    instance = this,

                    counterEnd = function() {
                        $timeout(function() {
                            ngCart.removeItemById(itemId);
                            $scope.initCart();
                            //angular.element('#navidad' + itemId).click();
                        }, 100);
                    };

                function decrementCounter() {
                    if (scope.seconds <= 0) {
                        counterEnd();
                        instance.stop();
                        return;
                    }
                    scope.seconds--;
                    if (scope.seconds === 0) {
                        scope.isRefreshing = true;
                    }

                    angular.element('#timer' + itemId).text(convertDate(scope.seconds));
                    scope.$apply(); //update the view bindings
                }

                this.start = function() {
                    clearInterval(timer);
                    scope.seconds = item.getProductExpire();

                    angular.element('#timer' + itemId).text(convertDate(scope.seconds));

                    timer = setInterval(decrementCounter.bind(this.timer), 1000);
                };

                this.stop = function() {
                    clearInterval(timer);
                }
            }

            var ct;
            $scope.init = function(id) {
                console.log(id);
                var itemCart = ngCart.getItemById(id);
                //create a new event timer and start counting down
                ct = new Countdown($scope, itemCart);
                ct.start();
            };
            $scope.startTimer = function(id) {
                console.log(id);
                var itemCart = ngCart.getItemById(id);
                //create a new event timer and start counting down
                ct = new Countdown($scope, itemCart);
                ct.start();
            };

            $scope.removeItem = function(itemId) {
                //debugger;
                var item = itemId;
                if (typeof itemId !== "object") {
                    item = ngCart.getItemById(itemId);
                }

                if ((typeof item === "object") && (item !== null)) {
                    var guid = item.getGuid();
                    if (typeof guid !== 'undefined') {
                        var items = ngCart.getItems();
                        var itemToRemove = [];
                        angular.forEach(items, function(item) {
                            if (item.getGuid() === guid) {
                                itemToRemove.push(item.getId());
                            }
                        });
                        for (var i = 0; i < itemToRemove.length; i++) {
                            ngCart.removeItemById(itemToRemove[i]);
                        }
                    } else {
                        ngCart.removeItemById(item.getId());
                    }
                }
                $scope.initCart();
            };

            function convertDate(t) {
                var days, hours, minutes, seconds;
                //days = Math.floor(t / 86400);
                //t -= days * 86400;
                //hours = Math.floor(t / 3600) % 24;
                //t -= hours * 3600;
                minutes = Math.floor(t / 60) % 60;
                t -= minutes * 60;
                seconds = t % 60;
                return [
                    //days + 'd',
                    //hours + 'h',
                    minutes + 'm',
                    seconds + 's'
                ].join(' ');
            };
        }])
        .controller('DepositController', ['$rootScope', '$scope', 'ngCart', 'ngCart.lottoyard.api', 'ngCart.translationService', 'PaymentSystems',
            function($rootScope, $scope, ngCart, LottoyardService, translationService, PaymentSystems) {

                $scope.ngCart = ngCart;
                $scope.depositAmount = 0;
                $scope.paymentSystems = PaymentSystems;
                $scope.terms = false;
                $scope.status = "";
                $scope.statusclass = "";
                $scope.section = { selectionPaymentTemplate: "" };
                $scope.extraInfo = "creditcard";
                $scope.promoCode = "";
                $scope.creditcard = {};
                $scope.currentYear = new Date().getFullYear();
                $scope.creditCardExpirationYears = [$scope.currentYear, $scope.currentYear + 1, $scope.currentYear + 2, $scope.currentYear + 3, $scope.currentYear + 4, $scope.currentYear + 5, $scope.currentYear + 6, $scope.currentYear + 7, $scope.currentYear + 8, $scope.currentYear + 9, $scope.currentYear + 10];

                translationService.getTranslation($scope, $rootScope.language);

                $scope.initDepositPage = function() {

                    if ($scope.isAuthenticated) {

                        var data = JSON.stringify({ MemberId: "{0}" });

                        LottoyardService.getMemberPaymentMethods(data).then(function(resp) {
                            ngCart.setIframePaymentMethods(resp);
                            //setting up default method id for drop down
                            if (resp.length > 0) {
                                $scope.selectedmethod = resp[0];
                                ngCart.setPaymentMethodId(resp[0].MethodId);
                                ngCart.setProcessor(resp[0].Processor);
                            }

                            if ($scope.isAuthenticated && ngCart.getIframePaymentMethods().length === 0) {
                                $scope.section.selectionPaymentTemplate = 'new';
                            } else if ($scope.isAuthenticated && ngCart.getIframePaymentMethods().length > 0) {
                                $scope.section.selectionPaymentTemplate = 'exist';
                            }
                        });
                    } else {
                        $scope.section.selectionPaymentTemplate = 'signup';
                    }
                };

                $scope.paymentMethodSelected = function(_methodId, _processor) {
                    ngCart.setPaymentMethodId(_methodId);
                    ngCart.setProcessor(_processor);

                    $rootScope.$broadcast('ngCart:change', {});
                    console.log('methodId', _methodId);
                }

                $scope.showtooltippay = function(_id) {
                    if ($scope.paycart !== _id) {
                        $scope.paycart = _id;
                    } else {
                        $scope.paycart = null;
                    }
                };

                $scope.hidetooltippay = function(_id) {
                    $scope.paycart = null;
                };

                $scope.depositFunds = function(selectedMethod, depositAmount, terms) {
                    //debugger;
                    if (!terms) {
                        $scope.paymentMethodError = true;
                        $scope.paymentMethodErrorText = "Please agree with our Terms and Conditions!";
                        return;
                    }

                    if (typeof(selectedMethod) === 'undefined' || selectedMethod.MethodId === '') {
                        $scope.paymentMethodError = true;
                        $scope.paymentMethodErrorText = "Please select a payment method!";
                        return;
                    }

                    if (typeof(depositAmount) === 'undefined' || depositAmount === '' || depositAmount === 0 || depositAmount < 5) {
                        $scope.paymentMethodError = true;
                        $scope.paymentMethodErrorText = "The Min Deposit Is 5EUR";
                        return;
                    }

                    var paymentMethodId = ngCart.getPaymentMethodId();
                    if (typeof(paymentMethodId) === 'undefined' || paymentMethodId == null) paymentMethodId = 0;

                    var data = {
                        SessionId: "{0}",
                        MemberId: "{0}",
                        PaymentMethodId: paymentMethodId,
                        Amount: depositAmount,
                        ProcessorApi: ngCart.getProcessor()
                    };

                    LottoyardService.depositFunds(JSON.stringify(data)).then(function(resp) {
                        $scope.creditCardError = [];

                        if (resp.IsSuccess) {
                            $scope.paymentMethodError = false;
                            $scope.status = resp.Status;
                            $scope.status = "Thank you , your deposit was successful!";
                            $scope.statusclass = "ok";
                            if (ngCart.getProcessor() !== 'CreditCard') {

                                $("#hiddenclicker").attr("href", resp.Url);
                                $("#hiddenclicker").fancybox({
                                    'width': '95%',
                                    'height': '95%',
                                    'autoScale': true,
                                    'transitionIn': 'elastic',
                                    'transitionOut': 'elastic',
                                    'speedIn': 600,
                                    'speedOut': 200,
                                    'type': 'iframe'
                                }).trigger("click");
                            } else {
                                window.location = '/thankyou?deposit-funds';
                            }

                        } else {
                            $scope.paymentMethodError = false;
                            $scope.creditCard = true;
                            $scope.creditCardError.push({ ErrorMessage: resp.error_msg });
                            $('.mainpaymenttabs').removeClass('loading');
                        }
                    });
                };

                $scope.paymentSelect = function(payment) {
                    console.log(payment);
                    ngCart.setProcessor(payment.processor);
                    $scope.creditCard = false;
                    $scope.status = "";
                    $scope.extraInfo = payment.name;
                }

                $scope.submitOrderNewCreditCard = function(creditcard, depositAmount) {
                    $scope.creditCardError = [];
                    $scope.creditCard = false;
                    //debugger;

                    if (typeof(creditcard) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Enter credit card" });
                        return;
                    }
                    if (!creditcard.terms) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please agree with our Terms and Conditions!" });
                        return;
                    }
                    if (typeof(creditcard.CardHolderName) === 'undefined' || creditcard.CardHolderName.length < 2) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please type your full name" });
                        return;
                    }
                    if (typeof(creditcard.CreditCardNumber) === 'undefined' || creditcard.CreditCardNumber.length < 10) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Credit card number length is invalid" });
                        return;
                    }
                    if (typeof(creditcard.expiration) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Date" });
                        return;
                    }
                    if (typeof(creditcard.expiration.year) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Year" });
                        return;
                    }
                    if (typeof(creditcard.expiration.month) === 'undefined') {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert Expiration Month" });
                        return;
                    }
                    if (typeof(creditcard.Cvv) === 'undefined' || creditcard.Cvv.length < 3) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please insert your cvv number" });
                        return;
                    }

                    var today = new Date();

                    var lastDay = new Date(parseInt(creditcard.expiration.year), parseInt(creditcard.expiration.month), 0).getDate();
                    var expirationDate = creditcard.expiration.year + "-" + creditcard.expiration.month + "-" + lastDay;

                    today.setHours(0, 0, 0, 0);
                    var creditCardDate = new Date(expirationDate);
                    creditCardDate.setHours(0, 0, 0, 0);

                    if (creditCardDate < today) {
                        $scope.creditCard = true;
                        $scope.creditCardError.push({ ErrorMessage: "Please enter valid card expiration date!" });
                        return;
                    }

                    creditcard.ExpirationDate = expirationDate;
                    ngCart.setProcessor("CreditCard");
                    console.log(creditcard);
                    //debugger;
                    var data = {
                        SessionId: "{0}",
                        MemberId: "{0}",
                        Amount: depositAmount,
                        ProcessorApi: ngCart.getProcessor(),
                        CreditCard: {
                            CardType: _getCreditCardType(creditcard.CreditCardNumber),
                            CreditCardNumber: creditcard.CreditCardNumber,
                            Cvv: creditcard.Cvv,
                            ExpirationDate: expirationDate,
                            CardHolderName: creditcard.CardHolderName
                        }
                    };
                    //debugger;
                    LottoyardService.depositFunds(JSON.stringify(data)).then(function(resp) {
                        console.log(resp);
                        //debugger;
                        $('.mainpaymenttabs').removeClass('loading');
                        if (resp.IsSuccess) {
                            window.location = '/thankyou?deposit-funds';
                        } else {
                            $scope.creditCard = true;
                            $scope.creditCardError.push({ ErrorMessage: resp.error_msg });
                            return;
                        }
                    });
                }

                $scope.paymentSelectMoreInfo = function($event, phoneOrEmail, amountToDeposit) {
                    $event.preventDefault();
                    //debugger;
                    console.log(phoneOrEmail);

                    ngCart.setPhoneOrEmail(phoneOrEmail);

                    paymentSelect(amountToDeposit);

                }

                $scope.editPaymentMethods = function() {
                    $scope.section.selectionPaymentTemplate = 'new';
                }

                function paymentSelect(amountToDeposit) {
                    if (typeof(amountToDeposit) === 'undefined') {
                        amountToDeposit = 0;
                    }

                    var paymentMethodId = ngCart.getPaymentMethodId();
                    if (typeof(paymentMethodId) === 'undefined' || paymentMethodId == null) paymentMethodId = 0;

                    var data = {
                        SessionId: "{0}",
                        MemberId: "{0}",
                        PaymentMethodId: paymentMethodId,
                        Amount: amountToDeposit,
                        ProcessorApi: ngCart.getProcessor(),
                        PhoneOrEmail: ngCart.getPhoneOrEmail()
                    };

                    LottoyardService.depositFunds(JSON.stringify(data)).then(function(resp) {

                        $scope.creditCardError = [];

                        if (resp.StatusCode === 0 && resp.Status === 0) {
                            if (ngCart.getProcessor() === 'PayboutiqueYandex') {

                                $scope.status = false;
                                $window.open(resp.Url, '_blank');

                            } else {
                                $("#hiddenclicker").attr("href", resp.Url);
                                $("#hiddenclicker").fancybox({
                                    'width': '95%',
                                    'height': '95%',
                                    'autoScale': true,
                                    'transitionIn': 'elastic',
                                    'transitionOut': 'elastic',
                                    'speedIn': 600,
                                    'speedOut': 200,
                                    'type': 'iframe'
                                }).trigger("click");
                            }
                        } else {
                            $scope.creditCard = true;
                            $scope.creditCardError = resp.ErrorMessage;
                            $scope.paymentMethodError = true;
                            $scope.paymentMethodErrorText = resp.ErrorMessage;
                        }
                    });
                };

            }
        ])
        .controller('someCtrl', ['$scope', 'item', 'line', function($scope, item, line) {
            //debugger;
            $scope.isValidSelectLine = true;
            $scope.isValidExtraLine = true;

            console.log('line', line);
            line++;
            $scope.line = line;
            $scope.item = item;
            console.log('line', line);
            console.log('$scope.line', $scope.line);

            $scope.clickNumber = function(number) {
                // debugger;

                var minSelectNumbers = item.getMinSelectNumbers();
                var maxSelectNumbers = item.getMaxSelectNumbers();

                var totalSelectNumbers = countSelectedNumbersInArray($scope.selectedNumbers);

                console.log('totalSelectNumbers', totalSelectNumbers);

                if (totalSelectNumbers < maxSelectNumbers) {
                    if (number.isSelected) {
                        number.isSelected = 0;
                    } else {
                        number.isSelected = 1;
                    }
                } else {
                    if (number.isSelected) {
                        number.isSelected = 0;
                    }
                }

                totalSelectNumbers = countSelectedNumbersInArray($scope.selectedNumbers);

                if (totalSelectNumbers < minSelectNumbers) {
                    $scope.isValidSelectLine = false;
                } else {
                    $scope.isValidSelectLine = true;
                }
            }

            $scope.clickNumberExtra = function(number) {
                //debugger;
                $scope.isValidExtraLine = true;
                var minExtraSelectNumbers = item.getMinExtraNumber();
                var maxExtraSelectNumbers = item.getMaxExtraNumbers();

                var totalExtraSelectNumbers = countSelectedNumbersInArray($scope.selectedNumbersExtra);

                console.log('totalExtraSelectNumbers', totalExtraSelectNumbers);

                if (totalExtraSelectNumbers < maxExtraSelectNumbers) {
                    if (number.isSelected) {
                        number.isSelected = 0;
                    } else {
                        number.isSelected = 1;
                    }
                } else {
                    if (number.isSelected) {
                        number.isSelected = 0;
                    }
                }

                totalExtraSelectNumbers = countSelectedNumbersInArray($scope.selectedNumbersExtra);

                if (minExtraSelectNumbers !== 0) {
                    if (totalExtraSelectNumbers === 0) {
                        $scope.isValidExtraLine = false;
                    } else if (minExtraSelectNumbers > totalExtraSelectNumbers || totalExtraSelectNumbers < maxExtraSelectNumbers) {
                        $scope.isValidExtraLine = false;
                    }
                }


                //$scope.isValidLine = true;
                console.log('totalExtraSelectNumbers', totalExtraSelectNumbers);
            }

            function countSelectedNumbersInArray(arr) {
                var totalSelectNumbers = 0;
                arr.filter(function(value) {
                    if (value.isSelected) {
                        totalSelectNumbers++;
                        return false;
                    } else {
                        return true;
                    }
                });

                return totalSelectNumbers;
            }

            function clearSelectedNumbersInArray(arr) {
                return arr.filter(function(value) {
                    if (value.isSelected) {
                        value.isSelected = 0;
                        return false;
                    } else {
                        return true;
                    }
                });
            }

            $scope.checkInput = function(_line) {
                console.log('checkInput');
                //debugger;
                //imame item i line
                var selectedNumbers = countSelectedNumbersInArray($scope.selectedNumbers);
                var selectedExtraNumbers = countSelectedNumbersInArray($scope.selectedNumbersExtra);
                var maxSelectNumbers = item.getMaxSelectNumbers();

                if (selectedNumbers !== maxSelectNumbers) {
                    $scope.isValidSelectLine = false;
                    return false;
                }

                //todo check if there is extra numvbers
                if (selectedExtraNumbers > 0 || selectedExtraNumbers !== item.getMaxExtraNumbers()) {
                    if (selectedExtraNumbers !== item.getMaxExtraNumbers()) {
                        $scope.isValidExtraLine = false;
                        return false;
                    }
                }

                if ($scope.isValidSelectLine && $scope.isValidExtraLine) {
                    var currentLineToUpdate = item.getNumbersSantized()[_line];
                    console.log(currentLineToUpdate);

                    var newLine = [];

                    $scope.selectedNumbers.filter(function(value) {
                        if (value.isSelected) {
                            newLine.push(value.id);
                            return false;
                        } else {
                            return true;
                        }

                    });

                    var newLineToUpdate = newLine.join(',');

                    if ($scope.selectedNumbersExtra.length > 0) {
                        var newExtraLine = [];

                        $scope.selectedNumbersExtra.filter(function(value) {
                            if (value.isSelected) {
                                newExtraLine.push(value.id);
                                return false;
                            } else {
                                return true;
                            }

                        });

                        newLineToUpdate += '#' + newExtraLine.join(',');

                        //elgordo update all lines with same special numbers
                        if (item.getLotteryType() === 10) {
                            var allLines = item.getNumbersSantized();

                            angular.forEach(allLines, function(line, index) {

                                var splittedLine = line.split('#');
                                var oldLine = splittedLine[0];
                                var extraNumber = newExtraLine[0];
                                var lineToUpdate = oldLine + '#' + extraNumber;

                                item.updateSantizedLine(lineToUpdate, index + 1);

                            });
                        }
                    }

                    console.log(newLineToUpdate);
                    item.updateSantizedLine(newLineToUpdate, _line);


                }

                return true;
            }

            $scope.clearLine = function() {
                clearSelectedNumbersInArray($scope.selectedNumbers);
                clearSelectedNumbersInArray($scope.selectedNumbersExtra);

                $scope.isValidSelectLine = false;

            }

            $scope.quickpick = function(line) {
                    //  debugger;
                    clearSelectedNumbersInArray($scope.selectedNumbers);
                    clearSelectedNumbersInArray($scope.selectedNumbersExtra);

                    var maxSelectNumbers = item.getMaxSelectNumbers();
                    var maxSelectExtraNumbers = item.getMaxExtraNumbers();
                    var startNumber = item.getMinSelectNumbers();
                    var startExtraNumber = item.getMinExtraNumber();
                    var endNumber = item.getSelectNumbers();
                    var endExtraNumbers = item.getExtraNumbers();

                    while (countSelectedNumbersInArray($scope.selectedNumbers) < maxSelectNumbers) {
                        var number = $scope.getRandomInt(startNumber, endNumber - 1);

                        var objNumber = {
                            id: 1,
                            isSelected: 0
                        }
                        objNumber.id = number;
                        objNumber.isSelected = 1;
                        console.log(objNumber);
                        console.log('number', number);
                        $scope.selectedNumbers[number - 1] = objNumber;
                    }


                    if (maxSelectExtraNumbers > 0) {
                        while (countSelectedNumbersInArray($scope.selectedNumbersExtra) < maxSelectExtraNumbers) {
                            var numberExtra = $scope.getRandomInt(startExtraNumber, endExtraNumbers - 1);

                            var objNumberExtra = {
                                id: 1,
                                isSelected: 0
                            }
                            objNumberExtra.id = numberExtra;
                            objNumberExtra.isSelected = 1;
                            console.log(objNumberExtra);
                            console.log('numberExtra', numberExtra);
                            if (item.getLotteryType() === 10) {
                                $scope.selectedNumbersExtra[numberExtra] = objNumberExtra;
                            } else {
                                $scope.selectedNumbersExtra[numberExtra - 1] = objNumberExtra;
                            }

                        }
                    }
                    console.log($scope.selectedNumbers);
                    console.log($scope.selectedNumbersExtra);


                    var selectedNumbers = countSelectedNumbersInArray($scope.selectedNumbers);
                    var selectedExtraNumbers = countSelectedNumbersInArray($scope.selectedNumbersExtra);

                    if (selectedNumbers === maxSelectNumbers) {
                        $scope.isValidSelectLine = true;
                    }
                    if (selectedExtraNumbers === maxSelectExtraNumbers) {
                        $scope.isValidExtraLine = true;

                    }


                }
                //debugger;
            line -= 1;
            var selectNumbers = item.getSelectNumbers();
            var selectNumbersExtra = item.getExtraNumbers();

            var selectNumberArray = [];
            var selectNumberExtraArray = [];
            var currentLine = item.getNumbersSantized()[line];

            var emptyLine = false;

            if (typeof currentLine === 'undefined') {
                emptyLine = true;
            }

            var specialNumbers = '';

            if (!emptyLine) {
                var indexOfStartSpecialNumber = currentLine.indexOf('#');
                if (indexOfStartSpecialNumber !== -1) {
                    console.log(currentLine);
                    specialNumbers = currentLine.substr(parseInt(currentLine.indexOf(('#')) + 1));

                    specialNumbers = specialNumbers.split(',');
                    console.log(specialNumbers);
                    specialNumbers = specialNumbers.map(function(x) {
                        return parseInt(x);
                    });
                }
                var currentLineSplited;
                if (indexOfStartSpecialNumber === -1) {
                    currentLineSplited = currentLine.split(',');
                } else {
                    currentLineSplited = currentLine.slice(0, indexOfStartSpecialNumber).split(',');
                }

                currentLineSplited = currentLineSplited.map(function(x) {
                    return parseInt(x);
                });

                console.log(currentLineSplited);
            }

            var startNumber = item.getMinSelectNumbers();

            for (var i = startNumber; i <= selectNumbers; i++) {
                var n = {
                    id: i,
                    isSelected: 0
                };
                if (!emptyLine) {
                    if (currentLineSplited.indexOf(i) >= 0) {
                        n.isSelected = 1;
                    }
                }

                selectNumberArray.push(n);
            }

            // var startExtraNumber = item.getMinExtraNumber();
            var startExtraNumber = item.getMinExtraNumber();
            //id 10 is Elgordo
            if (item.getMaxExtraNumbers() > 0) {
                for (var j = startExtraNumber; j <= selectNumbersExtra; j++) {
                    var extra = {
                        id: j,
                        isSelected: 0
                    };
                    if (!emptyLine) {
                        if (specialNumbers.indexOf(j) >= 0) {
                            extra.isSelected = 1;
                        }
                    }

                    selectNumberExtraArray.push(extra);
                }
            }
            console.log(selectNumberArray);
            $scope.selectedNumbers = selectNumberArray;
            $scope.selectedNumbersExtra = selectNumberExtraArray;


        }])
        .value('version', '1.0.0');;
    'use strict';


    angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController', ['$scope', 'ngCart', function($scope, ngCart) {
        $scope.ngCart = ngCart;

    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart) {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                id: '@',
                name: '@',
                quantity: '@',
                quantityMax: '@',
                price: '@',
                data: '='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if (typeof attrs.templateurl == 'undefined') {
                    return '/template/ngCart/addtocart.html';
                } else {
                    return attrs.templateurl;
                }
            },
            link: function(scope, element, attrs) {
                scope.attrs = attrs;
                scope.inCart = function() {
                    return ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()) {
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt = [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', ['ngCart', 'ngCart.lottoyard.api', '$rootScope', function(ngCart, LottoyardService, $rootScope) {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if (typeof attrs.templateurl == 'undefined') {
                    return '/template/ngCart/cart.html';
                } else {
                    return attrs.templateurl;
                }
            },
            link: function(scope, element, attrs) {
                //debugger;
                scope.beforeCheckOutCall();
            }
        };
    }])

    .directive('ngcartPayment', ['ngCart', function(ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {},
                templateUrl: function(element, attrs) {
                    if (typeof attrs.templateurl == 'undefined') {
                        return '/template/ngCart/paymentexist.html';
                    } else {
                        return attrs.templateurl;
                    }
                },
                link: function(scope, element, attrs) {

                }
            };

        }])
        .directive('ngcartPaymentNew', ['ngCart', function(ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {},
                templateUrl: function(element, attrs) {
                    if (typeof attrs.templateurl == 'undefined') {
                        return '/template/ngCart/paymentnew.html';
                    } else {
                        return attrs.templateurl;
                    }
                },
                link: function(scope, element, attrs) {

                }
            };

        }])
        .directive('ngcartSignup', ['ngCart', function(ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {},
                templateUrl: function(element, attrs) {
                    //debugger;
                    if (typeof attrs.templateurl == 'undefined') {
                        return '/template/ngCart/signup.html';
                    } else {
                        return attrs.templateurl;
                    }
                },
                link: function(scope, element, attrs) {

                }
            };

        }])
        .directive('ngcartSummary', [function() {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {},
                transclude: true,
                templateUrl: function(element, attrs) {
                    if (typeof attrs.templateurl == 'undefined') {
                        return '/template/ngCart/summary.html';
                    } else {
                        return attrs.templateurl;
                    }
                }
            };
        }])
        .directive('ngcartCheckout', [function() {
            return {
                restrict: 'E',
                controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', 'ngCart.lottoyard.api', function($rootScope, $scope, ngCart, fulfilmentProvider, apiService) {
                    $scope.ngCart = ngCart;

                    $scope.checkout = function($event) {
                        $event.preventDefault();
                        // debugger;
                        fulfilmentProvider.setService($scope.service);
                        fulfilmentProvider.setSettings($scope.settings);
                        fulfilmentProvider.checkout()
                            .success(function(data, status, headers, config) {
                                console.log(data);
                                $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                            })
                            .error(function(data, status, headers, config) {
                                $rootScope.$broadcast('ngCart:checkout_failed', {
                                    statusCode: status,
                                    error: data
                                });
                            });
                    }
                }]),
                scope: {
                    service: '@',
                    settings: '='
                },
                transclude: true,
                templateUrl: function(element, attrs) {
                    if (typeof attrs.templateurl == 'undefined') {
                        return '/template/ngCart/checkout.html';
                    } else {
                        return attrs.templateurl;
                    }
                }
            };
        }]);;
    angular.module('ngCart.fulfilment', [])
        .run(['$rootScope', '$http', function($rootScope, $http) {

            $http.defaults.transformRequest.push(function(data) {
                $rootScope.progress = true;
                return data;
            });
            $http.defaults.transformResponse.push(function(data) {
                $rootScope.progress = false;
                return data;
            });
        }])
        .service('fulfilmentProvider', ['$injector', function($injector) {

            this._obj = {
                service: undefined,
                settings: undefined
            };

            this.setService = function(service) {
                this._obj.service = service;
            };

            this.setSettings = function(settings) {
                this._obj.settings = settings;
            };

            this.checkout = function() {

                var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
                return provider.checkout(this._obj.settings);
            }
        }])
        .factory('ngCart.lottoyard.api', ['$q', '$log', '$http', 'CacheFactory', 'RESTApiUrl', 'Products', '$timeout', '$interval', 'myCacheFactory', function($q, $log, $http, CacheFactory, RESTApiUrl, Products, $timeout, $interval, dataCache) {

            var service = {};

            var MAX_REQUESTS = 5;
            var counterAllLotteriesRules = 1;
            var countergetAllProductsRules = 1;
            var counterProductPrices = 1;
            var counterAllBrandDraws = 1;

            var getAllLotteriesRulesCompleted = false;
            var getAllProductsRulesCompleted = false;
            var getProductPricesCompleted = false;

            function getLotteryFromArrayById(array, id) {
                var lottery = array.filter(function(obj) {
                    if ('LotteryTypeId' in obj && typeof(obj.LotteryTypeId) === 'number' && obj.LotteryTypeId === id) {
                        return true;
                    }
                    return false;
                });

                return lottery;
            }

            function getProductFromArrayById(array, id) {
                var lottery = array.filter(function(obj) {
                    if ('ProductId' in obj && typeof(obj.ProductId) === 'number' && obj.ProductId === id) {
                        return true;
                    }
                    return false;
                });

                return lottery;
            }

            function getProductPriceFromArrayById(array, productId, draws, lotteryType) {

                return array.filter(function(x) {
                    if (x.ProductId === productId && x.NumOfDraws === draws && x.LotteryId === lotteryType) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            function getProductPriceFromArrayByIds(array, productId, draws, lotteryType, lines) {
                // debugger;
                return array.filter(function(x) {
                    if (x.ProductId === productId && x.NumOfDraws === draws && x.LotteryId === lotteryType && x.Lines === lines) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            function updateUserBalance() {
                var datastring = "action=lottery_data&m=userinfo/get-member-money-balance";
                jQuery.ajax({
                    type: "POST",
                    url: CONFIG.adminURL,
                    data: datastring,
                    success: function(resp) {
                        $('.mainpaymenttabs').removeClass('loading');
                    }
                });
            }

            service.getLotteryById = function getLotteryById(id) {
                var idcache = 'lottery-rules';

                if (dataCache.get(idcache)) {
                    var cached = dataCache.get(idcache);
                    //debugger;
                    return getLotteryFromArrayById(cached, id)[0];
                } else {
                    this.getAllLotteriesRules().then(function(resp) {
                        return getLotteryFromArrayById(resp, id)[0];
                    });
                }

            };

            service.getProductById = function getLotteryById(id) {
                var idcache = 'product-rules';

                if (dataCache.get(idcache)) {
                    var cached = dataCache.get(idcache);
                    // debugger;
                    console.log(getProductFromArrayById(cached, id))
                    return getProductFromArrayById(cached, id)[0];
                } else {

                    this.getAllProductsRules().then(function(resp) {
                        return getProductFromArrayById(resp, id)[0];
                    });
                }
            };

            service.getAllLotteriesRules = function getAllLotteriesRules() {

                var id = 'lottery-rules';

                var deffered = $q.defer();

                if (dataCache.get(id)) {
                    deffered.resolve(dataCache.get(id));
                } else {
                    $http({
                        method: 'POST',
                        cache: CacheFactory.get('cachelottoyard'),
                        url: RESTApiUrl,
                        timeout: 25000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'action=lottery_data&m=globalinfo/lottery-rules'
                    }).success(function(data) {

                        var resp;
                        getAllLotteriesRulesCompleted = true;

                        try {
                            resp = data;

                        } catch (e) {
                            console.error('Parsing globalinfo/lottery-rules Error: %s Response: %s', e, data);
                            deffered.reject('There was an error');
                        }

                        dataCache.put(id, resp);

                        deffered.resolve(resp);

                    }).error(function(response) {
                        // console.log(RESTApiUrl);
                        if (counterAllLotteriesRules < MAX_REQUESTS) {
                            $timeout(function() {
                                getAllLotteriesRules();
                                console.log("globalinfo/lottery-rules");
                            }, 2500);

                            counterAllLotteriesRules++;
                        } else {
                            console.warn("Error in getAllProductsRulesCompleted: " + response);
                            deffered.reject('There was an error');
                        }

                    });
                }

                return deffered.promise;
            };

            service.getAllProductsRules = function getAllProductsRules() {

                var id = 'product-rules';

                var deffered = $q.defer();

                if (dataCache.get(id)) {
                    deffered.resolve(dataCache.get(id));
                } else {
                    $http({
                        method: 'POST',
                        cache: CacheFactory.get('cachelottoyard'),
                        url: RESTApiUrl,
                        timeout: 25000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'action=lottery_data&m=globalinfo/product-rules'
                    }).success(function(data) {

                        getAllProductsRulesCompleted = true;
                        var resp;
                        try {
                            resp = data;
                        } catch (e) {
                            console.error("Parsing globalinfo/product-rules Error: %s Response: %s ", e, data);
                            deffered.reject('There was an error');
                        }
                        console.log(resp);

                        dataCache.put(id, resp);

                        deffered.resolve(resp);

                    }).error(function(response) {
                        if (countergetAllProductsRules < MAX_REQUESTS) {
                            console.log('countergetAllProductsRules:' + countergetAllProductsRules);
                            $timeout(function() {
                                service.getAllProductsRules();
                            }, 2500);

                            countergetAllProductsRules++;
                        } else {
                            console.warn("Error in getAllProductsRulesCompleted" + response);
                            deffered.reject('There was an error:');
                        }

                    });
                }

                return deffered.promise;
            };

            service.getFreeTicket = function getFreeTicket() {

                var id = 'free-ticket';

                var data = JSON.stringify({ MemberId: "{0}" });

                var deffered = $q.defer();

                if (dataCache.get(id)) {
                    deffered.resolve(dataCache.get(id));
                } else {
                    $http({
                        method: 'POST',
                        cache: CacheFactory.get('cachelottoyard'),
                        url: RESTApiUrl,
                        timeout: 2000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'action=lottery_data&m=playlottery/get-member-free-ticket'
                    }).success(function(data) {
                        //debugger;
                        //getAllProductsRulesCompleted = true;

                        dataCache.put(id, data);

                        deffered.resolve(data);

                    }).error(function(response) {
                        if (countergetAllProductsRules < MAX_REQUESTS) {
                            console.log('countergetAllProductsRules:' + countergetAllProductsRules);
                            $timeout(service.getAllProductsRules(), 2500);

                            countergetAllProductsRules++;
                        } else {
                            console.warn("Error in getAllProductsRulesCompleted" + response);
                            deffered.reject('There was an error:');
                        }

                    });
                }

                return deffered.promise;
            };

            service.prepareOrder = function(data) {

                var deffered = $q.defer();
                console.log('prepare-order', data);
                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: 'action=lottery_data&m=cashier/prepare-order&data=' + encodeURIComponent(data)
                }).success(function(resp) {
                    $('.linesdraws.draws').removeClass('loading');
                    $('.linesdraws.lines').removeClass('loading');
                    var parsedResp;
                    try {
                        parsedResp = resp;
                    } catch (e) {
                        console.error("Parsing cashier/prepare-order Error: %s Response: %s", e, resp);
                        deffered.reject('There was an error');
                    }
                    //debugger;
                    console.log('resp-prepare-order' + parsedResp);

                    deffered.resolve(parsedResp);

                }).error(function() {
                    deffered.reject();
                });

                return deffered.promise;
            }

            service.submitOrder = function(data) {
                var jsonData = JSON.parse(data);
                jsonData = {
                    ...jsonData,
                    Pan:jsonData.CreditCard.CreditCardNumber,
                    ExpiryDate: jsonData.CreditCard.ExpirationDate,
                    SecurityCode: jsonData.CreditCard.Cvv
                }
                data = JSON.stringify(jsonData);
                var deffered = $q.defer();
                $('#middle').addClass('loading');
                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'action=lottery_data&m=cashier/processor-confirm-lwg-order&data=' + encodeURIComponent(data)
                }).success(function(dataResp) {
                    var resp;
                    // debugger;
                    try {
                        resp = dataResp;
                        // updateUserBalance();
                    } catch (e) {
                        console.error("Parsing cashier/processor-confirm-lwg-order Error: %s Response: %s", e, dataResp.error_msg);
                        deffered.reject('There was an error');
                    }
                    console.log(resp);

                    deffered.resolve(resp);

                }).error(function() {

                    deffered.reject('There was an error');
                });


                return deffered.promise;
            };

            service.getMemberPaymentMethods = function(data) {

                var deffered = $q.defer();

                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'action=lottery_data&m=cashier/get-member-payment-methods&data=' + data
                }).success(function(data) {
                    var resp;
                    try {
                        resp = data;
                    } catch (e) {
                        console.error("Parsing cashier/get-member-payment-methods Error: %s Response: %s", e, data.error_msg);
                        deffered.reject('There was an error');
                    }
                    console.log(resp);

                    deffered.resolve(resp);

                }).error(function() {

                    deffered.reject('There was an error');
                });


                return deffered.promise;
            };

            service.depositFunds = function(data) {
                $('.mainpaymenttabs').addClass('loading');
                var deffered = $q.defer();

                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'action=lottery_data&m=cashier/deposit-funds&data=' + data
                }).success(function(data) {
                    var resp;
                    try {
                        resp = data;
                        // updateUserBalance();
                    } catch (e) {
                        console.error("Parsing cashier/deposit-fundss Error: %s Response: %s", e, data.error_msg);
                        deffered.reject('There was an error');
                    }
                    console.log(resp);

                    deffered.resolve(resp);

                }).error(function() {

                    deffered.reject('There was an error');
                });

                return deffered.promise;
            };

            service.signIn = function(data) {
                var deffered = $q.defer();
                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'action=lottery_data&m=userinfo/login&email=' + data.email + '&password=' + data.password
                }).success(function(resp) {
                    var parsedResp;
                    try {
                        parsedResp = resp;
                    } catch (e) {
                        console.error("Parsing cashier/deposit-fundss Error: %s Response: %s", e, resp.error_msg);
                        deffered.reject('There was an error');
                    }
                    console.log(parsedResp);

                    deffered.resolve(parsedResp);

                }).error(function() {
                    deffered.reject();
                });

                return deffered.promise;
            }

            service.forgotPass = function(data) {

                var deffered = $q.defer();
                $http({
                    method: 'POST',
                    url: RESTApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'action=lottery_data&m=userinfo/get-personal-details-by-email&email=' + data.forgotemail
                }).success(function(resp) {
                    var parsedResp;
                    try {
                        parsedResp = resp;
                    } catch (e) {
                        console.error("Parsing cashier/deposit-fundss Error: %s Response: %s", e, resp.error_msg);
                        deffered.reject('There was an error');
                    }
                    // console.log(parsedResp);
                    deffered.resolve(parsedResp);

                }).error(function() {
                    deffered.reject();
                });

                return deffered.promise;
            }

            //here we are adding products support
            if (typeof(Products) !== 'undefined' && Products.length > 0) {
                service.getProductPrices = function getProductPrices() {
                    var id = 'product-prices';
                    var products = "";

                    angular.forEach(Products, function(item) {
                        products += item.id + ',';
                    });

                    var deffered = $q.defer();

                    if (dataCache.get(id)) {
                        deffered.resolve(dataCache.get(id));
                    } else {
                        $http({
                            method: 'POST',
                            cache: CacheFactory.get('cachelottoyard'),
                            url: RESTApiUrl,
                            timeout: 25000,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: 'action=lottery_data&m=globalinfo/get-prices-by-brand-and-productid&ProductIds=' + products
                        }).success(function(data) {
                            var resp;
                            try {
                                resp = data;
                            } catch (e) {
                                console.error("Parsing globalinfo/get-prices-by-brand-and-productid Error: %s Response: %s", e, data.error_msg);
                                deffered.reject('There was an error');
                            }
                            getProductPricesCompleted = true;

                            dataCache.put(id, resp);

                            deffered.resolve(resp);

                            // console.log(data);

                        }).error(function(response) {

                            if (counterProductPrices < MAX_REQUESTS) {
                                console.log('counterProductPrices:' + counterProductPrices);

                                $timeout(function() {
                                    service.getProductPrices();
                                }, 2500);

                                //getProductPrices();
                                counterProductPrices++;
                            } else {
                                console.warn("Error in getProductPricesCompleted: " + response);
                                deffered.reject('There was an error');
                            }

                        });
                    }

                    return deffered.promise;
                }

                service.getProductPriceById = function(productId, draws, lotteryType) {
                    var idcache = 'product-prices';

                    if (dataCache.get(idcache)) {
                        var cached = dataCache.get(idcache);
                        // debugger;
                        return getProductPriceFromArrayById(cached, productId, draws, lotteryType)[0];
                    } else {
                        this.getProductPrices().then(function(resp) {

                            return getProductPriceFromArrayById(resp, productId, draws, lotteryType)[0];
                        });
                    }
                };

                service.getProductPriceByIds = function(productId, draws, lotteryType, lines) {
                    var idcache = 'product-prices';
                    if (dataCache.get(idcache)) {
                        var cached = dataCache.get(idcache);
                        return getProductPriceFromArrayByIds(cached, productId, draws, lotteryType, lines)[0];
                    } else {
                        this.getProductPrices().then(function(resp) {
                            return getProductPriceFromArrayByIds(resp, productId, draws, lotteryType, lines)[0];
                        });
                    }
                };
            }
            //signUp
            service.signUp = function(data) {
                    data = $.param(data);
                    var deffered = $q.defer();
                    console.log(data);
                    $http({
                        method: 'POST',
                        url: RESTApiUrl,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'action=lottery_data&m=userinfo/signup&' + data
                    }).success(function(resp) {
                        var parsedResp;
                        //debugger;
                        try {
                            parsedResp = resp;
                        } catch (e) {
                            console.error("Parsing signup/signup-internal Error: %s Response: %s", e, resp.error_msg);
                        }
                        // console.log(parsedResp);

                        deffered.resolve(parsedResp);

                    }).error(function() {
                        deffered.reject();
                    });

                    return deffered.promise;
                }
                //get lotteries jackpots
                //get-all-brand-draws
            service.getAllBrandDraws = function getAllBrandDraws() {
                var id = 'get-all-brand-draws';
                var deffered = $q.defer();

                if (dataCache.get(id)) {
                    deffered.resolve(dataCache.get(id));
                } else {
                    $http({
                        method: 'POST',
                        cache: CacheFactory.get('cachelottoyard'),
                        url: RESTApiUrl,
                        timeout: 25000,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'action=lottery_data&m=globalinfo/get-all-brand-draws'
                    }).success(function(data) {
                        var resp;
                        try {
                            resp = data;
                        } catch (e) {
                            console.error("Parsing globalinfo/get-all-brand-draws Error: %s Response: %s", e, data.error_msg);
                            deffered.reject('There was an error');
                        }
                        getProductPricesCompleted = true;

                        dataCache.put(id, resp);

                        deffered.resolve(resp);

                    }).error(function(response) {

                        if (counterAllBrandDraws < MAX_REQUESTS) {
                            console.log('counterAllBrandDraws:' + counterAllBrandDraws);
                            $timeout(function() {
                                service.getAllBrandDraws();
                            }, 2500);
                            //getAllBrandDraws();
                            counterAllBrandDraws++;
                        } else {
                            console.warn("Error in counterAllBrandDraws: " + response);
                            deffered.reject('There was an error');
                        }
                    });
                }

                return deffered.promise;
            }

            return service;

        }])
        .service('myCacheFactory', ['CacheFactory', function(CacheFactory) {
            // Check to make sure the cache doesn't already exist
            if (!CacheFactory.get('cachelottoyard')) {
                return CacheFactory('cachelottoyard', {
                    maxAge: 60 * 60 * 1000, // Items added to this cache expire after 3 minutes
                    cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every 5 minutes
                    deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
                    storageMode: 'localStorage' // This cache will use `localStorage`.
                });
            }
        }])
        .service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart) {

            this.checkout = function() {

                var deferred = $q.defer();

                $log.info(ngCart.toObject());
                deferred.resolve({
                    cart: ngCart.toObject()
                });

                return deferred.promise;

            }

        }])
        .service('ngCart.fulfilment.http', ['$http', 'ngCart', function($http, ngCart) {

            this.checkout = function(settings) {
                return $http.post(settings.url, { data: ngCart.toObject(), options: settings.options });
            }
        }])
        .service('ngCart.translationService', ['ngCart', '$resource', '$http', 'cartTranslationUrl', function(ngCart, $resource, $http, cartTranslationUrl) {

            this.getTranslation = function($scope, language) {

                $scope.translation = translationObject;
                //    var service = this;
                //    var request = $http({
                //        method: "GET",
                //        url: cartTranslationUrl + '/translation_' + language + '.json',
                //    });
                //
                //    request.then(function (resp) {
                //        $scope.translation = resp.data;
                //    }, function (resp) {
                //        if (resp.status === 404) {
                //            service.getTranslation($scope, 'en');
                //        }
                //    });
                //var languageFilePath = '/Scripts/cartjs/translations/translation_' + language + '.json';
                //$resource(languageFilePath).get().$promise.then(function (data) {
                //    debugger;
                //         $scope.translation = data;
                //});
            };
        }])
        .service('ngCart.fulfilment.lottoyard', ['$http', 'ngCart', function($http, ngCart) {

            //debugger;
            var restApiUrl = CONFIG.adminURL;

            this.checkout = function(settings) {
                var data = ngCart.toObject();

                return $http({
                    method: 'POST',
                    url: restApiUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'm=lottery_data&action=cashier/prepare-order&data=' + encodeURIComponent(data)
                });
                //var deffered = $q.defer();

                //    $http({
                //        method: 'POST',
                //        url: restApiUrl,
                //        headers: {
                //            'Content-Type': 'application/x-www-form-urlencoded'
                //        },
                //        data: 'action=cashier/prepare-order&data=' + ngCart.toObject()
                //    }).success(function(data) {

                //        console.log(data);


                //        deffered.resolve(data);

                //    }).error(function() {

                //        deffered.reject('There was an error');
                //    });

                //    return deffered.promise;
            }

        }])
        .factory('ngCart.GetCountryByIpService', ['$http', '$q', function($http, $q) {
            var service = {};

            function getFromFreeGeoIp() {
                var deffered = $q.defer();
                $http({
                    url: 'https://freegeoip.net/json/',
                    timeout: 500
                }).success(function(location) {
                    if (location.country_code == null || location.country_code == undefined || location.country_code == 'undefined') {
                        return;
                    }
                    console.log("freegeoip.net success");
                    deffered.resolve(location.country_code);

                }).error(function() {

                    deffered.reject('There was an error');
                });

                return deffered.promise;
            }

            function getFromIp2c() {
                var deffered = $q.defer();
                $http({
                    url: 'http://ip-api.com/json',
                    timeout: 500
                }).success(function(location) {
                    console.log("ip-api.com success");
                    deffered.resolve(location.countryCode);

                }).error(function() {
                    deffered.reject('There was an error');
                });

                return deffered.promise;
            }

            function getFromMaxMind() {
                var deffered = $q.defer();

                // geoip2.country(function (data) {
                //     var countryCode = data.country.iso_code;
                //     deffered.resolve(countryCode);
                // }, function () {
                //     deffered.reject('There was an error');
                // });
                return deffered.promise;
            }

            service.getCountryCodeByIp = function() {

                var deffered = $q.defer();
                var resultOfFreeSerice = [];

                function toStartPaidService() {
                    console.log(resultOfFreeSerice);
                    if (resultOfFreeSerice.length === 2) {
                        if (resultOfFreeSerice.every(function(value, index, ar) {
                                if (value) {
                                    return false;
                                } else {
                                    return true;
                                }
                            })) {
                            console.log("starting paid service");

                            $q.when(getFromMaxMind(), (function(data) {
                                console.log(data);
                                deffered.resolve(data);
                            }));
                        } else if (resultOfFreeSerice.length === 2) {
                            console.log("fail");
                        }
                    }
                }

                $q.when(getFromMaxMind(), (function(data) {
                    console.log(data);
                    deffered.resolve(data);
                }));

                //$q.when(getFromFreeGeoIp(), (function (data) {
                //    console.log("freegeoip " + data);
                //    deffered.resolve(data);

                //}), function () {
                //    console.log("freegeoip failed");
                //    resultOfFreeSerice.push(false);
                //    toStartPaidService();
                //});

                //$q.when(getFromIp2c(), (function (data) {
                //    console.log("ip2c.org " + data);
                //    deffered.resolve(data);

                //}), function () {
                //    console.log("ip2c failed");
                //    resultOfFreeSerice.push(false);
                //    toStartPaidService();
                //});


                return deffered.promise;
            }

            return service;
        }])
        .factory('broadcastService', ['$rootScope', function($rootScope) {
            return {
                send: function(msg, data) {
                    $rootScope.$broadcast(msg, data);
                }
            }
        }])
        .filter('floor', function() {
            return function(input) {
                return Math.floor(input);
            };
        })
        .directive('validNumber', function() {
            return {
                require: '?ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    if (!ngModelCtrl) {
                        return;
                    }

                    ngModelCtrl.$parsers.push(function(val) {
                        if (angular.isUndefined(val)) {
                            var val = '';
                        }
                        var clean = val.replace(/[^0-9]+/g, '');
                        if (val !== clean) {
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                        return clean;
                    });

                    element.bind('keypress', function(event) {
                        if (event.keyCode === 32) {
                            event.preventDefault();
                        }
                    });
                }
            };
        })
        .directive('validNumberDecimal', function() {
            return {
                require: '?ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    if (!ngModelCtrl) {
                        return;
                    }

                    ngModelCtrl.$parsers.push(function(val) {
                        if (angular.isUndefined(val)) {
                            var val = '';
                        }
                        var clean = val.replace(/[^0-9\.]/g, '');
                        var decimalCheck = clean.split('.');

                        if (!angular.isUndefined(decimalCheck[1])) {
                            decimalCheck[1] = decimalCheck[1].slice(0, 2);
                            clean = decimalCheck[0] + '.' + decimalCheck[1];
                        }
                        if (val !== clean) {
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                        return clean;
                    });

                    element.bind('keypress', function(event) {
                        if (event.keyCode === 32) {
                            event.preventDefault();
                        }
                    });
                }
            };
        })
        .filter('translate', ['$rootScope', 'ErrorMessages', function($rootScope, ErrorMessages) {
            return function(items) {
                var filtered = [];
                var currentLangErrorsArr = ErrorMessages[$rootScope.language];
                if (typeof(items) !== "undefined" && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var err = currentLangErrorsArr.filter(function(x) {
                            if (x.error === item.ErrorMessage) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (err.length > 0) {
                            filtered.push(err[0].text);
                        } else {
                            filtered.push(item.ErrorMessage);
                        }
                    }
                }

                return filtered;
            };
        }]);
}());