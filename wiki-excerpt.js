/*

jQuery wiki-excerpt extension by Prashant Acharekar

*/


(function ($) {
   $.fn.excerpt = function (option) {

     var defaults = {
       type : "overlay"
     },

     settings = $.extend({}, defaults, option),

     wordDefs = {};

     // store definition locally
     this.addDefinition = function (word, definition) {
       wordDefs[word] = definition;
     };

     // get locally stored def
     this.getDefinition = function (word) {
       return wordDefs[word];
     };

     // get wiki excerpt
     this.getExcerpt = function (obj) {
       var excerpt = "";
       for (var i in obj) {
         if (!obj.hasOwnProperty(i)) continue;
         if (typeof obj[i] == 'object') {
           excerpt += this.getExcerpt(obj[i]);
         } else if (i === '*') {
           excerpt = obj[i];
           break;
         }
       }
       return excerpt;
     };

     // wiki def lookup
     this.wikiApiUrl = (location.protocol === 'https:' ? 'https:' : 'http:') + "//en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&rvparse=0&format=json&titles=";

     this.fetchWikiText = function (word, callback) {
       var that = this;
       var wordDef = that.getDefinition (word);
       if (word != undefined && word != "" && wordDef === undefined) {
         $.ajax({
                  dataType: 'jsonp',
                  url: that.wikiApiUrl + word,
                  success: function (data) {

                    var wikiExcerpt = (that.getExcerpt(data));
                    if (wikiExcerpt != undefined && wikiExcerpt !== "") {
                      $("#wiki-text").html("");
                      $('#wiki-text').html(wikiExcerpt);
                      $("#wiki-text .infobox").remove();
                      $("#wiki-text .thumbinner").remove();
                      $("#wiki-text .error").remove();
                      $("#wiki-text .reference").remove();
                      $("#wiki-text table").remove();
                      $('#wiki-text a').each(function (index, ele) {
                                               ele.href = ele.href.replace("file://" , "http://en.wikipedia.org");
                                               ele.href = ele.href.replace(document.location.host + "/wiki" , "http://en.wikipedia.org");
                                               ele.target="_blank";
                                             });
                      that.addDefinition (word, $('#wiki-text').html());
                      if (callback) {
                        callback ($('#wiki-text').html());
                      }
                    } else {
                      if (callback) {
                        callback (null);
                      }
                    }
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                    if (callback) {
                      callback(null);
                    }
                  }
                });
       }
     };

     // closing overlay div
     this.closeDefOverlay = function () {
       $("#overlay p").removeClass("def-lookup-error");
       $("#blanket").toggle();
       $("#overlay .def-para").html("Fetching data &nbsp;&nbsp; <img src='./loading.gif' alt='...' />");
     };

     // main deflookup function
     this.defLookup = function (word) {
       var that = this;
       $("#blanket").toggle();
       var wordDef = that.getDefinition (word);
       if (wordDef) {
         $("#overlay p").html(wordDef);
       } else {
         this.fetchWikiText(word, function (def) {
                              if (def && def !== "") {
                                $("#overlay p").html(def);
                              } else {
                                $("#overlay p").html("Could not find definition for word '" + word + "'");
                                $("#overlay p").addClass("def-lookup-error");
                              }
                            });
       }
     };

     // creating overlay div
     this.createOverlayDiv = function () {
       var that = this;
       $("<div id='blanket'>"
         + "<div id='overlay'>"
         + "<a href='close'>"
         + "<span class='close'>x</span>"
         + "</a>"
         + "<p class='def-para'>Fetching data &nbsp;&nbsp; <img src='./loading.gif' alt='...' /></p>"
         + "</div>"
         + "</div>")
         .appendTo('body');
       // attaching close overlay event
       $("#blanket a[href='close']").click(function (event) {
                                             event.stopPropagation();
                                             that.closeDefOverlay();
                                             return false;
                                           });
     };

     // creating div to insert wiki def
     this.createWikiDefDiv = function () {
       $("<div style='display:none' id='wiki-text'></div>").appendTo('body');
     };

     // http://naspinski.net/post/Javascript-replaceAll-function.aspx
     function replaceAll(txt, replace, with_this) {
       return txt.replace(new RegExp(replace, 'g'),with_this);
     }

     // overall init function
     this.init = function () {
       var that = this;
       this.each(function () {
                   var $this = $(this);
                   var word = $this.html();
                   word = $.trim(word);
                   word = replaceAll(word, " ",  "_");
                   $this.bind("click", function () {
                                that.defLookup(word);
                                return false;
                              });
                 });
       this.createOverlayDiv();
       this.createWikiDefDiv();
     };

     this.init();

     return this;
   };

 })(jQuery);
