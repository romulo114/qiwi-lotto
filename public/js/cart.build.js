function Mapper(e, t) {
  (this.inputCart = e),
    (this.CreditCard = t),
    (this.initialize = function () {
      var e = [];
      return (
        this.inputCart.items.forEach(function (t) {
          var r;
          if (999 == t.getProductIdSpecial()) {
            var n = !1;
            e.forEach(function (e) {
              e.guid == t.getGuid() && (n = !0);
            }),
              (r = new OlapProduct(
                t.getLotteryType(),
                t.getNumberOfDraws(),
                t.getNumberOfLines(),
                t.getId(),
                t.getIsFastProcessing(),
                !t.getIsSubscription(),
                ["1,2,3,4,5,6"],
                t.getQuantity(),
                t.getGuid(),
                t.getProductIdSpecial(),
                t.getOriginalPrice()
              ));
          } else
            switch (t.getProductType()) {
              case 1:
                r = new PersonalProduct(
                  t.getLotteryType(),
                  t.getNumberOfDraws(),
                  t.getNumberOfLines(),
                  t.getId(),
                  t.getIsFastProcessing(),
                  !t.getIsSubscription(),
                  t.getNumbersSantized(),
                  t.getQuantity()
                );
                break;
              case 3:
                r = new GroupProduct(
                  t.getLotteryType(),
                  t.getNumberOfDraws(),
                  t.getGroupnoshares(),
                  t.getId(),
                  t.getIsFastProcessing(),
                  !t.getIsSubscription(),
                  t.getQuantity()
                );
                break;
              case 2:
              case 4:
              case 5:
              case 6:
              case 14:
              case 18:
              case 19:
              case 666:
                r = new NavidadProduct(
                  t.getProductType(),
                  t.getLotteryType(),
                  t.getNumberOfDraws(),
                  t.getNumberOfLines(),
                  t.getId(),
                  t.getIsFastProcessing(),
                  !t.getIsSubscription(),
                  new Array(t.getNumbersSantized().join("/")),
                  t.getQuantity()
                );
                break;
              case 15:
              case 20:
              case 24:
              case 26:
              case 31:
                r = new NavidadProduct(
                  t.getProductType(),
                  t.getLotteryType(),
                  t.getNumberOfDraws(),
                  t.getNumberOfLines(),
                  t.getId(),
                  t.getIsFastProcessing(),
                  !t.getIsSubscription(),
                  new Array(t.getTicketsNumbersId().join()),
                  t.getQuantity()
                );
                break;
              default:
                throw "No such handler!Mapper.js";
            }
          r && e.push(r);
        }),
        e
      );
    }),
    (this.outputCart = this.initialize());
}
function Product(e, t, r, n, o, a, i, s, c) {
  (this.MemberId = "{0}"),
    (this.ProductId = e),
    (this.LotteryTypeID = t),
    (this.numOfDraws = r),
    (this.numOfLines = n),
    (this.externalId = o),
    (this.isVip = a),
    (this.isCash = i),
    (this.selectedNumbers = s),
    (this.Quantity = c);
}
function PersonalProduct(e, t, r, n, o, a, i, s) {
  Product.call(this, 1, e, t, r, n, o, a, i, s);
}
function Product666(e, t, r, n, o, a, i, s) {
  Product.call(this, 666, e, t, r, n, o, a, i, s);
}
function GroupProduct(e, t, r, n, o, a, i) {
  Product.call(this, 3, e, t, r, n, o, a, [""], i);
}
function NavidadProduct(e, t, r, n, o, a, i, s, c) {
  Product.call(this, e, t, r, n, o, a, i, s, c);
}
function SpecialProduct(e, t, r, n, o, a, i, s, c) {
  Product.call(this, e, t, r, n, o, a, i, s, c);
}
function OlapProduct(e, t, r, n, o, a, i, s, c, u, d) {
  Product.call(this, 999, e, t, r, n, o, a, i, s),
    (this.guid = c),
    (this.productIdSpecial = u),
    (this.amount = d);
}
function PrepareOrderRequest(e, t) {
  (this.ReedemCode = t ? t : ""), (this.ProductNumsLottery = e);
}
function ConfirmOrderRequest(e, t, r, n, o, a) {
  (this.PhoneOrEmail = e),
    (this.ProcessorApi = t ? t : ""),
    (this.ReedemCode = r ? r : ""),
    n && (this.PaymentMethodId = n),
    (this.AffiliateId = o),
    a && (this.OlapAffiliateId = a),
    (this.SessionId = "{0}"),
    (this.MemberId = "{0}"),
    (this.OrderData = []);
}
function OrderDataItem(e, t, r, n, o) {
  (this.EmailCode = "{emailcode}"),
    (this.productCounter = e),
    (this.numOfDraws = t),
    (this.numOfLines = r),
    (this.Quantity = n),
    (this.linesData = []);
}
function LineDataItem(e, t, r, n, o, a) {
  (this.MemberId = "{0}"),
    (this.LotteryTypeID = e),
    (this.SelectedNumbers = t),
    (this.IsVIP = r),
    (this.IsCash = n),
    (this.isOnline = o),
    (this.ProductID = a);
}
function inheritPrototype(e, t) {
  var r = Object.create(t.prototype);
  (r.constructor = e), (e.prototype = r);
}
function validateCreditCardNumber(e, t) {
  function r(e) {
    if (/[^0-9-\s]+/.test(e)) return !1;
    var t = 0,
      r = 0,
      n = !1;
    e = e.replace(/\D/g, "");
    for (var o = e.length - 1; o >= 0; o--) {
      var a = e.charAt(o),
        r = parseInt(a, 10);
      n && (r *= 2) > 9 && (r -= 9), (t += r), (n = !n);
    }
    return t % 10 == 0;
  }
  var n = e.trim(),
    o = "Card number";
  return (
    "undefined" != typeof t && (o = t),
    "" === n
      ? o + " should not be empty!"
      : e.length < 16
      ? o + " is not a valid number"
      : r(n)
      ? ""
      : o + " is not a valid number"
  );
}
function _getCreditCardType(e) {
  var t = new RegExp("^4");
  return null != e.match(t)
    ? "Visa"
    : ((t = new RegExp("^5[1-5]")),
      null != e.match(t)
        ? "Mastercard"
        : ((t = new RegExp("^3[47]")),
          null != e.match(t)
            ? "AMEX"
            : ((t = new RegExp(
                "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
              )),
              null != e.match(t)
                ? "Discover"
                : ((t = new RegExp("^36")),
                  null != e.match(t)
                    ? "Diners"
                    : ((t = new RegExp("^30[0-5]")),
                      null != e.match(t)
                        ? "Diners - Carte Blanche"
                        : ((t = new RegExp("^35(2[89]|[3-8][0-9])")),
                          null != e.match(t)
                            ? "JCB"
                            : ((t = new RegExp(
                                "^(4026|417500|4508|4844|491(3|7))"
                              )),
                              null != e.match(t)
                                ? "Visa Electron"
                                : "Visa")))))));
}
function deepCopy(e) {
  if ("[object Array]" === Object.prototype.toString.call(e)) {
    for (var t = [], r = 0, n = e.length; r < n; r++)
      t[r] = arguments.callee(e[r]);
    return t;
  }
  if ("object" == typeof e) {
    var r,
      t = {};
    for (r in e) t[r] = arguments.callee(e[r]);
    return t;
  }
  return e;
}
var icelotto = angular.module("myApp", [
  "ngCart",
  "angular-cache",
  "ngResource",
  "ngDialog",
  "fancyboxplus",
  "countdownApp",
  "animateNumbersModule",
]);
icelotto.value("RESTApiUrl", CONFIG.adminURL),
  icelotto.value("cartTranslationUrl", CART_CONFIG.CART_TRANSLATION_URL),
  icelotto.constant("PaymentSystems", [
    {
      name: "creditcard",
      logo: "creditcards.png",
      processor: "CreditCard",
      needmoreinfo: 1,
    },
  ]),
  icelotto.constant("Products", [
    { id: "1", Name: "Personal" },
    { id: "2", Name: "PersonalAndGroup" },
    { id: "3", Name: "Group" },
    { id: "14", Name: "TopLottoGroup" },
  ]),
  icelotto.constant("ErrorMessages", {
    en: [
      {
        error: "'Email' is not a valid email address.",
        text: "Email is not a valid email address.",
      },
      {
        error: "Email already exists.",
        text: "You already have an account with us, please login.",
      },
      {
        error: "Please insert valid password",
        text: "Password length must be between 7 to 20 characters.",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name.",
      },
      {
        error: "Name must not include numbers and be 2-20 characters.",
        text: "Name must not include numbers and be 2-20 characters.",
      },
      {
        error: "'Email' should not be empty",
        text: "'Email' should not be empty.",
      },
      { error: "Invalid Email format", text: "Invalid Email format." },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "Mobile Number is not a valid phone number!",
      },
      {
        error: "Credit card number length is invalid",
        text: "Credit card number length is invalid.",
      },
      { error: "The Min Deposit Is 2EUR", text: "The Min Deposit Is 2EUR." },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Credit Card number is invalid.",
      },
      {
        error: "CreditCardAlreadyExist",
        text: "This Credit Card already exists.",
      },
      { error: "Enter credit card", text: "Enter credit card." },
      {
        error: "Please agree with our Terms and Conditions!",
        text: "Please agree with our Terms and Conditions!",
      },
      {
        error: "Please type your full name",
        text: "Please type your full name.",
      },
      {
        error: "Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number.",
      },
      {
        error: "Please insert Expiration Date",
        text: "Please insert Expiration Date.",
      },
      {
        error: "Please insert Expiration Year",
        text: "Please insert Expiration Year.",
      },
      {
        error: "Please insert Expiration Month",
        text: "Please insert Expiration Month.",
      },
      {
        error: "Please insert your cvv number",
        text: "Please insert your cvv number.",
      },
      {
        error: "Please enter valid card expiration date!",
        text: "Please enter valid card expiration date.",
      },
      { error: "The Min Deposit Is 5EUR", text: "The Min Deposit Is 5EUR." },
      { error: "ProcessorRequestFaild", text: "Failed." },
      { error: "BankDeclainTransaction", text: "Bank Declines Transaction." },
      { error: "Bad format detected", text: "Bad format detected." },
      {
        error: "TransactionNotPermittedOnCard",
        text: "Transaction not permitted on Card.",
      },
      { error: "UnknownError", text: "Failed." },
      { error: "ErrorPurchaseProducts", text: "Error Purchase Products." },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format.",
      },
      {
        error:
          "CVV -> 'C V V' is not in the correct format.CardNumber -> Card Number is not a valid credit card number",
        text: "Credit Card number is invalid!",
      },
    ],
    de: [
      {
        error: "Name must not include numbers and be 2-20 characters",
        text: "Name must not include numbers and be 2-20 characters",
      },
      {
        error: "Email already exists.",
        text: "Sie haben bereits ein Konto bei uns, bitte anmelden",
      },
      {
        error: "Please insert valid password",
        text: "Bitte geben gültigen passwort",
      },
      {
        error: "Please insert valid full name",
        text: "Bitte geben gültigen Vornamen",
      },
      {
        error: "'Email' should not be empty.",
        text: "Ungültige E-Mail foramt",
      },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "- Zahlen bestehen",
      },
      { error: "Login failed", text: "Username or password are incorrect" },
      { error: "Please insert valid email", text: "Please insert valid email" },
      {
        error: "Please insert valid password",
        text: "Please insert valid password",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name",
      },
      {
        error: "Please insert valid phone number",
        text: "Please insert valid phone number",
      },
      {
        error: "Password length must be between 7 to 20 characters",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please type your full name",
        text: "Bitte geben Sie Ihren vollständigen Namen ein",
      },
      {
        error: "Credit card number length is invalid",
        text: "Die Länge der Kreditkartennummer ist ungültig",
      },
      {
        error: "Please insert your cvv number",
        text: "Bitte geben Sie Ihre CVV-Nummer ein",
      },
      {
        error: "Please insert Expiration Date",
        text: "Bitte geben Sie das Ablaufdatum ein",
      },
      {
        error: "Please insert Expiration Year",
        text: "Bitte geben Sie das Ablaufjahr ein",
      },
      { error: "Expiration date is wrong", text: "Ablaufdatum ist falsch" },
      {
        error: "Please accept our Terms and Conditions",
        text: "Bitte akzeptieren Sie unsere AGBs",
      },
      {
        error: "CVV must contain 3-4 digits",
        text: "Der CVV muss aus 3-4 Ziffern bestehen",
      },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number",
      },
      { error: "CreditCardAlreadyExist ", text: "Credit Card Already Exists" },
      {
        error: "CVV -> 'C V V' is not in the correct format",
        text: "CVV is not in the correct format",
      },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format",
      },
    ],
    fr: [
      {
        error: "Name must not include numbers and be 2-20 characters",
        text: "Name must not include numbers and be 2-20 characters",
      },
      {
        error: "Email already exists.",
        text: "Vous avez déjà un compte avec nous, s'il vous plaît connecter",
      },
      {
        error: "Please insert valid password",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please insert valid full name",
        text: "Name must not include numbers and be 2-20 characters.",
      },
      { error: "'Email' should not be empty.", text: "Invalid Email format" },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "Phone should contain numbers only!!",
      },
      { error: "Login failed", text: "Username or password are incorrect" },
      { error: "Please insert valid email", text: "Please insert valid email" },
      {
        error: "Please insert valid password",
        text: "Please insert valid password",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name",
      },
      {
        error: "Please insert valid phone number",
        text: "Please insert valid phone number",
      },
      {
        error: "Password length must be between 7 to 20 characters",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please type your full name",
        text: "Veuillez saisir votre nom complet",
      },
      {
        error: "Credit card number length is invalid",
        text: "La longueur du numéro de carte de crédit est invalide",
      },
      {
        error: "Please insert your cvv number",
        text: "Veuillez indiquer votre numéro CVV",
      },
      {
        error: "Please insert Expiration Date",
        text: "Veuillez saisir la date d'expiration",
      },
      {
        error: "Please insert Expiration Year",
        text: "Veuillez saisir l'année d'expiration",
      },
      {
        error: "Expiration date is wrong",
        text: "La date d'expiration est incorrecte",
      },
      {
        error: "Please accept our Terms and Conditions",
        text: "Veuillez accepter nos Conditions générales",
      },
      {
        error: "CVV must contain 3-4 digits",
        text: "Le numéro CVV doit comporter 3 à 4 chiffres",
      },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number",
      },
      { error: "CreditCardAlreadyExist ", text: "Credit Card Already Exists" },
      {
        error: "CVV -> 'C V V' is not in the correct format",
        text: "CVV is not in the correct format",
      },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format",
      },
    ],
    ru: [
      {
        error: "Name must not include numbers and be 2-20 characters",
        text: "Name must not include numbers and be 2-20 characters",
      },
      {
        error: "Email already exists.",
        text: "У вас уже есть аккаунт в нашей системе, пожалуйста, войдите",
      },
      {
        error: "Please insert valid password",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please insert valid full name",
        text: "Name must not include numbers and be 2-20 characters.",
      },
      { error: "'Email' should not be empty.", text: "Invalid Email format" },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "Phone should contain numbers only!!",
      },
      { error: "Login failed", text: "Username or password are incorrect" },
      { error: "Please insert valid email", text: "Please insert valid email" },
      {
        error: "Please insert valid password",
        text: "Please insert valid password",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name",
      },
      {
        error: "Please insert valid phone number",
        text: "Please insert valid phone number",
      },
      {
        error: "Password length must be between 7 to 20 characters",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please type your full name",
        text: "Введите свое имя и фамилию",
      },
      {
        error: "Credit card number length is invalid",
        text: "Неверная длина номера кредитной карты",
      },
      { error: "Please insert your cvv number", text: "Укажите свой CVV-код" },
      {
        error: "Please insert Expiration Date",
        text: "Введите день срока истечения срока деятельности",
      },
      {
        error: "Please insert Expiration Year",
        text: "Введите год истечения срока действия",
      },
      {
        error: "Expiration date is wrong",
        text: "Неверная дата истечения срока годности",
      },
      {
        error: "Please accept our Terms and Conditions",
        text: "Примите наши Положения и условия ",
      },
      {
        error: "CVV must contain 3-4 digits",
        text: "CVV-код должен содержать 3-4 цифры",
      },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number",
      },
      { error: "CreditCardAlreadyExist ", text: "Credit Card Already Exists" },
      {
        error: "CVV -> 'C V V' is not in the correct format",
        text: "CVV is not in the correct format",
      },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format",
      },
    ],
    es: [
      {
        error: "Name must not include numbers and be 2-20 characters",
        text: "Name must not include numbers and be 2-20 characters",
      },
      {
        error: "Email already exists.",
        text: "You already have an account with us, please login",
      },
      {
        error: "Please insert valid password",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please insert valid full name",
        text: "Name must not include numbers and be 2-20 characters.",
      },
      { error: "'Email' should not be empty.", text: "Invalid Email format" },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "Phone should contain numbers only!!",
      },
      { error: "Login failed", text: "Username or password are incorrect" },
      { error: "Please insert valid email", text: "Please insert valid email" },
      {
        error: "Please insert valid password",
        text: "Please insert valid password",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name",
      },
      {
        error: "Please insert valid phone number",
        text: "Please insert valid phone number",
      },
      {
        error: "Password length must be between 7 to 20 characters",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please type your full name",
        text: "Escriba su nombre completo, por favor",
      },
      {
        error: "Credit card number length is invalid",
        text: "La longitud del número de la tarjeta de crédito no es válida",
      },
      {
        error: "Please insert your cvv number",
        text: "Introduzca, por favor, el código CVV de detrás",
      },
      {
        error: "Please insert Expiration Date",
        text: "Por favor, introduzca la fecha de caducidad",
      },
      {
        error: "Please insert Expiration Year",
        text: "Por favor, introduzca el año en que caduca",
      },
      {
        error: "Expiration date is wrong",
        text: "La fecha de caducidad está equivocada",
      },
      {
        error: "Please accept our Terms and Conditions",
        text: "Acepte, por favor, nuestros Términos y condiciones",
      },
      {
        error: "CVV must contain 3-4 digits",
        text: "El CVV debe tener 3-4 dígitos",
      },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number",
      },
      { error: "CreditCardAlreadyExist ", text: "Credit Card Already Exists" },
      {
        error: "CVV -> 'C V V' is not in the correct format",
        text: "CVV is not in the correct format",
      },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format",
      },
    ],
    nl: [
      {
        error: "Name must not include numbers and be 2-20 characters",
        text: "Name must not include numbers and be 2-20 characters",
      },
      {
        error: "Email already exists.",
        text: "You already have an account with us, please login",
      },
      {
        error: "Please insert valid password",
        text: "Password length must be between 7 to 20 characters",
      },
      {
        error: "Please insert valid full name",
        text: "Name must not include numbers and be 2-20 characters.",
      },
      { error: "'Email' should not be empty.", text: "Invalid Email format" },
      {
        error: "Property Mobile Number is not a valid phone number!",
        text: "Phone should contain numbers only!!",
      },
      { error: "Login failed", text: "Username or password are incorrect" },
      { error: "Please insert valid email", text: "Please insert valid email" },
      {
        error: "Please insert valid password",
        text: "Please insert valid password",
      },
      {
        error: "Please insert valid full name",
        text: "Please insert valid full name",
      },
      {
        error: "Please insert valid phone number",
        text: "Please insert valid phone number",
      },
      {
        error: "Password length must be between 7 to 20 characters",
        text: "Password length must be between 7 to 20 characters",
      },
      { error: "Please type your full name", text: "Typ je volledige naam" },
      {
        error: "Credit card number length is invalid",
        text: "Lengte van het creditcardnummer is ongeldig",
      },
      { error: "Please insert your cvv number", text: "Vul je CVC-nummer in" },
      { error: "Please insert Expiration Date", text: "Vul de vervaldatum in" },
      { error: "Please insert Expiration Year", text: "Vul het vervaljaar in" },
      { error: "Expiration date is wrong", text: "De vervaldatum is onjuist" },
      {
        error: "Please accept our Terms and Conditions",
        text: "Ga akkoord met onze algemene voorwaarden",
      },
      {
        error: "CVV must contain 3-4 digits",
        text: "CVC moet 3-4 cijfers bevatten",
      },
      {
        error: "CardNumber -> Card Number is not a valid credit card number",
        text: "Card Number is not a valid credit card number",
      },
      { error: "CreditCardAlreadyExist ", text: "Credit Card Already Exists" },
      {
        error: "CVV -> 'C V V' is not in the correct format",
        text: "CVV is not in the correct format",
      },
      {
        error: "CVV -> 'C V V' is not in the correct format.",
        text: "CVV is not in the correct format",
      },
    ],
  }),
  angular.module("myApp").controller("mainCtrl", [
    "$scope",
    "$http",
    "ngCart",
    "$rootScope",
    "ngCart.lottoyard.api",
    "$q",
    "$timeout",
    function (e, t, r, n, o, a, i) {
      ($ = jQuery),
        r.setFastProcessingTax(0.79),
        r.setAffiliateCode(parseInt(CONFIG.affiliateId)),
        r.setOlapAffiliateCode(parseInt(CART_CONFIG.CART_OLAP_AFFILIATE_CODE)),
        r.setReedemCode(CONFIG.cartPromoCode),
        (n.isFirstTimePurchase = parseInt(
          CART_CONFIG.CART_IS_FIRSTTIME_PURCHASE
        )),
        (n.isAuthenticated = CONFIG.isLogin),
        (n.cartPartialsPath = CART_CONFIG.CART_PARTIALS_URI),
        (n.language = CONFIG.siteLang),
        (n.cartUrlWithLang =
          "en" !== n.language ? "/" + n.language + "/cart/" : "/cart/"),
        (n.sessionId = CONFIG.sessionId),
        console.log("$rootScope.language", n.language),
        (n.topJacktop = {});
      var s = n.cartUrlWithLang;
      n.isFirstTimePurchase &&
        (console.log("Getting free ticket:"),
        o.getFreeTicket().then(function (e) {
          console.log(e), console.log("got free ticket");
        })),
        (e.initCartCalls = function () {
          o.getAllBrandDraws().then(function (e) {
            var t = e[0];
            angular.forEach(function (e) {
              e.Jackpot > t.Jackpot && (t = e);
            }),
              (n.topJacktop = t),
              console.log("Top jacktop lottery: ", t);
          }),
            o
              .getAllLotteriesRules()
              .then(o.getAllProductsRules())
              .then(o.getProductPrices())
              .then(function () {
                console.log("init loaded"),
                  $("body").find(".loading").removeClass("loading");
              });
        }),
        (e.saveToCartPredefined = function (e, t, n) {
          console.log(e),
            o
              .getAllLotteriesRules()
              .then(o.getAllProductsRules())
              .then(o.getProductPrices())
              .then(function () {
                r.addItemPredifined(
                  e.ProductId,
                  e.LotteryID,
                  e.Lines,
                  e.Draws,
                  e.Amount,
                  t,
                  e.SelectedNumbers
                ),
                  n && (window.location = s);
              });
        }),
        (e.setPromoCode = function (e) {
          r.setReedemCode(e), n.$broadcast("ngCart:change", {});
        }),
        (e.emptyCart = function () {
          r.empty();
        }),
        (e.clearCart = function () {
          r.setIframePaymentMethods(null),
            r.setPaymentMethodId(null),
            r.setProcessor(null),
            n.$broadcast("ngCart:change", {});
        }),
        (e.saveToCartProduct = function (e, t) {
          console.log(e),
            o
              .getAllLotteriesRules()
              .then(o.getAllProductsRules())
              .then(o.getProductPrices())
              .then(function () {
                4 === e.LotteryId
                  ? r.addItem(
                      e.id,
                      0,
                      0,
                      0,
                      0,
                      e.Draws,
                      1,
                      e.Price / e.Draws,
                      e.Price,
                      e.LotteryId,
                      0,
                      0,
                      "",
                      e.Price / e.Draws,
                      0,
                      0,
                      "product",
                      e.Price,
                      0,
                      0,
                      0,
                      e.ProductId,
                      0
                    )
                  : 3 === e.ProductId
                  ? r.addItem(
                      e.id,
                      0,
                      0,
                      0,
                      0,
                      e.Draws,
                      1,
                      (e.Price / e.Draws) * 8,
                      e.Price,
                      e.LotteryId,
                      0,
                      0,
                      "",
                      e.Price / e.Draws,
                      0,
                      0,
                      "groupselection",
                      e.Price,
                      0,
                      0,
                      0,
                      e.ProductId,
                      0
                    )
                  : r.addItem(
                      e.id,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      e.LotteryId,
                      e.Draws,
                      0,
                      "",
                      e.Price / e.Draws,
                      0,
                      0,
                      "product",
                      e.Price,
                      0,
                      0,
                      0,
                      e.ProductId,
                      "",
                      e.Qty
                    ),
                  t && (window.location = s);
              });
        }),
        (e.saveToCartNavidad = function (e, t) {
          o.getAllLotteriesRules().then(function () {
            o.getAllProductsRules().then(function () {
              o.getProductPrices().then(function () {
                r.addItem(
                  e.id,
                  parseFloat(e.discount),
                  0,
                  e.groupSettingsIndex,
                  0,
                  0,
                  0,
                  0,
                  0,
                  e.lotteryType,
                  e.noofdraws,
                  e.nooflines,
                  e.numbers,
                  e.originalprice,
                  0,
                  0,
                  "single",
                  e.totalCost,
                  0,
                  0,
                  e.ticketNumberIds,
                  e.productType,
                  e.timestamp
                ),
                  t && (window.location = s);
              });
            });
          });
        }),
        (e.saveToCart = function (e, t) {
          o.getAllLotteriesRules()
            .then(o.getAllProductsRules())
            .then(o.getProductPrices())
            .then(function () {
              r.addItem(
                e.id,
                e.discount,
                e.groupComboBoxSelectionIndex,
                e.groupSettingsIndex,
                e.groupdiscount,
                e.groupnodraws,
                e.groupnoshares,
                e.grouporiginalprice,
                e.grouptotal,
                e.lotteryType,
                e.noofdraws,
                e.nooflines,
                e.numbers,
                e.originalprice,
                e.personalComboBoxSelectionIndex,
                e.personalSettingsIndex,
                e.selectedTab,
                e.totalCost,
                e.isSubscription,
                e.isQuickPick,
                e.ticketsNumbers,
                e.productType,
                e.productExpire,
                e.productIdSpecial,
                e.quantity,
                e.guid,
                e.evenLinesOnly
              ),
                t && (window.location = s);
            });
        }),
        e.initCartCalls();
    },
  ]),
  (Mapper.prototype.mapCart = function () {
    for (
      var e = "", t = Object.keys(this.outputCart).length, r = 0;
      r < Object.keys(this.outputCart).length;
      r++
    )
      (e += this.outputCart[r].stringifyProduct() + (t > 1 ? "|" : "")), t--;
    return e;
  }),
  (Mapper.prototype.PrepareOrder = function () {
    var e = new PrepareOrderRequest(this.mapCart(), this.inputCart.reedemCode);
    return JSON.stringify(e);
  }),
  (Mapper.prototype.ConfirmOrder = function () {
    var e = new ConfirmOrderRequest(
        this.inputCart.phoneOrEmail,
        this.inputCart.processor,
        this.inputCart.reedemCode,
        this.inputCart.paymentMethodId,
        this.inputCart.affiliateCode,
        this.inputCart.olapAffiliateCode
      ),
      t = 1,
      r = [];
    return (
      this.outputCart.forEach(function (n) {
        if (n instanceof OlapProduct) r.indexOf(n.guid) < 0 && r.push(n.guid);
        else {
          var o = new OrderDataItem(1, n.numOfDraws, n.numOfLines, n.Quantity);
          n.selectedNumbers.forEach(function (e) {
            var t = new LineDataItem(
              n.LotteryTypeID,
              e,
              n.isVip,
              n.isCash,
              1,
              n.ProductId
            );
            o.AddLineDataItem(t);
          }),
            e.AddOrderDateItem(o),
            t++;
        }
      }),
      this.CreditCard && e.AddCreditCard(this.CreditCard),
      r.length > 0 && e.AddGuid(r.join("|")),
      e.stringifyConfirmRequest()
    );
  }),
  (Product.prototype = {
    constructor: Product,
    stringifyProduct: function () {
      for (var e = "", t = this.Quantity; t > 0; t--)
        e +=
          "MemberId=" +
          this.MemberId +
          "&ProductId=" +
          this.ProductId +
          "&LotteryTypeID=" +
          this.LotteryTypeID +
          "&numOfDraws=" +
          this.numOfDraws +
          "&numOfLines=" +
          this.numOfLines +
          "&externalId=" +
          this.externalId +
          "&isVip=" +
          this.isVip +
          "&isCash=" +
          this.isCash +
          "&selectedNumbers=" +
          this.selectedNumbers +
          (t > 1 ? "|" : "");
      return e;
    },
  }),
  inheritPrototype(PersonalProduct, Product),
  inheritPrototype(PersonalProduct, Product),
  inheritPrototype(GroupProduct, Product),
  inheritPrototype(NavidadProduct, Product),
  inheritPrototype(SpecialProduct, Product),
  inheritPrototype(OlapProduct, Product),
  (OlapProduct.prototype.stringifyProduct = function () {
    for (var e = "", t = this.Quantity; t > 0; t--)
      e +=
        "MemberId=" +
        this.MemberId +
        "&ProductId=" +
        this.ProductId +
        "&LotteryTypeID=" +
        this.LotteryTypeID +
        "&numOfDraws=" +
        this.numOfDraws +
        "&numOfLines=" +
        this.numOfLines +
        "&externalId=" +
        this.externalId +
        "&isVip=" +
        this.isVip +
        "&Amount=" +
        this.amount +
        "&isCash=" +
        this.isCash +
        "&selectedNumbers=" +
        this.selectedNumbers +
        (t > 1 ? "|" : "");
    return e;
  }),
  (ConfirmOrderRequest.prototype = {
    constructor: ConfirmOrderRequest,
    AddOrderDateItem: function (e) {
      this.OrderData.push(e);
    },
    AddCreditCard: function (e) {
      (this.PaymentMethodId = 0),
        (this.ProcessorApi = "CreditCard"),
        (this.CreditCard = e),
        (this.CreditCard.CardType = _getCreditCardType(e.CreditCardNumber));
    },
    AddGuid: function (e) {
      this.guid = e;
    },
    stringifyOrderData: function () {
      for (var e = "", t = 0; t < this.OrderData.length; t++)
        (e += this.OrderData[t].stringify()),
          (e += t + 1 < this.OrderData.length ? "|" : "");
      return e;
    },
    stringifyConfirmRequest: function () {
      return (this.OrderData = this.stringifyOrderData()), JSON.stringify(this);
    },
  }),
  (OrderDataItem.prototype.stringify = function () {
    for (var e = "", t = this.Quantity; t > 0; t--) {
      e +=
        "EmailCode=" +
        this.EmailCode +
        "&productCounter=" +
        this.productCounter +
        "&numOfDraws=" +
        this.numOfDraws +
        "&numOfLines=" +
        this.numOfLines +
        "&";
      var r = this.linesData.length;
      this.linesData.forEach(function (t) {
        (e += t.stringify()), r--, r > 0 && (e += "|");
      }),
        t > 1 && (e += "|");
    }
    return e;
  }),
  (OrderDataItem.prototype.AddLineDataItem = function (e) {
    this.linesData.push(e);
  }),
  (LineDataItem.prototype.stringify = function () {
    return (
      "MemberId=" +
      this.MemberId +
      "&LotteryTypeID=" +
      this.LotteryTypeID +
      "&SelectedNumbers=" +
      this.SelectedNumbers +
      "&IsVIP=" +
      this.IsVIP +
      "&IsCash=" +
      this.IsCash +
      "&isOnline=" +
      this.isOnline +
      "&ProductID=" +
      this.ProductID
    );
  }),
  (function () {
    "use strict";
    angular
      .module("ngCart", ["ngCart.directives"])
      .config([function () {}])
      .provider("$ngCart", function () {
        this.$get = function () {};
      })
      .run([
        "$rootScope",
        "ngCart",
        "ngCartItem",
        "store",
        function (e, t, r, n) {
          e.$on("ngCart:change", function () {
            t.$save();
          }),
            angular.isObject(n.get("cart"))
              ? t.$restore(n.get("cart"))
              : t.init();
        },
      ])
      .service("ngCart", [
        "$rootScope",
        "ngCartItem",
        "store",
        "ngCart.lottoyard.api",
        "Products",
        function (e, t, r, n, o) {
          function a(e) {
            function t(e, t) {
              return Math.floor(Math.random() * (t - e + 1)) + e;
            }
            for (
              var r = [],
                n = [],
                o = "",
                a = e.MaxExtraNumbers,
                i = e.MinSelectNumber,
                s = e.SelectNumbers,
                c = e.MaxSelectNumbers,
                u = e.MinExtraNumber,
                d = e.ExtraNumbers;
              r.length < c;

            ) {
              var l = t(i, s);
              r.indexOf(l) === -1 && (r.push(l), console.log(l));
            }
            if (((o += r.join(",")), a > 0)) {
              for (; n.length < a; ) {
                var l = t(u, d);
                n.indexOf(l) === -1 && (n.push(l), console.log(l));
              }
              o += "#" + n.join(",");
            }
            return o;
          }
          function i(e) {
            return !isNaN(parseFloat(e)) && isFinite(e);
          }
          function s(e) {
            function t(e) {
              return !isNaN(parseFloat(e)) && isFinite(e);
            }
            for (
              var r = ",", n = "|", o = "#", a = e.length, i = "", s = 1, c = 0;
              c < a;
              c++
            ) {
              var u = e[c],
                d = e[c + 1];
              if (0 !== c)
                t(u)
                  ? ((i += u), s++)
                  : (u !== r && u !== n && u !== o) ||
                    "undefined" == typeof d ||
                    !t(d) ||
                    (i += u);
              else if (t(u)) {
                (i += u), s++;
                continue;
              }
            }
            return console.log(i), i;
          }
          (this.init = function () {
            this.$cart = {
              shipping: null,
              taxRate: null,
              tax: null,
              paymentMethodId: null,
              processor: null,
              fastProcessingTax: null,
              amountToPay: 0,
              reedemCode: "",
              isFastProcessing: !1,
              phoneOrEmail: null,
              iframePaymentMethods: [],
              items: [],
            };
          }),
            (this.addItem = function (
              r,
              o,
              a,
              i,
              s,
              c,
              u,
              d,
              l,
              m,
              p,
              g,
              f,
              h,
              y,
              C,
              b,
              P,
              v,
              x,
              I,
              N,
              E,
              T,
              w,
              M,
              S
            ) {
              function O(e) {
                function t(e, t) {
                  return Math.floor(Math.random() * (t - e + 1)) + e;
                }
                for (
                  var r = [],
                    n = [],
                    o = "",
                    a = e.MaxExtraNumbers,
                    i = e.MinSelectNumber,
                    s = e.SelectNumbers,
                    c = e.MaxSelectNumbers,
                    u = e.MinExtraNumber,
                    d = e.ExtraNumbers;
                  r.length < c;

                ) {
                  var l = t(i, s);
                  r.indexOf(l) === -1 && (r.push(l), console.log(l));
                }
                if (((o += r.join(",")), a > 0)) {
                  for (; n.length < a; ) {
                    var l = t(u, d);
                    n.indexOf(l) === -1 && (n.push(l), console.log(l));
                  }
                  o += "#" + n.join(",");
                }
                return o;
              }
              var D = this.getItemById(r);
              if ("object" == typeof D) D.setQuantity(w, !1);
              else {
                if (
                  (10 === this.$cart.items.length && this.$cart.items.shift(),
                  "single" === b)
                ) {
                  N = 1;
                  var L = n.getProductPriceByIds(N, p, m, g);
                  P = L.Price;
                }
                if (
                  ((o = parseFloat(o.toFixed(3))),
                  "single" !== b || ("undefined" != typeof N && "" !== N)
                    ? "groupselection" === b && (N = 3)
                    : (N = 1),
                  "product" === b && 3 === N && (u = 0 === u ? 1 : u),
                  this.getIsFastProcessing())
                ) {
                  var A = !0;
                  P = parseFloat(P) + this.getFastProcessingTax();
                }
                if (
                  ((v = 2 === C || 2 === i),
                  (w = w > 0 ? w : 1),
                  2 === N || 4 === N || 14 === N || 19 === N)
                ) {
                  var _ = n.getProductById(N);
                  console.log(_), console.log(N);
                  var $ = _.ProductName,
                    G = _.ValidLotteries.filter(function (e) {
                      return (
                        "LotteryTypeId" in e &&
                        "number" == typeof e.LotteryTypeId &&
                        e.LotteryTypeId === m
                      );
                    })[0];
                  if (
                    ((2 !== N && 4 !== N && 19 !== N) || (w > 1 && (P = w * P)),
                    2 === N && ($ = n.getLotteryById(m).LotteryType),
                    (14 !== N && 19 !== N) || (g = 1),
                    19 === N && ($ = "247Premium"),
                    7 === m)
                  )
                    V = {
                      SelectNumbers: 0,
                      MinSelectNumber: 0,
                      MaxSelectNumbers: 0,
                      ExtraNumbers: 0,
                      MaxExtraNumbers: 0,
                      MinExtraNumber: 0,
                      DrawsPerWeek: 0,
                    };
                  else var V = n.getLotteryById(m);
                  if (2 === N || 4 === N) {
                    g = G.MinLines;
                    for (var R = 0; R < G.MinLines; R++)
                      f += R === G.MinLines - 1 ? O(V) : O(V) + "|";
                  }
                  var B = new t(
                    r,
                    o,
                    a,
                    i,
                    s,
                    c,
                    u,
                    d,
                    l,
                    m,
                    p,
                    g,
                    f,
                    h,
                    y,
                    C,
                    b,
                    P,
                    $,
                    V.SelectNumbers,
                    V.MinSelectNumber,
                    V.MaxSelectNumbers,
                    V.ExtraNumbers,
                    V.MaxExtraNumbers,
                    V.MinExtraNumber,
                    G.MinLines,
                    G.MaxLines,
                    V.DrawsPerWeek,
                    _.Draws,
                    A,
                    v,
                    x,
                    I,
                    N,
                    E,
                    T,
                    w,
                    M,
                    S
                  );
                } else {
                  var k = n.getLotteryById(m).LotteryType,
                    V = n.getLotteryById(m);
                  ("product" !== b && 3 !== N) ||
                    ((s = 0),
                    angular.forEach(V.ProductsDrawOptions, function (e) {
                      e.ProductId === N &&
                        e.IsSubscription === v &&
                        angular.forEach(e.MultiDrawOptions, function (e) {
                          e.NumberOfDraws === parseInt(c) && (s = e.Discount);
                        });
                    })),
                    1 === N &&
                      ((h = n.getProductPriceByIds(N, 1, m, 1).Price),
                      (p = parseInt(p)),
                      (o = 0),
                      angular.forEach(V.ProductsDrawOptions, function (e) {
                        e.ProductId === N &&
                          e.IsSubscription === v &&
                          angular.forEach(e.MultiDrawOptions, function (e) {
                            e.NumberOfDraws === parseInt(p) && (o = e.Discount);
                          });
                      })),
                    15 === N || 24 === N || 26 === N || 20 === N
                      ? ((V.MinLines = 1), (V.MaxLines = I.length))
                      : angular.forEach(V.ProductsDrawOptions, function (e) {
                          e.ProductId === N &&
                            e.IsSubscription === v &&
                            angular.forEach(e.MultiDrawOptions, function (e) {
                              e.NumberOfDraws === parseInt(p) &&
                                ((V.MinLines = e.MinLines),
                                (V.MaxLines = e.MaxLines));
                            });
                        });
                  var B = new t(
                    r,
                    o,
                    a,
                    i,
                    s,
                    c,
                    u,
                    d,
                    l,
                    m,
                    p,
                    g,
                    f,
                    h,
                    y,
                    C,
                    b,
                    P,
                    k,
                    V.SelectNumbers,
                    V.MinSelectNumber,
                    V.MaxSelectNumbers,
                    V.ExtraNumbers,
                    V.MaxExtraNumbers,
                    V.MinExtraNumber,
                    V.MinLines,
                    V.MaxLines,
                    V.DrawsPerWeek,
                    V.ProductsDrawOptions,
                    A,
                    v,
                    x,
                    I,
                    N,
                    E,
                    T,
                    w,
                    M,
                    S
                  );
                }
                this.$cart.items.push(B),
                  console.log(this.$cart.items),
                  e.$broadcast("ngCart:itemAdded", B);
              }
              e.$broadcast("ngCart:change", {});
            }),
            (this.addItemPredifined = function (r, o, c, u, d, l, m) {
              i(r) || (r = parseInt(r)),
                i(o) || (o = parseInt(o)),
                i(c) || (c = parseInt(c)),
                i(u) || (u = parseInt(u)),
                i(d) || (d = parseInt(d));
              var p,
                g,
                f,
                h,
                y,
                C,
                b,
                P,
                v,
                x,
                I,
                N,
                E,
                T = 999,
                w = n.getProductById(r),
                M = "",
                S = 1;
              (T = 999),
                (l = l),
                "undefined" == typeof w
                  ? (p = n.getLotteryById(o).LotteryType)
                  : ((p = w.ProductName), (g = "product")),
                3 === r
                  ? (g = "group")
                  : 1 === r
                  ? ((g = "personal"), (h = parseInt(c)))
                  : 0 === u && (g = "raffle"),
                (f = parseInt(u));
              var O = 0,
                D = 0,
                L = 0,
                A = 0,
                _ = 0,
                $ = 0,
                G = 0,
                V = 0,
                R = r,
                B = d,
                k = d;
              switch (
                ((y = {
                  SelectNumbers: 0,
                  MinSelectNumber: 0,
                  MaxSelectNumbers: 0,
                  ExtraNumbers: 0,
                  MaxExtraNumbers: 0,
                  MinExtraNumber: 0,
                  DrawsPerWeek: 0,
                }),
                g)
              ) {
                case "personal":
                  if ("undefined" != typeof m) M = s(m);
                  else {
                    y = n.getLotteryById(o);
                    var F = y.MinLines,
                      U = y.MaxLines;
                    if (h > U || F > h)
                      throw "Lines can not be greater than max lines or less then defined in rules";
                    for (var j = 0; j < h; j++)
                      M += j === h - 1 ? a(y) : a(y) + "|";
                  }
                  break;
                case "group":
                  (_ = u), ($ = c);
                  break;
                case "raffle":
                  return void n.getRaffleTicket(r).then(
                    angular.bind(this, function (r) {
                      if ((console.log(r), !Array.isArray(r)))
                        throw "OLA: raffle response is not array!: error:" + r;
                      var n = r[0];
                      (M = n.Number + "-" + n.Seat + "-" + n.Ticket),
                        (N = [n.Id]);
                      var a = [],
                        i = {},
                        s = new Date();
                      s.setMinutes(s.getMinutes() + RaffleExpiresInMin),
                        (i.id = n.Id),
                        (i.exp = s),
                        a.push(i),
                        (h = shares);
                      var c = new t(
                        0,
                        O,
                        D,
                        L,
                        A,
                        _,
                        $,
                        G,
                        V,
                        o,
                        f,
                        h,
                        M,
                        B,
                        C,
                        b,
                        g,
                        k,
                        p,
                        y.SelectNumbers,
                        y.MinSelectNumber,
                        y.MaxSelectNumbers,
                        y.ExtraNumbers,
                        y.MaxExtraNumbers,
                        y.MinExtraNumber,
                        y.MinLines,
                        y.MaxLines,
                        y.DrawsPerWeek,
                        f,
                        v,
                        P,
                        x,
                        N,
                        R,
                        a,
                        T,
                        S,
                        l
                      );
                      this.$cart.items.push(c),
                        e.$broadcast("ngCart:itemAdded", c),
                        e.$broadcast("ngCart:change", {});
                    })
                  );
                case "product":
                  switch (R) {
                    case 4:
                      (E = 1), (f = u), (h = 1), (M = s(m));
                      break;
                    case 14:
                      (E = 1), (f = u);
                  }
              }
              var Y = new t(
                0,
                O,
                D,
                L,
                A,
                _,
                $,
                G,
                V,
                o,
                f,
                h,
                M,
                B,
                C,
                b,
                g,
                k,
                p,
                y.SelectNumbers,
                y.MinSelectNumber,
                y.MaxSelectNumbers,
                y.ExtraNumbers,
                y.MaxExtraNumbers,
                y.MinExtraNumber,
                y.MinLines,
                y.MaxLines,
                y.DrawsPerWeek,
                f,
                v,
                P,
                x,
                N,
                R,
                I,
                T,
                S,
                l
              );
              this.$cart.items.push(Y),
                e.$broadcast("ngCart:itemAdded", Y),
                e.$broadcast("ngCart:change", {});
            }),
            (this.getItemById = function (e) {
              var t = this.getCart().items,
                r = !1;
              return (
                angular.forEach(t, function (t) {
                  t.getId() === e && (r = t);
                }),
                r
              );
            }),
            (this.setShipping = function (e) {
              return (this.$cart.shipping = e), this.getShipping();
            }),
            (this.getShipping = function () {
              return 0 === this.getCart().items.length
                ? 0
                : this.getCart().shipping;
            }),
            (this.setTaxRate = function (e) {
              return (
                (this.$cart.taxRate = +parseFloat(e).toFixed(2)),
                this.getTaxRate()
              );
            }),
            (this.getTaxRate = function () {
              return this.$cart.taxRate;
            }),
            (this.getTax = function () {
              return +parseFloat(
                (this.getSubTotal() / 100) * this.getCart().taxRate
              ).toFixed(2);
            }),
            (this.setCart = function (e) {
              return (this.$cart = e), this.getCart();
            }),
            (this.getCart = function () {
              return this.$cart;
            }),
            (this.getItems = function () {
              return this.getCart().items;
            }),
            (this.setItems = function (e) {
              this.$cart.items = e;
            }),
            (this.getTopNItems = function (e) {
              return this.getCart().items.slice(0, e);
            }),
            (this.getTotalItems = function () {
              var e = 0,
                t = this.getItems();
              return (
                angular.forEach(t, function (t) {
                  e += t.getQuantity();
                }),
                e
              );
            }),
            (this.getTotalUniqueItems = function () {
              return this.getCart().items.length;
            }),
            (this.getSubTotal = function () {
              var e = 0;
              return (
                angular.forEach(this.getCart().items, function (t) {
                  e += t.getTotal();
                }),
                +parseFloat(e).toFixed(2)
              );
            }),
            (this.totalCost = function () {
              return +parseFloat(
                this.getSubTotal() + this.getShipping() + this.getTax()
              ).toFixed(2);
            }),
            (this.setAmountToPay = function (e) {
              this.$cart.amountToPay = e;
            }),
            (this.getAmountToPay = function () {
              return this.$cart.amountToPay >= 0
                ? this.$cart.amountToPay
                : this.totalCost();
            }),
            (this.removeItem = function (t) {
              this.$cart.items.splice(t, 1),
                e.$broadcast("ngCart:itemRemoved", {}),
                e.$broadcast("ngCart:change", {});
            }),
            (this.removeItemById = function (t) {
              var r = this.getCart();
              angular.forEach(r.items, function (e, n) {
                e.getId() === t && r.items.splice(n, 1);
              }),
                this.setCart(r),
                e.$broadcast("ngCart:itemRemoved", {}),
                e.$broadcast("ngCart:change", {});
            }),
            (this.empty = function () {
              e.$broadcast("ngCart:change", {}),
                (this.$cart.items = []),
                r.emptyCart();
            }),
            (this.isEmpty = function () {
              return !(this.$cart.items.length > 0);
            }),
            (this.setIframePaymentMethods = function (e) {
              return (
                (this.$cart.iframePaymentMethods = e),
                this.getIframePaymentMethods()
              );
            }),
            (this.getIframePaymentMethods = function () {
              return this.$cart.iframePaymentMethods;
            }),
            (this.setPaymentMethodId = function (e) {
              this.$cart.paymentMethodId = e;
            }),
            (this.getPhoneOrEmail = function () {
              return this.$cart.phoneOrEmail;
            }),
            (this.setPhoneOrEmail = function (e) {
              this.$cart.phoneOrEmail = e;
            }),
            (this.getPaymentMethodId = function () {
              return this.$cart.paymentMethodId;
            }),
            (this.setProcessor = function (e) {
              this.$cart.processor = e;
            }),
            (this.getProcessor = function () {
              return this.$cart.processor;
            }),
            (this.setReedemCode = function (e) {
              return (this.$cart.reedemCode = e), this.getReedemCode();
            }),
            (this.getReedemCode = function () {
              return this.$cart.reedemCode;
            }),
            (this.setReedemBonusAmount = function (e) {
              return (
                (this.$cart.reedemBonusAmount = e), this.getReedemBonusAmount()
              );
            }),
            (this.getReedemBonusAmount = function () {
              return this.$cart.reedemBonusAmount < 0
                ? 0
                : this.$cart.reedemBonusAmount;
            }),
            (this.setAffiliateCode = function (e) {
              return (this.$cart.affiliateCode = e), this.getAffiliateCode();
            }),
            (this.getAffiliateCode = function () {
              return this.$cart.affiliateCode;
            }),
            (this.setIsFastProcessing = function (e) {
              return (
                (this.$cart.isFastProcessing = e), this.getIsFastProcessing()
              );
            }),
            (this.getIsFastProcessing = function () {
              return this.$cart.isFastProcessing;
            }),
            (this.setFastProcessingTax = function (e) {
              return (
                (this.$cart.fastProcessingTax = e), this.getFastProcessingTax()
              );
            }),
            (this.getFastProcessingTax = function () {
              return this.$cart.fastProcessingTax;
            }),
            (this.setOlapAffiliateCode = function (e) {
              return (
                (this.$cart.olapAffiliateCode = e), this.getOlapAffiliateCode()
              );
            }),
            (this.getOlapAffiliateCode = function () {
              return this.$cart.olapAffiliateCode;
            }),
            (this.toObject = function () {
              return (
                0 !== this.getItems().length && (console.log(items), items)
              );
            }),
            (this.$restore = function (e) {
              var r = this;
              r.init(),
                (r.$cart.shipping = e.shipping),
                (r.$cart.tax = e.tax),
                (r.$cart.iframePaymentMethods = e.iframePaymentMethods),
                (r.$cart.paymentMethodId = e.paymentMethodId),
                (r.$cart.processor = e.processor),
                (r.$cart.fastProcessingTax = e.fastProcessingTax),
                (r.$cart.amountToPay = e.amountToPay),
                (r.$cart.phoneOrEmail = e.phoneOrEmail),
                (r.$cart.reedemCode = e.reedemCode),
                (r.$cart.isFastProcessing = e.isFastProcessing),
                (r.$cart.affiliateCode = e.affiliateCode),
                (r.$cart.reedemBonusAmount = e.reedemBonusAmount),
                (r.$cart.olapAffiliateCode = e.olapAffiliateCode),
                angular.forEach(e.items, function (e) {
                  r.$cart.items.push(
                    new t(
                      e._id,
                      e._discount,
                      e._groupComboBoxSelectionIndex,
                      e._groupSettingsIndex,
                      e._groupdiscount,
                      e._groupnodraws,
                      e._groupnoshares,
                      e._grouporiginalprice,
                      e._grouptotal,
                      e._lotteryType,
                      e._noofdraws,
                      e._nooflines,
                      e._numbers,
                      e._originalprice,
                      e._personalComboBoxSelectionIndex,
                      e._personalSettingsIndex,
                      e._selectedTab,
                      e._totalCost,
                      e._lotteryName,
                      e._selectNumbers,
                      e._minselectNumbers,
                      e._maxselectNumbers,
                      e._extraNumbers,
                      e._maxExtraNumbers,
                      e._minExtraNumber,
                      e._minLines,
                      e._maxLines,
                      e._drawsPerWeek,
                      e._productsDrawOptions,
                      e._isFastProcessing,
                      e._isSubscription,
                      e._isQuickPick,
                      e._ticketsNumbersId,
                      e._productType,
                      e._productExpire,
                      e._productIdSpecial,
                      e._quantity,
                      e._guid,
                      e._evenLinesOnly
                    )
                  );
                }),
                this.$save();
            }),
            (this.$save = function () {
              return r.set("cart", JSON.stringify(this.getCart()));
            });
        },
      ])
      .factory("ngCartItem", [
        "$rootScope",
        "$log",
        function (e, t) {
          function r() {
            return (
              "0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
            ).slice(-4);
          }
          var n = function (
            e,
            t,
            r,
            n,
            o,
            a,
            i,
            s,
            c,
            u,
            d,
            l,
            m,
            p,
            g,
            f,
            h,
            y,
            C,
            b,
            P,
            v,
            x,
            I,
            N,
            E,
            T,
            w,
            M,
            S,
            O,
            D,
            L,
            A,
            _,
            $,
            G,
            V,
            R
          ) {
            this.setId(e),
              this.setDiscount(t),
              this.setGroupComboBoxSelectionIndex(r),
              this.setGroupSettingsIndex(n),
              this.setGroupdiscount(o),
              this.setGroupnodraws(a),
              this.setGroupnoshares(i),
              this.setGrouporiginalprice(s),
              this.setGroupTotal(c),
              this.setLotteryType(u),
              this.setNumberOfDraws(d),
              this.setNumberOfLines(l),
              this.setNumbers(m),
              this.setOriginalPrice(p),
              this.setPersonalComboBoxSelectionIndex(g),
              this.setPersonalSettingsIndex(f),
              this.setSelectedTab(h),
              this.setTotalCost(y),
              this.setTotalDiscount(),
              this.setNumbersSantized(m),
              this.setLotteryType(u),
              this.setLotteryName(C),
              this.setProductType(A),
              this.setProductExpire(_),
              this.setSelectNumbers(b),
              this.setMinSelectNumbers(P),
              this.setMaxSelectNumbers(v),
              this.setExtraNumbers(x),
              this.setMaxExtraNumbers(I),
              this.setMinExtraNumber(N),
              this.setMinLines(E),
              this.setMaxLines(T),
              this.setDrawsPerWeek(w),
              this.setProductsDrawOptions(M),
              this.setIsFastProcessing(S),
              this.setIsSubscription(O),
              this.setIsQuickPick(D),
              this.setTicketsNumbersId(L),
              this.setProductIdSpecial($),
              this.setGuid(V),
              this.setQuantity(G),
              this.setEvenLinesOnly(R);
          };
          return (
            (n.prototype.setId = function (e) {
              e
                ? (this._id = e)
                : ((this._id = r()),
                  t.info("An ID is auto generated:" + this._id));
            }),
            (n.prototype.getId = function () {
              return this._id;
            }),
            (n.prototype.setDiscount = function (e) {
              this._discount = e;
            }),
            (n.prototype.getDiscount = function () {
              return 1 === this._productType
                ? this._discount.toFixed(3)
                : this._groupdiscount.toFixed(2);
            }),
            (n.prototype.setGroupComboBoxSelectionIndex = function (e) {
              this._groupComboBoxSelectionIndex = e;
            }),
            (n.prototype.getGroupComboBoxSelectionIndex = function () {
              return this._groupComboBoxSelectionIndex;
            }),
            (n.prototype.setGroupSettingsIndex = function (e) {
              this._groupSettingsIndex = e;
            }),
            (n.prototype.getGroupSettingsIndex = function () {
              return this._groupSettingsIndex;
            }),
            (n.prototype.setGroupdiscount = function (e) {
              this._groupdiscount = e;
            }),
            (n.prototype.getGroupdiscount = function () {
              return this._groupdiscount;
            }),
            (n.prototype.setGroupnodraws = function (e) {
              this._groupnodraws = parseInt(e);
            }),
            (n.prototype.getGroupnodraws = function () {
              return this._groupnodraws;
            }),
            (n.prototype.setGroupnoshares = function (e) {
              this._groupnoshares = e;
            }),
            (n.prototype.getGroupnoshares = function () {
              return this._groupnoshares;
            }),
            (n.prototype.setGrouporiginalprice = function (e) {
              this._grouporiginalprice = e;
            }),
            (n.prototype.getGrouporiginalprice = function () {
              return this._grouporiginalprice;
            }),
            (n.prototype.setGroupTotal = function (e) {
              this._grouptotal = e;
            }),
            (n.prototype.getGroupTotal = function () {
              return this._grouptotal;
            }),
            (n.prototype.setLotteryType = function (e) {
              e
                ? e <= 0
                  ? t.error("A lotteryType must be over 0")
                  : (this._lotteryType = e)
                : t.error("A lotteryType must be provided");
            }),
            (n.prototype.getLotteryType = function () {
              return this._lotteryType;
            }),
            (n.prototype.setLotteryName = function (e) {
              "NavidadPersonal" === e
                ? (this._lotteryName = "Navidad")
                : (this._lotteryName = e);
            }),
            (n.prototype.getLotteryName = function () {
              return this._lotteryName;
            }),
            (n.prototype.setNumberOfDraws = function (e) {
              this._noofdraws = e;
            }),
            (n.prototype.getNumberOfDraws = function () {
              return "groupselection" === this._selectedTab ||
                3 === this._productType
                ? this._groupnodraws
                : this._noofdraws;
            }),
            (n.prototype.getNumberOfLinesOrShares = function () {
              return 1 !== this._productType
                ? this._groupnoshares
                : this._nooflines;
            }),
            (n.prototype.setNumberOfLines = function (e) {
              this._nooflines = e;
            }),
            (n.prototype.getNumberOfLines = function () {
              return this._nooflines;
            }),
            (n.prototype.setEvenLinesOnly = function (e) {
              return (this._evenLinesOnly = e);
            }),
            (n.prototype.getEvenLinesOnly = function () {
              return this._evenLinesOnly;
            }),
            (n.prototype.setNumbers = function (e) {
              var t, r;
              if ("undefined" != typeof e && "" !== e) {
                (t = ""), (r = 1);
                for (var n = 0, o = e.length; n < o; n++) {
                  var a = "|",
                    i = e[n],
                    s = e[n + 1];
                  if (i !== a) t += i;
                  else {
                    if (s === a || "undefined" == typeof s) continue;
                    r++, (t += a);
                  }
                }
                r !== this._nooflines &&
                  console.warn("mismatching lines in numebrs");
              }
              this._numbers = t;
            }),
            (n.prototype.getNumbers = function () {
              return this._numbers;
            }),
            (n.prototype.setNumbersSantized = function (e) {
              if ("undefined" != typeof e)
                if (e.indexOf(",") !== -1)
                  if (e.length > 0) {
                    var t = e.split("|");
                    (t = t.filter(function (e) {
                      return e.replace(/(\r\n|\n|\r)/gm, "");
                    })),
                      (this._numbersSantized = t);
                  } else this._numbersSantized = [];
                else
                  (this._numbersSantized = []), this._numbersSantized.push(e);
              else (this._numbersSantized = []), this._numbersSantized.push(e);
            }),
            (n.prototype.getNumbersSantized = function () {
              return this._numbersSantized;
            }),
            (n.prototype.getLinesNumbers = function (e) {
              if (13 === this._lotteryType) return e;
              var t = this._numbersSantized[e],
                r = t.split(",");
              return (
                t.indexOf("#") !== -1 && (r = t.split("#")[0].split(",")), r
              );
            }),
            (n.prototype.getLinesSpecialNumbers = function (e) {
              var t = this._numbersSantized[e];
              return t.indexOf("#") !== -1 ? t.split("#")[1].split(",") : 0;
            }),
            (n.prototype.setOriginalPrice = function (e) {
              this._originalprice = e;
            }),
            (n.prototype.getOriginalPrice = function () {
              return this._originalprice;
            }),
            (n.prototype.setPersonalComboBoxSelectionIndex = function (e) {
              this._personalComboBoxSelectionIndex = e;
            }),
            (n.prototype.getPersonalComboBoxSelectionIndex = function () {
              return this._personalComboBoxSelectionIndex;
            }),
            (n.prototype.setPersonalSettingsIndex = function (e) {
              this._personalSettingsIndex = e;
            }),
            (n.prototype.getPersonalSettingsIndex = function () {
              return this._personalSettingsIndex;
            }),
            (n.prototype.setSelectedTab = function (e) {
              this._selectedTab = e;
            }),
            (n.prototype.getSelectedTab = function () {
              return this._selectedTab;
            }),
            (n.prototype.setTotalCost = function (e) {
              this._totalCost = parseFloat(e);
            }),
            (n.prototype.getTotalCost = function () {
              return this._totalCost;
            }),
            (n.prototype.setTotalDiscount = function (e) {
              if ("undefined" == typeof e)
                if (this._groupdiscount > 0) {
                  var t =
                    this._totalCost +
                    (this._totalCost / (1 - this._groupdiscount)) *
                      this._groupdiscount;
                  this._totalDiscount = this._groupdiscount * t;
                } else {
                  var t = this._totalCost;
                  this._totalDiscount = this._groupdiscount * t;
                }
              else this._totalDiscount = e;
            }),
            (n.prototype.getTotalDiscount = function () {
              return 1 === this._productType
                ? (
                    this._nooflines *
                    this._originalprice *
                    parseInt(this._noofdraws) *
                    this._discount
                  ).toFixed(2)
                : this._totalDiscount;
            }),
            (n.prototype.removeLastLine = function () {
              var t = this._numbers.lastIndexOf("|"),
                r = this._numbers.substring(0, t);
              (this._numbers = r),
                this.setNumbersSantized(r),
                e.$broadcast("ngCart:change", {});
            }),
            (n.prototype.updateSantizedLine = function (t, r) {
              if (this._numbersSantized.length < r)
                console.log("new line"),
                  (this._numbers += "|" + t),
                  this._numbersSantized.push(t),
                  this._nooflines++;
              else {
                this._numbersSantized[r - 1] = t;
                var n = this._numbers.split("|");
                (n[r - 1] = t), (this._numbers = n.join("|"));
              }
              e.$broadcast("ngCart:change", {});
            }),
            (n.prototype.setProductType = function (e) {
              this._productType = e;
            }),
            (n.prototype.getProductType = function () {
              return this._productType;
            }),
            (n.prototype.getLineOrShareText = function () {
              return 1 === this._productType ? "Line" : "Share";
            }),
            (n.prototype.getSelectNumbers = function () {
              return this._selectNumbers;
            }),
            (n.prototype.setSelectNumbers = function (e) {
              this._selectNumbers = e;
            }),
            (n.prototype.getMinSelectNumbers = function () {
              return this._minselectNumbers;
            }),
            (n.prototype.setMinSelectNumbers = function (e) {
              this._minselectNumbers = e;
            }),
            (n.prototype.getMaxSelectNumbers = function () {
              return this._maxselectNumbers;
            }),
            (n.prototype.setMaxSelectNumbers = function (e) {
              this._maxselectNumbers = e;
            }),
            (n.prototype.getExtraNumbers = function () {
              return this._extraNumbers;
            }),
            (n.prototype.setExtraNumbers = function (e) {
              this._extraNumbers = e;
            }),
            (n.prototype.getMaxExtraNumbers = function () {
              return this._maxExtraNumbers;
            }),
            (n.prototype.setMaxExtraNumbers = function (e) {
              this._maxExtraNumbers = e;
            }),
            (n.prototype.getMinExtraNumber = function () {
              return this._minExtraNumber;
            }),
            (n.prototype.setMinExtraNumber = function (e) {
              this._minExtraNumber = e;
            }),
            (n.prototype.getMinLines = function () {
              return this._minLines;
            }),
            (n.prototype.setMinLines = function (e) {
              this._minLines = e;
            }),
            (n.prototype.getMaxLines = function () {
              return this._maxLines;
            }),
            (n.prototype.setMaxLines = function (e) {
              this._maxLines = e;
            }),
            (n.prototype.getDrawsPerWeek = function () {
              return this._drawsPerWeek;
            }),
            (n.prototype.setDrawsPerWeek = function (e) {
              this._drawsPerWeek = e;
            }),
            (n.prototype.setProductsDrawOptions = function (e) {
              this._productsDrawOptions = e;
            }),
            (n.prototype.getProductsDrawOptions = function () {
              var e = [],
                t = this;
              if (1 === this._productType)
                angular.forEach(this._productsDrawOptions, function (r, n) {
                  1 === r.ProductId &&
                    r.IsSubscription === t._isSubscription &&
                    (e = r.MultiDrawOptions);
                });
              else if (
                3 === this._productType ||
                ("product" === this._selectedTab && 3 === this._productType)
              )
                angular.forEach(this._productsDrawOptions, function (r, n) {
                  3 === r.ProductId &&
                    r.IsSubscription === t._isSubscription &&
                    (e = r.MultiDrawOptions);
                });
              else if ("product" === this._selectedTab) {
                var r = [];
                return (
                  angular.forEach(this._productsDrawOptions, function (e, t) {
                    r.push({ Discount: 0, NumberOfDraws: e });
                  }),
                  r
                );
              }
              return e;
            }),
            (n.prototype.getProductsSubscriptionOptions = function () {
              var e = [];
              return (
                1 === this._productType
                  ? angular.forEach(this._productsDrawOptions, function (t, r) {
                      1 === t.ProductId &&
                        t.IsSubscription &&
                        (e = t.MultiDrawOptions);
                    })
                  : angular.forEach(this._productsDrawOptions, function (t, r) {
                      3 === t.ProductId &&
                        t.IsSubscription &&
                        (e = t.MultiDrawOptions);
                    }),
                e
              );
            }),
            (n.prototype.setProductExpire = function (e) {
              this._productExpire = e;
            }),
            (n.prototype.getProductExpire = function () {
              var e = this._productExpire[0].exp,
                t = new Date(e),
                r = Math.floor((t.getTime() - new Date().getTime()) / 1e3);
              return r;
            }),
            (n.prototype.getNavidadTicket = function () {
              return this._numbers.split("-");
            }),
            (n.prototype.setQuantity = function (e) {
              this._quantity = e;
            }),
            (n.prototype.getQuantity = function () {
              return this._quantity;
            }),
            (n.prototype.setTicketsNumbersId = function (e) {
              this._ticketsNumbersId = e;
            }),
            (n.prototype.getTicketsNumbersId = function () {
              return this._ticketsNumbersId;
            }),
            (n.prototype.getTotal = function () {
              return +parseFloat(this.getTotalCost()).toFixed(2);
            }),
            (n.prototype.setIsFastProcessing = function (e) {
              "undefined" == typeof e && (e = !1), (this._isFastProcessing = e);
            }),
            (n.prototype.getIsFastProcessing = function () {
              return this._isFastProcessing;
            }),
            (n.prototype.setIsSubscription = function (e) {
              "undefined" == typeof e && (e = !1), (this._isSubscription = e);
            }),
            (n.prototype.getIsSubscription = function () {
              return this._isSubscription;
            }),
            (n.prototype.setIsQuickPick = function (e) {
              "undefined" == typeof e && (e = !1), (this._isQuickPick = e);
            }),
            (n.prototype.getIsQuickPick = function () {
              return this._isQuickPick;
            }),
            (n.prototype.setProductIdSpecial = function (e) {
              this._productIdSpecial = e;
            }),
            (n.prototype.getProductIdSpecial = function () {
              return this._productIdSpecial;
            }),
            (n.prototype.setGuid = function (e) {
              this._guid = e;
            }),
            (n.prototype.getGuid = function () {
              return this._guid;
            }),
            (n.prototype.toObject = function () {
              return {
                id: this.getId(),
                lines: this.getNumberOfLines(),
                draws: this.getNumberOfDraws(),
                total: this.getTotalCost(),
              };
            }),
            n
          );
        },
      ])
      .service("store", [
        "$window",
        "CacheFactory",
        function (e, t) {
          var r = t("cart", {
            maxAge: 36e5,
            deleteOnExpire: "aggressive",
            storageMode: "localStorage",
          });
          return {
            get: function (e) {
              if (r.get(e)) {
                var t = angular.fromJson(r.get(e));
                return JSON.parse(t);
              }
              return !1;
            },
            set: function (e, t) {
              return (
                void 0 === t ? r.remove(e) : r.put(e, angular.toJson(t)),
                r.get(e)
              );
            },
            emptyCart: function () {
              t.destroy("cart");
            },
          };
        },
      ])
      .controller("CartController", [
        "$scope",
        "ngCart",
        "ngDialog",
        "$controller",
        "$rootScope",
        "ngCart.lottoyard.api",
        "$location",
        "PaymentSystems",
        "ngCart.GetCountryByIpService",
        "ngCart.translationService",
        function (e, t, r, n, o, a, i, s, c, u) {
          function d(r) {
            t.setIframePaymentMethods(r.IframePaymentMethods),
              r.IframePaymentMethods.length > 0 &&
                ((e.selectedmethod = r.IframePaymentMethods[0]),
                t.setPaymentMethodId(r.IframePaymentMethods[0].MethodId),
                t.setProcessor(r.IframePaymentMethods[0].Processor));
            var n = t.totalCost();
            n !== r.AmountToPay
              ? t.setAmountToPay(r.AmountToPay)
              : t.setAmountToPay(t.totalCost()),
              t.setReedemBonusAmount(r.ReedemBonusAmount),
              r.ReedemBonusAmount > 0
                ? ((e.redeemCodeOk = !0), (e.redeemCodeWrong = !1))
                : ((e.redeemCodeWrong = !0), (e.redeemCodeOk = !1)),
              o.$broadcast("ngCart:change", {});
          }
          function l() {
            t.setAmountToPay(0),
              t.setIframePaymentMethods(null),
              t.setIsFastProcessing(!1),
              t.setPaymentMethodId(null),
              t.setPhoneOrEmail(null),
              t.setProcessor(null),
              o.$broadcast("ngCart:change", {});
          }
          function m(e, t) {
            for (var r = t[0], n = Math.abs(e - r), o = 0; o < t.length; o++) {
              var a = Math.abs(e - t[o]);
              a < n && ((n = a), (r = t[o]));
            }
            return r;
          }
          function p(t, r) {
            if ("undefined" != typeof r) {
              e.isAuthenticated && $(".linesdraws.draws").addClass("loading");
              var n = 0,
                i = 0;
              if (
                "groupselection" === t.getSelectedTab() ||
                3 === t.getProductType()
              ) {
                t.setGroupnodraws(r.NumberOfDraws);
                var s = a.getProductPriceById(
                  t.getProductType(),
                  r.NumberOfDraws,
                  t.getLotteryType()
                );
                r.Discount > 0
                  ? ((n =
                      t.getGroupnoshares() *
                      (s.Price + (s.Price / (1 - r.Discount)) * r.Discount)),
                    (i = r.Discount * n))
                  : ((n = t.getGroupnoshares() * s.Price),
                    (i = r.Discount * n)),
                  t.setGroupdiscount(r.Discount);
              } else if (
                2 === t.getProductType() ||
                4 === t.getProductType() ||
                14 === t.getProductType()
              ) {
                var s = a.getProductPriceById(
                  t.getProductType(),
                  r.NumberOfDraws,
                  t.getLotteryType()
                );
                t.setNumberOfDraws(r.NumberOfDraws),
                  (n = s.Price * t.getQuantity()),
                  (i = 0),
                  t.setDiscount(r.Discount);
              } else if (1 === t.getProductType()) {
                t.setNumberOfDraws(r.NumberOfDraws);
                var s = a.getProductPriceByIds(
                  t.getProductType(),
                  t.getNumberOfDraws(),
                  t.getLotteryType(),
                  t.getNumberOfLines()
                );
                if (r.Discount > 0)
                  var n = s.Price + (s.Price / (1 - r.Discount)) * r.Discount,
                    i = r.Discount * n;
                else
                  var n = s.Price,
                    i = r.Discount * n;
                t.setDiscount(r.Discount);
              }
              t.setMinLines(r.MinLines),
                t.setMaxLines(r.MaxLines),
                t.setTotalCost(n - i),
                t.setTotalDiscount(i),
                e.initCart(),
                o.$broadcast("ngCart:change", {});
            }
          }
          function g() {
            if (t.getItems().length > 0) {
              var e = new Mapper(t.getCart()),
                r = e.PrepareOrder();
              a.prepareOrder(r).then(function (e) {
                d(e), o.$broadcast("ngCart:change", {});
              });
            }
          }
          function f(e) {
            var t = [],
              r = null,
              n = e.length;
            for (r = n - 1; r >= 0; r -= 1) t.push(e[r]);
            return t;
          }
          function h(e) {
            for (var t = new Array(), r = 0; r < e.length; r++)
              e[r] && t.push(e[r]);
            return t;
          }
          function y() {
            var r = new Mapper(t.getCart()),
              n = r.ConfirmOrder();
            console.log(n),
              a.submitOrder(n).then(function (r) {
                (e.creditCardError = []),
                  console.log("submitOrder:" + r),
                  console.log(r),
                  0 === r.StatusCode && 0 === r.Status
                    ? "PayboutiqueYandex" === t.getProcessor()
                      ? ((e.status = !1), window.open(r.Url, "_blank"))
                      : "Neteller" === t.getProcessor()
                      ? ((e.status = !1), (window.location.href = r.Url))
                      : ($("#hiddenclicker").attr("href", r.Url),
                        $("#hiddenclicker")
                          .fancybox({
                            width: "95%",
                            height: "95%",
                            autoScale: !0,
                            transitionIn: "elastic",
                            transitionOut: "elastic",
                            speedIn: 600,
                            speedOut: 200,
                            type: "iframe",
                          })
                          .trigger("click"))
                    : ((e.creditCard = !0),
                      (e.creditCardError = r.ErrorMessage),
                      (e.paymentMethodError = !0),
                      (e.paymentMethodErrorText = r.ErrorMessage));
              });
          }
          function C(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e;
          }
          function b(e) {
            var t = 1;
            return (
              "-" === e[0] && ((t = -1), (e = e.substr(1))),
              function (r, n) {
                var o = r[e] > n[e] ? -1 : r[e] < n[e] ? 1 : 0;
                return o * t;
              }
            );
          }
          (e.ngCart = t),
            (e.isFirstTimePurchase = o.isFirstTimePurchase),
            (e.isAuthenticated = o.isAuthenticated),
            (e.cartPartialsPath = o.cartPartialsPath),
            (e.paymentSystems = s),
            (e.extraInfo = "creditcard"),
            (e.promoCode = ""),
            (e.creditcard = {}),
            (e.paymentMethodError = !1),
            (e.country_code = ""),
            (e.signup = {
              mobileNumber: "",
              firstname: "",
              lastname: "",
              email: "",
              password: "",
            }),
            (e.terms = !1),
            (e.fastProcessing = t.getIsFastProcessing()),
            (e.section = { selectionPaymentTemplate: "" }),
            (e.country_codes = CountryCodeNames),
            (e.country_prefixes = CountryCodePrefixes),
            (e.language = o.language),
            (e.redeemCodeOk = !1),
            (e.redeemCodeWrong = !1),
            (e.showFreeTicket = !1),
            (e.hideEmptyCart = !1),
            (e.promoCode = t.getReedemCode()),
            (e.currentYear = new Date().getFullYear()),
            (e.creditCardExpirationYears = [
              e.currentYear,
              e.currentYear + 1,
              e.currentYear + 2,
              e.currentYear + 3,
              e.currentYear + 4,
              e.currentYear + 5,
              e.currentYear + 6,
              e.currentYear + 7,
              e.currentYear + 8,
              e.currentYear + 9,
              e.currentYear + 10,
            ]),
            e.$watch(
              function () {
                return o.progress;
              },
              function () {
                e.progress = o.progress;
              },
              !0
            ),
            e.isAuthenticated && e.isFirstTimePurchase
              ? ((e.showFreeTicket = !0), (e.hideEmptyCart = !0))
              : e.isAuthenticated && !e.isFirstTimePurchase
              ? ((e.showFreeTicket = !1), (e.hideEmptyCart = !1))
              : ((e.showFreeTicket = !0), (e.hideEmptyCart = !0)),
            ("undefined" != typeof o.language && "" !== o.language) ||
              (o.language = "en"),
            e.isAuthenticated || l(),
            u.getTranslation(e, o.language),
            (e.redirectToCart = function (t) {
              t.preventDefault(),
                (window.location =
                  "en" !== e.language ? "/" + e.language + "/cart/" : "/cart/");
            }),
            (e.redirectToPlayPageTopJackpot = function () {
              window.location =
                CONFIG.homeURL +
                "/" +
                o.topJacktop.LotteryName.toLowerCase() +
                "-lottery/";
            }),
            (e.initCart = function () {
              if (e.isAuthenticated) {
                if (t.getItems().length > 0) {
                  var r = new Mapper(t.getCart()),
                    n = r.PrepareOrder();
                  a.prepareOrder(n).then(function (r) {
                    d(r),
                      t.getTotalItems() > 0 &&
                      e.isAuthenticated &&
                      0 === t.getIframePaymentMethods().length
                        ? (e.section.selectionPaymentTemplate = "new")
                        : t.getTotalItems() > 0 &&
                          e.isAuthenticated &&
                          t.getIframePaymentMethods().length > 0 &&
                          (e.section.selectionPaymentTemplate = "exist");
                  });
                }
              } else
                t.getTotalItems() > 0 &&
                  !e.isAuthenticated &&
                  (e.section.selectionPaymentTemplate = "signup");
            }),
            (e.removeItem = function (r) {
              var n = r;
              if (
                ("object" != typeof r && (n = t.getItemById(r)),
                "object" == typeof n && null !== n)
              ) {
                var o = n.getGuid();
                if ("undefined" != typeof o) {
                  var a = t.getItems(),
                    i = [];
                  angular.forEach(a, function (e) {
                    e.getGuid() === o && i.push(e.getId());
                  });
                  for (var s = 0; s < i.length; s++) t.removeItemById(i[s]);
                } else t.removeItemById(n.getId());
              }
              e.initCart();
            }),
            (e.initSignUp = function () {
              for (var t = 0; t < e.country_codes.length; t++)
                if (e.country_codes[t].code === CONFIG.countryCode) {
                  e.country_code = e.country_codes[t];
                  var r = e.country_codes[t].code;
                  e.signup.MobileNumber = e.country_prefixes[r];
                  break;
                }
            }),
            (e.setPrefix = function (t) {
              e.signup.MobileNumber = e.country_prefixes[t];
            }),
            (e.beforeCheckOutCall = g),
            (e.editPaymentMethods = function () {
              (e.creditCardError = !1),
                (e.section.selectionPaymentTemplate = "new");
            }),
            (e.signin = function (t, r) {
              var n = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              return (
                t.preventDefault(),
                "undefined" == typeof r || "" === r
                  ? ((e.signinError = !0),
                    void (e.errorText =
                      "Email and Password should not be empty."))
                  : "undefined" == typeof r.email
                  ? ((e.signinError = !0),
                    void (e.errorText = "Email should not be empty"))
                  : n.test(r.email)
                  ? "undefined" == typeof r.password || "" === r.password
                    ? ((e.signinError = !0),
                      void (e.errorText = "Password should not be empty."))
                    : ((e.signinError = !1),
                      (e.errorText = ""),
                      void a.signIn(r).then(function (t) {
                        "Login failed" === t.error_msg
                          ? ((e.signinError = !0),
                            (e.errorText =
                              "Email and Password miss match or does not exists."))
                          : (l(), window.location.reload());
                      }))
                  : ((e.signinError = !0),
                    void (e.errorText = "Email is not valid."))
              );
            }),
            (e.forgotpass = function (t, r) {
              t.preventDefault();
              var n = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              return "undefined" != typeof r &&
                "" !== r.forgotemail &&
                r.forgotemail
                ? n.test(r.forgotemail)
                  ? ((e.signinError = !1),
                    (e.errorText = ""),
                    void a.forgotPass(r).then(function (t) {
                      "We cannot send you the password" === t.error_msg
                        ? ((e.signinError = !0), (e.errorText = t.error_msg))
                        : "Email not found" === t.error_msg
                        ? ((e.signinError = !0), (e.errorText = t.error_msg))
                        : ((e.signinError = !0), (e.errorText = t.msg), l());
                    }))
                  : ((e.signinError = !0),
                    void (e.errorText = "Email is not valid."))
                : ((e.signinError = !0),
                  void (e.errorText = "Email address should not be empty"));
            }),
            (e.signUp = function (t, r) {
              if (
                ((e.signupErrorText = []),
                t.preventDefault(),
                "undefined" == typeof r)
              )
                return (
                  (e.signupError = !0), void e.signupErrorText.push("Error")
                );
              if ("" === r.firstname)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "First name should not be empty",
                  })
                );
              if ("" === r.laststname)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "Last name should not be empty",
                  })
                );
              if (r.firstname.length < 2 || r.firstname.length > 20)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage:
                      "Name must not include numbers and be 2-20 characters.",
                  })
                );
              if (r.lastname.length < 2 || r.lastname.length > 20)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage:
                      "Name must not include numbers and be 2-20 characters.",
                  })
                );
              if ("" === r.email)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "'Email' should not be empty",
                  })
                );
              if ("" === r.password)
                return (
                  (e.signupError = !0),
                  e.signupErrorText.push({
                    ErrorMessage: "Password should not be empty",
                  }),
                  !1
                );
              if (r.password.length < 7 || r.password.length > 20)
                return (
                  (e.signupError = !0),
                  e.signupErrorText.push({
                    ErrorMessage:
                      "Password length should be 7 to 20 characters",
                  }),
                  !1
                );
              var n = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              if (!n.test(r.email))
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "Invalid Email format",
                  })
                );
              if ("" === r.MobileNumber || "undefined" == typeof r.MobileNumber)
                return (
                  (e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "Phone should not be empty",
                  })
                );
              var i = /^\+?[0-9 \-()]{6,25}$/;
              return i.test(jQuery.trim(r.MobileNumber))
                ? ((e.signupError = !1),
                  (r.AffiliateId = o.affiliateId),
                  void (
                    e.signupError ||
                    (jQuery(".hidesigninloader").show(),
                    a.signUp(r).then(function (t) {
                      if (
                        (jQuery(".hidesigninloader").hide(),
                        "undefined" != typeof t.Result &&
                          "undefined" != typeof t.Result.UserSessionId)
                      )
                        l(), window.location.reload();
                      else {
                        e.signupError = !0;
                        var r = { ErrorMessage: t.error_msg };
                        e.signupErrorText.push(r);
                      }
                    }))
                  ))
                : ((e.signupError = !0),
                  void e.signupErrorText.push({
                    ErrorMessage: "Phone number is not valid",
                  }));
            }),
            (e.paymentSelect = function (r) {
              return (
                console.log(r),
                t.setProcessor(r.processor),
                r.needmoreinfo
                  ? (t.getAmountToPay() < 2 && "creditcard" != r.name && y(),
                    void (e.extraInfo = r.name))
                  : void y()
              );
            }),
            (e.paymentSelectMoreInfo = function (e, r) {
              e.preventDefault(), console.log(r), t.setPhoneOrEmail(r), y();
            }),
            (e.checkPayment = function (r, n, o) {
              "neteller" == r.name &&
                (t.setProcessor("neteller"), e.paymentSelectMoreInfo(n, o));
            }),
            (e.submitOrderNewCreditCard = function (r) {
              if (
                ((e.creditCardError = []),
                (e.creditCard = !1),
                "undefined" == typeof r)
              )
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Enter credit card",
                  })
                );
              if (!r.terms)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please agree with our Terms and Conditions!",
                  })
                );
              if (
                "undefined" == typeof r.CardHolderName ||
                r.CardHolderName.length < 2
              )
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please type your full name",
                  })
                );
              if (
                "undefined" == typeof r.CreditCardNumber ||
                0 == r.CreditCardNumber.length
              )
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please insert credit card number.",
                  })
                );
              if (r.CreditCardNumber.length < 10)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Credit card number length is invalid",
                  })
                );
              if ("undefined" == typeof r.expiration)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Date",
                  })
                );
              if ("undefined" == typeof r.expiration.year)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Year",
                  })
                );
              if ("undefined" == typeof r.expiration.month)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Month",
                  })
                );
              if ("undefined" == typeof r.Cvv || r.Cvv.length < 3)
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please insert your cvv number",
                  })
                );
              var n = new Date(
                  parseInt(r.expiration.year),
                  parseInt(r.expiration.month),
                  0
                ).getDate(),
                o = r.expiration.year + "-" + r.expiration.month + "-" + n,
                i = new Date();
              i.setHours(0, 0, 0, 0);
              var s = new Date(o);
              if ((s.setHours(0, 0, 0, 0), s < i))
                return (
                  (e.creditCard = !0),
                  void e.creditCardError.push({
                    ErrorMessage: "Please enter valid card expiration date!",
                  })
                );
              var c = {
                CardHolderName: r.CardHolderName,
                CreditCardNumber: r.CreditCardNumber,
                Cvv: r.Cvv,
                ExpirationDate: o,
              };
              console.log(c), t.setProcessor("CreditCard");
              var u = new Mapper(t.getCart(), c),
                d = u.ConfirmOrder();
              a.submitOrder(d).then(function (t) {
                return (
                  console.log(t),
                  t.IsSuccess
                    ? void (window.location = "/thankyou/" + t.Pmc + "/")
                    : ($("#middle").removeClass("loading"),
                      (e.creditCard = !0),
                      void e.creditCardError.push({
                        ErrorMessage: t.error_msg,
                      }))
                );
              });
            }),
            (e.submitOrder = function (r, n) {
              if (!n)
                return (
                  (e.paymentMethodError = !0),
                  void (e.paymentMethodErrorText =
                    "Please agree with our Terms and Conditions!")
                );
              if ("undefined" == typeof r || "" === r.MethodId)
                return (
                  (e.paymentMethodError = !0),
                  void (e.paymentMethodErrorText =
                    "Please select a payment method!")
                );
              if (0 !== t.getItems().length) {
                console.log("submit order", t);
                var o = new Mapper(t.getCart(), ""),
                  i = o.ConfirmOrder();
                console.log(i),
                  a.submitOrder(i).then(function (r) {
                    console.log(r),
                      (e.creditCardError = []),
                      (e.paymentMethodError = !1),
                      r.IsSuccess
                        ? "CreditCard" !== t.getProcessor()
                          ? 0 === r.StatusCode
                            ? ($("#hiddenclicker").attr("href", r.Url),
                              $("#hiddenclicker")
                                .fancybox({
                                  width: "95%",
                                  height: "95%",
                                  autoScale: !0,
                                  transitionIn: "elastic",
                                  transitionOut: "elastic",
                                  speedIn: 600,
                                  speedOut: 200,
                                  type: "iframe",
                                })
                                .trigger("click"))
                            : ((e.creditCard = !0),
                              e.creditCardError.push({
                                ErrorMessage: r.error_msg,
                              }))
                          : (window.location = "/thankyou/" + r.Pmc + "/")
                        : ($("#middle").removeClass("loading"),
                          0 === r.StatusCode
                            ? ($("#hiddenclicker").attr("href", r.Url),
                              $("#hiddenclicker")
                                .fancybox({
                                  width: "95%",
                                  height: "95%",
                                  autoScale: !0,
                                  transitionIn: "elastic",
                                  transitionOut: "elastic",
                                  speedIn: 600,
                                  speedOut: 200,
                                  type: "iframe",
                                })
                                .trigger("click"))
                            : ((e.creditCard = !0),
                              e.creditCardError.push({
                                ErrorMessage: r.error_msg,
                              })));
                  });
              }
            }),
            (e.paymentMethodSelected = function (e, r) {
              "undefined" != typeof e &&
                "undefined" != typeof r &&
                (t.setPaymentMethodId(e),
                t.setProcessor(r),
                o.$broadcast("ngCart:change", {}),
                console.log("methodId", e));
            }),
            (e.subscriptionChanged = function (r) {
              var n = t.getItemById(r);
              n.getIsSubscription()
                ? n.setIsSubscription(!1)
                : n.setIsSubscription(!0),
                o.$broadcast("ngCart:change", {}),
                e.$broadcast("ngCart:itemSubscriptionChanged", { itemid: r }),
                console.log(t);
            }),
            (e.fastProcessingChanged = function () {
              t.setIsFastProcessing(!t.getIsFastProcessing()),
                (e.fastProcessing = t.getIsFastProcessing());
              var r = t.getItems();
              angular.forEach(r, function (e) {
                e.setIsFastProcessing(t.getIsFastProcessing()),
                  t.getIsFastProcessing()
                    ? (e.setTotalCost(
                        e.getTotalCost() + t.getFastProcessingTax()
                      ),
                      t.getAmountToPay() > 0 &&
                        t.setAmountToPay(
                          t.getAmountToPay() + t.getFastProcessingTax()
                        ))
                    : (e.setTotalCost(
                        e.getTotalCost() - t.getFastProcessingTax()
                      ),
                      t.getAmountToPay() > 0 &&
                        t.setAmountToPay(
                          t.getAmountToPay() - t.getFastProcessingTax()
                        ));
              }),
                o.$broadcast("ngCart:change", {}),
                console.log(t);
            }),
            (e.beforeCheckout = function (e) {
              e.preventDefault(),
                console.log("before checkout"),
                g(),
                (window.location = o.cartUrlWithLang);
            }),
            (e.getRandomInt = C),
            (e.addQuantity = function (r) {
              if (!(r.getQuantity() < 1)) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading"),
                  r.setQuantity(r.getQuantity() + 1);
                var n = a.getProductPriceById(
                    r.getProductType(),
                    r.getNumberOfDraws(),
                    r.getLotteryType()
                  ).Price,
                  o = n * r.getQuantity(),
                  i = 0;
                r.setTotalCost(o - i),
                  r.setTotalDiscount(),
                  e.initCart(),
                  console.log(t.getAmountToPay());
              }
            }),
            (e.removeQuantity = function (t) {
              if (!(t.getQuantity() <= 1)) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading"),
                  t.setQuantity(t.getQuantity() - 1);
                var r = a.getProductPriceById(
                    t.getProductType(),
                    t.getNumberOfDraws(),
                    t.getLotteryType()
                  ).Price,
                  n = r * t.getQuantity(),
                  o = 0;
                t.setTotalCost(n - o), t.setTotalDiscount(), e.initCart();
              }
            }),
            (e.addShare = function (t) {
              if (t.getGroupnoshares() < 150) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading");
                var r = t.getGroupnoshares();
                t.setGroupnoshares(r + 1);
                var n = a.getProductPriceById(
                  t.getProductType(),
                  t.getGroupnodraws(),
                  t.getLotteryType()
                );
                if (t.getGroupdiscount() > 0)
                  var i =
                      t.getGroupnoshares() *
                      (n.Price +
                        (n.Price / (1 - t.getGroupdiscount())) *
                          t.getGroupdiscount()),
                    s = t.getGroupdiscount() * i;
                else
                  var i = t.getGroupnoshares() * n.Price,
                    s = t.getGroupdiscount() * i;
                t.setTotalCost(i - s), t.setTotalDiscount();
              }
              e.initCart(), o.$broadcast("ngCart:change", {});
            }),
            (e.removeShare = function (t) {
              if (t.getGroupnoshares() > 1) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading");
                var r = t.getGroupnoshares();
                t.setGroupnoshares(r - 1);
                var n = a.getProductPriceById(
                  t.getProductType(),
                  t.getGroupnodraws(),
                  t.getLotteryType()
                );
                if (t.getGroupdiscount() > 0)
                  var i =
                      t.getGroupnoshares() *
                      (n.Price +
                        (n.Price / (1 - t.getGroupdiscount())) *
                          t.getGroupdiscount()),
                    s = t.getGroupdiscount() * i;
                else
                  var i = t.getGroupnoshares() * n.Price,
                    s = t.getGroupdiscount() * i;
                t.setTotalCost(i - s), t.setTotalDiscount(s);
              }
              e.initCart(), o.$broadcast("ngCart:change", {});
            }),
            (e.initpopuppromo = function (t) {
              t && (e.promoactive = !0);
            }),
            (e.addLine = function P(r) {
              if ((console.log(r), r.getMaxLines() > r.getNumberOfLines())) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading");
                for (
                  var n = [],
                    i = [],
                    s = r.getSelectNumbers(),
                    c = r.getMinSelectNumbers(),
                    u = r.getExtraNumbers(),
                    d = r.getMaxExtraNumbers(),
                    l = r.getMaxSelectNumbers();
                  n.length < l;

                ) {
                  for (var m = C(c, s), p = !1, g = 0; g < n.length; g++)
                    if (n[g] === m) {
                      p = !0;
                      break;
                    }
                  p || (n[n.length] = m);
                }
                if (
                  (console.log("generatedNumbers", n),
                  10 === r.getLotteryType())
                ) {
                  var f = r.getNumbersSantized()[0];
                  i.push(f.split("#")[1]);
                } else {
                  if (r.getMaxExtraNumbers() > 0)
                    for (var h = r.getMaxExtraNumbers(); i.length < h; ) {
                      for (var m = C(u, d), p = !1, g = 0; g < i.length; g++)
                        if (i[g] === m) {
                          p = !0;
                          break;
                        }
                      p || (i[i.length] = m);
                    }
                  console.log("generatedExtraNumbers", i);
                }
                var y = r.getNumbers() + "|" + n.join(",");
                i.length > 0 && (y += "#" + i.join(",")),
                  console.log("newLinesToStore", y),
                  r.setNumberOfLines(r.getNumberOfLines() + 1),
                  15 !== r.getProductType() &&
                    (r.setNumbers(y), r.setNumbersSantized(y)),
                  console.log(t);
                var b = a.getProductPriceByIds(
                  r.getProductType(),
                  r.getNumberOfDraws(),
                  r.getLotteryType(),
                  r.getNumberOfLines()
                );
                if (r.getDiscount() > 0)
                  var v =
                      b.Price +
                      (b.Price / (1 - r.getDiscount())) * r.getDiscount(),
                    x = r.getDiscount() * v;
                else
                  var v = b.Price,
                    x = r.getDiscount() * v;
                r.setTotalCost(v - x), r.setTotalDiscount();
              }
              console.log(r),
                r.getEvenLinesOnly() &&
                  r.getNumberOfLinesOrShares() % 2 !== 0 &&
                  (console.log("inside"), P(r)),
                e.initCart(),
                o.$broadcast("ngCart:change", {});
            }),
            (e.removeLine = function v(t) {
              if (t.getMinLines() !== t.getNumberOfLines()) {
                e.isAuthenticated && $(".linesdraws.lines").addClass("loading"),
                  t.setNumberOfLines(t.getNumberOfLines() - 1),
                  t.removeLastLine();
                var r = a.getProductPriceByIds(
                  t.getProductType(),
                  t.getNumberOfDraws(),
                  t.getLotteryType(),
                  t.getNumberOfLines()
                );
                if (t.getDiscount() > 0)
                  var n =
                      r.Price +
                      (r.Price / (1 - t.getDiscount())) * t.getDiscount(),
                    i = t.getDiscount() * n;
                else
                  var n = r.Price,
                    i = t.getDiscount() * n;
                t.setTotalCost(n - i);
              }
              t.getEvenLinesOnly() &&
                t.getNumberOfLinesOrShares() % 2 !== 0 &&
                (console.log("inside"), v(t)),
                e.initCart(),
                o.$broadcast("ngCart:change", {});
            }),
            (e.addDraw = function (e) {
              var t = e.getProductsDrawOptions(),
                r = 0;
              r =
                3 === e.getProductType()
                  ? e.getGroupnodraws()
                  : e.getNumberOfDraws();
              var n = t.filter(function (e) {
                  return (
                    "NumberOfDraws" in e &&
                    "number" == typeof e.NumberOfDraws &&
                    !isNaN(e.NumberOfDraws) &&
                    e.NumberOfDraws > r
                  );
                }),
                o = n[0];
              p(e, o);
            }),
            (e.removeDraw = function (t) {
              var r = t.getProductsDrawOptions(),
                n = h(f(r)),
                i = 0;
              i =
                "groupselection" === t.getSelectedTab() ||
                3 === t.getProductType()
                  ? t.getGroupnodraws()
                  : t.getNumberOfDraws();
              var s = n.filter(function (e) {
                return (
                  "NumberOfDraws" in e &&
                  "number" == typeof e.NumberOfDraws &&
                  !isNaN(e.NumberOfDraws) &&
                  e.NumberOfDraws < i
                );
              });
              s.length > 1 && (s = s.sort(b("NumberOfDraws")));
              var c = s[0];
              if (
                ("undefined" != typeof c &&
                  "undefined" != typeof c.MinLines &&
                  "undefined" != typeof c.MaxLines &&
                  (t.setMinLines(c.MinLines), t.setMaxLines(c.MaxLines)),
                3 !== t.getProductType() &&
                  t.getMinLines() > t.getNumberOfLines())
              )
                for (
                  console.log("generating new lines - remove draw");
                  t.getMinLines() > t.getNumberOfLines();

                )
                  e.addLine(t);
              if ("undefined" != typeof c) {
                e.isAuthenticated && $(".linesdraws.draws").addClass("loading");
                var u = 0,
                  d = 0;
                if (3 === t.getProductType()) {
                  t.setGroupnodraws(c.NumberOfDraws);
                  var l = a.getProductPriceById(
                    t.getProductType(),
                    c.NumberOfDraws,
                    t.getLotteryType()
                  );
                  c.Discount > 0
                    ? ((u =
                        t.getGroupnoshares() *
                        (l.Price + (l.Price / (1 - c.Discount)) * c.Discount)),
                      (d = c.Discount * u))
                    : ((u = t.getGroupnoshares() * l.Price),
                      (d = c.Discount * l.Price)),
                    t.setGroupdiscount(c.Discount);
                } else if (
                  2 === t.getProductType() ||
                  4 === t.getProductType() ||
                  14 === t.getProductType()
                ) {
                  t.setNumberOfDraws(c.NumberOfDraws);
                  var l = a.getProductPriceById(
                    t.getProductType(),
                    c.NumberOfDraws,
                    t.getLotteryType()
                  );
                  (u = l.Price * t.getQuantity()),
                    (d = 0),
                    t.setDiscount(c.Discount);
                } else if (1 === t.getProductType()) {
                  t.setNumberOfDraws(c.NumberOfDraws);
                  var l = a.getProductPriceByIds(
                    t.getProductType(),
                    t.getNumberOfDraws(),
                    t.getLotteryType(),
                    t.getNumberOfLines()
                  );
                  if (c.Discount > 0)
                    var u = l.Price + (l.Price / (1 - c.Discount)) * c.Discount,
                      d = c.Discount * u;
                  else
                    var u = l.Price,
                      d = c.Discount * u;
                  t.setDiscount(c.Discount);
                }
                t.setTotalCost(u - d),
                  t.setTotalDiscount(d),
                  e.initCart(),
                  o.$broadcast("ngCart:change", {});
              }
            }),
            (e.addShareNavidad = function (t) {
              if (t.getMaxLines() > t.getNumberOfLines()) {
                t.setNumberOfLines(t.getNumberOfLines() + 1);
                var r = t.getNumberOfLines() * t.getOriginalPrice(),
                  n = t.getDiscount() * r;
                t.setTotalCost(r - n),
                  e.initCart(),
                  o.$broadcast("ngCart:change", {});
              }
            }),
            (e.removeShareNavidad = function (t) {
              if (t.getMinLines() !== t.getNumberOfLines()) {
                t.setNumberOfLines(t.getNumberOfLines() - 1);
                var r = t.getNumberOfLines() * t.getOriginalPrice(),
                  n = t.getDiscount() * r;
                t.setTotalCost(r - n);
              }
              e.initCart(), o.$broadcast("ngCart:change", {});
            }),
            (e.editLine = function (t, o) {
              r.open({
                template: e.cartPartialsPath + "ngCart/addnumbers.html",
                scope: e,
                controller: n("someCtrl", { $scope: e, item: o, line: t }),
              }),
                console.log(t, " ", o);
            }),
            (e.popuppromo = function () {
              e.promoactive !== !0
                ? (e.promoactive = !0)
                : (e.promoactive = !1);
            }),
            (e.promoCodeValidator = function (t) {
              var r = t.charCode || t.keyCode || 0;
              8 !== r &&
                9 !== r &&
                ("undefined" != typeof e.promoCode &&
                  null !== e.promoCode &&
                  3 === e.promoCode.length &&
                  (e.promoCode += "-"),
                "undefined" != typeof e.promoCode &&
                  null !== e.promoCode &&
                  7 === e.promoCode.length &&
                  (e.promoCode += "-"));
            }),
            (e.showDetail = function (t) {
              e.active !== t ? (e.active = t) : (e.active = null);
            }),
            (e.showthetooltip = function (t) {
              e.tooltipshown !== t
                ? (e.tooltipshown = t)
                : (e.tooltipshown = null);
            }),
            (e.hidethetooltip = function (t) {
              e.tooltipshown = null;
            }),
            (e.showtooltipcart = function (t) {
              e.tooltipcart !== t
                ? (e.tooltipcart = t)
                : (e.tooltipcart = null);
            }),
            (e.hidetooltipcart = function (t) {
              e.tooltipcart = null;
            }),
            (e.showtooltippay = function (t) {
              e.paycart !== t ? (e.paycart = t) : (e.paycart = null);
            }),
            (e.hidetooltippay = function (t) {
              e.paycart = null;
            }),
            (e.submitPromoCode = function (e, r) {
              e.preventDefault(), t.setReedemCode(r), g();
            }),
            (e.removePromoCode = function () {
              t.setReedemCode(""), g(), e.popuppromo();
            }),
            e.$on("ngCart:itemSubscriptionChanged", function (e, r) {
              var n = t.getItemById(r.itemid),
                o = n.getProductsDrawOptions(),
                a = 0;
              a =
                "groupselection" === n.getSelectedTab() ||
                3 === n.getProductType()
                  ? n.getGroupnodraws()
                  : n.getNumberOfDraws();
              var i = [];
              angular.forEach(o, function (e) {
                i.push(e.NumberOfDraws);
              });
              var s = m(a, i),
                c = o.filter(function (e) {
                  if (e.NumberOfDraws === s) return !0;
                });
              p(n, c[0]), console.log(r);
            }),
            console.log(t);
        },
      ])
      .controller("NavidadController", [
        "$rootScope",
        "$scope",
        "ngCart",
        "$timeout",
        function (e, t, r, n) {
          function o(e, o) {
            function i() {
              return e.seconds <= 0
                ? (d(), void u.stop())
                : (e.seconds--,
                  0 === e.seconds && (e.isRefreshing = !0),
                  angular.element("#timer" + c).text(a(e.seconds)),
                  void e.$apply());
            }
            var s,
              c = o.getId(),
              u = this,
              d = function () {
                n(function () {
                  r.removeItemById(c), t.initCart();
                }, 100);
              };
            (this.start = function () {
              clearInterval(s),
                (e.seconds = o.getProductExpire()),
                angular.element("#timer" + c).text(a(e.seconds)),
                (s = setInterval(i.bind(this.timer), 1e3));
            }),
              (this.stop = function () {
                clearInterval(s);
              });
          }
          function a(e) {
            var t, r;
            return (
              (t = Math.floor(e / 60) % 60),
              (e -= 60 * t),
              (r = e % 60),
              [t + "m", r + "s"].join(" ")
            );
          }
          var i;
          (t.init = function (e) {
            console.log(e);
            var n = r.getItemById(e);
            (i = new o(t, n)), i.start();
          }),
            (t.startTimer = function (e) {
              console.log(e);
              var n = r.getItemById(e);
              (i = new o(t, n)), i.start();
            }),
            (t.removeItem = function (e) {
              var n = e;
              if (
                ("object" != typeof e && (n = r.getItemById(e)),
                "object" == typeof n && null !== n)
              ) {
                var o = n.getGuid();
                if ("undefined" != typeof o) {
                  var a = r.getItems(),
                    i = [];
                  angular.forEach(a, function (e) {
                    e.getGuid() === o && i.push(e.getId());
                  });
                  for (var s = 0; s < i.length; s++) r.removeItemById(i[s]);
                } else r.removeItemById(n.getId());
              }
              t.initCart();
            });
        },
      ])
      .controller("DepositController", [
        "$rootScope",
        "$scope",
        "ngCart",
        "ngCart.lottoyard.api",
        "ngCart.translationService",
        "PaymentSystems",
        function (e, t, r, n, o, a) {
          function i(e) {
            "undefined" == typeof e && (e = 0);
            var o = r.getPaymentMethodId();
            ("undefined" != typeof o && null != o) || (o = 0);
            var a = {
              SessionId: "{0}",
              MemberId: "{0}",
              PaymentMethodId: o,
              Amount: e,
              ProcessorApi: r.getProcessor(),
              PhoneOrEmail: r.getPhoneOrEmail(),
            };
            n.depositFunds(JSON.stringify(a)).then(function (e) {
              (t.creditCardError = []),
                0 === e.StatusCode && 0 === e.Status
                  ? "PayboutiqueYandex" === r.getProcessor()
                    ? ((t.status = !1), $window.open(e.Url, "_blank"))
                    : ($("#hiddenclicker").attr("href", e.Url),
                      $("#hiddenclicker")
                        .fancybox({
                          width: "95%",
                          height: "95%",
                          autoScale: !0,
                          transitionIn: "elastic",
                          transitionOut: "elastic",
                          speedIn: 600,
                          speedOut: 200,
                          type: "iframe",
                        })
                        .trigger("click"))
                  : ((t.creditCard = !0),
                    (t.creditCardError = e.ErrorMessage),
                    (t.paymentMethodError = !0),
                    (t.paymentMethodErrorText = e.ErrorMessage));
            });
          }
          (t.ngCart = r),
            (t.depositAmount = 0),
            (t.paymentSystems = a),
            (t.terms = !1),
            (t.status = ""),
            (t.statusclass = ""),
            (t.section = { selectionPaymentTemplate: "" }),
            (t.extraInfo = "creditcard"),
            (t.promoCode = ""),
            (t.creditcard = {}),
            (t.currentYear = new Date().getFullYear()),
            (t.creditCardExpirationYears = [
              t.currentYear,
              t.currentYear + 1,
              t.currentYear + 2,
              t.currentYear + 3,
              t.currentYear + 4,
              t.currentYear + 5,
              t.currentYear + 6,
              t.currentYear + 7,
              t.currentYear + 8,
              t.currentYear + 9,
              t.currentYear + 10,
            ]),
            o.getTranslation(t, e.language),
            (t.initDepositPage = function () {
              if (t.isAuthenticated) {
                var e = JSON.stringify({ MemberId: "{0}" });
                n.getMemberPaymentMethods(e).then(function (e) {
                  r.setIframePaymentMethods(e),
                    e.length > 0 &&
                      ((t.selectedmethod = e[0]),
                      r.setPaymentMethodId(e[0].MethodId),
                      r.setProcessor(e[0].Processor)),
                    t.isAuthenticated &&
                    0 === r.getIframePaymentMethods().length
                      ? (t.section.selectionPaymentTemplate = "new")
                      : t.isAuthenticated &&
                        r.getIframePaymentMethods().length > 0 &&
                        (t.section.selectionPaymentTemplate = "exist");
                });
              } else t.section.selectionPaymentTemplate = "signup";
            }),
            (t.paymentMethodSelected = function (t, n) {
              r.setPaymentMethodId(t),
                r.setProcessor(n),
                e.$broadcast("ngCart:change", {}),
                console.log("methodId", t);
            }),
            (t.showtooltippay = function (e) {
              t.paycart !== e ? (t.paycart = e) : (t.paycart = null);
            }),
            (t.hidetooltippay = function (e) {
              t.paycart = null;
            }),
            (t.depositFunds = function (e, o, a) {
              if (!a)
                return (
                  (t.paymentMethodError = !0),
                  void (t.paymentMethodErrorText =
                    "Please agree with our Terms and Conditions!")
                );
              if ("undefined" == typeof e || "" === e.MethodId)
                return (
                  (t.paymentMethodError = !0),
                  void (t.paymentMethodErrorText =
                    "Please select a payment method!")
                );
              if ("undefined" == typeof o || "" === o || 0 === o || o < 5)
                return (
                  (t.paymentMethodError = !0),
                  void (t.paymentMethodErrorText = "The Min Deposit Is 5EUR")
                );
              var i = r.getPaymentMethodId();
              ("undefined" != typeof i && null != i) || (i = 0);
              var s = {
                SessionId: "{0}",
                MemberId: "{0}",
                PaymentMethodId: i,
                Amount: o,
                ProcessorApi: r.getProcessor(),
              };
              n.depositFunds(JSON.stringify(s)).then(function (e) {
                (t.creditCardError = []),
                  e.IsSuccess
                    ? ((t.paymentMethodError = !1),
                      (t.status = e.Status),
                      (t.status = "Thank you , your deposit was successful!"),
                      (t.statusclass = "ok"),
                      "CreditCard" !== r.getProcessor()
                        ? ($("#hiddenclicker").attr("href", e.Url),
                          $("#hiddenclicker")
                            .fancybox({
                              width: "95%",
                              height: "95%",
                              autoScale: !0,
                              transitionIn: "elastic",
                              transitionOut: "elastic",
                              speedIn: 600,
                              speedOut: 200,
                              type: "iframe",
                            })
                            .trigger("click"))
                        : (window.location = "/thankyou?deposit-funds"))
                    : ((t.paymentMethodError = !1),
                      (t.creditCard = !0),
                      t.creditCardError.push({ ErrorMessage: e.error_msg }),
                      $(".mainpaymenttabs").removeClass("loading"));
              });
            }),
            (t.paymentSelect = function (e) {
              console.log(e),
                r.setProcessor(e.processor),
                (t.creditCard = !1),
                (t.status = ""),
                (t.extraInfo = e.name);
            }),
            (t.submitOrderNewCreditCard = function (e, o) {
              if (
                ((t.creditCardError = []),
                (t.creditCard = !1),
                "undefined" == typeof e)
              )
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Enter credit card",
                  })
                );
              if (!e.terms)
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please agree with our Terms and Conditions!",
                  })
                );
              if (
                "undefined" == typeof e.CardHolderName ||
                e.CardHolderName.length < 2
              )
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please type your full name",
                  })
                );
              if (
                "undefined" == typeof e.CreditCardNumber ||
                e.CreditCardNumber.length < 10
              )
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Credit card number length is invalid",
                  })
                );
              if ("undefined" == typeof e.expiration)
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Date",
                  })
                );
              if ("undefined" == typeof e.expiration.year)
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Year",
                  })
                );
              if ("undefined" == typeof e.expiration.month)
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please insert Expiration Month",
                  })
                );
              if ("undefined" == typeof e.Cvv || e.Cvv.length < 3)
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please insert your cvv number",
                  })
                );
              var a = new Date(),
                i = new Date(
                  parseInt(e.expiration.year),
                  parseInt(e.expiration.month),
                  0
                ).getDate(),
                s = e.expiration.year + "-" + e.expiration.month + "-" + i;
              a.setHours(0, 0, 0, 0);
              var c = new Date(s);
              if ((c.setHours(0, 0, 0, 0), c < a))
                return (
                  (t.creditCard = !0),
                  void t.creditCardError.push({
                    ErrorMessage: "Please enter valid card expiration date!",
                  })
                );
              (e.ExpirationDate = s),
                r.setProcessor("CreditCard"),
                console.log(e);
              var u = {
                SessionId: "{0}",
                MemberId: "{0}",
                Amount: o,
                ProcessorApi: r.getProcessor(),
                CreditCard: {
                  CardType: _getCreditCardType(e.CreditCardNumber),
                  CreditCardNumber: e.CreditCardNumber,
                  Cvv: e.Cvv,
                  ExpirationDate: s,
                  CardHolderName: e.CardHolderName,
                },
              };
              n.depositFunds(JSON.stringify(u)).then(function (e) {
                return (
                  console.log(e),
                  $(".mainpaymenttabs").removeClass("loading"),
                  e.IsSuccess
                    ? void (window.location = "/thankyou?deposit-funds")
                    : ((t.creditCard = !0),
                      void t.creditCardError.push({
                        ErrorMessage: e.error_msg,
                      }))
                );
              });
            }),
            (t.paymentSelectMoreInfo = function (e, t, n) {
              e.preventDefault(), console.log(t), r.setPhoneOrEmail(t), i(n);
            }),
            (t.editPaymentMethods = function () {
              t.section.selectionPaymentTemplate = "new";
            });
        },
      ])
      .controller("someCtrl", [
        "$scope",
        "item",
        "line",
        function (e, t, r) {
          function n(e) {
            var t = 0;
            return (
              e.filter(function (e) {
                return !e.isSelected || (t++, !1);
              }),
              t
            );
          }
          function o(e) {
            return e.filter(function (e) {
              return !e.isSelected || ((e.isSelected = 0), !1);
            });
          }
          (e.isValidSelectLine = !0),
            (e.isValidExtraLine = !0),
            console.log("line", r),
            r++,
            (e.line = r),
            (e.item = t),
            console.log("line", r),
            console.log("$scope.line", e.line),
            (e.clickNumber = function (r) {
              var o = t.getMinSelectNumbers(),
                a = t.getMaxSelectNumbers(),
                i = n(e.selectedNumbers);
              console.log("totalSelectNumbers", i),
                i < a
                  ? r.isSelected
                    ? (r.isSelected = 0)
                    : (r.isSelected = 1)
                  : r.isSelected && (r.isSelected = 0),
                (i = n(e.selectedNumbers)),
                i < o ? (e.isValidSelectLine = !1) : (e.isValidSelectLine = !0);
            }),
            (e.clickNumberExtra = function (r) {
              e.isValidExtraLine = !0;
              var o = t.getMinExtraNumber(),
                a = t.getMaxExtraNumbers(),
                i = n(e.selectedNumbersExtra);
              console.log("totalExtraSelectNumbers", i),
                i < a
                  ? r.isSelected
                    ? (r.isSelected = 0)
                    : (r.isSelected = 1)
                  : r.isSelected && (r.isSelected = 0),
                (i = n(e.selectedNumbersExtra)),
                0 !== o &&
                  (0 === i
                    ? (e.isValidExtraLine = !1)
                    : (o > i || i < a) && (e.isValidExtraLine = !1)),
                console.log("totalExtraSelectNumbers", i);
            }),
            (e.checkInput = function (r) {
              console.log("checkInput");
              var o = n(e.selectedNumbers),
                a = n(e.selectedNumbersExtra),
                i = t.getMaxSelectNumbers();
              if (o !== i) return (e.isValidSelectLine = !1), !1;
              if (
                (a > 0 || a !== t.getMaxExtraNumbers()) &&
                a !== t.getMaxExtraNumbers()
              )
                return (e.isValidExtraLine = !1), !1;
              if (e.isValidSelectLine && e.isValidExtraLine) {
                var s = t.getNumbersSantized()[r];
                console.log(s);
                var c = [];
                e.selectedNumbers.filter(function (e) {
                  return !e.isSelected || (c.push(e.id), !1);
                });
                var u = c.join(",");
                if (e.selectedNumbersExtra.length > 0) {
                  var d = [];
                  if (
                    (e.selectedNumbersExtra.filter(function (e) {
                      return !e.isSelected || (d.push(e.id), !1);
                    }),
                    (u += "#" + d.join(",")),
                    10 === t.getLotteryType())
                  ) {
                    var l = t.getNumbersSantized();
                    angular.forEach(l, function (e, r) {
                      var n = e.split("#"),
                        o = n[0],
                        a = d[0],
                        i = o + "#" + a;
                      t.updateSantizedLine(i, r + 1);
                    });
                  }
                }
                console.log(u), t.updateSantizedLine(u, r);
              }
              return !0;
            }),
            (e.clearLine = function () {
              o(e.selectedNumbers),
                o(e.selectedNumbersExtra),
                (e.isValidSelectLine = !1);
            }),
            (e.quickpick = function (r) {
              o(e.selectedNumbers), o(e.selectedNumbersExtra);
              for (
                var a = t.getMaxSelectNumbers(),
                  i = t.getMaxExtraNumbers(),
                  s = t.getMinSelectNumbers(),
                  c = t.getMinExtraNumber(),
                  u = t.getSelectNumbers(),
                  d = t.getExtraNumbers();
                n(e.selectedNumbers) < a;

              ) {
                var l = e.getRandomInt(s, u - 1),
                  m = { id: 1, isSelected: 0 };
                (m.id = l),
                  (m.isSelected = 1),
                  console.log(m),
                  console.log("number", l),
                  (e.selectedNumbers[l - 1] = m);
              }
              if (i > 0)
                for (; n(e.selectedNumbersExtra) < i; ) {
                  var p = e.getRandomInt(c, d - 1),
                    g = { id: 1, isSelected: 0 };
                  (g.id = p),
                    (g.isSelected = 1),
                    console.log(g),
                    console.log("numberExtra", p),
                    10 === t.getLotteryType()
                      ? (e.selectedNumbersExtra[p] = g)
                      : (e.selectedNumbersExtra[p - 1] = g);
                }
              console.log(e.selectedNumbers),
                console.log(e.selectedNumbersExtra);
              var f = n(e.selectedNumbers),
                h = n(e.selectedNumbersExtra);
              f === a && (e.isValidSelectLine = !0),
                h === i && (e.isValidExtraLine = !0);
            }),
            (r -= 1);
          var a = t.getSelectNumbers(),
            i = t.getExtraNumbers(),
            s = [],
            c = [],
            u = t.getNumbersSantized()[r],
            d = !1;
          "undefined" == typeof u && (d = !0);
          var l = "";
          if (!d) {
            var m = u.indexOf("#");
            m !== -1 &&
              (console.log(u),
              (l = u.substr(parseInt(u.indexOf("#") + 1))),
              (l = l.split(",")),
              console.log(l),
              (l = l.map(function (e) {
                return parseInt(e);
              })));
            var p;
            (p = m === -1 ? u.split(",") : u.slice(0, m).split(",")),
              (p = p.map(function (e) {
                return parseInt(e);
              })),
              console.log(p);
          }
          for (var g = t.getMinSelectNumbers(), f = g; f <= a; f++) {
            var h = { id: f, isSelected: 0 };
            d || (p.indexOf(f) >= 0 && (h.isSelected = 1)), s.push(h);
          }
          var y = t.getMinExtraNumber();
          if (t.getMaxExtraNumbers() > 0)
            for (var C = y; C <= i; C++) {
              var b = { id: C, isSelected: 0 };
              d || (l.indexOf(C) >= 0 && (b.isSelected = 1)), c.push(b);
            }
          console.log(s), (e.selectedNumbers = s), (e.selectedNumbersExtra = c);
        },
      ])
      .value("version", "1.0.0"),
      angular
        .module("ngCart.directives", ["ngCart.fulfilment"])
        .controller("CartController", [
          "$scope",
          "ngCart",
          function (e, t) {
            e.ngCart = t;
          },
        ])
        .directive("ngcartAddtocart", [
          "ngCart",
          function (e) {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {
                id: "@",
                name: "@",
                quantity: "@",
                quantityMax: "@",
                price: "@",
                data: "=",
              },
              transclude: !0,
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/addtocart.html"
                  : t.templateurl;
              },
              link: function (t, r, n) {
                (t.attrs = n),
                  (t.inCart = function () {
                    return e.getItemById(n.id);
                  }),
                  t.inCart()
                    ? (t.q = e.getItemById(n.id).getQuantity())
                    : (t.q = parseInt(t.quantity)),
                  (t.qtyOpt = []);
                for (var o = 1; o <= t.quantityMax; o++) t.qtyOpt.push(o);
              },
            };
          },
        ])
        .directive("ngcartCart", [
          "ngCart",
          "ngCart.lottoyard.api",
          "$rootScope",
          function (e, t, r) {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {},
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/cart.html"
                  : t.templateurl;
              },
              link: function (e, t, r) {
                e.beforeCheckOutCall();
              },
            };
          },
        ])
        .directive("ngcartPayment", [
          "ngCart",
          function (e) {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {},
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/paymentexist.html"
                  : t.templateurl;
              },
              link: function (e, t, r) {},
            };
          },
        ])
        .directive("ngcartPaymentNew", [
          "ngCart",
          function (e) {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {},
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/paymentnew.html"
                  : t.templateurl;
              },
              link: function (e, t, r) {},
            };
          },
        ])
        .directive("ngcartSignup", [
          "ngCart",
          function (e) {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {},
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/signup.html"
                  : t.templateurl;
              },
              link: function (e, t, r) {},
            };
          },
        ])
        .directive("ngcartSummary", [
          function () {
            return {
              restrict: "E",
              controller: "CartController",
              scope: {},
              transclude: !0,
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/summary.html"
                  : t.templateurl;
              },
            };
          },
        ])
        .directive("ngcartCheckout", [
          function () {
            return {
              restrict: "E",
              controller: [
                "$rootScope",
                "$scope",
                "ngCart",
                "fulfilmentProvider",
                "ngCart.lottoyard.api",
                function (e, t, r, n, o) {
                  (t.ngCart = r),
                    (t.checkout = function (r) {
                      r.preventDefault(),
                        n.setService(t.service),
                        n.setSettings(t.settings),
                        n
                          .checkout()
                          .success(function (t, r, n, o) {
                            console.log(t),
                              e.$broadcast("ngCart:checkout_succeeded", t);
                          })
                          .error(function (t, r, n, o) {
                            e.$broadcast("ngCart:checkout_failed", {
                              statusCode: r,
                              error: t,
                            });
                          });
                    });
                },
              ],
              scope: { service: "@", settings: "=" },
              transclude: !0,
              templateUrl: function (e, t) {
                return "undefined" == typeof t.templateurl
                  ? "/template/ngCart/checkout.html"
                  : t.templateurl;
              },
            };
          },
        ]),
      angular
        .module("ngCart.fulfilment", [])
        .run([
          "$rootScope",
          "$http",
          function (e, t) {
            t.defaults.transformRequest.push(function (t) {
              return (e.progress = !0), t;
            }),
              t.defaults.transformResponse.push(function (t) {
                return (e.progress = !1), t;
              });
          },
        ])
        .service("fulfilmentProvider", [
          "$injector",
          function (e) {
            (this._obj = { service: void 0, settings: void 0 }),
              (this.setService = function (e) {
                this._obj.service = e;
              }),
              (this.setSettings = function (e) {
                this._obj.settings = e;
              }),
              (this.checkout = function () {
                var t = e.get("ngCart.fulfilment." + this._obj.service);
                return t.checkout(this._obj.settings);
              });
          },
        ])
        .factory("ngCart.lottoyard.api", [
          "$q",
          "$log",
          "$http",
          "CacheFactory",
          "RESTApiUrl",
          "Products",
          "$timeout",
          "$interval",
          "myCacheFactory",
          function (e, t, r, n, o, a, i, s, c) {
            function u(e, t) {
              var r = e.filter(function (e) {
                return (
                  "LotteryTypeId" in e &&
                  "number" == typeof e.LotteryTypeId &&
                  e.LotteryTypeId === t
                );
              });
              return r;
            }
            function d(e, t) {
              var r = e.filter(function (e) {
                return (
                  "ProductId" in e &&
                  "number" == typeof e.ProductId &&
                  e.ProductId === t
                );
              });
              return r;
            }
            function l(e, t, r, n) {
              return e.filter(function (e) {
                return (
                  e.ProductId === t && e.NumOfDraws === r && e.LotteryId === n
                );
              });
            }
            function m(e, t, r, n, o) {
              return e.filter(function (e) {
                return (
                  e.ProductId === t &&
                  e.NumOfDraws === r &&
                  e.LotteryId === n &&
                  e.Lines === o
                );
              });
            }
            var p = {},
              g = 5,
              f = 1,
              h = 1,
              y = 1,
              C = 1,
              b = !1,
              P = !1,
              v = !1;
            return (
              (p.getLotteryById = function (e) {
                var t = "lottery-rules";
                if (c.get(t)) {
                  var r = c.get(t);
                  return u(r, e)[0];
                }
                this.getAllLotteriesRules().then(function (t) {
                  return u(t, e)[0];
                });
              }),
              (p.getProductById = function (e) {
                var t = "product-rules";
                if (c.get(t)) {
                  var r = c.get(t);
                  return console.log(d(r, e)), d(r, e)[0];
                }
                this.getAllProductsRules().then(function (t) {
                  return d(t, e)[0];
                });
              }),
              (p.getAllLotteriesRules = function x() {
                var t = "lottery-rules",
                  a = e.defer();
                return (
                  c.get(t)
                    ? a.resolve(c.get(t))
                    : r({
                        method: "POST",
                        cache: n.get("cachelottoyard"),
                        url: o,
                        timeout: 25e3,
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: "action=lottery_data&m=globalinfo/lottery-rules",
                      })
                        .success(function (e) {
                          var r;
                          b = !0;
                          try {
                            r = e;
                          } catch (n) {
                            console.error(
                              "Parsing globalinfo/lottery-rules Error: %s Response: %s",
                              n,
                              e
                            ),
                              a.reject("There was an error");
                          }
                          c.put(t, r), a.resolve(r);
                        })
                        .error(function (e) {
                          f < g
                            ? (i(function () {
                                x(), console.log("globalinfo/lottery-rules");
                              }, 2500),
                              f++)
                            : (console.warn(
                                "Error in getAllProductsRulesCompleted: " + e
                              ),
                              a.reject("There was an error"));
                        }),
                  a.promise
                );
              }),
              (p.getAllProductsRules = function () {
                var t = "product-rules",
                  a = e.defer();
                return (
                  c.get(t)
                    ? a.resolve(c.get(t))
                    : r({
                        method: "POST",
                        cache: n.get("cachelottoyard"),
                        url: o,
                        timeout: 25e3,
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: "action=lottery_data&m=globalinfo/product-rules",
                      })
                        .success(function (e) {
                          P = !0;
                          var r;
                          try {
                            r = e;
                          } catch (n) {
                            console.error(
                              "Parsing globalinfo/product-rules Error: %s Response: %s ",
                              n,
                              e
                            ),
                              a.reject("There was an error");
                          }
                          console.log(r), c.put(t, r), a.resolve(r);
                        })
                        .error(function (e) {
                          h < g
                            ? (console.log("countergetAllProductsRules:" + h),
                              i(function () {
                                p.getAllProductsRules();
                              }, 2500),
                              h++)
                            : (console.warn(
                                "Error in getAllProductsRulesCompleted" + e
                              ),
                              a.reject("There was an error:"));
                        }),
                  a.promise
                );
              }),
              (p.getFreeTicket = function () {
                var t = "free-ticket",
                  a = (JSON.stringify({ MemberId: "{0}" }), e.defer());
                return (
                  c.get(t)
                    ? a.resolve(c.get(t))
                    : r({
                        method: "POST",
                        cache: n.get("cachelottoyard"),
                        url: o,
                        timeout: 2e3,
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: "action=lottery_data&m=playlottery/get-member-free-ticket",
                      })
                        .success(function (e) {
                          c.put(t, e), a.resolve(e);
                        })
                        .error(function (e) {
                          h < g
                            ? (console.log("countergetAllProductsRules:" + h),
                              i(p.getAllProductsRules(), 2500),
                              h++)
                            : (console.warn(
                                "Error in getAllProductsRulesCompleted" + e
                              ),
                              a.reject("There was an error:"));
                        }),
                  a.promise
                );
              }),
              (p.prepareOrder = function (t) {
                var n = e.defer();
                return (
                  console.log("prepare-order", t),
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=cashier/prepare-order&data=" +
                      encodeURIComponent(t),
                  })
                    .success(function (e) {
                      $(".linesdraws.draws").removeClass("loading"),
                        $(".linesdraws.lines").removeClass("loading");
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/prepare-order Error: %s Response: %s",
                          r,
                          e
                        ),
                          n.reject("There was an error");
                      }
                      console.log("resp-prepare-order" + t), n.resolve(t);
                    })
                    .error(function () {
                      n.reject();
                    }),
                  n.promise
                );
              }),
              (p.submitOrder = function (t) {
                var n = e.defer();
                return (
                  $("#middle").addClass("loading"),
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=cashier/processor-confirm-order&data=" +
                      encodeURIComponent(t),
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/processor-confirm-order Error: %s Response: %s",
                          r,
                          e.error_msg
                        ),
                          n.reject("There was an error");
                      }
                      console.log(t), n.resolve(t);
                    })
                    .error(function () {
                      n.reject("There was an error");
                    }),
                  n.promise
                );
              }),
              (p.getMemberPaymentMethods = function (t) {
                var n = e.defer();
                return (
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=cashier/get-member-payment-methods&data=" +
                      t,
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/get-member-payment-methods Error: %s Response: %s",
                          r,
                          e.error_msg
                        ),
                          n.reject("There was an error");
                      }
                      console.log(t), n.resolve(t);
                    })
                    .error(function () {
                      n.reject("There was an error");
                    }),
                  n.promise
                );
              }),
              (p.depositFunds = function (t) {
                $(".mainpaymenttabs").addClass("loading");
                var n = e.defer();
                return (
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=cashier/deposit-funds&data=" + t,
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/deposit-fundss Error: %s Response: %s",
                          r,
                          e.error_msg
                        ),
                          n.reject("There was an error");
                      }
                      console.log(t), n.resolve(t);
                    })
                    .error(function () {
                      n.reject("There was an error");
                    }),
                  n.promise
                );
              }),
              (p.signIn = function (t) {
                var n = e.defer();
                return (
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=userinfo/login&email=" +
                      t.email +
                      "&password=" +
                      t.password,
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/deposit-fundss Error: %s Response: %s",
                          r,
                          e.error_msg
                        ),
                          n.reject("There was an error");
                      }
                      console.log(t), n.resolve(t);
                    })
                    .error(function () {
                      n.reject();
                    }),
                  n.promise
                );
              }),
              (p.forgotPass = function (t) {
                var n = e.defer();
                return (
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data:
                      "action=lottery_data&m=userinfo/get-personal-details-by-email&email=" +
                      t.forgotemail,
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing cashier/deposit-fundss Error: %s Response: %s",
                          r,
                          e.error_msg
                        ),
                          n.reject("There was an error");
                      }
                      n.resolve(t);
                    })
                    .error(function () {
                      n.reject();
                    }),
                  n.promise
                );
              }),
              "undefined" != typeof a &&
                a.length > 0 &&
                ((p.getProductPrices = function () {
                  var t = "product-prices",
                    s = "";
                  angular.forEach(a, function (e) {
                    s += e.id + ",";
                  });
                  var u = e.defer();
                  return (
                    c.get(t)
                      ? u.resolve(c.get(t))
                      : r({
                          method: "POST",
                          cache: n.get("cachelottoyard"),
                          url: o,
                          timeout: 25e3,
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                          data:
                            "action=lottery_data&m=globalinfo/get-prices-by-brand-and-productid&ProductIds=" +
                            s,
                        })
                          .success(function (e) {
                            var r;
                            try {
                              r = e;
                            } catch (n) {
                              console.error(
                                "Parsing globalinfo/get-prices-by-brand-and-productid Error: %s Response: %s",
                                n,
                                e.error_msg
                              ),
                                u.reject("There was an error");
                            }
                            (v = !0), c.put(t, r), u.resolve(r);
                          })
                          .error(function (e) {
                            y < g
                              ? (console.log("counterProductPrices:" + y),
                                i(function () {
                                  p.getProductPrices();
                                }, 2500),
                                y++)
                              : (console.warn(
                                  "Error in getProductPricesCompleted: " + e
                                ),
                                u.reject("There was an error"));
                          }),
                    u.promise
                  );
                }),
                (p.getProductPriceById = function (e, t, r) {
                  var n = "product-prices";
                  if (c.get(n)) {
                    var o = c.get(n);
                    return l(o, e, t, r)[0];
                  }
                  this.getProductPrices().then(function (n) {
                    return l(n, e, t, r)[0];
                  });
                }),
                (p.getProductPriceByIds = function (e, t, r, n) {
                  var o = "product-prices";
                  if (c.get(o)) {
                    var a = c.get(o);
                    return m(a, e, t, r, n)[0];
                  }
                  this.getProductPrices().then(function (o) {
                    return m(o, e, t, r, n)[0];
                  });
                })),
              (p.signUp = function (t) {
                t = $.param(t);
                var n = e.defer();
                return (
                  console.log(t),
                  r({
                    method: "POST",
                    url: o,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: "action=lottery_data&m=userinfo/signup&" + t,
                  })
                    .success(function (e) {
                      var t;
                      try {
                        t = e;
                      } catch (r) {
                        console.error(
                          "Parsing signup/signup-internal Error: %s Response: %s",
                          r,
                          e.error_msg
                        );
                      }
                      n.resolve(t);
                    })
                    .error(function () {
                      n.reject();
                    }),
                  n.promise
                );
              }),
              (p.getAllBrandDraws = function () {
                var t = "get-all-brand-draws",
                  a = e.defer();
                return (
                  c.get(t)
                    ? a.resolve(c.get(t))
                    : r({
                        method: "POST",
                        cache: n.get("cachelottoyard"),
                        url: o,
                        timeout: 25e3,
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: "action=lottery_data&m=globalinfo/get-all-brand-draws",
                      })
                        .success(function (e) {
                          var r;
                          try {
                            r = e;
                          } catch (n) {
                            console.error(
                              "Parsing globalinfo/get-all-brand-draws Error: %s Response: %s",
                              n,
                              e.error_msg
                            ),
                              a.reject("There was an error");
                          }
                          (v = !0), c.put(t, r), a.resolve(r);
                        })
                        .error(function (e) {
                          C < g
                            ? (console.log("counterAllBrandDraws:" + C),
                              i(function () {
                                p.getAllBrandDraws();
                              }, 2500),
                              C++)
                            : (console.warn(
                                "Error in counterAllBrandDraws: " + e
                              ),
                              a.reject("There was an error"));
                        }),
                  a.promise
                );
              }),
              p
            );
          },
        ])
        .service("myCacheFactory", [
          "CacheFactory",
          function (e) {
            if (!e.get("cachelottoyard"))
              return e("cachelottoyard", {
                maxAge: 36e5,
                cacheFlushInterval: 36e5,
                deleteOnExpire: "aggressive",
                storageMode: "localStorage",
              });
          },
        ])
        .service("ngCart.fulfilment.log", [
          "$q",
          "$log",
          "ngCart",
          function (e, t, r) {
            this.checkout = function () {
              var n = e.defer();
              return (
                t.info(r.toObject()),
                n.resolve({ cart: r.toObject() }),
                n.promise
              );
            };
          },
        ])
        .service("ngCart.fulfilment.http", [
          "$http",
          "ngCart",
          function (e, t) {
            this.checkout = function (r) {
              return e.post(r.url, { data: t.toObject(), options: r.options });
            };
          },
        ])
        .service("ngCart.translationService", [
          "ngCart",
          "$resource",
          "$http",
          "cartTranslationUrl",
          function (e, t, r, n) {
            this.getTranslation = function (e, t) {
              e.translation = translationObject;
            };
          },
        ])
        .service("ngCart.fulfilment.lottoyard", [
          "$http",
          "ngCart",
          function (e, t) {
            var r = CONFIG.adminURL;
            this.checkout = function (n) {
              var o = t.toObject();
              return e({
                method: "POST",
                url: r,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data:
                  "m=lottery_data&action=cashier/prepare-order&data=" +
                  encodeURIComponent(o),
              });
            };
          },
        ])
        .factory("ngCart.GetCountryByIpService", [
          "$http",
          "$q",
          function (e, t) {
            function r() {
              var e = t.defer();
              return e.promise;
            }
            var n = {};
            return (
              (n.getCountryCodeByIp = function () {
                var e = t.defer();
                return (
                  t.when(r(), function (t) {
                    console.log(t), e.resolve(t);
                  }),
                  e.promise
                );
              }),
              n
            );
          },
        ])
        .factory("broadcastService", [
          "$rootScope",
          function (e) {
            return {
              send: function (t, r) {
                e.$broadcast(t, r);
              },
            };
          },
        ])
        .filter("floor", function () {
          return function (e) {
            return Math.floor(e);
          };
        })
        .directive("validNumber", function () {
          return {
            require: "?ngModel",
            link: function (e, t, r, n) {
              n &&
                (n.$parsers.push(function (e) {
                  if (angular.isUndefined(e)) var e = "";
                  var t = e.replace(/[^0-9]+/g, "");
                  return e !== t && (n.$setViewValue(t), n.$render()), t;
                }),
                t.bind("keypress", function (e) {
                  32 === e.keyCode && e.preventDefault();
                }));
            },
          };
        })
        .directive("validNumberDecimal", function () {
          return {
            require: "?ngModel",
            link: function (e, t, r, n) {
              n &&
                (n.$parsers.push(function (e) {
                  if (angular.isUndefined(e)) var e = "";
                  var t = e.replace(/[^0-9\.]/g, ""),
                    r = t.split(".");
                  return (
                    angular.isUndefined(r[1]) ||
                      ((r[1] = r[1].slice(0, 2)), (t = r[0] + "." + r[1])),
                    e !== t && (n.$setViewValue(t), n.$render()),
                    t
                  );
                }),
                t.bind("keypress", function (e) {
                  32 === e.keyCode && e.preventDefault();
                }));
            },
          };
        })
        .filter("translate", [
          "$rootScope",
          "ErrorMessages",
          function (e, t) {
            return function (r) {
              var n = [],
                o = t[e.language];
              if ("undefined" != typeof r && r.length > 0)
                for (var a = 0; a < r.length; a++) {
                  var i = r[a],
                    s = o.filter(function (e) {
                      return e.error === i.ErrorMessage;
                    });
                  s.length > 0 ? n.push(s[0].text) : n.push(i.ErrorMessage);
                }
              return n;
            };
          },
        ]);
  })();
var CountryCodeNames = [
    { name: "Afghanistan", code: "AF" },
    { name: "Åland Islands", code: "AX" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "AndorrA", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Bouvet Island", code: "BV" },
    { name: "Brazil", code: "BR" },
    { name: "British Indian Ocean Territory", code: "IO" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cape Verde", code: "CV" },
    { name: "Cayman Islands", code: "KY" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Christmas Island", code: "CX" },
    { name: "Cocos (Keeling) Islands", code: "CC" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo, The Democratic Republic of the", code: "CD" },
    { name: "Cook Islands", code: "CK" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cote D'Ivoire", code: "CI" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Ethiopia", code: "ET" },
    { name: "Falkland Islands (Malvinas)", code: "FK" },
    { name: "Faroe Islands", code: "FO" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "French Guiana", code: "GF" },
    { name: "French Polynesia", code: "PF" },
    { name: "French Southern Territories", code: "TF" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Gibraltar", code: "GI" },
    { name: "Greece", code: "GR" },
    { name: "Greenland", code: "GL" },
    { name: "Grenada", code: "GD" },
    { name: "Guadeloupe", code: "GP" },
    { name: "Guam", code: "GU" },
    { name: "Guatemala", code: "GT" },
    { name: "Guernsey", code: "GG" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Heard Island and Mcdonald Islands", code: "HM" },
    { name: "Holy See (Vatican City State)", code: "VA" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran, Islamic Republic Of", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Isle of Man", code: "IM" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jersey", code: "JE" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea, Democratic People'S Republic of", code: "KP" },
    { name: "Korea, Republic of", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Lao People'S Democratic Republic", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libyan Arab Jamahiriya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macao", code: "MO" },
    { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Martinique", code: "MQ" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mayotte", code: "YT" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia, Federated States of", code: "FM" },
    { name: "Moldova, Republic of", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montserrat", code: "MS" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "Netherlands Antilles", code: "AN" },
    { name: "New Caledonia", code: "NC" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Niue", code: "NU" },
    { name: "Norfolk Island", code: "NF" },
    { name: "Northern Mariana Islands", code: "MP" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestinian Territory, Occupied", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Pitcairn", code: "PN" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Qatar", code: "QA" },
    { name: "Reunion", code: "RE" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation", code: "RU" },
    { name: "RWANDA", code: "RW" },
    { name: "Saint Helena", code: "SH" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Pierre and Miquelon", code: "PM" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia and Montenegro", code: "CS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Svalbard and Jan Mayen", code: "SJ" },
    { name: "Swaziland", code: "SZ" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Taiwan, Province of China", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania, United Republic of", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tokelau", code: "TK" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Turks and Caicos Islands", code: "TC" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "United States Minor Outlying Islands", code: "UM" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Virgin Islands, British", code: "VG" },
    { name: "Virgin Islands, U.S.", code: "VI" },
    { name: "Wallis and Futuna", code: "WF" },
    { name: "Western Sahara", code: "EH" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ],
  CountryCodePrefixes = {
    US: "1",
    CA: "1",
    BB: "1246",
    AI: "1264",
    AG: "1268",
    VG: "1284",
    VI: "1340",
    KY: "1345",
    BM: "1441",
    GD: "1473",
    TC: "1649",
    MS: "1664",
    MP: "1670",
    GU: "1671",
    AS: "1684",
    LC: "1758",
    DM: "1767",
    VC: "1784",
    PR: "1787",
    DO: "1809",
    TT: "1868",
    KN: "1869",
    JM: "1876",
    EG: "20",
    MA: "212",
    EH: "212",
    DZ: "213",
    TN: "216",
    LY: "218",
    GM: "220",
    SN: "221",
    MR: "222",
    ML: "223",
    GN: "224",
    CI: "225",
    BF: "226",
    NE: "227",
    TG: "228",
    BJ: "229",
    MU: "230",
    LR: "231",
    SL: "232",
    GH: "233",
    NG: "234",
    TD: "235",
    CF: "236",
    CM: "237",
    CV: "238",
    ST: "239",
    GQ: "240",
    GA: "241",
    CG: "242",
    BS: "242",
    CD: "243",
    AO: "244",
    GW: "245",
    IO: "246",
    AC: "247",
    SC: "248",
    SD: "249",
    RW: "250",
    ET: "251",
    SO: "252",
    QS: "252",
    DJ: "253",
    KE: "254",
    TZ: "255",
    UG: "256",
    BI: "257",
    MZ: "258",
    ZM: "260",
    MG: "261",
    RE: "262",
    TF: "262",
    ZW: "263",
    NA: "264",
    MW: "265",
    LS: "266",
    BW: "267",
    SZ: "268",
    YT: "269",
    KM: "269",
    ZA: "27",
    ER: "291",
    AW: "297",
    FO: "298",
    GL: "299",
    GR: "30",
    NL: "31",
    BE: "32",
    FR: "33",
    ES: "34",
    EA: "34",
    IC: "34",
    GI: "350",
    PT: "351",
    LU: "352",
    IE: "353",
    IS: "354",
    AL: "355",
    MT: "356",
    CY: "357",
    FI: "358",
    AX: "358",
    BG: "359",
    HU: "36",
    LT: "370",
    LV: "371",
    EE: "372",
    MD: "373",
    AM: "374",
    QN: "374",
    BY: "375",
    AD: "376",
    MC: "377",
    SM: "378",
    VA: "379",
    UA: "380",
    RS: "381",
    ME: "382",
    HR: "385",
    SI: "386",
    BA: "387",
    EU: "388",
    MK: "389",
    IT: "39",
    RO: "40",
    CH: "41",
    CZ: "420",
    SK: "421",
    LI: "423",
    AT: "43",
    GB: "44",
    UK: "44",
    GG: "44",
    IM: "44",
    JE: "44",
    DK: "45",
    SE: "46",
    NO: "47",
    SJ: "47",
    PL: "48",
    DE: "49",
    FK: "500",
    BZ: "501",
    GT: "502",
    SV: "503",
    HN: "504",
    NI: "505",
    CR: "506",
    PA: "507",
    PM: "508",
    HT: "509",
    PE: "51",
    MX: "52",
    CU: "53",
    AR: "54",
    BR: "55",
    CL: "56",
    CO: "57",
    VE: "58",
    GP: "590",
    BO: "591",
    GY: "592",
    EC: "593",
    GF: "594",
    PY: "595",
    MQ: "596",
    SR: "597",
    UY: "598",
    AN: "599",
    MY: "60",
    AU: "61",
    CX: "61",
    CC: "61",
    ID: "62",
    PH: "63",
    NZ: "64",
    AQ: "64",
    SG: "65",
    TH: "66",
    TL: "670",
    NF: "672",
    BN: "673",
    NR: "674",
    PG: "675",
    TO: "676",
    SB: "677",
    VU: "678",
    FJ: "679",
    PW: "680",
    WF: "681",
    CK: "682",
    NU: "683",
    WS: "685",
    KI: "686",
    NC: "687",
    TV: "688",
    PF: "689",
    TK: "690",
    FM: "691",
    MH: "692",
    RU: "7",
    KZ: "7",
    XT: "800",
    XS: "808",
    JP: "81",
    KR: "82",
    VN: "84",
    KP: "850",
    HK: "852",
    MO: "853",
    KH: "855",
    LA: "856",
    CN: "86",
    XN: "870",
    XE: "871",
    XF: "872",
    PN: "872",
    XI: "873",
    XW: "874",
    XP: "878",
    BD: "880",
    XG: "881",
    XV: "882",
    XL: "883",
    TW: "886",
    XD: "888",
    TR: "90",
    QY: "90",
    IN: "91",
    PK: "92",
    AF: "93",
    LK: "94",
    MM: "95",
    MV: "960",
    LB: "961",
    JO: "962",
    SY: "963",
    IQ: "964",
    KW: "965",
    SA: "966",
    YE: "967",
    OM: "968",
    PS: "970",
    AE: "971",
    IL: "972",
    BH: "973",
    QA: "974",
    BT: "975",
    MN: "976",
    NP: "977",
    XR: "979",
    IR: "98",
    XC: "991",
    TJ: "992",
    TM: "993",
    AZ: "994",
    GE: "995",
    KG: "996",
    UZ: "998",
  },
  animateNumbersApp = angular.module("animateNumbersModule", ["ngCart"]);
animateNumbersApp.directive("animateNumbers", [
  "$timeout",
  function (e) {
    return {
      replace: !1,
      scope: !0,
      link: function (t, r, n) {
        $(window).ready(function () {
          var n = r[0],
            o = 50,
            a = 1500,
            i = n.innerText[0],
            s = n.innerText.substr(1),
            c = parseFloat(s.split(",").join("")),
            u = 0,
            d = 0,
            l = Math.ceil(a / o),
            m = c / l,
            p = 0,
            g = 3;
          c > g && (c -= g), (t.timoutId = null);
          var f = function () {
              t.timoutId = e(function () {
                (d += m),
                  (p = Math.round((d / c) * 100)),
                  p > 60 && p < 80 ? (o += 10) : p > 90 && (o = 200),
                  u++,
                  u >= l
                    ? (e.cancel(t.timoutId),
                      (d = c),
                      (n.textContent = i + c.toLocaleString()),
                      c > g && h())
                    : ((n.textContent = i + Math.round(d).toLocaleString()),
                      f());
              }, o);
            },
            h = function () {
              t.timoutId = e(function () {
                g--,
                  g < 0
                    ? e.cancel(t.timoutId)
                    : (c++, (n.textContent = i + c.toLocaleString()), h());
              }, 500);
            };
          return f(), !0;
        });
      },
    };
  },
]);
var countdownApp = angular.module("countdownApp", ["ngCart"]);
countdownApp.directive("countdown", [
  "$timeout",
  "$interval",
  "ngCart",
  "$parse",
  "$compile",
  function (e, t, r, n, o) {
    return {
      restrict: "EA",
      link: function (t, n, a) {
        function i(e) {
          var t, r;
          return (
            (t = Math.floor(e / 60) % 60),
            (e -= 60 * t),
            (r = e % 60),
            [t + "m", r + "s"].join(" ")
          );
        }
        function s() {
          return m <= 0
            ? (console.log(m),
              console.log(i(m)),
              e.cancel(c),
              void r.removeItemById(a.itemid))
            : (m--,
              n.html(i(m)),
              o(n.contents())(t),
              console.log(a.itemid + ":" + i(m)),
              void (c = e(s, 1e3)));
        }
        var c = null,
          u = r.getItemById(a.itemid),
          d = u.getProductExpire(),
          l = new Date(d),
          m =
            (Math.floor((l.getTime() - new Date().getTime()) / 1e3),
            u.getProductExpire());
        n.text(i(m)), (c = e(s, 1e3));
      },
      transclude: !0,
      scope: {},
      template: "<span>{{total}}</span>",
      controller: function (e) {
        console.log(e);
      },
    };
  },
]);
var flyingCartApp = angular.module("flyingCartApp", []);
flyingCartApp.directive("addToCartButton", function () {
  function e(e, t, r) {
    t.on("click", function (e) {
      e.preventDefault();
      var t = angular.element(document.getElementsByClassName("pricecart"));
      console.log(t);
      var r = t.prop("offsetTop"),
        n = t.prop("offsetRight"),
        o = t.prop("offsetWidth"),
        a = t.prop("offsetHeight");
      console.log(r, n, o, a);
      var i = angular.element(e.target.parentNode.parentNode.childNodes[1]),
        s = angular.element(e.target.parentNode.parentNode),
        c = i.prop("offsetLeft"),
        u = i.prop("offsetTop"),
        d = i.prop("currentSrc");
      console.log(c + " " + u + " " + d);
      var l = angular.element('<img src="' + d + '"/>');
      l.css({
        height: "150px",
        position: "absolute",
        top: u + "px",
        left: c + "px",
        opacity: 0.5,
      }),
        l.addClass("itemaddedanimate"),
        s.append(l),
        setTimeout(function () {
          l.css({
            height: "75px",
            top: "-100px",
            right: n + "px",
            opacity: 0.5,
          });
        }, 500),
        setTimeout(function () {
          l.css({ height: 0, opacity: 0.5 }), t.addClass("shakeit");
        }, 1e3),
        setTimeout(function () {
          t.removeClass("shakeit"), l.remove();
        }, 1500);
    });
  }
  return {
    restrict: "E",
    link: e,
    transclude: !0,
    replace: !0,
    scope: {},
    template: '<button className="add-to-cart" ng-transclude></button>',
  };
});
