!function(e,t){t.mixin({ucwords:function(e){return(e+"").replace(/^([a-z])|\s+([a-z])|-([a-z])/g,function(e){return e.toUpperCase()})}}),APP.Templates.Markdown=APP.Template.extend({compile:(new Showdown.converter).makeHtml}),APP.Views.Markdown=APP.View.extend({options:{template:APP.Templates.Markdown,mdRoot:"assets/html/",parseName:!1},events:{"click a":"processLink"},initialize:function(e){var t=e.parseName||this.options.parseName?this._parseName(e.page):e.page;return this.options.url=this.options.mdRoot+t+".md",APP.View.prototype.initialize.call(this,e)},processLink:function(t){t.preventDefault();var a="A"==t.target.tagName?e(t.target):e(t.target).closest("a"),i=a.attr("href");/(file|http).*/.test(i)&&(window.location=i),i=i.replace("./wiki","").replace("./",""),app.navigate(i,!0)},_parseName:function(e){return e=t.ucwords(e)}})}(this.jQuery,this._,this.Backbone);