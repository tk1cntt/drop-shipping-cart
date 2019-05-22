var rules = {
  translate: {
    TAOBAO: {
      basePrice: '#J_PriceName, #J_StrPriceModBox .tb-property-type',
      promoPrice: '.tb-promo-price .tb-property-type',
      stock: "dt:contains('數量'), dt:contains('数量')",
      product: '.tb-amount-widget .mui-amount-unit',
      size:
        "dt:contains('尺碼'), dt:contains('尺寸'), dt:contains('尺码'), dt:contains('参考身高'), dt:contains('鞋码'), dt:contains('大小描述')",
      color:
        "dt:contains('顏色'), dt:contains('颜色分类'), dt:contains('颜色')",
      stock_str: 'em.tb-stock-tip, .tb-amount em'
    },
    TMALL: {
      basePrice:
        "dt:contains('價格'), dt:contains('专柜价'), dt:contains('价格')",
      promoPrice:
        "dt:contains('促銷價'), dt:contains('促销价'), dt:contains('狂欢价')",
      stock: "dt:contains('數量'), dt:contains('数量')",
      product: '.tb-amount-widget .mui-amount-unit',
      size:
        "dt:contains('尺碼'), dt:contains('尺寸'), dt:contains('尺码'), dt:contains('套餐類型'), dt:contains('参考身高'), dt:contains('鞋码'), dt:contains('大小描述')",
      color: "dt:contains('顏色'), dt:contains('颜色')",
      stock_str: '#J_EmStock'
    },
    cn1688: {
      basePrice: 'tr.price > td.price-title',
      promoPrice: '.timer-txt',
      stock: ".d-title:contains('采购量')",
      product: 'td.count .unit',
      size: '.d-content .obj-sku .obj-title',
      color: '.d-content .obj-leading .obj-title',
      stock_str: 'span.total',
      condition: '.amount-title'
    }
  },
  info: {
    TAOBAO: {
      shop: {
        id_data_api: '#J_listBuyerOnView',
        id_data_sellerid: '#J_Pine',
        name_title: '.tb-shop-name a, .shop-name-title',
        name_text: '.tb-shop-seller a',
        link: '.tb-shop-name a, .tb-shop-seller a, .shop-name-link',
        aliwangwang: '.ww-light'
      },
      product: {
        id: 'input[name=item_id]',
        basePrice:
          '#J_StrPrice .tb-rmb-num, #J_StrPriceModBox .tb-rmb-num, #J_priceStd .tb-rmb-num',
        promoPrice:
          '#J_PromoPrice .tb-rmb-num, #J_SPrice .tb-rmb-num, #J_PromoPriceNum',
        hiddenPrice: "#J_PromoHd .tb-promo-type:contains('VIP')",
        image: '#J_ThumbView, #J_ImgBooth',
        title_content: "meta[property='og:title']",
        title_data_title: '.tb-main-title',
        saleLocation: '#J-From',
        quantity: '#J_IptAmount, .mui-amount-input',
        stock: 'em.tb-stock-tip, .tb-amount em'
      },
      box_prepend: '#J_isSku, #J_isku, .tb-key'
    },
    TMALL: {
      shop: {
        id_shopid: '#LineZing',
        id_eval: "meta[name='microscope-data']",
        name_text: '.shopLink, .slogo-shopname strong',
        name_value: 'input[name=seller_nickname]',
        name_data_nick: 'span.ww-light',
        link: '.hd-shop-name a, #J_DcShopArchive .enterShop, a.slogo-shopname',
        aliwangwang: 'input[name=seller_nickname]'
      },
      product: {
        id_itemid: '#LineZing',
        basePrice:
          'div.tm-fcs-panel > dl.tm-tagPrice-panel > dd > span, #J_StrPrice .tm-price, #J_StrPriceModBox .tm-price, #J_priceStd .tm-price',
        promoPrice:
          '#J_PromoPrice .tm-price, #J_SPrice .tm-price, #J_PromoBox .tm-price',
        hiddenPrice: ".tm-promo-type:contains('vip')",
        image: '#J_UlThumb img',
        title: 'input[name=title]',
        saleLocation: '#J_AddrSelectTrigger > span.mui_addr_tri_1',
        quantity: '#J_IptAmount, .mui-amount-input',
        stock: '#J_EmStock'
      },
      box_after: '.tm-fcs-panel'
    },
    cn1688: {
      shop: {
        id_data_mod_config: '.mod-detail-gallery',
        id_data_seller_id: '.widget-custom-container .coupons-list-item',
        name_json: "meta[property='og:product:nick']",
        name_title:
          '.shop-info .base-info .company-name, .shopdetail .company-detail .company-name',
        name_text:
          '.chinaname, .shop-info .base-info .company-name, .d-tab-company .company-name, .company-name .name',
        link_href:
          '.shop-info .base-info > a, .companyName-box .logo >a, .chinaname, .enname, .enter-wp',
        link_value: '.currentdomain',
        aliwangwang_text: '#usermidid',
        aliwangwang_json: '[data-alitalk]'
      },
      product: {
        id_value: '#feedbackInfoId',
        id_content: "meta[name='b2c_auction']",
        priceWholesale: '#mod-detail-price .price',
        amountWholesale: '#mod-detail-price .amount',
        promoPrice:
          '.mod-detail-info-price .price-now, .mod-detail-daixiao-price .value',
        image: '#J_DetailInside .tab-pane img',
        title_content: "meta[property='og:title']",
        title_text: '.d-title',
        saleLocation: '.delivery-addr, .address span.disc',
        quantity: '', //use getQuantity in cn1688
        stock: 'span.total'
      },
      box_prepend: 'div.offerdetail_ditto_purchasing'
    }
  },
  currentVersion: chrome.runtime.getManifest().version,
  newestVersion: '',
  exchangeNum: 0,
  exchangeRate: ''
};
//tool.calculateExchangeRate();
//tool.getNewestVersion();

var addon = {};
addon.toolbar = `
  <div class="chipo-wrapper _chipo-wrapper">
    <div class="chipo-alert _alert-shop-credible ">
        <strong>QUÝ KHÁCH VUI LÒNG KHÔNG SỬ DỤNG GOOGLE TRANSLATE KHI CLICK VÀO NÚT ĐẶT HÀNG</strong>
    </div>
    <div class="chipo-content">
        <div class="chipo-block" data-spm-anchor-id="a220o.1000855.0.i2.18b65b0d8FZMPx">
            <ul class="chipo-list-inline">
                <li class="" data-spm-anchor-id="a220o.1000855.0.i0.18b65b0d8FZMPx">
                    <!--<a id='_add-to-favorite' href='javascript:;' class='save-product-ao'> Lưu sản phẩm </a>-->
                    <a href="https://chipo.vn/" style="color: white" target="_blank" class="_chipo-home">Trang chủ</a>
                </li>
                <li>
                    <a href="javascript:;" class="btn _addToCart btn-order" data-target="#myChipoModal-order">
                        <i class="pull-left"></i> ĐẶT HÀNG CHIPO
                    </a>
                    <a href="https://chipo.vn/backend/#/gio-hang" target="_blank" class="chipo-link _link-detail-cart">
                        <i class="chipo-icon-shopping-cart"></i> Vào giỏ hàng
                    </a>
                </li>
                <li class="pull-right">
                </li>
            </ul>
        </div>
    </div>
    </div>
`;
addon.popup = `
    <div class="modal fade" id="myChipoModal-order" role="dialog">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Modal Header</h4>
          </div>
          <div class="modal-body">
            <p>This is a small modal.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
`;
addon.login = `
    <div class="modal fade" id="myChipoModal-login" role="dialog">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Login</h4>
          </div>
          <div class="modal-body">
            <p>Please login to ...</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
`;
/*
$.get(chrome.runtime.getURL('../template/popup.html'), function(data) {
  var html = $.parseHTML(data);
  $(html)
    .find('a.btn-default')
    .attr('href', tool.getCartUrl);
  addon.popup = html;
});
*/
addon.boxPrice = `
    <div class="chipo-box-info">
      <div class="chipo-basic-info">
          <ul>
              <li>Giá bán: <span id="sell_price" class="text-chipo">đ</span></li>
              <li>Tỷ giá 1<span class="chipo-yen">¥</span>: <span id="exchange_rate" class="text-chipo">đ</span>
              </li>
              <li>Còn <span id="stock" class="text-chipo">0</span> sản phẩm</li>
          </ul>
      </div>
      <div class="chipo-warning hidden"></div>
    </div>
`;
