   // scroll控件，可以上下轮播广告
   var tinyScroll = (function() {
       var _data = [];
       var _elem = document;
       var _height = 0;
       var _eindex = 0; // end index
       var _cindex = 0;// current index
       var _subElem1, _subElem2; // two sub element
       var _dur = 30;//animation time

       var _current = function() {
           return _data[_cindex];
       };

       var _getNext = function() {
           var index = _cindex + 1;
           index = index > _eindex ? 0 : index;
           return _data[index];
       };

       var _next = function() {
           _cindex = _cindex + 1;
           _cindex = _cindex > _eindex ? 0 : _cindex;
           return _data[_cindex];
       };

       var _setElementStyle = function(element) {
           if (!element) return;
           element.style.position = "relative";
           element.style.overflow = "hidden";
           element.style.whiteSpace = "nowrap";
           element.style.height = _height + "px";
           element.style.lineHeight = _height + "px";
       };

       var _createSubElem = function(data) {
           var sub = document.createElement("a");
           sub.href = data.url;
           sub.innerHTML = data.text;
           sub.style.display = "block";
           sub.style.position = "absolute";
           sub.style.fontSize = "14px";
           sub.onclick = function() {
               jumpToInfo();
           };
           return sub;
       };

       var _drawFirstElem = function() {
           _subElem1 = _createSubElem(_current());
           _subElem1.style.marginTop = "0px";
           _elem.appendChild(_subElem1);
       };

       var _drawSecondElem = function() {
           _subElem2 = _createSubElem(_getNext());
           _subElem2.style.marginTop = parseInt(_subElem1.style.marginTop) + _height + "px";
           _elem.appendChild(_subElem2);
       }

       var _drawSubList = function() { // actually, just draw 2 elements for scroll each time
           _drawFirstElem();
           _drawSecondElem();
       };

       var _move = function() {
           var top1 = parseInt(_subElem1.style.marginTop);
           top1 = top1 - 1;
           var bSwitch = false;

           if (top1 <= -_height) {
               _elem.removeChild(_subElem1);
               _subElem1 = _subElem2;
               top1 = parseInt(_subElem1.style.marginTop);
               _next();
               _drawSecondElem();
               bSwitch = true;
           }

           var top2 = parseInt(_subElem2.style.marginTop);
           top2 = top2 - 1;
           _subElem1.style.marginTop = top1 + "px";
           _subElem2.style.marginTop = top2 + "px";
           //console.log(bSwitch);
           //console.log("top " + top1 + "," + top2);
           var dur = bSwitch ? _dur * 100 : _dur;
           setTimeout(function() {
               _move();
           }, dur);
       };

       var _init = function(data, elem) {
           _data = data;
           _elem = elem;
           //_elem.innerHTML = " ";
           _height = _elem.offsetHeight;
           _eindex = _data.length - 1;
           _setElementStyle(elem);
           _drawSubList();
           setTimeout(function() {
               _move();
           }, _dur * 50);
       };

       return function (options) {
//                  this._elem = options.element;
//                  this._data = options.data;// [{url:"",text:""}, {url:"",text:""}]
          _init(options.data, options.element);

          this.start = function() {
            console.log("start=");
          };

          this.stop = function() {
            console.log("stop=");
          };
       };
   })();