var kj = kj || {
        host: "http://121.40.153.157/",
        serverUrl: "http://121.40.153.157/",
        TEST_USER: "admin",
        TEST_PWD: "admin123",
        isFunction: function (obj) {
            return typeof(obj) == "function";
        },
        extend: function (target) {
            var len = arguments.length,
                index = 1,
                first = arguments[0];
            if (typeof target == 'boolean') {
                if (target) first = {};
                else {
                    first = arguments[1];
                    index = 2;
                }
            }
            for (; index < len; index++) {
                var o = arguments[index];
                for (i in o) if (o[i] !== undefined) first[i] = o[i];
            }
            return first;
        },
        each: function (elements, callback) {
            var i, key;
            if (typeof elements.length == 'number') {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === false) return elements
            } else {
                for (key in elements)
                    if (callback.call(elements[key], key, elements[key]) === false) return elements
            }
            ;

            return elements;
        }
    };

var KEY_SHOPID = "currentShopId";
var KEY_CACHE = "cacheData";
var KEY_AREAID = "currentAreaId";
var KEY_USERINFO = "userInfo";
var KEY_LOCATIONS = "locations";
var KEY_GEO_ID = "geoid";
var KEY_GEO_LOCATIONS = "geolocations";
var KEY_HIS_LOCATIONS = "historyLocations";
var KEY_HIS_GEO_LOCATIONS = "historyGeoLocations";
var KEY_LOC_TYPE = "loctype";
var KEY_CURRENT_CITY = "currentCity";
var KEY_SELECTED_AREA = "selectedArea";
var KEY_CUR_SHOPLIST = "currentShopList";

kj.initContext = function () {
    if (!plus.storage.getItem(KEY_SELECTED_AREA)) {
        console.log("set default selected area text as 附近干洗店");
        plus.storage.setItem(KEY_SELECTED_AREA, "附近干洗店");
    }
    if (!plus.storage.getItem(KEY_AREAID)) {
        console.log("set default area id as 2");
        plus.storage.setItem(KEY_AREAID, "2");
    }
    if (!plus.storage.getItem(KEY_CURRENT_CITY)) {
        console.log("set default city as 南京");
        plus.storage.setItem(KEY_CURRENT_CITY, "315");
    }
    if (!plus.storage.getItem(KEY_HIS_LOCATIONS)) {
        //console.log("set default history locations empty !");
        plus.storage.setItem(KEY_HIS_LOCATIONS, JSON.stringify({}));
        //console.log("========" + plus.storage.getItem(KEY_HIS_LOCATIONS));
    }
    if (!plus.storage.getItem(KEY_HIS_GEO_LOCATIONS)) {
        plus.storage.setItem(KEY_HIS_GEO_LOCATIONS, JSON.stringify({}));
    }
    if (!plus.storage.getItem(KEY_SHOPID)) {
        console.log("set default shop id as 1");
        plus.storage.setItem(KEY_SHOPID, "1");
    }
    if (!plus.storage.getItem(KEY_CACHE)) {
        console.log("set default cache as empty");
        plus.storage.setItem(KEY_CACHE, JSON.stringify({ShopList: [], shopInfo: {}}));
    }
    var Ctx = function () {
        this.get = function (key) {
            var val = plus.storage.getItem(key);
            try {
                val = eval('(' + val + ')');
                console.log("o val is " + val);
            } catch (e) {
                // do nothing
                console.log("convert failed[" + val + "]:" + e);
            }
            return val;
        };
        this.set = function (key, val) {
            //console.log("===================================" + key + "," + val);
            //console.log("type is " + typeof(val));
            if (typeof(val) == "object") {
                val = JSON.stringify(val);
            } else if (typeof(val) == "number") {
                val = "" + val;
            }
            plus.storage.setItem(key, val);
            //console.log("set after:" + plus.storage.getItem(key));
        };
    };

    return new Ctx();
};

kj.initShop = function () {
    var SEARCH_RADIUS = 2000;
    var _currentPage = 1;
    var _currentAreaId = kj.context.get(KEY_AREAID);
    var _currentShopId = kj.context.get(KEY_SHOPID);
    var _cache = kj.context.get(KEY_CACHE);
    //console.log("_cache is " +_cache);

    var _loginUrl = function () {
        return kj.serverUrl + "common.php?app_ajax=1&app=sys&app_act=login.verify";
    };
    
    var _logoutUrl = function () {
        return kj.serverUrl + "common.php?app=sys&app_act=login.out";
    };
    
    var _changePwdUrl = function () {
        return kj.serverUrl;
    };
    
    var _editProductUrl = function () {
        return kj.serverUrl;
    };
    var _editActInfoUrl = function () {
        return kj.serverUrl;
    };
    
     var _deleteProductUrl = function () {
        return kj.serverUrl;
    };
    var _deleteActInfoUrl = function () {
        return kj.serverUrl;
    };
    
    var _addProductUrl = function () {
        return kj.serverUrl;
    };
    
    var _addmsgUrl = function () {
        return kj.serverUrl;
    };
    
    var _addActUrl = function () {
        return kj.serverUrl;
    };
    
    var _addCommentUrl = function () {
        return kj.serverUrl;
    };
    
    var _editShopInfoDetailUrl = function () {
        return kj.serverUrl;
    };
    
    var _changeOderStataUrl = function () {
        return kj.serverUrl;
    };
    
    var _refuseOderUrl = function () {
        return kj.serverUrl;
    };
    
	var _getCommentUrl = function () {
        return kj.serverUrl;
    };

    var _userInfoUrl = function () {
        return kj.serverUrl + "index.php?app_act=userinfo";
    };

    var _shopUrl = function () {
        return kj.serverUrl + "index.php?app_act=shoplist&page=" + _currentPage + "&area_id=" + _currentAreaId;
    };

    var _allshopUrl = function () {
        return kj.serverUrl + "index.php?app_act=allshop";
    };

    var _shopInfoUrl = function (shopId) {
        return kj.serverUrl + "index.php?app_act=shopinfo&id=" + shopId;
    };

    var _orderUrl = function () {
        return kj.serverUrl + "index.php?app_ajax=1&app=ajax&app_act=saveorder";
    };

    var _orderlistUrl = function () {
        return kj.serverUrl + "index.php?app=member&app_act=orderlist";
    };

    var _shopOrderlistUrl = function () {
        return kj.serverUrl + "index.php?app_act=orderlist";
    };

    var _oldOrderlistUrl = function () {
        return kj.serverUrl + "index.php?app=member&app_act=orderlist";
    };

	var _shopOldOrderlistUrl = function () {
        return kj.serverUrl + "index.php?app_act=orderlist";
    };

    var _locationUrl = function () {
        return kj.serverUrl + "index.php?app_ajax=1&app_act=get.area";
    };

    var _geoShopUrl = function () {
        return kj.serverUrl + "index.php?app_act=loclist";
    };

    var _sendCheckUrl = function () {
        return kj.serverUrl;
    };

    var _newUserUrl = function () {
        return kj.serverUrl;
    };

    var _compileLocations = function (data) {
        if (!data) {
            return null;
        }

        var loclist = [];
        var locmap = {};
        var infos = data.list.info;
        for (var locId in infos) {
            var loc = infos[locId];
            loclist.push(loc);
            locmap[loc.id] = loc;
        }

        return {"loclist": loclist, "locmap": locmap};
    };

    var _compileGeoLocations = function (data) {
        if (!data || data.length <= 0) {
            return;
        }
        var loclist = [];
        var locmap = {};
        for (var i = 0; i < data.length; i++) {

        }
    };

    var _loadLocations = function () {
        var url = _locationUrl();
        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("_loadLocations result:" + data);
                data = eval('(' + data + ')');
                kj.context.set(KEY_LOCATIONS, _compileLocations(data));
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to login:" + type);
            }
        });
    };

    var _login = function (name, pwd, successCB) {
        var user = name;
        var pwd = pwd;
        var url = _loginUrl();
        var wait = plus.nativeUI.showWaiting();
        kj.ajax({
            url: url,
            type: "POST",
            data: {"uname": user, "pwd": pwd, "autologin": 1},
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (data.code != 0) {
                    mui.toast(data.msg);
                } else if (successCB && (typeof(successCB) == "function")) {
                    _getUserInfo(function (userinfo) {
                        kj.context.set(KEY_USERINFO, userinfo);
                    });
                    
                    plus.webview.getWebviewById("myInfo.html").reload();
                    plus.webview.getWebviewById("pullrefresh-main.html").reload();
                    successCB(data);

                }
                wait.close();
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to login:" + type);
                successCB(null)
                wait.close();
            }
        });
    };

        var _logout = function () {
	        var url = _logoutUrl();
	        kj.ajax({
	            url: url,
	            type: "POST",
	            data: {},
	            dataType: "text",
	            success: function () {
	                console.log("退出登录-------");
	               }
	               ,
	            error: function (error, type, xhr, settings) {
	                console.log("fail to logout:" + type);
	            }
	        });
	    };

        var _changePwd = function (name, pwd,oldPwd,successCB) {
	        var url = _changePwdUrl()+"index.php?app_act=changepwd&uname="+name+"&oldPwd="+oldPwd+"&pwd="+pwd;
	        kj.ajax({
	            url: url,
	            type: "POST",
	            data: {"uname": name, "oldPwd": oldPwd, "pwd": pwd},
	            dataType: "text",
	            success: function (data) {
	                console.log("修改密码result:" + data);
	                data = eval('(' + data + ')');
	                if (data.result != "ok") {
	                    mui.toast(data.msg);
	                } else if (successCB && (typeof(successCB) == "function")) {
	                    successCB(data);
	                }
	            },
	            error: function (error, type, xhr, settings) {
	                console.log("fail to login:" + type);
	            }
	        });
    };

		var _editProduct = function (menuID,menuTitle,menuPrice,successCB) {
		        var url =_editProductUrl()+"index.php?app_act=changemenu&menu_id="+menuID+"&menu_title="+menuTitle+"&menu_price="+menuPrice;
		        kj.ajax({
		            url: url,
		            type: "POST",
		            data: {"menuID": menuID, "menuTitle": menuTitle, "menuPrice": menuPrice},
		            dataType: "text",
		            success: function (data) {
		                console.log("编辑产品result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("productEdit").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
			var _deleteProduct = function (menuID,successCB) {
		        var url =_deleteProductUrl()+"index.php?app_act=deletemenu&menu_id="+menuID;
		        kj.ajax({
		            url: url,
		            type: "POST",
		            data: {"menuID": menuID},
		            dataType: "text",
		            success: function (data) {
		                console.log("编辑产品result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("productEdit").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };

			var _addProduct = function (shopID,menuTitle,menuPrice,successCB) {
		        var url =_addProductUrl()+"index.php?app_act=addmenu&shop_id="+shopID+"&menu_title="+menuTitle+"&menu_price="+menuPrice;
		        kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"shopID": shopID, "menuTitle": menuTitle, "menuPrice": menuPrice},
		            dataType: "text",
		            success: function (data) {
		                console.log("编辑产品result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("productEdit").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };

     var _editActInfo = function (actID,actInfo,successCB) {
		        var url =_editActInfoUrl()+"index.php?app_act=changeact&act_id="+actID+"&title="+actInfo;
		        kj.ajax({
		            url: url,
		            type: "POST",
		            data: {"actID": actID, "actInfo": actInfo},
		            dataType: "text",
		            success: function (data) {
		                console.log("编辑活动result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("editShopinfo").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		    
		    var _deleteActInfo = function (actID,successCB) {
		        var url =_deleteActInfoUrl()+"index.php?app_act=deleteact&act_id="+actID;
		        kj.ajax({
		            url: url,
		            type: "POST",
		            data: {"actID": actID},
		            dataType: "text",
		            success: function (data) {
		                console.log("删除活动result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("editShopinfo").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		   
		   var _addAct = function (actInfo,shopID,successCB) {
		        var url =_addActUrl()+"index.php?app_act=addact&shop_id="+shopID+"&title="+actInfo;
		        kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"actInfo": actInfo, "shopID": shopID},
		            dataType: "text",
		            success: function (data) {
		                console.log("新增活动result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("editShopinfo").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		    
		    var _editShopInfoDetail = function (shopID,opentime,address,linktel,leastPrice,addPrice,discountprice,desc,successCB) {
		    	var shopName=kj.context.get("userInfo").shopName;
		        var url =_editShopInfoDetailUrl()+"index.php?app_act=changeshop&shop_id="+shopID+"&shop_name="+shopName+"&opentime="+opentime;
		        url+="&shop_linktel="+linktel+"&shop_desc="+desc+"&shop_dispatch_price="+leastPrice+"&shop_addprice="+addPrice+"&discountprice="+discountprice+"&shop_address="+address;
		        kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"shopID": shopID, "opentime": opentime},
		            dataType: "text",
		            success: function (data) {
		                console.log("修改店铺资料result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("editShopinfo").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		  
		  var _addComment = function (oderShopID,oderID,userID,score,info,successCB) {
		        var url =_addActUrl()+"index.php?app_act=addcomment&shop_id="+oderShopID+"&order_id="+oderID+"&user_id="+userID+"&score="+score+"&message="+info;
		       kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"oderShopID": oderShopID, "oderID": oderID, "userID": userID, "score": score, "info": info},
		            dataType: "text",
		            success: function (data) {
		                console.log("新评论result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                    setTimeout(function() {
		                  	mui.currentWebview.close();
		                  }, 3000);//1.5秒之后关闭订单页面	
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                    plus.webview.getWebviewById("oderDetail").reload();
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		  
		  var _getComment = function (shopID,oderID,successCB) {
		        var url =_getCommentUrl()+"index.php?app_act=getcomment&shop_id="+shopID+"&order_id="+oderID;
		        kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"shopID": shopID, "oderID": oderID},
		            dataType: "text",
		            success: function (data) {
		                console.log("查询评论-------result:" + data);
		                data = eval('(' + data + ')');
		                 if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		  
		  var _addmsg = function (phone,msg,successCB) {
		        var url =_addmsgUrl()+"index.php?app_act=addmsg&phone="+phone+"&message="+msg;
		        kj.ajax({
		            url: url,
		            type: "POST",
		             data: {"phone": phone, "message": msg},
		            dataType: "text",
		            success: function (data) {
		                console.log("意见反馈result:" + data);
		                data = eval('(' + data + ')');
		                if (data.result != "ok") {
		                    mui.toast(data.msg);
		                } else if (successCB && (typeof(successCB) == "function")) {
		                    successCB(data);
		                }
		            },
		            error: function (error, type, xhr, settings) {
		                console.log("fail to login:" + type);
		            }
		        });
		    };
		  
    var _changeOderStata = function (oderID, stata, successCB) {
        var url = _changeOderStataUrl() + "/index.php?app=ajax&app_act=setorderstate&orderId=" + oderID + "&state=" + stata;
        kj.ajax({
            url: url,
            type: "POST",
            data: {"oderID": oderID, "stata": stata},
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (data.result != "ok") {
                    mui.toast(data.msg);
                } else if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                    kj.context.set("oderState", kj.shop.oderStata(stata));
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to login:" + type);
            }
        });
    };

	var _refuseOder = function (phone,refuseReason, successCB) {
        var url = _changeOderStataUrl()+"index.php?app_act=refuseOrder&phone="+phone+"&reason="+refuseReason;
        kj.ajax({
            url: url,
            type: "POST",
            data: {"phone": phone, "refuseReason": refuseReason},
            dataType: "text",
            success: function (data) {
                console.log("拒绝订单----result:" + data);
                data = eval('(' + data + ')');
                if (data.result != "ok") {
                	console.log("拒绝订单操作失败----data.msg:" + data.msg);
                    mui.toast("操作失败,请稍后再试！");
                    setTimeout(function() {
		                  	mui.currentWebview.close();
		                  }, 1500);//1.5秒之后关闭订单页面
                } else if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to login:" + type);
            }
        });
    };

    var _sendCheck = function (phoneNo, successCB) {
        var url = _sendCheckUrl();
        kj.ajax({
            url: url + "/index.php?app_act=checkmobile&phoneNo=" + phoneNo,
            type: "POST",
            data: {"phoneNo": phoneNo},
            dataType: "text",
            success: function (data) {
                console.log("----------result:" + data);
                data = eval('(' + data + ')');
                if (data.result != "ok") {
                    mui.toast(data.msg);
                } else if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                    kj.context.set("checkNo", data.checkNo);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to login:" + type);
            }
        });
    };

    var _newUser = function (phoneNo, pwd, successCB) {
    	var wait = plus.nativeUI.showWaiting();
        var url = _newUserUrl() + "/index.php?app_act=userreg&uname=" + phoneNo + "&pwd=" + pwd;
        kj.ajax({
            url: url,
            type: "POST",
            data: {"uname": phoneNo, "pwd": pwd},
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (data.code != 0) {
                    mui.toast(data.msg);
                } else if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                }
                wait.close();
            },
            error: function (error, type, xhr, settings) {
            	successCB(null);
                console.log("fail to login:" + type);
                wait.close();
            }
        });
    };

    var _getUserInfo = function (successCB) {
        var url = _userInfoUrl();
        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("userinfo------result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get user info :" + type);
            }
        });
    };

    var _loadShopData = function (successCB, error) {
        var url = _shopUrl();
        console.log("start to load shop list from " + url);

        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                    var slist = data.shoplist.list;
                    console.log("_list " + slist);
                    _cache.ShopList = slist;
                    console.log("_cache " + typeof(_cache) + JSON.stringify(_cache));
                    kj.context.set(KEY_CACHE, _cache);
                    successCB(data.shoplist.list);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get shop list:" + type);
            }
        });
    };

    var _findShopInfo = function (shopId) {
        var list = _cache.ShopList;
        if (list == null || list.lengh == 0) {
            console.log("can't get the shop information:" + shopId);
            list = testdata;
            //return;
        }
        var info = null;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.shop_id == shopId) {
                return item;
            }
        }

        return null;
    };

    var _loadShopInfo = function (shopId, successCB) {
        var url = _shopInfoUrl(shopId);
        console.log("start to load shop info from " + url);
		var wait = plus.nativeUI.showWaiting();
		
        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("店铺信息--------result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                    var info = data;
                    console.log(info);
                    _cache.shopInfo[shopId] = info;
                    kj.context.set(KEY_CACHE, _cache);
                    successCB(info);
                    wait.close();
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get shop info:" + type);
                wait.close();
            }
        });
    };

    //配送费"shop_dispatch_price":0，满XX免配送费"discountprice":50
    var _drawShopList = function (sel, listdata) {
        if (!listdata || listdata.length == 0) {
            return;
        }
        var domHtml = '';
        var shopDesc = "";
        for (var i = 0; i < listdata.length; i++) {
            var item = listdata[i];
            if (item.discountprice == 0) {
                shopDesc = item.shop_dispatch_price + "元起送·" + item.shop_addprice + "元配送费"
            }
            else {
                shopDesc = item.shop_dispatch_price + "元起送·" + item.shop_addprice + "元配送费·满" + item.discountprice + "元免配送费";
            }

            domHtml += '<li class="mui-table-view-cell mui-media">';
            domHtml += '<a onclick="kj.shop.showShopInfo(' + item.shop_id + ', \'' + item.shop_name + '\');">';
            domHtml += '<img class="mui-media-object mui-pull-left" src="' + kj.host + item.shop_pic_small + '">';
            domHtml += '<div class="mui-media-body"><h4>' + item.shop_name + '</h4>';
            if(item.shop_support_score==0){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-five"></div></div>';
            }else if(item.shop_support_score>0 && item.shop_support_score<=0.5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-half"></div></div>';
            }else if(item.shop_support_score>0.5 && item.shop_support_score<=1){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-one"></div></div>';
            }else if(item.shop_support_score>1 && item.shop_support_score<=1.5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-one-half"></div></div>';
            }else if(item.shop_support_score>1.5 && item.shop_support_score<=2){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-two"></div></div>';
            }else if(item.shop_support_score>2 && item.shop_support_score<=2.5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-two-half"></div></div>';
            }else if(item.shop_support_score>2.5 && item.shop_support_score<=3){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-three"></div></div>';
            }else if(item.shop_support_score>3 && item.shop_support_score<=3.5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-three-half"></div></div>';
            }else if(item.shop_support_score>3.5 && item.shop_support_score<=4){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-four"></div></div>';
            }else if(item.shop_support_score>4 && item.shop_support_score<=4.5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-four-half"></div></div>';
            }else if(item.shop_support_score>4.5 && item.shop_support_score<=5){
            	domHtml += '<div class="mui-ellipsis"><div class="shop-stars-five"></div></div>';
            }
            /*domHtml += '<div class="mui-ellipsis"><div class="shop-stars"></div></div>';*/
            domHtml += '<p class="mui-ellipsis">' + shopDesc + '</p></div></a></li>';
        }
        console.log(domHtml);
        document.getElementById(sel).innerHTML = domHtml;
    };

    var _setShopId = function (id) {
        console.log("set shop id as " + id);
        _currentShopId = id;
        kj.context.set(KEY_SHOPID, id);
    }

    var _getShopInfo = function (shopId, success) {
        console.log("get shop info: " + shopId);
        _loadShopInfo(shopId, function (data) {
            success && success(data);
        });
    };

    var _drawProdList = function (elemId, listdata) {
        if (!listdata || listdata.length == 0) {
            return;
        }
        var domHtml = '';
        domHtml +='<li class="mui-table-view-divider">服务价格目录</li>';
        for (var i = 0; i < listdata.length; i++) {
            var item = listdata[i];
            domHtml += '<li class="mui-table-view-cell mui-media">';
            domHtml += '<a>';
//			domHtml += '<img class="mui-media-object mui-pull-left" src="http://dcloudio.github.io/mui/assets/img/shuijiao.jpg">';
            domHtml += '<div><span class="content mui-pull-left">' + item.menu_title + '</span><span class="mui-pull-right content">￥' + item.menu_price + '</span></div></a></li>';
        }
        document.getElementById(elemId).innerHTML = domHtml;
    };

    var _editProdList = function (elemId, listdata) {
        if (!listdata || listdata.length == 0) {
            return;
        }
        var domHtml = '';
        for (var i = 0; i < listdata.length; i++) {
            var item = listdata[i];
            domHtml += '<li class="mui-table-view-cell mui-media">';
            domHtml += '<a onclick="kj.shop.editProdDetail(\'' + item.menu_title + '\',\'' + item.menu_price + '\',\'' + item.menu_id + '\');">';
            //domHtml += '<a>';
//			domHtml += '<img class="mui-media-object mui-pull-left" src="http://dcloudio.github.io/mui/assets/img/shuijiao.jpg">';
            domHtml += '<div><span class="content mui-pull-left">' + item.menu_title + '</span><span class="mui-pull-right content">￥' + item.menu_price + '</span>';
            domHtml += '</div></a></li>';
        }
        document.getElementById(elemId).innerHTML = domHtml;

    };

    var _sendOrder = function (address, phone, extra, getOrderTime, successCB) {
        var url = _orderUrl();
        var shopId = kj.context.get(KEY_SHOPID);
        var shopInfo = _cache.shopInfo[shopId];
        var areaId = kj.context.get(KEY_AREAID);
        var userInfo = kj.context.get(KEY_USERINFO);
        var userName = userInfo && userInfo.name;
        //系统中要求必须有一个商品，所以获取一件菜单中的第一个商品放入购物车
        var menu0 = shopInfo.menus.list && shopInfo.menus.list.group_0 && shopInfo.menus.list.group_0.list[0].menu_id;
        console.log("key area id " + kj.context.get(KEY_AREAID));
        var params = {
            "louhao1": address,
            "mobile": phone,
            "getOrderTime": getOrderTime,
            "name": userName,
            "sex": "先生",
            "beta": extra,
            "info_area_id": [areaId],
            "area_id": areaId,
            "area_allid": areaId,
            "cart_ids": shopId + ":" + menu0 + "|" + menu0,
            "area_select": 0//使用新地址
        };
        console.log("33 send order info:" + JSON.stringify(params));
        kj.ajax({
            url: url,
            data: params,
            type: "POST",
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (data.code != 0) {
                    mui.toast(data.msg);
                } else if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to commit the order:" + type);
            }
        });
    };

    var _getOrderList = function (successCB) {
        var url = _orderlistUrl();
        var userInfo = kj.context.get(KEY_USERINFO);
        if (userInfo != null && userInfo.type == "shop") {
            url = _shopOrderlistUrl();
        }
        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("订单-----------------result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                	console.log("success to get order list");
                    successCB(data);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get order list:" + type);
                successCB(null);
            }
        });
    };

    var _getOldOrderList = function (keyWord, successCB) {
        var url = _oldOrderlistUrl();
        var userInfo = kj.context.get(KEY_USERINFO);
        if (userInfo != null && userInfo.type == "shop") {
            url = _shopOldOrderlistUrl();
        }
        kj.ajax({
            url: url,
            dataType: "text",
            data: {"keyWord": keyWord},
            success: function (data) {
                console.log("his-----------result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                    successCB(data);
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get order list:" + type);
            }
        });
    };

    var _drawOrderList = function (elemId, data) {
        if (!data) {
            return;
        }

        var shop = data.shop;
        var domHtml = '';
        for (var orderDate in data.list) {
            domHtml += '<li class="mui-table-view-divider">' + orderDate + '</li>';
            var itemList = data.list[orderDate];
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                var shopName = shop["id_" + item.order_shop_id].shop_name;
                var state = kj.shop.oderStata(item.order_state);
                var addtime = item.order_day + " " + kj.shop.oderAddtime(item.order_addtime);
                domHtml += '<li class="mui-table-view-cell mui-media">';
                domHtml += '<a class="mui-navigate-right" onclick="kj.shop.showOderDetail(\'' + state + '\',\'' + shopName + '\',\'' + item.order_number + '\',\'' + item.order_shop_id + '\',\'' + addtime + '\',\'' + item.order_mobile + '\',\'' + item.taken_time + '\',\'' + item.order_louhao1 + '\',\'' + item.order_beta + '\',\'' + item.order_id + '\');">';
                domHtml += '<div style="font-size: 18px;margin-bottom: 11px;">' + shopName + '</div>';
                domHtml += '<div style="font-size: 16px;color: #40CE54;">订单状态：' + state + '</div>';
                domHtml += '</a></li>';
            }
        }
        document.getElementById(elemId).innerHTML = domHtml;
    };

	var _drawCommentist = function (elemId, data) {
        if (!data) {
            return;
        }

        var shop = data.shop;
        var domHtml = '';
        if(data[0]){
        	for (var orderDate in data) {
        	var itemList = data[orderDate];
                domHtml += '<li class="mui-table-view-divider">' + itemList.user_name + '<span class="mui-pull-right">'+itemList.format_time+'</span></li>';
                domHtml += '<li class="mui-table-view-cell mui-media"><div class="mui-pull-left">';
                domHtml += '<label class="shop-header"><section class="shop-comment-section ">';
                 if(itemList.comment_val==0){
	            	domHtml += '<div id="shop-comment-five"></div>';
	            }else if(itemList.comment_val>0 && itemList.comment_val<=0.5){
	            	domHtml += '<div id="shop-comment-half"></div>';
	            }else if(itemList.comment_val>0.5 && itemList.comment_val<=1){
	            	domHtml += '<div id="shop-comment-one"></div>';
	            }else if(itemList.comment_val>1 && itemList.comment_val<=1.5){
	            	domHtml += '<div id="shop-comment-one-half"></div>';
	            }else if(itemList.comment_val>1.5 && itemList.comment_val<=2){
	            	domHtml += '<div id="shop-comment-two"></div>';
	            }else if(itemList.comment_val>2 && itemList.comment_val<=2.5){
	            	domHtml += '<div id="shop-comment-two-half"></div>';
	            }else if(itemList.comment_val>2.5 && itemList.comment_val<=3){
	            	domHtml += '<div id="shop-comment-three"></div>';
	            }else if(itemList.comment_val>3 && itemList.comment_val<=3.5){
	            	domHtml += '<div id="shop-comment-three-half"></div>';
	            }else if(itemList.comment_val>3.5 && itemList.comment_val<=4){
	            	domHtml += '<div id="shop-comment-four"></div>';
	            }else if(itemList.comment_val>4 && itemList.comment_val<=4.5){
	            	domHtml += '<div id="shop-comment-four-half"></div>';
	            }else if(itemList.comment_val>4.5 && itemList.comment_val<=5){
	            	domHtml += '<div id="shop-comment-five"></div>';
	            }
                domHtml += '</section></label></div></li>';
                domHtml += '<li class="mui-table-view-cell mui-media">';
                domHtml += '<label class="mui-pull-left">' + itemList.comment_beta + '</label>';
                domHtml += '</li>';
        }
        document.getElementById(elemId).innerHTML = domHtml;
        }else{
        document.getElementById(elemId).innerHTML = '<label class="mui-pull-left">该店铺暂无评论！</label>';
        }
        
    };


    var _searchLocation = function (keyword) {
        var locs = kj.context.get(KEY_LOCATIONS);
        if (!locs) {
            return null;
        }

        var loclist = locs.loclist;
        var locmap = locs.locmap;
        var ret = [];
        for (var i = 0; i < loclist.length; i++) {
            var item = loclist[i];
            if (item.name.indexOf(keyword) >= 0) {
                ret.push(item);
            }
            if (item.pid > 0 && locmap[item.pid].name.indexOf(keyword) >= 0) {
                ret.push(item);
            }
        }
        return ret;
    };

    var _drawLocation = function (elemId, locs) {
        if (!locs || locs.length == 0) {
            return;
        }
        var domHtml = '';
        for (var i = 0; i < locs.length; i++) {
            var item = locs[i];
            domHtml += '<li class="mui-table-view-cell mui-media">';
            domHtml += '<a onclick="selectLocation(' + item.id + ', \'' + item.name + '\');">';
            domHtml += '<div class="mui-media-body"><span>' + item.name + '</span>';
            domHtml += '<p class="mui-ellipsis">location id：' + item.id + '</p>';
            domHtml += '</div></a></li>';
        }
        console.log("dom:" + domHtml);
        document.getElementById(elemId).innerHTML = domHtml;
    };

    var _addHisLocation = function (loc) {
        if (!loc) {
            return;
        }
        var currentLoc = kj.context.get(KEY_HIS_LOCATIONS);
        if (!currentLoc) {
            currentLoc = {};
        }
        if (currentLoc[loc.id]) {
            return;
        }
        currentLoc[loc.id] = loc;
        kj.context.set(KEY_HIS_LOCATIONS, currentLoc);
    };
    var _getHisLocation = function () {
        return kj.context.get(KEY_HIS_LOCATIONS);
    };
    var _drawHisLocation = function (elemId, locs) {
        var domHtml = '';
        for (var key in locs) {
            var item = locs[key];
            domHtml += '<li class="mui-table-view-cell">';
            domHtml += '<a onclick="selectLocation(' + item.id + ', \'' + item.name + '\');">';
            domHtml += '<span>' + item.name + '</span>';
            domHtml += '</a></li>';
        }
        console.log(domHtml);
        document.getElementById(elemId).innerHTML = domHtml;
    };

    var _drawGeoLocations = function (data, elemId) {
        if (data && data.length > 0) {
            var domHtml = '';
            for (var i = 0; i < data.length; i++) {
                var geo = data[i];
                domHtml += '<li class="mui-table-view-cell">';
                domHtml += '<a onclick=\'selectGeoLocation("' + geo.uid + '", "' + geo.name + '");\'>';
                domHtml += '<h4 class="mui-ellipsis">' + geo.name + '</h4>';
                domHtml += '<h5 class="mui-ellipsis">' + geo.address + '</h5></a></li>';
            }
            console.log(domHtml);
            document.getElementById(elemId).innerHTML = domHtml;
        }
    };

    var _drawShopByArea = function (elemId, before, after) {
        before && before();
        _loadShopData(function (data) {
            _drawShopList(elemId, data);
            after && after();
        });
    };

    var _findGeoInfo = function () {
        var locs = kj.context.get(KEY_GEO_LOCATIONS);
        var geoId = kj.context.get(KEY_GEO_ID);
        if (locs && locs.length > 0) {
            for (var i = 0; i < locs.length; i++) {
                if (locs[i].uid == geoId) {
                    return locs[i];
                }
            }
        }

        var hislocs = kj.context.get(KEY_HIS_GEO_LOCATIONS);
        if (hislocs && hislocs[geoId]) {
            return hislocs[geoId];
        }

        return null;
    };

    var _getGeoByUid = function (uid) {
        var locs = kj.context.get(KEY_GEO_LOCATIONS);
        if (locs && locs.length > 0) {
            for (var i = 0; i < locs.length; i++) {
                if (locs[i].uid == uid) {
                    return locs[i];
                }
            }
        }
        return null;
    };

    var _inArea = function (point, center, radius) {
        var circle = new BMap.Circle(center, radius);
        var ret = BMapLib.GeoUtils.isPointInCircle(point, circle);
        //console.log("=====================  check in area: " + ret);
        //console.log("======  " + JSON.stringify(point));
        //console.log("======  " + JSON.stringify(center));
        return ret;
    };

    var _findShopByGeo = function (shops, geo) {
        if (shops && shops.length > 0) {
            var ret = [];
            for (var i = 0; i < shops.length; i++) {
                var shop = shops[i];
                var point = new BMap.Point(shop.lng, shop.lat);
                var center = new BMap.Point(geo.location.lng, geo.location.lat);
                if (_inArea(point, center, SEARCH_RADIUS)) {
                    ret.push(shop);
                }
            }
            return ret;
        }
        return null;
    };

    var _addHisGeoLocation = function (loc) {
        var cache = kj.context.get(KEY_HIS_GEO_LOCATIONS);
        cache = cache || {};
        cache[loc.uid] = loc;
        kj.context.set(KEY_HIS_GEO_LOCATIONS, cache);
    };

    var _getHisGeoLocation = function () {
        return kj.context.get(KEY_HIS_GEO_LOCATIONS);
    };

    var _drawHisGeoLocation = function (elemId, locs) {
        var domHtml = '';
        for (var key in locs) {
            var item = locs[key];
            domHtml += '<li class="mui-table-view-cell">';
            domHtml += '<a onclick="selectGeoLocation(\'' + item.uid + '\', \'' + item.name + '\');">';
            domHtml += '<span>' + item.name + '</span>';
            domHtml += '</a></li>';
        }
        console.log(domHtml);
        document.getElementById(elemId).innerHTML = domHtml;
    };

    var _getCurrentLoc = function (successCB) {
        console.log("_getCurrentLoc");
        var wait = plus.nativeUI.showWaiting();
        plus.geolocation.getCurrentPosition(function (p) {
            console.log("Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
            var lat = p.coords.latitude;
            var lon = p.coords.longitude;
            var bdurl = "http://api.map.baidu.com/geocoder/v2/?ak=5f6919055455e92c1efb6631e32164bd&&location=" + lat + "," + lon + "&output=json&pois=0";
            kj.ajax({
                url: bdurl,
                dataType: "text",
                success: function (data) {
                    console.log("result:" + data);
                    data = eval('(' + data + ')');
                    if (successCB && (typeof(successCB) == "function")) {
                        if (data.status == 0) {
                            var bdaddress = {
                                "address": "",
                                "content": {
                                    "address": data.result.formatted_address,
                                    "address_detail": {
                                        "city": data.result.addressComponent.city,
                                        "city_code": data.result.cityCode,
                                        "district": data.result.addressComponent.district,
                                        "province": data.result.addressComponent.province,
                                        "street": data.result.addressComponent.street,
                                        "street_number": data.result.addressComponent.street_number
                                    },
                                    "point": {"x": data.result.location.lng, "y": data.result.location.lat}
                                },
                                "status": 0
                            };
                            kj.shop.setSelectedArea(data.result.formatted_address);
                            wait.close();
                            successCB(bdaddress);
                        }
                    }
                },
                error: function (error, type, xhr, settings) {
                    console.log("fail to get current position:" + type);
                    wait.close();
                    successCB(null);
                }
            });
        }, function (e) {
            mui.toast("获取当前位置失败, 请打开手机GPS开关!");
        });
    };

    var _getShopByGeo = function (successCB) {
        var geo = _findGeoInfo();
        if (geo == null) {
            console.log("can't get geo infomation !");
            successCB(null);
            return;
        }

        var url = _geoShopUrl();
        kj.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                console.log("result:" + data);
                data = eval('(' + data + ')');
                if (successCB && (typeof(successCB) == "function")) {
                    successCB(_findShopByGeo(data, geo));
                }
            },
            error: function (error, type, xhr, settings) {
                console.log("fail to get order list:" + type);
                successCB(null);
            }
        });
    };

    var Shop = function () {
        this.drawShopList = function (elemId, before, after) {
        	var wait = plus.nativeUI.showWaiting();
            if (kj.context.get(KEY_LOC_TYPE) != "geo") {
                _drawShopByArea(elemId, before, after);
            } else {
                _getShopByGeo(function (shops) {
                    if (!shops || shops.length <= 0) {
                    	wait.close();
                        return;
                    }

                    kj.ajax({
                        url: _allshopUrl(),
                        dataType: "text",
                        success: function (data) {
                        	wait.close();
                            console.log("result:" + data);
                            data = eval('(' + data + ')');
                            if (data && data.length > 0) {
                                var results = [];
                                for (var i = 0; i < shops.length; i++) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (shops[i].id == data[j].shop_id) {
                                            results.push(data[j]);
                                            continue;
                                        }
                                    }
                                }
                                kj.context.set(KEY_CUR_SHOPLIST, results)
                                _drawShopList(elemId, results);
                            }
                        },
                        error: function (error, type, xhr, settings) {
                            console.log("fail to get order list:" + type);
                            wait.close();
                        }
                    });
                });
            }
        };
        this.drawProdList = function (elemId) {
            _getShopInfo(_currentShopId, function (data) {
                if (data.menus.list && data.menus.list.group_0) {
                	console.log("the shop data is:" + JSON.stringify(data));
                    _drawProdList(elemId, data.menus.list.group_0.list);
                }
            });
        };
        
        this.drawCommentist = function (elemId,callback) {
            _getComment(_currentShopId, "",function (data) {
                    _drawCommentist(elemId, data);
                    callback(data);
            });
        };
        
        this.editProdList = function (elemId) {
            _getShopInfo(kj.context.get("userInfo").shopID, function (data) {
                if (data.menus.list && data.menus.list.group_0) {
                    _editProdList(elemId, data.menus.list.group_0.list);
                }
            });
        };
		this.editProduct = function (menuID,menuTitle,menuPrice,callback) {
           _editProduct(menuID,menuTitle,menuPrice,callback);
        };
        this.editActInfo = function (actID,actInfo,callback) {
           _editActInfo(actID,actInfo,callback);
        };
        this.deleteProduct = function (menuID,callback) {
           _deleteProduct(menuID,callback);
        };
        this.deleteActInfo = function (actID,callback) {
           _deleteActInfo(actID,callback);
        };

		this.addProduct = function (shopID,menuTitle,menuPrice,callback) {
           _addProduct(shopID,menuTitle,menuPrice,callback);
        };
        this.addmsg = function (phone,msg,callback) {
           _addmsg(phone,msg,callback);
        };
        
        this.addAct = function (actInfo,shopID,callback) {
           _addAct(actInfo,shopID,callback);
        };
        this.addComment = function (oderShopID,oderID,userID,score,info,callback) {
           _addComment(oderShopID,oderID,userID,score,info,callback);
        };
        
        
		this.editShopInfoDetail = function (shopID,opentime,address,linktel,leastPrice,addPrice,discountprice,desc,callback) {
           _editShopInfoDetail(shopID,opentime,address,linktel,leastPrice,addPrice,discountprice,desc,callback);
        };



        this.getShopInfo = function (callback) {
            return _getShopInfo(_currentShopId, callback);
        };
        this.editShopInfo = function (callback) {
            return _getShopInfo(kj.context.get("userInfo").shopID, callback);
        };
        
        this.editShopDetail = function (callback) {
            return _getShopInfo(kj.context.get("userInfo").shopID, callback);
        };
        
        this.showShopInfo = function (id, shopName) {
            _setShopId(id);
            kj.shop.openWithMui("shop.html", "shop", true, {name: shopName})
        };
        this.showOderDetail = function (state, shopName, orderNumber, shopID, addtime, mobile, arrive, address, beta, orderID) {
            kj.context.set("oderState", state);
            kj.shop.openWithMui("oderDetail.html", "oderDetail", true, {
                state: state,
                shopName: shopName,
                orderNumber: orderNumber,
                shopID: shopID,
                addtime: addtime,
                mobile: mobile,
                arrive: arrive,
                address: address,
                beta: beta,
                orderID: orderID
            });
        };
        this.editProdDetail = function (menuTitle, menuPrice, menuID) {
            kj.shop.openWithMui("editProduct.html", "editProduct", true, {
                menuTitle: menuTitle,
                menuPrice: menuPrice,
                menuID: menuID
            });
        };
        this.editAct = function (artID, artTitle) {
            kj.shop.openWithMui("editAct.html", "editAct", true, {
                artID: artID,
                artTitle: artTitle
            });
        };
        
        this.oderStata = function (ID) {
            if (ID == 0) {
                return "等待店铺接单";
            } else if (ID == 1) {
                return "店铺已接单";
            } else if (ID == 2) {
                return "洗涤中";
            } else if (ID == 3) {
                return "订单完成（未评价）";
            } else if (ID == 4) {
                return "订单完成（已评价）";
            }else if(ID == 9){
            	return "店铺已拒绝";
            }
        };
        this.oderAddtime = function (time) {
            var timeTmp = new Date(parseInt(time) * 1000).toLocaleString();
            return timeTmp.toString().split(" ")[4];
        };

        this.changeOderStata = function (oderID, stata, callback) {
            _changeOderStata(oderID, stata, callback);
        };

		this.refuseOder = function (phone, refuseReason,callback) {
            _refuseOder(phone,refuseReason, callback);
        };

		this.getComment = function (shopID, oderID, callback) {
            _getComment(shopID, oderID, callback);
        };

        this.submitOrder = function (address, phone, extra, getOrderTime, callback) {
            _sendOrder(address, phone, extra, getOrderTime, callback);
        };
        this.login = function (name, pwd, callback) {
            _login(name, pwd, callback);
        };
        this.logout = function () {
            _logout();
        };
        this.changePwd = function (name, pwd,oldPwd, callback) {
            _changePwd(name, pwd,oldPwd, callback);
        };
        
        this.sendCheck = function (phoneNo, callback) {
            _sendCheck(phoneNo, callback);
        };
        this.newUser = function (phoneNo, pwd, callback) {
            _newUser(phoneNo, pwd, callback);
        };
        this.drawOrderList = function (elemId) {
            _getOrderList(function (data) {
                if (data) {
                    _drawOrderList(elemId, data);
                }
                else {
                }
            });
        };
        this.drawOldOrderList = function (elemId, keyWord) {
            _getOldOrderList(keyWord, function (data) {
            	if(data.shop==null || data.shop=="undefined"){
            		mui.alert("查询结果为空,请确认订单号或手机号的正确性！");
            		return;
            	}
                if (data) {
                    _drawOrderList(elemId, data);
                }
            });
        };
        this.loadLocations = function () {
            _loadLocations();
        };
        this.searchLocation = function (searchText, elemId) {
            var locs = _searchLocation(searchText);
            _drawLocation(elemId, locs);
        };
        this.selectLocation = function (id, name) {
            var lastId = kj.context.get(KEY_AREAID);
            if (lastId != id) {
                console.log("==================   reset shop list cache ====================")
                kj.context.set(KEY_CACHE, {ShopList: [], shopInfo: {}});
                kj.context.set(KEY_AREAID, id);
                kj.context.set(KEY_LOC_TYPE, "area");
                kj.context.set(KEY_SELECTED_AREA, name);
                plus.webview.getWebviewById("index.html").evalJS("modifyLocName('" + name + "')");
                plus.webview.getWebviewById("mainShopList").reload();
            }
            console.log("add location : " + JSON.stringify(kj.context.get(KEY_LOCATIONS).locmap[id]));
            //this.addHisLocation(kj.context.get(KEY_LOCATIONS).locmap[id]);
            var lsview = mui.currentWebview;
            if (plus.webview.getWebviewById("locationview")) {
                plus.webview.getWebviewById("locationview").close();
            }
            lsview.close();
        };
        this.getCurrentLocation = function (callback) {
            return _getCurrentLoc(callback);
        };
        this.selectCurrentLocation = function () {
            _getCurrentLoc(function (data) {
                var id = "current_pos";
                var lastId = kj.context.get(KEY_GEO_ID);

                if (lastId != id) {
                    var locations = [{
                        "name": "",
                        "location": {
                            "lat": data.content.point.y,
                            "lng": data.content.point.x
                        },
                        "address": data.content.address,
                        "uid": id
                    }];
                    console.log("locations : " + JSON.stringify(data));
                    kj.context.set(KEY_GEO_LOCATIONS, locations);
                    kj.context.set(KEY_LOC_TYPE, "geo");
                    kj.context.set(KEY_GEO_ID, id);
                    kj.context.set(KEY_SELECTED_AREA, data.content.address);
                    plus.webview.getWebviewById("index.html").evalJS("modifyLocName('" + data.content.address + "')");
                    plus.webview.getWebviewById("mainShopList").reload();
                }
            });
        };
        this.selectGeoLocation = function (id, name) {
            var geoloc = _getGeoByUid(id);
            if (geoloc) {
                _addHisGeoLocation(geoloc);
            }

            var lastId = kj.context.get(KEY_GEO_ID);
            if (lastId != id) {
                kj.context.set(KEY_LOC_TYPE, "geo");
                kj.context.set(KEY_GEO_ID, id);
                console.log("------------------------------ set location to " + name);
                kj.context.set(KEY_SELECTED_AREA, name);
                plus.webview.getWebviewById("index.html").evalJS("modifyLocName('" + name + "')");
                plus.webview.getWebviewById("mainShopList").reload();
            }
        };

        this.searchGeoLocation = function (searchText, elemId) {
            //无区域设置，默认在南京范围搜索
            var dbUrl = "http://api.map.baidu.com/place/v2/search?&q=" + searchText + "&region=" + kj.context.get(KEY_CURRENT_CITY) + "&output=json&ak=5f6919055455e92c1efb6631e32164bd";
            kj.ajax({
                url: dbUrl,
                dataType: "text",
                success: function (data) {
                    console.log("local search result:" + data);
                    data = eval('(' + data + ')');
                    if (data.message == "ok") {
                        kj.context.set(KEY_GEO_LOCATIONS, data.results);
                        _drawGeoLocations(data.results, elemId);
                    }
                },
                error: function (error, type, xhr, settings) {
                    console.log("fail to search geo locations:" + type);
                }
            });
        };
        this.addHisLocation = function (loc) {
            _addHisLocation(loc);
        };
        this.setCurrentCity = function (cityCode) {
            kj.context.set(KEY_CURRENT_CITY, cityCode);
        };
        this.getSelectedArea = function () {
            return kj.context.get(KEY_SELECTED_AREA);
        };
        this.setSelectedArea = function (area) {
            kj.context.set(KEY_SELECTED_AREA, area);
        };
        this.drawHisLocation = function (elemId) {
            var locs = _getHisGeoLocation();
            _drawHisGeoLocation(elemId, locs);
        };
        this.drawGeoLocation = function (elemId) {
            var results = kj.context.get(KEY_GEO_LOCATIONS);
            _drawGeoLocations(results, elemId);
        };
        this.openWithLoading = function (url, id, extra, preFunc) {
            var newView = plus.webview.create(url, id, null, extra);
            newView.addEventListener("loaded", function () {
                preFunc && preFunc(newView);
                newView.show("slide-in-right", 100);
            }, false);
        };

        //autoShow的意思是需不需要先load，默认使用true，只有需要用到ajax的地方才用false，用false的意思是网络数据传输完毕之后再显示
        this.openWithMui = function (url, id, autoShow, extras) {
            mui.openWindow({
                id: id,
                url: url,
                extras: extras,
                show: {
                    autoShow: autoShow,
                    aniShow: "slide-in-right"
                },
                waiting: {
                    autoShow: false
                }
            });
        };
    };

    return new Shop();
};
