(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["album"],{2532:function(t,e,a){"use strict";var i=a("23e7"),r=a("5a34"),s=a("1d80"),n=a("ab13");i({target:"String",proto:!0,forced:!n("includes")},{includes:function(t){return!!~String(s(this)).indexOf(r(t),arguments.length>1?arguments[1]:void 0)}})},"44e7":function(t,e,a){var i=a("861d"),r=a("c6b6"),s=a("b622"),n=s("match");t.exports=function(t){var e;return i(t)&&(void 0!==(e=t[n])?!!e:"RegExp"==r(t))}},"5a34":function(t,e,a){var i=a("44e7");t.exports=function(t){if(i(t))throw TypeError("The method doesn't accept regular expressions");return t}},8418:function(t,e,a){"use strict";var i=a("c04e"),r=a("9bf2"),s=a("5c6c");t.exports=function(t,e,a){var n=i(e);n in t?r.f(t,n,s(0,a)):t[n]=a}},a434:function(t,e,a){"use strict";var i=a("23e7"),r=a("23cb"),s=a("a691"),n=a("50c4"),c=a("7b0b"),o=a("65f0"),l=a("8418"),u=a("1dde"),d=a("ae40"),p=u("splice"),m=d("splice",{ACCESSORS:!0,0:0,1:2}),f=Math.max,h=Math.min,b=9007199254740991,g="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!p||!m},{splice:function(t,e){var a,i,u,d,p,m,v=c(this),x=n(v.length),w=r(t,x),_=arguments.length;if(0===_?a=i=0:1===_?(a=0,i=x-w):(a=_-2,i=h(f(s(e),0),x-w)),x+a-i>b)throw TypeError(g);for(u=o(v,i),d=0;d<i;d++)p=w+d,p in v&&l(u,d,v[p]);if(u.length=i,a<i){for(d=w;d<x-i;d++)p=d+i,m=d+a,p in v?v[m]=v[p]:delete v[m];for(d=x;d>x-i+a;d--)delete v[d-1]}else if(a>i)for(d=x-i;d>w;d--)p=d+i-1,m=d+a-1,p in v?v[m]=v[p]:delete v[m];for(d=0;d<a;d++)v[d+w]=arguments[d+2];return v.length=x-i+a,u}})},ab13:function(t,e,a){var i=a("b622"),r=i("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(a){try{return e[r]=!1,"/./"[t](e)}catch(i){}}return!1}},caad:function(t,e,a){"use strict";var i=a("23e7"),r=a("4d64").includes,s=a("44d2"),n=a("ae40"),c=n("indexOf",{ACCESSORS:!0,1:0});i({target:"Array",proto:!0,forced:!c},{includes:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),s("includes")},ee18:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"album"}},[a("b-container",[a("b-row",[a("b-col",{attrs:{cols:"12"}},[a("h1",{staticClass:"text-center"},[t._v("我的相簿")]),a("b-form",{on:{submit:function(e){return e.preventDefault(),t.onSubmit(e)}}},[a("b-form-group",{attrs:{id:"input-group-1",label:"圖片說明","label-for":"input-1",state:t.descState,description:"最多200個字","invalid-feedback":"格式不符"}},[a("b-form-textarea",{attrs:{id:"input-1",type:"text",placeholder:"請輸入相片說明...",state:t.descState},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}})],1),a("img-inputer",{staticClass:"mx-auto",attrs:{placeholder:"請選擇圖片","bottom-text":"點擊或拖曳更換圖片","max-size":1024,exceedSizeText:"檔案大小不能超過",accept:"image/*"},model:{value:t.image,callback:function(e){t.image=e},expression:"image"}}),a("br"),a("br"),a("b-btn",{attrs:{type:"submit",variant:"success"}},[t._v("送出")])],1)],1)],1),a("hr"),a("Photoswipe",[a("b-row",t._l(t.images,(function(e,i){return a("b-col",{key:e._id,attrs:{cols:"12",md:"60",lg:"3"}},[a("b-card",[a("b-card-img",{directives:[{name:"pswp",rawName:"v-pswp",value:e,expression:"image"}],attrs:{src:e.src}}),a("b-card-body",[e.edit?a("b-btn",{attrs:{variant:"danger"},on:{click:function(a){return t.cancel(e)}}},[t._v("取消")]):t._e(),e.edit?a("b-btn",{attrs:{variant:"success"},on:{click:function(a){return t.save(e)}}},[t._v("保存")]):t._e(),e.edit?t._e():a("b-btn",{attrs:{variant:"success"},on:{click:function(a){return t.edit(e)}}},[t._v("編輯")]),e.edit?t._e():a("b-btn",{attrs:{variant:"danger"},on:{click:function(a){return t.del(e,i)}}},[t._v("刪除")]),a("hr"),e.edit?a("b-form-textarea",{model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"image.model"}}):a("b-card-text",{staticStyle:{"white-space":"pre-wrap"}},[t._v(t._s(e.title))])],1)],1)],1)})),1)],1)],1)],1)},r=[],s=(a("a4d3"),a("e01a"),a("caad"),a("d81d"),a("a434"),a("2532"),{name:"Album",data:function(){return{image:null,description:"",images:[]}},computed:{descState:function(){return 0===this.description.length?null:!(this.description.length>200)},albumuser:function(){return this.$store.state.albumuser}},methods:{onSubmit:function(){var t=this;if(this.image.size>1048576)this.$swal({icon:"error",title:"錯誤",text:"圖片太大"});else if(this.image.type.includes("image")){var e=new FormData;e.append("image",this.image),e.append("description",this.description),e.append("count",0),this.axios.post("https://vuealbum123.herokuapp.com/albums/",e).then((function(e){e.data.success?(e.data.result.src="https://vuealbum123.herokuapp.com/albums/file/"+e.data.result.file,e.data.result.title=e.data.result.description,e.data.result.edit=!1,e.data.result.model=e.data.result.description,delete e.data.result.file,delete e.data.result.description,t.images.push(e.data.result),t.image=null,t.description=""):t.$swal({icon:"error",title:"錯誤",text:e.data.message})})).catch((function(e){t.$swal({icon:"error",title:"錯誤",text:e.response.data.message})}))}else this.$swal({icon:"error",title:"錯誤",text:"檔案格式錯誤"})},cancel:function(t){t.edit=!1,t.model=t.title},save:function(t){var e=this;this.axios.patch("https://vuealbum123.herokuapp.com/albums/"+t._id,{description:t.model}).then((function(a){a.data.success?(t.edit=!1,t.title=t.model):e.$swal({icon:"error",title:"錯誤",text:a.data.message})})).catch((function(t){e.$swal({icon:"error",title:"錯誤",text:t.response.data.message})}))},edit:function(t){t.edit=!0,t.model=t.title},del:function(t,e){var a=this;this.axios.delete("https://vuealbum123.herokuapp.com/albums/"+t._id).then((function(t){t.data.success?a.images.splice(e,1):a.$swal({icon:"error",title:"錯誤",text:t.data.message})})).catch((function(t){a.$swal({icon:"error",title:"錯誤",text:t.response.data.message})}))}},mounted:function(){var t=this;this.axios.get("https://vuealbum123.herokuapp.com/albums/user/"+this.albumuser._id).then((function(e){e.data.success?t.images=e.data.result.map((function(t){return t.src="https://vuealbum123.herokuapp.com/albums/file/"+t.file,t.title=t.description,t.edit=!1,t.model=t.description,delete t.file,delete t.description,t})):t.$swal({icon:"error",title:"錯誤",text:e.data.message})})).catch((function(e){t.$swal({icon:"error",title:"錯誤",text:e.response.data.message})}))}}),n=s,c=a("2877"),o=Object(c["a"])(n,i,r,!1,null,null,null);e["default"]=o.exports}}]);
//# sourceMappingURL=album.8e76a605.js.map