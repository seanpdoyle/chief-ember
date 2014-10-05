define("chief/adapters/application",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelAdapter.extend({})}),define("chief/app",["ember","ember/resolver","ember/load-initializers","chief/config/environment","exports"],function(e,t,s,a,n){"use strict";var r=e["default"],i=t["default"],o=s["default"],u=a["default"];r.MODEL_FACTORY_INJECTIONS=!0;var l=r.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:i});o(l,u.modulePrefix),n["default"]=l}),define("chief/config/environment",["exports"],function(e){"use strict";e["default"]={modulePrefix:"chief",environment:"production",baseURL:"/ember-chief",locationType:"auto",EmberENV:{FEATURES:{}},APP:{}}}),define("chief/components/image-upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.FileField.extend({model:s.Object.create({}),style:"width: 0%",uploader:function(){var e=this,t=this.get("model"),a=s.Uploader.create({url:"/images",paramNamespace:"image"});return a.on("progress",function(s){e.set("width","width: "+s.percent+"%"),t.set("style",s.percent)}),a.on("didUpload",function(s){var a=s.image;t.set("id",a.id),t.set("original",a.original),t.set("large",a.large),t.set("thumbnail",a.thumbnail),e.sendAction("action",t)}),a}.property(),readMetadata:function(){var e=this.get("files")[0],t=this.get("model"),a=new FileReader;a.onloadend=function(){var a=new JpegMeta.JpegFile(this.result,e.name),n=s.Object.create({latitude:a.gps.latitude,longitude:a.gps.longitude});t.set("location",n),t.set("orientation",a.tiff.Orientation.value)},e&&a.readAsBinaryString(e)}.observes("files","model"),previewImage:function(){var e=this.get("files")[0],t=this.get("model"),s=new FileReader;s.onloadend=function(){t.set("thumbnail",this.result)},e&&s.readAsDataURL(e)}.observes("files","model"),actions:{upload:function(){var e=this.get("files");s.empty(e)||this.get("uploader").upload(e[0])}}})}),define("chief/config/environments/production",["exports"],function(e){"use strict";e["default"]={modulePrefix:"chief",environment:"production",baseURL:"/ember-chief",locationType:"auto",EmberENV:{FEATURES:{}},APP:{}}}),define("chief/controllers/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({orientation:function(){return"orientation-"+this.get("model.orientation")}.property("model.orientation"),style:function(){return s.isEmpty(this.get("thumbnail"))?"background-color: white;":'background-image: url("'+this.get("thumbnail")+'");'}.property("thumbnail")})}),define("chief/controllers/images",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({withLocation:s.computed.filterBy("model","hasLocation",!0),withoutLocation:s.computed.setDiff("model","withLocation")})}),define("chief/controllers/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({reloadModel:function(){var e=this.get("latitude"),t=this.get("longitude");if(e&&t){var s=this.store.find("spot",{latitude:this.get("latitude"),longitude:this.get("longitude")});this.set("model",s)}}.observes("latitude","longitude")})}),define("chief/controllers/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({checkedImages:s.computed.filterBy("images","checked",!0),attachImages:function(){var e=this.get("spot.images");e.clear(),e.pushObjects(this.get("checkedImages"))}.observes("checkedImages.[]","images.@each"),actions:{save:function(){var e=this.get("spot");this.transitionToRoute("spot",e.save())}}})}),define("chief/initializers/geolocation",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"geolocation",initialize:function(){s.Route.reopen({setupController:function(e,t){this._super(e,t),navigator.geolocation.getCurrentPosition(function(t){var a={latitude:t.coords.latitude,longitude:t.coords.longitude};localStorage.setItem("lastLocation",JSON.stringify(a)),s.run(function(){e.set("latitude",a.latitude),e.set("longitude",a.longitude)})})},lastLocation:function(){var e=localStorage.getItem("lastLocation")||"{}";return JSON.parse(e)}.property()})}}}),define("chief/initializers/swag",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]={name:"swag",initialize:function(){Swag.registerHelpers(s.Handlebars)}}}),define("chief/mixins/locatable",["ember-data","ember","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=n.Mixin.create({latitude:a.attr("number"),longitude:a.attr("number"),distance:a.attr("number"),hasLocation:n.computed.not("missingLocation"),location:function(){return n.Object.create({latitude:this.get("latitude"),longitude:this.get("longitude")})}.property("latitude","longitude"),missingLocation:function(){return n.empty(this.get("latitude"))||n.empty(this.get("longitude"))}.property("latitude","longitude")})}),define("chief/models/image",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{spot:a.belongsTo("spot"),original:a.attr("string"),large:a.attr("string"),thumbnail:a.attr("string"),thumbnailOrOriginal:function(){return this.get("thumbnail")||this.get("original")}.property("thumbnail","original"),largeOrOriginal:function(){return this.get("large")||this.get("original")}.property("large","original")})}),define("chief/models/spot",["ember-data","chief/mixins/locatable","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"];s["default"]=a.Model.extend(n,{name:a.attr("string"),images:a.hasMany("image")})}),define("chief/router",["ember","chief/config/environment","exports"],function(e,t,s){"use strict";var a=e["default"],n=t["default"],r=a.Router.extend({location:n.locationType});r.map(function(){this.route("nearby",{path:"/"}),this.route("spot.new",{path:"/spot/new"}),this.resource("spot",{path:"/spot/:id"}),this.route("image",function(){this.route("new")}),this.route("catchall",{path:"/*wildcard"})}),s["default"]=r}),define("chief/routes/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.createRecord("image")},actions:{imageUploaded:function(){this.transitionTo("spot.new")}}})}),define("chief/routes/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.findQuery("spot",this.get("lastLocation"))}})}),define("chief/routes/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(e){return this.store.find("spot",e.id)}})}),define("chief/routes/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return s.RSVP.hash({images:this.store.find("image"),spot:this.store.createRecord("spot")})}})}),define("chief/routes/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("spot")}})}),define("chief/serializers/spot",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelSerializer.extend(s.EmbeddedRecordsMixin,{attrs:{images:{serialize:"ids",deserializer:"records"},distance:{serialize:!1}}})}),define("chief/templates/_footer",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){t.buffer.push("SPOTS")}function o(e,t){t.buffer.push("+")}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,l,h,f="",c=this,p=a.helperMissing;return r.buffer.push("<footer>\n  <nav>\n    "),l=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:c.noop,fn:c.program(1,i,r),contexts:[t],types:["STRING"],data:r},u=l?l.call(t,"nearby",h):p.call(t,"link-to","nearby",h),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n    "),l=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:c.noop,fn:c.program(3,o,r),contexts:[t],types:["STRING"],data:r},u=l?l.call(t,"spot.new",h):p.call(t,"link-to","spot.new",h),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n  </nav>\n</footer>\n"),f})}),define("chief/templates/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o,u,l="",h=a.helperMissing,f=this.escapeExpression;return r.buffer.push('<main class="content">\n  '),i=a._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n</main>\n\n"),r.buffer.push(f((o=a.partial||t&&t.partial,u={hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:r},o?o.call(t,"footer",u):h.call(t,"partial","footer",u)))),r.buffer.push("\n"),l})}),define("chief/templates/catchall",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{},r.buffer.push("<h1>Page Not Found</h1>\n")})}),define("chief/templates/components/image-upload",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i="",o=this.escapeExpression;return r.buffer.push('<div class="progress-bar">\n  <span class="meter" '),r.buffer.push(o(a["bind-attr"].call(t,{hash:{style:"style"},hashTypes:{style:"ID"},hashContexts:{style:t},contexts:[],types:[],data:r}))),r.buffer.push("></span>\n</div>\n<button "),r.buffer.push(o(a.action.call(t,"upload",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:r}))),r.buffer.push(" "),r.buffer.push(o(a["bind-attr"].call(t,{hash:{disabled:"invalid"},hashTypes:{disabled:"ID"},hashContexts:{disabled:t},contexts:[],types:[],data:r}))),r.buffer.push(">Save Image</button>\n"),i})}),define("chief/templates/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o="",u=this.escapeExpression;return r.buffer.push('<img data-role="thumbnail" '),r.buffer.push(u(a["bind-attr"].call(t,{hash:{src:"thumbnailOrOriginal"},hashTypes:{src:"ID"},hashContexts:{src:t},contexts:[],types:[],data:r}))),r.buffer.push(">\n<address>\n  "),i=a._triageMustache.call(t,"latitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push(", "),i=a._triageMustache.call(t,"longitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n</address>\n"),o})}),define("chief/templates/image/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var i,o,u,l="",h=this.escapeExpression,f=a.helperMissing;return r.buffer.push('<section class="image-new">\n  <label>\n    <aside '),r.buffer.push(h(a["bind-attr"].call(t,{hash:{"class":"orientation",style:"style"},hashTypes:{"class":"ID",style:"ID"},hashContexts:{"class":t,style:t},contexts:[],types:[],data:r}))),r.buffer.push("></aside>\n\n    "),r.buffer.push(h((o=a["image-upload"]||t&&t["image-upload"],u={hash:{model:"model",action:"imageUploaded"},hashTypes:{model:"ID",action:"STRING"},hashContexts:{model:t,action:t},contexts:[],types:[],data:r},o?o.call(t,u):f.call(t,"image-upload",u)))),r.buffer.push("\n  </label>\n\n  <address>\n    Latitude: "),i=a._triageMustache.call(t,"location.latitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n    Longitude: "),i=a._triageMustache.call(t,"location.longitude",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(i||0===i)&&r.buffer.push(i),r.buffer.push("\n  </address>\n</section>\n"),l})}),define("chief/templates/nearby",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n  "),t.buffer.push(h((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):l.call(e,"render","spot","",n)))),t.buffer.push("\n"),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=a.helperMissing,h=this.escapeExpression,f=this;return o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n"),u})}),define("chief/templates/spot",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push("\n<address>"),t.buffer.push(f((s=a.toFixed||e&&e.toFixed,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["ID","INTEGER"],data:t},s?s.call(e,"distance",1,n):h.call(e,"toFixed","distance",1,n)))),t.buffer.push(" miles away </address>\n"),r}function o(e,t){var s="";return t.buffer.push('\n    <img data-role="image" '),t.buffer.push(f(a["bind-attr"].call(e,{hash:{alt:"name",src:"largeOrOriginal"},hashTypes:{alt:"ID",src:"ID"},hashContexts:{alt:e,src:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n  "),s}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var u,l="",h=a.helperMissing,f=this.escapeExpression,c=this;return r.buffer.push('<h1 data-role="name">'),u=a._triageMustache.call(t,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("</h1>\n\n"),u=a["if"].call(t,"distance",{hash:{},hashTypes:{},hashContexts:{},inverse:c.noop,fn:c.program(1,i,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n\n<ul>\n  "),u=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:c.noop,fn:c.program(3,o,r),contexts:[t],types:["ID"],data:r}),(u||0===u)&&r.buffer.push(u),r.buffer.push("\n</ul>\n"),l})}),define("chief/templates/spot/new",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r,i="";return t.buffer.push("\n  "),t.buffer.push(b((n=a.input||e&&e.input,r={hash:{"class":"name",value:"name",type:"text",placeholder:"Name the spot..."},hashTypes:{"class":"STRING",value:"ID",type:"STRING",placeholder:"STRING"},hashContexts:{"class":e,value:e,type:e,placeholder:e},contexts:[],types:[],data:t},n?n.call(e,r):m.call(e,"input",r)))),t.buffer.push("\n  "),s=a.each.call(e,"errors.name",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(2,o,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('\n\n  <button class="submit" '),t.buffer.push(b(a.action.call(e,"save",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push(">Create!</button>\n"),i}function o(e,t){var s,n="";return t.buffer.push('\n    <div class="error">'),s=a._triageMustache.call(e,"message",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</div>\n  "),n}function u(e,t){t.buffer.push("Click here to add an image")}function l(e,t){var s,n,r="";return t.buffer.push("\n    <li "),t.buffer.push(b(a["bind-attr"].call(e,{hash:{"class":"checked:active"},hashTypes:{"class":"STRING"},hashContexts:{"class":e},contexts:[],types:[],data:t}))),t.buffer.push('>\n      <label data-image="'),t.buffer.push(b(a.unbound.call(e,"id",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}))),t.buffer.push('">\n        <img '),t.buffer.push(b(a["bind-attr"].call(e,{hash:{src:"thumbnailOrOriginal",alt:"thumbnailOrOriginal"},hashTypes:{src:"ID",alt:"ID"},hashContexts:{src:e,alt:e},contexts:[],types:[],data:t}))),t.buffer.push(">\n        "),t.buffer.push(b((s=a.input||e&&e.input,n={hash:{type:"checkbox",checked:"checked"},hashTypes:{type:"STRING",checked:"ID"},hashContexts:{type:e,checked:e},contexts:[],types:[],data:t},s?s.call(e,n):m.call(e,"input",n)))),t.buffer.push("\n      </label>\n    </li>\n  "),r}function h(e,t){var s,n="";return t.buffer.push('\n  <div class="error">'),s=a._triageMustache.call(e,"message",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</div>\n"),n}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var f,c,p,d="",m=a.helperMissing,b=this.escapeExpression,g=this;return f=a["with"].call(t,"spot",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(1,i,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n\n"),c=a["link-to"]||t&&t["link-to"],p={hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(4,u,r),contexts:[t],types:["STRING"],data:r},f=c?c.call(t,"image.new",p):m.call(t,"link-to","image.new",p),(f||0===f)&&r.buffer.push(f),r.buffer.push('\n\n<ul class="image-picker">\n  '),f=a.each.call(t,"images",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(6,l,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n</ul>\n\n"),f=a.each.call(t,"spot.errors.images",{hash:{},hashTypes:{},hashContexts:{},inverse:g.noop,fn:g.program(8,h,r),contexts:[t],types:["ID"],data:r}),(f||0===f)&&r.buffer.push(f),r.buffer.push("\n"),d})}),define("chief/templates/spots",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,a,n,r){function i(e,t){var s,n,r="";return t.buffer.push('\n      <li class="spot">\n        '),t.buffer.push(h((s=a.render||e&&e.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t},s?s.call(e,"spot","",n):l.call(e,"render","spot","",n)))),t.buffer.push("\n      </li>\n    "),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,s.Handlebars.helpers),r=r||{};var o,u="",l=a.helperMissing,h=this.escapeExpression,f=this;return r.buffer.push('<section class="spots">\n  <ul>\n    '),o=a.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(1,i,r),contexts:[],types:[],data:r}),(o||0===o)&&r.buffer.push(o),r.buffer.push("\n  </ul>\n</section>\n"),u})}),define("chief/views/image-item",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({classNameBindings:["image","missingLocation:missing-location"],templateName:"image-item"})});