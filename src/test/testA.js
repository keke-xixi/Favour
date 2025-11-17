{
   userId: "",
   userRole: "", // driver: 司机   coalDevelop  矿发人员
   coalId: "", // 矿发人员必填 分配的矿id （一个矿发人员对应一个矿）
}

[
  {
    "carNum"
  }
]

{
    result: true  // true: 成功  false: 失败
}


{
  qrCode: qrDataURL, // data:image/png;base64,iVBORw0KGgoAAA...
}

const toPdf = function (t, e, options) {
  var i = this;
  var dtd = $.Deferred();
  var isDownload = true;
  if (this.printPanels.length) {
    var r = o.a.mm.toPt(this.printPanels[0].width),
      a = o.a.mm.toPt(this.printPanels[0].height),
      p = $.extend({
        scale: 2,
        width: o.a.pt.toPx(r),
        x: 0,
        y: 0,
        useCORS: !0
      }, options || {}),
      s = new jsPDF({
        orientation: 1 == this.getOrient(0) ? "portrait" : "landscape",
        unit: "pt",
        format: this.printPanels[0].paperType ? this.printPanels[0].paperType.toLocaleLowerCase() : [r, a]
      }),
      l = this.getHtml(t, options);
    if (options && undefined != options.isDownload) {
      isDownload = options.isDownload
    }
    this.createTempContainer();
    var u = this.getTempContainer();
    this.svg2canvas(l), u.html(l[0]);
    var d = u.find(".hiprint-printPanel .hiprint-printPaper").length;
    $(l).css("position:fixed"), html2canvas(l[0], p).then(function (t) {
      var n = t.getContext("2d");
      n.mozImageSmoothingEnabled = !1, n.webkitImageSmoothingEnabled = !1, n.msImageSmoothingEnabled = !1, n.imageSmoothingEnabled = !1;

      for (var o = t.toDataURL("image/jpeg"), p = 0; p < d; p++) {
        s.addImage(o, "JPEG", 0, 0 - p * a, r, d * a), p < d - 1 && s.addPage();
      }
      if (isDownload) {
        i.removeTempContainer(), e.indexOf(".pdf") > -1 ? s.save(e) : s.save(e + ".pdf");
      } else {
        i.removeTempContainer();
        let type = options.type || 'blob';
        var pdfFile = s.output(type);
        dtd.resolve(pdfFile);
      }
    });
  }
  return dtd.promise();
}

const print = function (t, e, o) {
  t || (t = {}), this.getHtml(t, e).hiwprint(o);
}


const getHtml = function (t, e, n) {
  var i = 0;
  this.setCurrenttemplateData(e);
  var o = [],
    r = this.getBeginPrintTopInPaperByReferenceElement(t),
    a = t.getPaperFooter(i);
  this.isHeaderOrFooter() || this.isFixed() || r > a && "none" != t.panelPageRule && (o.push(new _dto_PaperHtmlResult__WEBPACK_IMPORTED_MODULE_3__.a({
    target: void 0,
    printLine: void 0
  })), r = r - a + t.paperHeader, i++ , a = t.getPaperFooter(i));
  var p = this.getData(e),
    s = this.createTarget(this.getTitle(), p, n);
  this.updateTargetSize(s), this.css(s, p), s.css("position", "absolute"), s.css("left", this.options.displayLeft()), s.css("top", r + "pt"), o.push(new _dto_PaperHtmlResult__WEBPACK_IMPORTED_MODULE_3__.a({
    target: s,
    printLine: r + this.options.getHeight(),
    referenceElement: new _PrintReferenceElement__WEBPACK_IMPORTED_MODULE_5__.a({
      top: this.options.getTop(),
      left: this.options.getLeft(),
      height: this.options.getHeight(),
      width: this.options.getWidth(),
      beginPrintPaperIndex: t.index,
      bottomInLastPaper: r + this.options.getHeight(),
      printTopInPaper: r
    })
  }))
  if (e && this.options.pageBreak) {
    o[0].target.css("top", t.paperHeader + "pt");
    o[0].referenceElement.top = this.options.getTop() - this.options.getHeight() - t.paperHeader;
    o[0].printLine = t.paperHeader;
    o[0].referenceElement.bottomInLastPaper = 0;
    o[0].referenceElement.printTopInPaper = t.paperHeader;
    o.unshift(new _dto_PaperHtmlResult__WEBPACK_IMPORTED_MODULE_3__.a({
      target: s,
      printLine: t.height,
      referenceElement: new _PrintReferenceElement__WEBPACK_IMPORTED_MODULE_5__.a({
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        beginPrintPaperIndex: t.index,
        bottomInLastPaper: t.height,
        printTopInPaper: t.paperHeader
      })
    }))
  }
  return o;
}