define("chief/adapters/application",["ember-data","chief/config/environment","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.ActiveModelAdapter.extend({host:n.APP.API_HOST})}),define("chief/app",["ember","ember/resolver","ember/load-initializers","chief/config/environment","exports"],function(e,t,s,a,n){"use strict";var r=e["default"],i=t["default"],o=s["default"],u=a["default"];r.MODEL_FACTORY_INJECTIONS=!0;var h=r.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:i});o(h,u.modulePrefix),n["default"]=h}),define("chief/components/image-slider",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({didInsertElement:function(){$(this.get("element")).owlCarousel()}})}),define("chief/components/image-upload",["ember","chief/models/upload","chief/config/environment","exports"],function(e,t,s,a){"use strict";var n=e["default"],r=t["default"],i=s["default"];a["default"]=n.FileField.extend({concurrency:3,multiple:!0,uploads:[],queue:function(){var e=this;return async.queue(function(t,s){var a=t.get("uploader"),n=t.get("file");a.on("didUpload",function(a){var n=$(a).find("Location")[0].textContent,r=unescape(n);t.set("url",r),e.sendAction("action",t),s()}),a.upload(n)},this.get("concurrency"))}.property(),uploadFiles:function(){var e=this.get("files");if(!n.isEmpty(e))for(var t=0;t<e.length;t++){var s=e[t];this.uploadFile(s)}}.observes("files"),uploadFile:function(e){var t=this.get("queue"),s=this.get("uploads"),a=r.create({file:e}),o=n.S3Uploader.create({url:i.APP.API_HOST+"/sign"});o.on("progress",function(e){a.set("progress",e.percent)}),a.set("uploader",o),this.previewImage(a),s.pushObject(a),t.push(a)},previewImage:function(e){var t=e.get("file"),s=new FileReader;s.onloadend=function(){e.set("original",this.result)},s.readAsDataURL(t)}})}),define("chief/models/upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Object.extend({file:"",progress:0,original:"",url:"",barWidth:function(){return"width: "+this.get("progress")+"%;"}.property("progress"),saved:s.computed.notEmpty("image")})}),define("chief/controllers/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({uploads:[],actions:{imageUploaded:function(e){var t=this.get("model"),s=this.store.createRecord("image",{file:e.get("url")});s.save().then(function(){e.set("image",s),t.pushObject(s)})["catch"](function(t){e.set("failed",!0),e.set("error",t.statusText)})}}})}),define("chief/controllers/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({queryParams:["latitude","longitude"],latitude:null,longitude:null})}),define("chief/controllers/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({init:function(){this.get("checkedImages")},images:s.computed.filter("availableImages",function(e){var t=this.get("spot"),a=e.get("spot");return s.isEmpty(a)||s.isEqual(a,t)}),checkedImages:s.computed.filterBy("images","checked",!0),attachImages:function(){var e=this.get("spot"),t=e.get("images");t.clear(),this.get("checkedImages").forEach(function(s){t.pushObject(s),s.set("spot",e)})}.observes("checkedImages.[]"),actions:{save:function(){var e=this.get("spot");this.transitionToRoute("spot",e.save())},destroyImage:function(e){e.destroyRecord()}}})}),define("chief/initializers/geolocation",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"geolocation",initialize:function(){s.Route.reopen({setupController:function(e,t){this._super(e,t),navigator.geolocation.getCurrentPosition(function(t){var a={latitude:t.coords.latitude,longitude:t.coords.longitude};localStorage.setItem("lastLocation",JSON.stringify(a)),s.run(function(){e.set("latitude",a.latitude),e.set("longitude",a.longitude)})})},lastLocation:function(){var e;try{e=JSON.parse(localStorage.getItem("lastLocation"))}catch(t){e={}}return e}.property()})}}}),define("chief/initializers/swag",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"swag",initialize:function(){Swag.registerHelpers(s.Handlebars)}}}),define("chief/mixins/locatable",["ember-data","ember","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=n.Mixin.create({latitude:a.attr("number"),longitude:a.attr("number"),distance:a.attr("number"),hasLocation:n.computed.not("missingLocation"),location:function(){return n.Object.create({latitude:this.get("latitude"),longitude:this.get("longitude")})}.property("latitude","longitude"),missingLocation:function(){return n.empty(this.get("latitude"))||n.empty(this.get("longitude"))}.property("latitude","longitude")})}),define("chief/models/image",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{spot:a.belongsTo("spot"),file:a.attr("string"),original:a.attr("string"),large:a.attr("string",function(e){return e.get("original")}),thumbnail:a.attr("string",function(e){return e.get("original")}),progress:0,barWidth:function(){var e=this.get("progress");return"width: "+e+"%;"}.property("progress")})}),define("chief/models/spot",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{name:a.attr("string"),images:a.hasMany("image")})}),define("chief/router",["ember","chief/config/environment","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"],r=a.Router.extend({location:n.locationType});r.map(function(){this.route("nearby",{path:"/"}),this.route("spot.new",{path:"/spot/new"}),this.resource("spot",{path:"/spot/:id"}),this.route("image",function(){this.route("new")}),this.route("catchall",{path:"/*wildcard"})}),s["default"]=r}),define("chief/routes/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return[]}})}),define("chief/routes/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({queryParams:{latitude:{refreshModel:!0},longitude:{refreshModel:!0}},model:function(){return this.store.findQuery("spot",this.get("lastLocation"))}})}),define("chief/routes/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(e){return this.store.find("spot",e.id)}})}),define("chief/routes/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return s.RSVP.hash({availableImages:this.store.find("image"),spot:this.store.createRecord("spot")})}})}),define("chief/routes/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("spot")}})}),define("chief/serializers/image",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelSerializer.extend({attrs:{distance:{serialize:!1},original:{serialize:!1},large:{serialize:!1},thumbnail:{serialize:!1}}})}),define("chief/serializers/spot",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelSerializer.extend(s.EmbeddedRecordsMixin,{attrs:{images:{serialize:"ids"},distance:{serialize:!1}}})}),define("chief/templates/_footer",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){t.buffer.push("Find")}function o(e,t){t.buffer.push("Share")}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,h,l,f="",p=this,c=a.helperMissing;return r.buffer.push("<footer>\n  <nav>\n    "),h=a["link-to"]||t&&t["link-to"],l={hash:{},hashTypes:{},hashContexts:{},inverse:p.noop,fn:p.program(1,i,r),contexts:[t],types:["STRING"],data:r},u=h?h.call(t,"nearby",l):c.call(t,"link-to","nearby",l),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n    "),h=a["link-to"]||t&&t["link-to"],l={hash:{},hashTypes:{},hashContexts:{},inverse:p.noop,fn:p.program(3,o,r),contexts:[t],types:["STRING"],data:r},u=h?h.call(t,"spot.new",l):c.call(t,"link-to","spot.new",l),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n  </nav>\n</footer>\n"),f})}),define("chief/templates/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o,u,h="",l=a.helperMissing,f=this.escapeExpression;return r.buffer.push('<main class="content">\n  '),i=a._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n</main>\n\n"),r.buffer.push(f((o=a.partial||t&&t.partial,u={hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:r},o?o.call(t,"footer",u):l.call(t,"partial","footer",u)))),r.buffer.push("\n"),h})}),define("chief/templates/catchall",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{},r.buffer.push("<h1>Page Not Found</h1>\n")})}),define("chief/templates/components/image-slider",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s="";return t.buffer.push('\n  <img data-role="image" '),t.buffer.push(h(a["bind-attr"].call(e,{hash:{src:"thumbnail",alt:"thumbnail"},hashTypes:{src:"ID",alt:"ID"},hashContexts:{src:e,alt:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n"),s}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",h=this.escapeExpression,l=this;return o=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:l.noop,fn:l.program(1,i,r),contexts:[t],types:["ID"],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n"),u})}),define("chief/templates/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o="",u=this.escapeExpression;return r.buffer.push('<img data-role="thumbnail" '),r.buffer.push(u(a["bind-attr"].call(t,{hash:{src:"thumbnail"},hashTypes:{src:"ID"},hashContexts:{src:t},contexts:[],types:[],data:r}))),r.buffer.push(">\n<address>\n  "),i=a._triageMustache.call(t,"latitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push(", "),i=a._triageMustache.call(t,"longitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n</address>\n"),o})}),define("chief/templates/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n="";return t.buffer.push("\n    <h1>"),s=a._triageMustache.call(e,"images.length",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push(" created!</h1>\n  "),n}function o(e,t){var s,n="";return t.buffer.push("\n    <li "),t.buffer.push(c(a["bind-attr"].call(e,{hash:{"class":"saved failed"},hashTypes:{"class":"STRING"},hashContexts:{"class":e},contexts:[],types:[],data:t}))),t.buffer.push(">\n      <img "),t.buffer.push(c(a["bind-attr"].call(e,{hash:{src:"original"},hashTypes:{src:"ID"},hashContexts:{src:e},contexts:[],types:[],data:t}))),t.buffer.push(' alt="spot">\n\n      <p class="error">'),s=a._triageMustache.call(e,"error",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</p>\n\n      "),s=a.unless.call(e,"saved",{hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(4,u,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n    </li>\n  "),n}function u(e,t){var s,n,r="";return t.buffer.push('\n        <div class="progress-bar-indication">\n          <span class="meter" '),t.buffer.push(c(a["bind-attr"].call(e,{hash:{style:"barWidth"},hashTypes:{style:"ID"},hashContexts:{style:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n            <p>"),t.buffer.push(c((s=a.toFixed||e&&e.toFixed,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","INTEGER"],data:t},s?s.call(e,"progress",0,n):d.call(e,"toFixed","progress",0,n)))),t.buffer.push("%</p>\n          </span>\n        </div>\n      "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var h,l,f,p="",c=this.escapeExpression,d=a.helperMissing,m=this;return r.buffer.push('<section class="image-new">\n  '),h=a["if"].call(t,"images.length",{hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(1,i,r),contexts:[t],types:["ID"],data:r}),(h||0===h)&&r.buffer.push(h),r.buffer.push("\n\n  <label>\n    Pick an image\n    "),r.buffer.push(c((l=a["image-upload"]||t&&t["image-upload"],f={hash:{uploads:"uploads",action:"imageUploaded"},hashTypes:{uploads:"ID",action:"STRING"},hashContexts:{uploads:t,action:t},contexts:[],types:[],data:r},l?l.call(t,f):d.call(t,"image-upload",f)))),r.buffer.push('\n  </label>\n\n  <ul class="uploads">\n  '),h=a.each.call(t,"uploads",{hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(3,o,r),contexts:[t],types:["ID"],data:r}),(h||0===h)&&r.buffer.push(h),r.buffer.push("\n  </ul>\n</section>\n"),p})}),define("chief/templates/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n  "),t.buffer.push(l((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):h.call(e,"render","spot","",n)))),t.buffer.push("\n"),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",h=a.helperMissing,l=this.escapeExpression,f=this;return o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n"),u})}),define("chief/templates/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n="";return t.buffer.push('\n  <h1 data-role="name">'),s=a._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</h1>\n"),n}function o(e,t){var s,n,r="";return t.buffer.push("\n  <address>"),t.buffer.push(c((s=a.toFixed||e&&e.toFixed,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","INTEGER"],data:t},s?s.call(e,"distance",2,n):p.call(e,"toFixed","distance",2,n)))),t.buffer.push(" miles away</address>\n"),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,h,l,f="",p=a.helperMissing,c=this.escapeExpression,d=this;return h=a["link-to"]||t&&t["link-to"],l={hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(1,i,r),contexts:[t,t],types:["STRING","ID"],data:r},u=h?h.call(t,"spot","",l):p.call(t,"link-to","spot","",l),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n"),u=a["if"].call(t,"distance",{hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(3,o,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n"),r.buffer.push(c((h=a["image-slider"]||t&&t["image-slider"],l={hash:{images:"images"},hashTypes:{images:"ID"},hashContexts:{images:t},contexts:[],types:[],data:r},h?h.call(t,l):p.call(t,"image-slider",l)))),r.buffer.push("\n"),f})}),define("chief/templates/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r,i="";return t.buffer.push("\n  "),t.buffer.push(m((n=a.input||e&&e.input,r={hash:{"class":"name",value:"name",type:"text",placeholder:"Name the spot..."},hashTypes:{"class":"STRING",value:"ID",type:"STRING",placeholder:"STRING"},hashContexts:{"class":e,value:e,type:e,placeholder:e},contexts:[],types:[],data:t},n?n.call(e,r):d.call(e,"input",r)))),t.buffer.push("\n  "),s=a.each.call(e,"errors.name",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(2,o,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n\n  "),s=a.each.call(e,"errors.images",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(2,o,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('\n\n  <button class="submit" '),t.buffer.push(m(a.action.call(e,"save",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push(">Create!</button>\n"),i}function o(e,t){var s,n="";return t.buffer.push('\n    <div class="error">'),s=a._triageMustache.call(e,"message",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</div>\n  "),n}function u(e,t){t.buffer.push("Click here to add an image")}function h(e,t){var s,n,r="";return t.buffer.push("\n    <li "),t.buffer.push(m(a["bind-attr"].call(e,{hash:{"class":"checked:active"},hashTypes:{"class":"STRING"},hashContexts:{"class":e},contexts:[],types:[],data:t}))),t.buffer.push('>\n      <label data-image="'),t.buffer.push(m(a.unbound.call(e,"id",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}))),t.buffer.push('">\n        <img '),t.buffer.push(m(a["bind-attr"].call(e,{hash:{src:"thumbnail",alt:"thumbnail"},hashTypes:{src:"ID",alt:"ID"},hashContexts:{src:e,alt:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n        "),t.buffer.push(m((s=a.input||e&&e.input,n={hash:{type:"checkbox",checked:"checked"},hashTypes:{type:"STRING",checked:"ID"},hashContexts:{type:e,checked:e},contexts:[],types:[],data:t},s?s.call(e,n):d.call(e,"input",n)))),t.buffer.push('\n      </label>\n      <button data-destroy-image="'),t.buffer.push(m(a.unbound.call(e,"id",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}))),t.buffer.push('" '),t.buffer.push(m(a.action.call(e,"destroyImage","",{hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t}))),t.buffer.push(">X</button>\n    </li>\n  "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var l,f,p,c="",d=a.helperMissing,m=this.escapeExpression,b=this;return l=a["with"].call(t,"spot",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(1,i,r),contexts:[t],types:["ID"],data:r}),(l||0===l)&&r.buffer.push(l),r.buffer.push("\n\n"),f=a["link-to"]||t&&t["link-to"],p={hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(4,u,r),contexts:[t],types:["STRING"],data:r},l=f?f.call(t,"image.new",p):d.call(t,"link-to","image.new",p),(l||0===l)&&r.buffer.push(l),r.buffer.push('\n\n<ul class="image-picker">\n  '),l=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:b.noop,fn:b.program(6,h,r),contexts:[t],types:["ID"],data:r}),(l||0===l)&&r.buffer.push(l),r.buffer.push("\n</ul>\n"),c})}),define("chief/templates/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push('\n      <li class="spot">\n        '),t.buffer.push(l((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):h.call(e,"render","spot","",n)))),t.buffer.push("\n      </li>\n    "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",h=a.helperMissing,l=this.escapeExpression,f=this;return r.buffer.push('<section class="spots">\n  <ul>\n    '),o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n  </ul>\n</section>\n"),u})}),define("chief/views/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({classNameBindings:["image","missingLocation:missing-location"],templateName:"image-item"})}),define("chief/config/environment",["ember"],function(e){var t="chief/config/environment",s=e["default"].$('meta[name="'+t+'"]').attr("content"),a=JSON.parse(unescape(s));return{"default":a}}),runningTests?require("chief/tests/test-helper"):require("chief/app")["default"].create({API_HOST:"http://api.wheelbytes.com"});