jQuery(document).ready(function ($) {
  jQuery("#single_continue").click(function (e) {
    e.preventDefault();

    var isSubscription = false;
    var subscription = parseInt($('input[name="single_drawop"]:checked').val());
    if (subscription == 2) {
      isSubscription = true;
    }

    var data = {
      lotteryId: parseInt($("#lotteryId").val()),
      draws: parseInt($("#singledata .draws").text().split(" ")[0]),
      productId: 1,
      subscription: isSubscription,
    };
    //debugger;
    getProductDiscount(
      data.productId,
      data.draws,
      data.lotteryId,
      data.subscription
    );

    var lines = jQuery(".cardline").find(".selected").length;
    var minl = jQuery("#minl").val();
    var maxl = jQuery("#maxl").val();
    var even = jQuery("#even").val();

    if (minl.length === 0 || maxl.length === 0) {
      console.log("Fatal ERROR - Min/Max lines are empty, check API or DB!!!");
      return false;
    }
    //debugger;
    if (lines === 0 || lines < minl) {
      if (minl > 5) {
        var divs = jQuery("#row_1").find(".select_num_col");
        for (var i = 0; i < divs.length; i++) {
          jQuery(divs[i]).find(".quickpic_text").trigger("click");
        }

        var leftline =
          parseInt(minl) -
          parseInt(jQuery(".cardline").find(".selected").length);

        jQuery(".addlines").trigger("click");

        var divs1 = jQuery("#row_2").find(".select_num_col");
        for (var j = 0; j < leftline; j++) {
          jQuery(divs1[j]).find(".quickpic_text").trigger("click");
        }
      } else {
        var divs = jQuery("#row_1").find(".select_num_col").not(".selected");
        for (var i = 0; i < parseInt(minl) - lines; i++) {
          jQuery(divs[i]).find(".quickpic_text").trigger("click");
        }
      }

      var lines = jQuery(".cardline").find(".selected").length;
      //            return false;
    } else if (even && lines % 2 !== 0 && lines > minl) {
      jQuery(".cardline")
        .find(".selected")
        .last()
        .find(".quickpic_delete")
        .trigger("click");
      lines--;
    }

    if (lines >= minl && lines <= maxl) {
      var singbm = jQuery("#single").find(".bonusmoney").html();
      var singsubtp = jQuery("#single").find(".subtotal").html();
      var singtp = jQuery("#single").find(".totalprice").html();

      var selno = "";
      var newarr = "";
      jQuery(".cardline")
        .find(".selected")
        .each(function () {
          var row = jQuery(this).parents(".cardline").attr("id");

          var cardnum = jQuery(this).index();

          var option_all = jQuery(this)
            .find(".main_active")
            .map(function () {
              return jQuery(this).text();
            })
            .get()
            .join();

          var option_all1 = jQuery(this)
            .find(".extra_active")
            .map(function () {
              return jQuery(this).text();
            })
            .get()
            .join();

          if (option_all1.length > 0) {
            selno += option_all + "#" + option_all1 + "|";
            newarr +=
              row + "-" + cardnum + "=>" + option_all + "#" + option_all1 + "|";
          } else {
            selno += option_all + "|";
            newarr += row + "-" + cardnum + "=>" + option_all + "|";
          }
        });

      jQuery("#storeselected").val(newarr);
      jQuery("#lines").val(lines);
      jQuery("#selno").val(selno);
      jQuery("#singbm").val(singbm);
      jQuery("#singsubtp").val(singsubtp);
      jQuery("#singtp").val(singtp);

      var even;
      if (jQuery("#even").val() > 0) {
        even = true;
      } else {
        even = false;
      }

      var lotteryresults = {
        lotteryType: data.lotteryId,
        discount: 0,
        nooflines: lines,
        noofdraws: data.draws,
        numbers: selno,
        totalCost: singtp.replace(/\u20ac/g, ""),
        selectedTab: "single",
        personalSettingsIndex: subscription,
        personalComboBoxSelectionIndex: 1,
        evenLinesOnly: even,
      };
      $("#submitform").click();
      //console.log('personal-ticket-object --->', lotteryresults);
      //debugger;
      /*var scope = angular.element(
	              document.
	              getElementById("Head1")).
	              scope();
	            scope.$apply(function () {
	                scope.saveToCart(lotteryresults, true);
	        });*/
    } else {
      jQuery("#errorbox").html(
        "Ticket lines must between " + minl + " and " + maxl
      );
      jQuery("#errorbox").parent().removeClass("hide");
    }
  });

  $("input[name='single_drawop']").click(function () {
    var isSubscription = false;
    if (parseInt($('input[name="single_drawop"]:checked').val()) == 2) {
      isSubscription = true;
    }

    var data = {
      lotteryId: parseInt($("#lotteryId").val()),
      draws: parseInt($("#singledata .draws").text().split(" ")[0]),
      productId: 1, //personal
      subscription: isSubscription,
    };

    getProductDiscount(
      data.productId,
      data.draws,
      data.lotteryId,
      data.subscription
    );
  });

  jQuery("#group_continue").click(function (e) {
    e.preventDefault();
    var grpbm = jQuery("#group").find(".bonusmoney").html();
    var grpsubtp = jQuery("#group").find(".subtotal").html();
    var grptp = jQuery("#group").find(".totalprice").html();

    jQuery("#grpbm").val(grpbm);
    jQuery("#grpsubtp").val(grpsubtp);
    jQuery("#grptp").val(grptp);

    var subscription = parseInt($('input[name="group_drawop"]:checked').val());

    var data = {
      lotteryId: parseInt($("#lotteryId").val()),
      draws: parseInt($("#groupdata .draws").text().split(" ")[0]),
    };

    var lotteryresults = {
      lotteryType: data.lotteryId,
      discount: 0,
      selectedTab: "groupselection",
      totalCost: grpbm.replace(/\u20ac/g, ""),
      groupdiscount: 0,
      groupnodraws: data.draws,
      groupnoshares: parseInt($('input[name="quantity"]').val()),
      groupSettingsIndex: subscription,
      groupComboBoxSelectionIndex: 2,
      grouptotal: grpbm.replace(/\u20ac/g, ""),
      originalprice: 1,
      grouporiginalprice: 1,
    };

    //console.log('group-ticket-object --->', lotteryresults);
    //debugger;
    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      scope.saveToCart(lotteryresults, true);
    });
  });

  if (CONFIG.isThankYouPage) {
    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      scope.emptyCart();
    });
  }

  if (CART_CONFIG.CART_PRODUCTS) {
    //debugger;
    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      var parsedProducts = JSON.parse(CART_CONFIG.CART_PRODUCTS.Products);
      var parsedProductsHash = CART_CONFIG.CART_PRODUCTS.Hash;
      var lengthArr = parsedProducts.length;
      for (var i = 0; i < lengthArr; i++) {
        if (i + 1 === lengthArr) {
          scope.saveToCartPredefined(
            parsedProducts[i],
            parsedProductsHash,
            true
          );
        } else {
          scope.saveToCartPredefined(
            parsedProducts[i],
            parsedProductsHash,
            false
          );
        }
      }
    });
  }
});

function getProductPrices(productId, draws, lotteryType) {
  var result = productPrices.filter(function (x) {
    if (
      x.ProductId === productId &&
      x.NumOfDraws === draws &&
      x.LotteryId === lotteryType
    ) {
      return true;
    } else {
      return false;
    }
  });

  return result[0];
}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

function buyNowProductBtn(productId, draws, lotteryType, qty) {
  //we will use 999 for American Product and 998 for EuroJackpot
  //debugger;
  if (productId === 999) {
    //PB NY MM
    var itemToSavePb = {
      ProductId: 3,
      LotteryId: 1,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(3, draws, 1).price,
      Qty: qty,
    };

    var itemToSaveNy = {
      ProductId: 3,
      LotteryId: 14,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(3, draws, 14).price,
      Qty: qty,
    };

    var itemToSaveMM = {
      ProductId: 3,
      LotteryId: 2,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(3, draws, 2).price,
      Qty: qty,
    };

    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      scope.saveToCartProduct(itemToSavePb);
      scope.saveToCartProduct(itemToSaveNy);
      scope.saveToCartProduct(itemToSaveMM, true);
    });
  } else if (productId === 998) {
    //EE EJ

    var itemToSaveEe = {
      ProductId: 3,
      LotteryId: 5,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(3, draws, 5).price,
      Qty: qty,
    };

    var itemToSaveEj = {
      ProductId: 3,
      LotteryId: 9,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(3, draws, 9).price,
      Qty: qty,
    };

    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      scope.saveToCartProduct(itemToSaveEe);
      scope.saveToCartProduct(itemToSaveEj, true);
    });
  } else {
    var itemToSave = {
      ProductId: productId,
      LotteryId: lotteryType,
      Draws: draws,
      Price: calculatePriceAndDiscountByDraws(productId, draws, lotteryType)
        .price,
      Qty: qty,
    };

    var scope = angular.element(document.getElementById("Head1")).scope();
    scope.$apply(function () {
      scope.saveToCartProduct(itemToSave, true);
    });
  }
}

function getProductDiscount(productId, draws, LotteryTypeId, subscription) {
  var lotteries_rule = localStorage.getItem(
    "cachefactory.caches.cachelottoyard.data.lottery-rules"
  );

  var disc = 0;
  if (typeof lotteries_rule !== "undefined" || lotteries_rule !== null) {
    if (typeof subscription === "undefined" || subscription === null) {
      subscription = false;
    }
    var lotteries_rule_parsed = JSON.parse(lotteries_rule);
    if (lotteries_rule_parsed == null) {
      //window.location.reload();
      alert(
        "Your device is not fully supported! Please turn off Private/Incognito browsing."
      );
    }
    var result = lotteries_rule_parsed.value.filter(function (x) {
      if (x.LotteryTypeId === LotteryTypeId) {
        return true;
      } else {
        return false;
      }
    });

    result = result[0].ProductsDrawOptions.filter(function (y) {
      if (y.ProductId === productId && y.IsSubscription === subscription) {
        return true;
      }
    });

    var discount = result[0].MultiDrawOptions.filter(function (draw) {
      if (draw.NumberOfDraws === draws) {
        return true;
      }
    });

    if (typeof discount !== "undefined" && discount.length > 0) {
      jQuery("#minl").val(discount[0].MinLines);
      jQuery("#maxl").val(discount[0].MaxLines);
      disc = discount[0].Discount;
    }
  }
  return disc;
}

function calculatePriceAndDiscountByDraws(productId, draws, lotteryTypeId) {
  //debugger;
  var totalPrice, discount, price;

  if (productId == 999) {
    var firstPrice = getProductPrices(3, draws, 1).Price;
    var secondPrice = getProductPrices(3, draws, 14).Price;
    var thirdPrice = getProductPrices(3, draws, 2).Price;
    var firstDiscount = (
      firstPrice / (1 - getProductDiscount(3, draws, 1)) -
      firstPrice
    ).toFixed(2);
    var secondDiscount = (
      secondPrice / (1 - getProductDiscount(3, draws, 14)) -
      secondPrice
    ).toFixed(2);
    var thirdDiscount = (
      thirdPrice / (1 - getProductDiscount(3, draws, 2)) -
      thirdPrice
    ).toFixed(2);

    totalPrice = (firstPrice + secondPrice + thirdPrice).toFixed(2);
    discount = (
      parseFloat(firstDiscount) +
      parseFloat(secondDiscount) +
      parseFloat(thirdDiscount)
    ).toFixed(2);
  } else if (productId == 998) {
    var firstPrice = getProductPrices(3, draws, 5).Price;
    var secondPrice = getProductPrices(3, draws, 9).Price;
    var firstDiscount = (
      firstPrice / (1 - getProductDiscount(3, draws, 5)) -
      firstPrice
    ).toFixed(2);
    var secondDiscount = (
      secondPrice / (1 - getProductDiscount(3, draws, 9)) -
      secondPrice
    ).toFixed(2);

    totalPrice = (firstPrice + secondPrice).toFixed(2);
    discount = (parseFloat(firstDiscount) + parseFloat(secondDiscount)).toFixed(
      2
    );
  } else {
    price = parseFloat(getProductPrices(productId, draws, lotteryTypeId).Price);
    if (productId == 14) {
      discount = (0).toFixed(2);
    } else {
      discount = (
        price / (1 - getProductDiscount(productId, draws, lotteryTypeId)) -
        price
      ).toFixed(2);
    }

    totalPrice = price;
  }

  return { price: totalPrice, discount: discount };
}

function viewMorePopUp(productId, draws, lotteryTypeId) {
  //debugger;
  $(".cart-popup").fadeIn();

  selectedProductId = productId;
  selectedLotteryTypeId = lotteryTypeId;

  if (productId == 999) {
    $("#popUpTitle").text("American Group");
    $("#popUpText").text(
      "Win the biggest lottery jackpot in the world! Boost your winning odds by 5000%. With our Groups you get more tickets, win more and pay less."
    );
    $("#popUpProduct").html(
      '<img src="' +
        CONFIG.templateURL +
        '/images/product-logo-america.png" alt="" />'
    );
  } else if (productId == 998) {
    $("#popUpTitle").text("Euro Group");
    $("#popUpText").text(
      "Play it European style, with 3 of the biggest lotteries in Europe. All lucky-star and Euro number combinations are covered, making you a winner on every draw."
    );
    $("#popUpProduct").html(
      '<img src="' +
        CONFIG.templateURL +
        '/images/product-logo-euro.png" alt="" />'
    );
  } else if (productId == 14) {
    $("#popUpTitle").text("Jackpot Hunter");
    $("#popUpText").text(
      "Never miss a BIG Jackpot! With the â€˜Jackpot Hunterâ€™ you will always play the biggest Jackpot at any given time with at least 100 tickets!"
    );
    $("#popUpProduct").html(
      '<img src="' +
        CONFIG.templateURL +
        '/images/product-logo-tophunter.png" alt="" />'
    );
  } else {
    if (lotteryTypeId == 1) {
      $("#popUpTitle").text("Powerball");
      $("#popUpText").text(
        "Win the biggest lottery jackpot in the world! Boost your winning odds by 5000%. With our Groups you get more tickets, win more and pay less."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoPowerBall"></div>'
      );
    }
    if (lotteryTypeId == 2) {
      $("#popUpTitle").text("MegaMillions");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoMegaMillions"></div>'
      );
    }
    if (lotteryTypeId == 3) {
      $("#popUpTitle").text("Lotto649");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoLotto649"></div>'
      );
    }
    if (lotteryTypeId == 4) {
      $("#popUpTitle").text("LaPrimitiva");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoLaPrimitiva"></div>'
      );
    }
    if (lotteryTypeId == 5) {
      $("#popUpTitle").text("EuroMillions");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoEuroMillions"></div>'
      );
    }
    if (lotteryTypeId == 8) {
      $("#popUpTitle").text("SuperEnalotto");
      $("#popUpText").text(
        "Beat the lottery with a Group. Play with hundreds of tickets each draw, increase your winning odds by 5000% and pay only a fraction of the price."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoSuperEnalotto"></div>'
      );
    }
    if (lotteryTypeId == 9) {
      $("#popUpTitle").text("EuroJackpot");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoEuroJackpot"></div>'
      );
    }
    if (lotteryTypeId == 10) {
      $("#popUpTitle").text("ElGordo");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoElGordo"></div>'
      );
    }
    if (lotteryTypeId == 11) {
      $("#popUpTitle").text("BonoLoto");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoElGordo"></div>'
      );
    }
    if (lotteryTypeId == 12) {
      $("#popUpTitle").text("UkLotto");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoUkLotto"></div>'
      );
    }
    if (lotteryTypeId == 14) {
      $("#popUpTitle").text("NewYorkLotto");
      $("#popUpText").text(
        "Itâ€™s a game of quantity. Get more tickets and enjoy higher winning odds."
      );
      $("#popUpProduct").html(
        '<div className="lottinner sliderlogoNewYorkLotto"></div>'
      );
    }
  }

  if (productId == 14) {
    $("#DrawsSelect").html(
      '<option value="2">2</option>' +
        '<option value="4">4</option>' +
        '<option value="8">8</option>' +
        '<option value="26">26</option>' +
        '<option value="52">52</option>' +
        '<option value="100">100</option>'
    );
  } else {
    $("#DrawsSelect").html(
      '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="4">4</option>' +
        '<option value="8">8</option>' +
        '<option value="26">26</option>' +
        '<option value="52">52</option>' +
        '<option value="100">100</option>'
    );
  }

  var total = calculatePriceAndDiscountByDraws(productId, draws, lotteryTypeId);
  $("#PopUpTotalSum b").html(CONFIG.siteCurrency + total.price);
  $("#popupDiscount").html(CONFIG.siteCurrency + total.discount);
}

function viewMorePopUpHide() {
  $(".cart-popup").fadeOut();
}
