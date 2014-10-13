define("chief/adapters/application",["ember-data","chief/config/environment","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.ActiveModelAdapter.extend({host:n.APP.API_HOST})}),define("chief/app",["ember","ember/resolver","ember/load-initializers","chief/config/environment","exports"],function(e,t,s,a,n){"use strict";var r=e["default"],i=t["default"],o=s["default"],u=a["default"];r.MODEL_FACTORY_INJECTIONS=!0;var l=r.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:i});o(l,u.modulePrefix),n["default"]=l}),define("chief/components/image-slider",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({didInsertElement:function(){$(this.get("element")).owlCarousel()}})}),define("chief/components/image-upload",["ember","chief/models/upload","chief/config/environment","exports"],function(e,t,s,a){"use strict";var n=e["default"],r=t["default"],i=s["default"];a["default"]=n.FileField.extend({concurrency:3,multiple:!0,uploads:[],queue:function(){var e=this;return async.queue(function(t,s){var a=t.get("uploader"),n=t.get("file");a.on("didUpload",function(a){var n=$(a).find("Location")[0].textContent,r=unescape(n);t.set("url",r),e.sendAction("action",t),s()}),a.upload(n)},this.get("concurrency"))}.property(),uploadFiles:function(){var e=this.get("files");if(!n.isEmpty(e))for(var t=0;t<e.length;t++){var s=e[t];this.uploadFile(s)}}.observes("files"),uploadFile:function(e){var t=this.get("queue"),s=this.get("uploads"),a=r.create({file:e}),o=n.S3Uploader.create({url:i.APP.API_HOST+"/sign"});o.on("progress",function(e){a.set("progress",e.percent)}),a.set("uploader",o),this.previewImage(a),s.pushObject(a),t.push(a)},previewImage:function(e){var t=e.get("file"),s=new FileReader;s.onloadend=function(){e.set("original",this.result)},s.readAsDataURL(t)}})}),define("chief/models/upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Object.extend({file:"",progress:0,original:"",url:"",barWidth:function(){return"width: "+this.get("progress")+"%;"}.property("progress"),saved:s.computed.notEmpty("image")})}),define("chief/controllers/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({actions:{destroy:function(){this.get("model").destroyRecord()}}})}),define("chief/controllers/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({uploads:[],actions:{imageUploaded:function(e){var t=this.get("model"),s=this.store.createRecord("image",{file:e.get("url")});s.save().then(function(){e.set("image",s),t.pushObject(s)})["catch"](function(t){s.deleteRecord(),e.set("image",null),e.set("failed",!0),e.set("error",t.statusText)})}}})}),define("chief/controllers/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({queryParams:["latitude","longitude"],latitude:null,longitude:null})}),define("chief/controllers/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({init:function(){this.get("checkedImages")},images:s.computed.filter("availableImages",function(e){var t=this.get("spot"),a=e.get("spot");return s.isEmpty(a)||s.isEqual(a,t)}),checkedImages:s.computed.filterBy("images","checked",!0),attachImages:function(){var e=this.get("spot"),t=e.get("images");t.clear(),this.get("checkedImages").forEach(function(s){t.pushObject(s),s.set("spot",e)})}.observes("checkedImages.[]"),actions:{save:function(){var e=this.get("spot");this.transitionToRoute("spot",e.save())}}})}),define("chief/initializers/geolocation",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"geolocation",initialize:function(){s.Route.reopen({setupController:function(e,t){this._super(e,t),navigator.geolocation.getCurrentPosition(function(t){var a={latitude:t.coords.latitude,longitude:t.coords.longitude};localStorage.setItem("lastLocation",JSON.stringify(a)),s.run(function(){e.set("latitude",a.latitude),e.set("longitude",a.longitude)})})},lastLocation:function(){var e;try{e=JSON.parse(localStorage.getItem("lastLocation"))}catch(t){e={}}return e}.property()})}}}),define("chief/initializers/swag",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"swag",initialize:function(){Swag.registerHelpers(s.Handlebars)}}}),define("chief/mixins/locatable",["ember-data","ember","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=n.Mixin.create({bearing:a.attr("string"),distance:a.attr("number"),latitude:a.attr("number"),longitude:a.attr("number"),hasLocation:n.computed.not("missingLocation"),location:function(){return n.Object.create({latitude:this.get("latitude"),longitude:this.get("longitude")})}.property("latitude","longitude"),missingLocation:function(){return n.empty(this.get("latitude"))||n.empty(this.get("longitude"))}.property("latitude","longitude")})}),define("chief/models/image",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{spot:a.belongsTo("spot"),file:a.attr("string"),original:a.attr("string"),large:a.attr("string",{defaultValue:function(e){return e.get("original")}}),thumbnail:a.attr("string",{defaultValue:function(e){return e.get("original")}}),progress:0,barWidth:function(){var e=this.get("progress");return"width: "+e+"%;"}.property("progress")})}),define("chief/models/spot",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{name:a.attr("string"),images:a.hasMany("image")})}),define("chief/router",["ember","chief/config/environment","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"],r=a.Router.extend({location:n.locationType});r.map(function(){this.route("nearby",{path:"/"}),this.route("spot.new",{path:"/spot/new"}),this.resource("spot",{path:"/spot/:id"}),this.route("image",function(){this.route("new")}),this.route("catchall",{path:"/*wildcard"})}),s["default"]=r}),define("chief/routes/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return[]}})}),define("chief/routes/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({queryParams:{latitude:{refreshModel:!0},longitude:{refreshModel:!0}},model:function(){return this.store.findQuery("spot",this.get("lastLocation"))}})}),define("chief/routes/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(e){return this.store.find("spot",e.id)}})}),define("chief/routes/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return s.RSVP.hash({availableImages:this.store.find("image"),spot:this.store.createRecord("spot")})}})}),define("chief/routes/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("spot")}})}),define("chief/serializers/image",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelSerializer.extend({attrs:{bearing:{serialize:!1},distance:{serialize:!1},original:{serialize:!1},large:{serialize:!1},thumbnail:{serialize:!1}}})}),define("chief/serializers/spot",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelSerializer.extend(s.EmbeddedRecordsMixin,{attrs:{bearing:{serialize:!1},distance:{serialize:!1},images:{serialize:"ids"}}})}),define("chief/templates/_footer",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){t.buffer.push("Find")}function o(e,t){t.buffer.push("Share")}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,l,h,f="",p=this,c=a.helperMissing;return r.buffer.push("<footer>\n  <nav>\n    "),l=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:p.noop,fn:p.program(1,i,r),contexts:[t],types:["STRING"],data:r},u=l?l.call(t,"nearby",h):c.call(t,"link-to","nearby",h),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n    "),l=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:p.noop,fn:p.program(3,o,r),contexts:[t],types:["STRING"],data:r},u=l?l.call(t,"spot.new",h):c.call(t,"link-to","spot.new",h),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n  </nav>\n</footer>\n"),f})}),define("chief/templates/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o,u,l="",h=a.helperMissing,f=this.escapeExpression;return r.buffer.push('<main class="content">\n  '),i=a._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n</main>\n\n"),r.buffer.push(f((o=a.partial||t&&t.partial,u={hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:r},o?o.call(t,"footer",u):h.call(t,"partial","footer",u)))),r.buffer.push("\n"),l})}),define("chief/templates/catchall",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{},r.buffer.push("<h1>Page Not Found</h1>\n")})}),define("chief/templates/components/image-slider",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s="";return t.buffer.push('\n  <img data-role="image" '),t.buffer.push(l(a["bind-attr"].call(e,{hash:{src:"thumbnail",alt:"thumbnail"},hashTypes:{src:"ID",alt:"ID"},hashContexts:{src:e,alt:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n"),s}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=this.escapeExpression,h=this;return o=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:h.noop,fn:h.program(1,i,r),contexts:[t],types:["ID"],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n"),u})}),define("chief/templates/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o,u="",l=this.escapeExpression,h=a.helperMissing;return r.buffer.push('<label data-image="'),r.buffer.push(l(a.unbound.call(t,"id",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}))),r.buffer.push('">\n  <img '),r.buffer.push(l(a["bind-attr"].call(t,{hash:{src:"thumbnail",alt:"thumbnail"},hashTypes:{src:"ID",alt:"ID"},hashContexts:{src:t,alt:t},contexts:[],types:[],data:r}))),r.buffer.push(">\n  "),r.buffer.push(l((i=a.input||t&&t.input,o={hash:{type:"checkbox",checked:"checked"},hashTypes:{type:"STRING",checked:"ID"},hashContexts:{type:t,checked:t},contexts:[],types:[],data:r},i?i.call(t,o):h.call(t,"input",o)))),r.buffer.push('\n</label>\n\n<button data-destroy-image="'),r.buffer.push(l(a.unbound.call(t,"id",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}))),r.buffer.push('" '),r.buffer.push(l(a.action.call(t,"destroy",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:r}))),r.buffer.push(">DELETE</button>\n"),u})}),define("chief/templates/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n="";return t.buffer.push("\n    <h1>"),s=a._triageMustache.call(e,"images.length",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push(" created!</h1>\n  "),n}function o(e,t){var s,n,r="";return t.buffer.push("\n    "),t.buffer.push(c((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"upload","",n):p.call(e,"render","upload","",n)))),t.buffer.push("\n  "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,l,h,f="",p=a.helperMissing,c=this.escapeExpression,d=this;return r.buffer.push('<section class="image-new">\n  '),u=a["if"].call(t,"images.length",{hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(1,i,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n  <label>\n    Pick an image\n    "),r.buffer.push(c((l=a["image-upload"]||t&&t["image-upload"],h={hash:{uploads:"uploads",action:"imageUploaded"},hashTypes:{uploads:"ID",action:"STRING"},hashContexts:{uploads:t,action:t},contexts:[],types:[],data:r},l?l.call(t,h):p.call(t,"image-upload",h)))),r.buffer.push('\n  </label>\n\n  <ul class="uploads">\n  '),u=a.each.call(t,"uploads",{hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(3,o,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n  </ul>\n</section>\n"),f})}),define("chief/templates/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n    "),t.buffer.push(h((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):l.call(e,"render","spot","",n)))),t.buffer.push("\n  "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=a.helperMissing,h=this.escapeExpression,f=this;return r.buffer.push('<section class="spots">\n  '),o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n</section>\n"),u})}),define("chief/templates/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n="";return t.buffer.push('\n  <h1 data-role="name">'),s=a._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</h1>\n"),n}function o(e,t){var s,n,r,i="";return t.buffer.push("\n  <address>"),t.buffer.push(c((n=a.toFixed||e&&e.toFixed,r={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","INTEGER"],data:t},n?n.call(e,"distance",2,r):p.call(e,"toFixed","distance",2,r)))),t.buffer.push(" miles "),s=a._triageMustache.call(e,"bearing",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</address>\n"),i}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,l,h,f="",p=a.helperMissing,c=this.escapeExpression,d=this;return l=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(1,i,r),contexts:[t,t],types:["STRING","ID"],data:r},u=l?l.call(t,"spot","",h):p.call(t,"link-to","spot","",h),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n"),u=a["if"].call(t,"distance",{hash:{},hashTypes:{},hashContexts:{},inverse:d.noop,fn:d.program(3,o,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n"),r.buffer.push(c((l=a["image-slider"]||t&&t["image-slider"],h={hash:{images:"images"},hashTypes:{images:"ID"},hashContexts:{images:t},contexts:[],types:[],data:r},l?l.call(t,h):p.call(t,"image-slider",h)))),r.buffer.push("\n"),f})}),define("chief/templates/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n      "),t.buffer.push(b((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"image-item","",n):m.call(e,"render","image-item","",n)))),t.buffer.push("\n    "),r}function o(e,t){var s,n="";return t.buffer.push('\n    <div class="error">'),s=a._triageMustache.call(e,"message",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</div>\n  "),n}function u(e,t){t.buffer.push("or click here to add one")}function l(e,t){var s,n,r,i="";return t.buffer.push("\n    "),t.buffer.push(b((n=a.input||e&&e.input,r={hash:{"class":"name",value:"name",type:"text",placeholder:"Name the spot..."},hashTypes:{"class":"STRING",value:"ID",type:"STRING",placeholder:"STRING"},hashContexts:{"class":e,value:e,type:e,placeholder:e},contexts:[],types:[],data:t},n?n.call(e,r):m.call(e,"input",r)))),t.buffer.push("\n\n    "),s=a.each.call(e,"errors.name",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(8,h,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('\n\n    <input type="submit" value="Create!">\n  '),i}function h(e,t){var s,n="";return t.buffer.push('\n      <div class="error">'),s=a._triageMustache.call(e,"message",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</div>\n    "),n}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var f,p,c,d="",m=a.helperMissing,b=this.escapeExpression,g=this;return r.buffer.push("<form "),r.buffer.push(b(a.action.call(t,"save",{hash:{on:"submit"},hashTypes:{on:"STRING"},hashContexts:{on:t},contexts:[t],types:["STRING"],data:r}))),r.buffer.push('>\n  <label>Pick one or more images</label>\n  <ul class="image-picker">\n    '),f=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(1,i,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n  </ul>\n\n  "),f=a.each.call(t,"errors.images",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(3,o,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n\n  "),p=a["link-to"]||t&&t["link-to"],c={hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(5,u,r),contexts:[t],types:["STRING"],data:r},f=p?p.call(t,"image.new",c):m.call(t,"link-to","image.new",c),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n\n  "),f=a["with"].call(t,"spot",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(7,l,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n</form>\n"),d})}),define("chief/templates/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n    "),t.buffer.push(h((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):l.call(e,"render","spot","",n)))),t.buffer.push("\n  "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=a.helperMissing,h=this.escapeExpression,f=this;return r.buffer.push('<section class="spots">\n  '),o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n</section>\n"),u})}),define("chief/templates/upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push('\n  <div class="progress-bar-indication">\n    <span class="meter" '),t.buffer.push(l(a["bind-attr"].call(e,{hash:{style:"barWidth"},hashTypes:{style:"ID"},hashContexts:{style:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n      <p>"),t.buffer.push(l((s=a.toFixed||e&&e.toFixed,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","INTEGER"],data:t},s?s.call(e,"progress",0,n):h.call(e,"toFixed","progress",0,n)))),t.buffer.push("%</p>\n    </span>\n  </div>\n"),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=this.escapeExpression,h=a.helperMissing,f=this;return r.buffer.push("<img "),r.buffer.push(l(a["bind-attr"].call(t,{hash:{src:"original"},hashTypes:{src:"ID"},hashContexts:{src:t},contexts:[],types:[],data:r}))),r.buffer.push(' alt="spot">\n\n<p class="error">'),o=a._triageMustache.call(t,"error",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("</p>\n\n"),o=a.unless.call(t,"saved",{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[t],types:["ID"],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n"),u})}),define("chief/views/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({classNameBindings:[":image-item","checked:active","missingLocation:missing-location"],tagName:"li",templateName:"image-item",checked:s.computed.alias("controller.checked"),missingLocation:s.computed.alias("controller.missingLocation")})}),define("chief/views/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({classNameBindings:[":spot"],tagName:"article",templateName:"spot"})}),define("chief/views/upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({classNameBindings:["saved","failed"],tagName:"li",templateName:"upload",failed:s.computed.alias("controller.failed"),saved:s.computed.alias("controller.saved")})}),define("chief/config/environment",["ember"],function(e){var t="chief/config/environment",s=e["default"].$('meta[name="'+t+'"]').attr("content"),a=JSON.parse(unescape(s));return{"default":a}}),runningTests?require("chief/tests/test-helper"):require("chief/app")["default"].create({API_HOST:"http://api.wheelbytes.com"});