/**
 * Commmon functions
 */
var tools = function() {
  var self = this;
  self.baseUrl = 'http://localhost:8080/api';//'https://chipo.vn/';
  var addUrl = '/shopping-carts';
  var loginUrl = '/authenticate';
  var exchangeRateUrl = 'exchangerate/';
  var saveProductUrl = '/shopping-carts';
  var checkVersionUrl = 'ext/version';

  self.getCartUrl = self.baseUrl + 'backend/#/gio-hang';

  /**
   * Get name of the site
   * @return {string} return site name or rmpty string
   */
  self.getSiteName = function() {
    var url = window.location.href;
    if (url.match(/item.taobao/) || url.match(/taobao.com\/item\//)) {
      return 'TAOBAO';
    }
    if (url.match(/detail.tmall/) || url.match(/tmall.com\/item\//)) {
      return 'TMALL';
    }
    if (
      url.match(/detail.1688/) ||
      url.match(/[d]+[e]+[t]+[a]+[i]+[l]+.1688/)
    ) {
      return 'cn1688';
    }
    return '';
  };

  /**
   * convert NDT price to VND
   * @param {string} price
   * @return {string} return converted price
   */
  self.convertToVND = function(price) {
    if (!$.isNumeric(price)) {
      if (price.indexOf('-') > 0) {
        var prices = price.split('-');
        price = '';
        for (var i in prices) {
          price += ' ' + self.convertToVND(prices[i]) + ' -';
        }
        price = price.slice(0, -1);
        return price;
      }
      return price;
    }
    price = parseFloat(price);
    var exchangeRate = rules.exchangeNum;
    var rounding = 1;
    var num = Math.ceil((price * exchangeRate) / rounding) * rounding;
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
  };

  /**
   * Calculate exchange rate
   */
  self.calculateExchangeRate = function() {
    self.sendAjax(exchangeRateUrl, 'GET', null, function(resp) {
      if (resp && resp.success) {
        rules.exchangeNum = resp.data;
        var rateStr = parseInt(resp.data).toLocaleString('vi');
        if (rateStr.indexOf(',') > 0) {
          rateStr = rateStr.replace(',', '.');
        }
        rules.exchangeRate = rateStr + 'đ';
      } else {
        rules.exchangeNum = 3575;
        rules.exchangeRate = '3.575đ';
        console.warn('Không thể kết nối với server');
      }
    });
  };

  /**
   * Call background script to send ajax
   * @param {string} url
   * @param {string} method
   * @param {*} data
   * @param {function} callBack
   */
  self.sendAjax = function(url, method, data, callBack) {
    chrome.runtime.sendMessage(
      {
        action: 'ajax',
        url: self.baseUrl + url,
        method: method,
        data: data
      },
      callBack
    );
  };

  self.sendLogin = function(url, method, data, callBack) {
    chrome.runtime.sendMessage(
      {
        action: 'login',
        url: self.baseUrl + url,
        method: method,
        data: data
      },
      callBack
    );
  };

  self.checkLogin = function(callBack){
    chrome.runtime.sendMessage(
      {
        action: 'verify'
      },
      callBack
    );
  };

  self.doLogin = function(data, callback) {
    self.sendLogin(loginUrl, 'POST', data, function(resp) {
      callback(resp);
    });
  };

  /**
   * Add the product to the cart using ajax
   * @param {Array} products
   * @param {object} shop
   */
  self.addToCart = function(product, shop) {
    $.each(product, function(index, value) {
      if (value.stock.toString().indexOf('.')) {
        value.stock = value.stock.toString().replace('.', '');
      }
      value.stock = self.convertNumber(value.stock);
      value.quantity = self.convertNumber(value.quantity);
      value.itemPriceNDT = self.convertNumber(value.itemPriceNDT);
    });
    var cart = {
      aliwangwang: shop.aliwangwang,
      shopId: shop.shopId,
      shopName: shop.shopName,
      shopLink: shop.shopLink,
      website: shop.website,
      items: product
    };
    self.checkLogin(function(resp) {
      console.log("checkLogin", resp);
      if (resp === "ok") {
        console.log("Add item to cart", cart);
        self.sendAjax(addUrl, 'POST', cart, function(resp) {
          if (resp && resp.success) {
            $('#myChipoModal-order').modal('show');
            var totalAmount = 0;
            $.each(cart.items, function(index, value) {
              totalAmount += value.totalAmountNDT;
            });
            totalAmount = Math.round(totalAmount * 100) / 100;
            $('.ls-deposit p').text(
              'Số tiền của sản phẩm phải trả: ' + totalAmount + ' NDT'
            );
            $('#chipo-textarea').val('');
          }
        });
      } else {
        $('#myChipoModal-login').modal('show');
      }
    });
  };

  /**
   * Save product using ajax
   * @param {object} product
   * @param shop
   */
  self.saveProduct = function(product, shop) {
    var favItem = {
      itemId: product.itemId,
      name: product.itemName,
      link: product.itemLink,
      price: product.itemPriceNDT,
      image: product.itemImage,
      website: shop.website,
      shopId: shop.shopId,
      shopName: shop.shopName
    };

    self.sendAjax(saveProductUrl, 'POST', favItem, function(resp) {
      if (resp && resp.success) {
        alert('Lưu sản phẩm thành công');
      } else {
        alert('Lưu sản phẩm không thành công');
      }
    });
  };

  /**
   * convert String no Number
   * @params {string} str
   * @params {number}
   */
  self.convertNumber = function(str) {
    if (!str || $.isNumeric(str)) {
      return str;
    }
    if (str.toString().indexOf(',') > 0) {
      str = str.toString().replace(/[,]+/, '.');
    }

    return parseFloat(str);
  };

  /**
   * Go to page
   * @param {string} url
   */
  self.goToSite = function(url) {
    window.location.replace(self.baseUrl + url);
  };

  /**
   * wrapper for window.location.href
   * @return {string} href
   */
  self.getProductLink = function() {
    return window.location.href;
  };

  //unfinished version controll
  self.getNewestVersion = function() {
    self.sendAjax(checkVersionUrl, 'GET', null, function(resp) {
      if (resp && resp.success && resp.data) {
        rules.newestVersion = resp.data;
      }
    });
  };
};

var tool = new tools();
