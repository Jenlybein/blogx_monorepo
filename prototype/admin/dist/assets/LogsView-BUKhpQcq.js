import{d as K,h as d,T as Rt,U as zt,V as B,W as _e,X as $t,Y as oe,Z as _t,_ as Pt,i as Ie,t as Wt,$ as kt,M as Et,a0 as Lt,a1 as At,a2 as Bt,x as Q,a3 as jt,k as r,a4 as i,a5 as x,l as _,a6 as It,a7 as de,r as Pe,a8 as ce,n as Nt,p as Ne,a9 as Ot,aa as Ht,A as be,D as Ft,ab as Mt,C as Dt,v as Vt,ac as We,ad as Xt,ae as Gt,af as Ut,ag as qt,ah as Yt,G as fe,ai as O,aj as ae,ak as Kt,al as H,am as re,I as Jt,w as A,f as h,N as Qt,o as Zt,e as m,j as ue,Q as ea}from"./index-Da9HaGbN.js";import{N as ke,a as Y}from"./Grid-DFGK7F5a.js";import{N as ne}from"./Input-D9N2pUrY.js";import{N as ta}from"./DataTable-B1H-VRw3.js";import{N as aa,a as pe}from"./TimelineItem-sMPxSxI1.js";import"./Checkbox-DssLF59G.js";import"./Select-B9xZ65PP.js";const ra=_e(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[_e("&::-webkit-scrollbar",{width:0,height:0})]),na=K({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=B(null);function n(c){!(c.currentTarget.offsetWidth<c.currentTarget.scrollWidth)||c.deltaY===0||(c.currentTarget.scrollLeft+=c.deltaY+c.deltaX,c.preventDefault())}const s=Rt();return ra.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:zt,ssr:s}),Object.assign({selfRef:e,handleWheel:n},{scrollTo(...c){var y;(y=e.value)===null||y===void 0||y.scrollTo(...c)}})},render(){return d("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var oa=/\s/;function ia(e){for(var n=e.length;n--&&oa.test(e.charAt(n)););return n}var sa=/^\s+/;function la(e){return e&&e.slice(0,ia(e)+1).replace(sa,"")}var Ee=NaN,da=/^[-+]0x[0-9a-f]+$/i,ca=/^0b[01]+$/i,ba=/^0o[0-7]+$/i,fa=parseInt;function Le(e){if(typeof e=="number")return e;if($t(e))return Ee;if(oe(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=oe(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=la(e);var s=ca.test(e);return s||ba.test(e)?fa(e.slice(2),s?2:8):da.test(e)?Ee:+e}var ve=function(){return _t.Date.now()},ua="Expected a function",pa=Math.max,va=Math.min;function ha(e,n,s){var f,c,y,v,u,g,w=0,S=!1,$=!1,L=!0;if(typeof e!="function")throw new TypeError(ua);n=Le(n)||0,oe(s)&&(S=!!s.leading,$="maxWait"in s,y=$?pa(Le(s.maxWait)||0,n):y,L="trailing"in s?!!s.trailing:L);function R(l){var E=f,D=c;return f=c=void 0,w=l,v=e.apply(D,E),v}function T(l){return w=l,u=setTimeout(k,n),S?R(l):v}function z(l){var E=l-g,D=l-w,V=n-E;return $?va(V,y-D):V}function W(l){var E=l-g,D=l-w;return g===void 0||E>=n||E<0||$&&D>=y}function k(){var l=ve();if(W(l))return P(l);u=setTimeout(k,z(l))}function P(l){return u=void 0,L&&f?R(l):(f=c=void 0,v)}function F(){u!==void 0&&clearTimeout(u),w=0,f=g=c=u=void 0}function N(){return u===void 0?v:P(ve())}function p(){var l=ve(),E=W(l);if(f=arguments,c=this,g=l,E){if(u===void 0)return T(g);if($)return clearTimeout(u),u=setTimeout(k,n),R(g)}return u===void 0&&(u=setTimeout(k,n)),v}return p.cancel=F,p.flush=N,p}var ga="Expected a function";function ma(e,n,s){var f=!0,c=!0;if(typeof e!="function")throw new TypeError(ga);return oe(s)&&(f="leading"in s?!!s.leading:f,c="trailing"in s?!!s.trailing:c),ha(e,n,{leading:f,maxWait:n,trailing:c})}const xa=K({name:"Add",render(){return d("svg",{width:"512",height:"512",viewBox:"0 0 512 512",fill:"none",xmlns:"http://www.w3.org/2000/svg"},d("path",{d:"M256 112V400M400 256H112",stroke:"currentColor","stroke-width":"32","stroke-linecap":"round","stroke-linejoin":"round"}))}}),ye=Pt("n-tabs"),Oe={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},he=K({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Oe,slots:Object,setup(e){const n=Ie(ye,null);return n||Wt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:n.paneStyleRef,class:n.paneClassRef,mergedClsPrefix:n.mergedClsPrefixRef}},render(){return d("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),ya=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},jt(Oe,["displayDirective"])),xe=K({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:ya,setup(e){const{mergedClsPrefixRef:n,valueRef:s,typeRef:f,closableRef:c,tabStyleRef:y,addTabStyleRef:v,tabClassRef:u,addTabClassRef:g,tabChangeIdRef:w,onBeforeLeaveRef:S,triggerRef:$,handleAdd:L,activateTab:R,handleClose:T}=Ie(ye);return{trigger:$,mergedClosable:Q(()=>{if(e.internalAddable)return!1;const{closable:z}=e;return z===void 0?c.value:z}),style:y,addStyle:v,tabClass:u,addTabClass:g,clsPrefix:n,value:s,type:f,handleClose(z){z.stopPropagation(),!e.disabled&&T(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){L();return}const{name:z}=e,W=++w.id;if(z!==s.value){const{value:k}=S;k?Promise.resolve(k(e.name,s.value)).then(P=>{P&&w.id===W&&R(z)}):R(z)}}}},render(){const{internalAddable:e,clsPrefix:n,name:s,disabled:f,label:c,tab:y,value:v,mergedClosable:u,trigger:g,$slots:{default:w}}=this,S=c??y;return d("div",{class:`${n}-tabs-tab-wrapper`},this.internalLeftPadded?d("div",{class:`${n}-tabs-tab-pad`}):null,d("div",Object.assign({key:s,"data-name":s,"data-disabled":f?!0:void 0},kt({class:[`${n}-tabs-tab`,v===s&&`${n}-tabs-tab--active`,f&&`${n}-tabs-tab--disabled`,u&&`${n}-tabs-tab--closable`,e&&`${n}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:g==="click"?this.activateTab:void 0,onMouseenter:g==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),d("span",{class:`${n}-tabs-tab__label`},e?d(Et,null,d("div",{class:`${n}-tabs-tab__height-placeholder`}," "),d(Lt,{clsPrefix:n},{default:()=>d(xa,null)})):w?w():typeof S=="object"?S:At(S??s)),u&&this.type==="card"?d(Bt,{clsPrefix:n,class:`${n}-tabs-tab__close`,onClick:this.handleClose,disabled:f}):null))}}),wa=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[i("segment-type",[r("tabs-rail",[x("&.transition-disabled",[r("tabs-capsule",`
 transition: none;
 `)])])]),i("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),i("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),i("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),i("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),i("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[i("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),x("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),i("flex",[r("tabs-nav",`
 width: 100%;
 position: relative;
 `,[r("tabs-wrapper",`
 width: 100%;
 `,[r("tabs-tab",`
 margin-right: 0;
 `)])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[_("prefix, suffix",`
 display: flex;
 align-items: center;
 `),_("prefix","padding-right: 16px;"),_("suffix","padding-left: 16px;")]),i("top, bottom",[x(">",[r("tabs-nav",[r("tabs-nav-scroll-wrapper",[x("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),x("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),i("shadow-start",[x("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[x("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])])])]),i("left, right",[r("tabs-nav-scroll-content",`
 flex-direction: column;
 `),x(">",[r("tabs-nav",[r("tabs-nav-scroll-wrapper",[x("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),x("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),i("shadow-start",[x("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[x("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[x("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `)]),x("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[i("disabled",{cursor:"not-allowed"}),_("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),_("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[x("&.transition-disabled",`
 transition: none;
 `),i("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[x("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),x("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),x("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),x("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),x("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),i("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[x("&:hover",{color:"var(--n-tab-text-color-hover)"}),i("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),i("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[i("line-type",[i("top",[_("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),i("left",[_("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),i("right",[_("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),i("bottom",[_("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),_("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),i("card-type",[_("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[i("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 justify-content: center;
 `,[_("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),It("disabled",[x("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),i("closable","padding-right: 8px;"),i("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),i("disabled","color: var(--n-tab-text-color-disabled);")])]),i("left, right",`
 flex-direction: column; 
 `,[_("prefix, suffix",`
 padding: var(--n-tab-padding-vertical);
 `),r("tabs-wrapper",`
 flex-direction: column;
 `),r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])]),i("top",[i("card-type",[r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);"),_("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),i("left",[i("card-type",[r("tabs-scroll-padding","border-right: 1px solid var(--n-tab-border-color);"),_("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),i("right",[i("card-type",[r("tabs-scroll-padding","border-left: 1px solid var(--n-tab-border-color);"),_("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),i("bottom",[i("card-type",[r("tabs-scroll-padding","border-top: 1px solid var(--n-tab-border-color);"),_("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),ge=ma,Sa=Object.assign(Object.assign({},Ne.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:String,placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Ca=K({name:"Tabs",props:Sa,slots:Object,setup(e,{slots:n}){var s,f,c,y;const{mergedClsPrefixRef:v,inlineThemeDisabled:u,mergedComponentPropsRef:g}=Nt(e),w=Ne("Tabs","-tabs",wa,Ot,e,v),S=B(null),$=B(null),L=B(null),R=B(null),T=B(null),z=B(null),W=B(!0),k=B(!0),P=We(e,["labelSize","size"]),F=Q(()=>{var t,a;if(P.value)return P.value;const o=(a=(t=g?.value)===null||t===void 0?void 0:t.Tabs)===null||a===void 0?void 0:a.size;return o||"medium"}),N=We(e,["activeName","value"]),p=B((f=(s=N.value)!==null&&s!==void 0?s:e.defaultValue)!==null&&f!==void 0?f:n.default?(y=(c=de(n.default())[0])===null||c===void 0?void 0:c.props)===null||y===void 0?void 0:y.name:null),l=Ht(N,p),E={id:0},D=Q(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});be(l,()=>{E.id=0,Z(),Se()});function V(){var t;const{value:a}=l;return a===null?null:(t=S.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${a}"]`)}function He(t){if(e.type==="card")return;const{value:a}=$;if(!a)return;const o=a.style.opacity==="0";if(t){const b=`${v.value}-tabs-bar--disabled`,{barWidth:C,placement:j}=e;if(t.dataset.disabled==="true"?a.classList.add(b):a.classList.remove(b),["top","bottom"].includes(j)){if(we(["top","maxHeight","height"]),typeof C=="number"&&t.offsetWidth>=C){const I=Math.floor((t.offsetWidth-C)/2)+t.offsetLeft;a.style.left=`${I}px`,a.style.maxWidth=`${C}px`}else a.style.left=`${t.offsetLeft}px`,a.style.maxWidth=`${t.offsetWidth}px`;a.style.width="8192px",o&&(a.style.transition="none"),a.offsetWidth,o&&(a.style.transition="",a.style.opacity="1")}else{if(we(["left","maxWidth","width"]),typeof C=="number"&&t.offsetHeight>=C){const I=Math.floor((t.offsetHeight-C)/2)+t.offsetTop;a.style.top=`${I}px`,a.style.maxHeight=`${C}px`}else a.style.top=`${t.offsetTop}px`,a.style.maxHeight=`${t.offsetHeight}px`;a.style.height="8192px",o&&(a.style.transition="none"),a.offsetHeight,o&&(a.style.transition="",a.style.opacity="1")}}}function Fe(){if(e.type==="card")return;const{value:t}=$;t&&(t.style.opacity="0")}function we(t){const{value:a}=$;if(a)for(const o of t)a.style[o]=""}function Z(){if(e.type==="card")return;const t=V();t?He(t):Fe()}function Se(){var t;const a=(t=T.value)===null||t===void 0?void 0:t.$el;if(!a)return;const o=V();if(!o)return;const{scrollLeft:b,offsetWidth:C}=a,{offsetLeft:j,offsetWidth:I}=o;b>j?a.scrollTo({top:0,left:j,behavior:"smooth"}):j+I>b+C&&a.scrollTo({top:0,left:j+I-C,behavior:"smooth"})}const ee=B(null);let ie=0,M=null;function Me(t){const a=ee.value;if(a){ie=t.getBoundingClientRect().height;const o=`${ie}px`,b=()=>{a.style.height=o,a.style.maxHeight=o};M?(b(),M(),M=null):M=b}}function De(t){const a=ee.value;if(a){const o=t.getBoundingClientRect().height,b=()=>{document.body.offsetHeight,a.style.maxHeight=`${o}px`,a.style.height=`${Math.max(ie,o)}px`};M?(M(),M=null,b()):M=b}}function Ve(){const t=ee.value;if(t){t.style.maxHeight="",t.style.height="";const{paneWrapperStyle:a}=e;if(typeof a=="string")t.style.cssText=a;else if(a){const{maxHeight:o,height:b}=a;o!==void 0&&(t.style.maxHeight=o),b!==void 0&&(t.style.height=b)}}}const Ce={value:[]},Te=B("next");function Xe(t){const a=l.value;let o="next";for(const b of Ce.value){if(b===a)break;if(b===t){o="prev";break}}Te.value=o,Ge(t)}function Ge(t){const{onActiveNameChange:a,onUpdateValue:o,"onUpdate:value":b}=e;a&&re(a,t),o&&re(o,t),b&&re(b,t),p.value=t}function Ue(t){const{onClose:a}=e;a&&re(a,t)}function Re(){const{value:t}=$;if(!t)return;const a="transition-disabled";t.classList.add(a),Z(),t.classList.remove(a)}const X=B(null);function se({transitionDisabled:t}){const a=S.value;if(!a)return;t&&a.classList.add("transition-disabled");const o=V();o&&X.value&&(X.value.style.width=`${o.offsetWidth}px`,X.value.style.height=`${o.offsetHeight}px`,X.value.style.transform=`translateX(${o.offsetLeft-Xt(getComputedStyle(a).paddingLeft)}px)`,t&&X.value.offsetWidth),t&&a.classList.remove("transition-disabled")}be([l],()=>{e.type==="segment"&&fe(()=>{se({transitionDisabled:!1})})}),Ft(()=>{e.type==="segment"&&se({transitionDisabled:!0})});let ze=0;function qe(t){var a;if(t.contentRect.width===0&&t.contentRect.height===0||ze===t.contentRect.width)return;ze=t.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&Re(),o!=="segment"){const{placement:b}=e;le((b==="top"||b==="bottom"?(a=T.value)===null||a===void 0?void 0:a.$el:z.value)||null)}}const Ye=ge(qe,64);be([()=>e.justifyContent,()=>e.size],()=>{fe(()=>{const{type:t}=e;(t==="line"||t==="bar")&&Re()})});const G=B(!1);function Ke(t){var a;const{target:o,contentRect:{width:b,height:C}}=t,j=o.parentElement.parentElement.offsetWidth,I=o.parentElement.parentElement.offsetHeight,{placement:q}=e;if(!G.value)q==="top"||q==="bottom"?j<b&&(G.value=!0):I<C&&(G.value=!0);else{const{value:J}=R;if(!J)return;q==="top"||q==="bottom"?j-b>J.$el.offsetWidth&&(G.value=!1):I-C>J.$el.offsetHeight&&(G.value=!1)}le(((a=T.value)===null||a===void 0?void 0:a.$el)||null)}const Je=ge(Ke,64);function Qe(){const{onAdd:t}=e;t&&t(),fe(()=>{const a=V(),{value:o}=T;!a||!o||o.scrollTo({left:a.offsetLeft,top:0,behavior:"smooth"})})}function le(t){if(!t)return;const{placement:a}=e;if(a==="top"||a==="bottom"){const{scrollLeft:o,scrollWidth:b,offsetWidth:C}=t;W.value=o<=0,k.value=o+C>=b}else{const{scrollTop:o,scrollHeight:b,offsetHeight:C}=t;W.value=o<=0,k.value=o+C>=b}}const Ze=ge(t=>{le(t.target)},64);Kt(ye,{triggerRef:H(e,"trigger"),tabStyleRef:H(e,"tabStyle"),tabClassRef:H(e,"tabClass"),addTabStyleRef:H(e,"addTabStyle"),addTabClassRef:H(e,"addTabClass"),paneClassRef:H(e,"paneClass"),paneStyleRef:H(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:H(e,"type"),closableRef:H(e,"closable"),valueRef:l,tabChangeIdRef:E,onBeforeLeaveRef:H(e,"onBeforeLeave"),activateTab:Xe,handleClose:Ue,handleAdd:Qe}),Mt(()=>{Z(),Se()}),Dt(()=>{const{value:t}=L;if(!t)return;const{value:a}=v,o=`${a}-tabs-nav-scroll-wrapper--shadow-start`,b=`${a}-tabs-nav-scroll-wrapper--shadow-end`;W.value?t.classList.remove(o):t.classList.add(o),k.value?t.classList.remove(b):t.classList.add(b)});const et={syncBarPosition:()=>{Z()}},tt=()=>{se({transitionDisabled:!0})},$e=Q(()=>{const{value:t}=F,{type:a}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[a],b=`${t}${o}`,{self:{barColor:C,closeIconColor:j,closeIconColorHover:I,closeIconColorPressed:q,tabColor:J,tabBorderColor:at,paneTextColor:rt,tabFontWeight:nt,tabBorderRadius:ot,tabFontWeightActive:it,colorSegment:st,fontWeightStrong:lt,tabColorSegment:dt,closeSize:ct,closeIconSize:bt,closeColorHover:ft,closeColorPressed:ut,closeBorderRadius:pt,[O("panePadding",t)]:te,[O("tabPadding",b)]:vt,[O("tabPaddingVertical",b)]:ht,[O("tabGap",b)]:gt,[O("tabGap",`${b}Vertical`)]:mt,[O("tabTextColor",a)]:xt,[O("tabTextColorActive",a)]:yt,[O("tabTextColorHover",a)]:wt,[O("tabTextColorDisabled",a)]:St,[O("tabFontSize",t)]:Ct},common:{cubicBezierEaseInOut:Tt}}=w.value;return{"--n-bezier":Tt,"--n-color-segment":st,"--n-bar-color":C,"--n-tab-font-size":Ct,"--n-tab-text-color":xt,"--n-tab-text-color-active":yt,"--n-tab-text-color-disabled":St,"--n-tab-text-color-hover":wt,"--n-pane-text-color":rt,"--n-tab-border-color":at,"--n-tab-border-radius":ot,"--n-close-size":ct,"--n-close-icon-size":bt,"--n-close-color-hover":ft,"--n-close-color-pressed":ut,"--n-close-border-radius":pt,"--n-close-icon-color":j,"--n-close-icon-color-hover":I,"--n-close-icon-color-pressed":q,"--n-tab-color":J,"--n-tab-font-weight":nt,"--n-tab-font-weight-active":it,"--n-tab-padding":vt,"--n-tab-padding-vertical":ht,"--n-tab-gap":gt,"--n-tab-gap-vertical":mt,"--n-pane-padding-left":ae(te,"left"),"--n-pane-padding-right":ae(te,"right"),"--n-pane-padding-top":ae(te,"top"),"--n-pane-padding-bottom":ae(te,"bottom"),"--n-font-weight-strong":lt,"--n-tab-color-segment":dt}}),U=u?Vt("tabs",Q(()=>`${F.value[0]}${e.type[0]}`),$e,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:l,renderedNames:new Set,segmentCapsuleElRef:X,tabsPaneWrapperRef:ee,tabsElRef:S,barElRef:$,addTabInstRef:R,xScrollInstRef:T,scrollWrapperElRef:L,addTabFixed:G,tabWrapperStyle:D,handleNavResize:Ye,mergedSize:F,handleScroll:Ze,handleTabsResize:Je,cssVars:u?void 0:$e,themeClass:U?.themeClass,animationDirection:Te,renderNameListRef:Ce,yScrollElRef:z,handleSegmentResize:tt,onAnimationBeforeLeave:Me,onAnimationEnter:De,onAnimationAfterEnter:Ve,onRender:U?.onRender},et)},render(){const{mergedClsPrefix:e,type:n,placement:s,addTabFixed:f,addable:c,mergedSize:y,renderNameListRef:v,onRender:u,paneWrapperClass:g,paneWrapperStyle:w,$slots:{default:S,prefix:$,suffix:L}}=this;u?.();const R=S?de(S()).filter(p=>p.type.__TAB_PANE__===!0):[],T=S?de(S()).filter(p=>p.type.__TAB__===!0):[],z=!T.length,W=n==="card",k=n==="segment",P=!W&&!k&&this.justifyContent;v.value=[];const F=()=>{const p=d("div",{style:this.tabWrapperStyle,class:`${e}-tabs-wrapper`},P?null:d("div",{class:`${e}-tabs-scroll-padding`,style:s==="top"||s==="bottom"?{width:`${this.tabsPadding}px`}:{height:`${this.tabsPadding}px`}}),z?R.map((l,E)=>(v.value.push(l.props.name),me(d(xe,Object.assign({},l.props,{internalCreatedByPane:!0,internalLeftPadded:E!==0&&(!P||P==="center"||P==="start"||P==="end")}),l.children?{default:l.children.tab}:void 0)))):T.map((l,E)=>(v.value.push(l.props.name),me(E!==0&&!P?je(l):l))),!f&&c&&W?Be(c,(z?R.length:T.length)!==0):null,P?null:d("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return d("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},W&&c?d(ce,{onResize:this.handleTabsResize},{default:()=>p}):p,W?d("div",{class:`${e}-tabs-pad`}):null,W?null:d("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},N=k?"top":s;return d("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${n}-type`,`${e}-tabs--${y}-size`,P&&`${e}-tabs--flex`,`${e}-tabs--${N}`],style:this.cssVars},d("div",{class:[`${e}-tabs-nav--${n}-type`,`${e}-tabs-nav--${N}`,`${e}-tabs-nav`]},Pe($,p=>p&&d("div",{class:`${e}-tabs-nav__prefix`},p)),k?d(ce,{onResize:this.handleSegmentResize},{default:()=>d("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},d("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},d("div",{class:`${e}-tabs-wrapper`},d("div",{class:`${e}-tabs-tab`}))),z?R.map((p,l)=>(v.value.push(p.props.name),d(xe,Object.assign({},p.props,{internalCreatedByPane:!0,internalLeftPadded:l!==0}),p.children?{default:p.children.tab}:void 0))):T.map((p,l)=>(v.value.push(p.props.name),l===0?p:je(p))))}):d(ce,{onResize:this.handleNavResize},{default:()=>d("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(N)?d(na,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:F}):d("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},F()))}),f&&c&&W?Be(c,!0):null,Pe(L,p=>p&&d("div",{class:`${e}-tabs-nav__suffix`},p))),z&&(this.animated&&(N==="top"||N==="bottom")?d("div",{ref:"tabsPaneWrapperRef",style:w,class:[`${e}-tabs-pane-wrapper`,g]},Ae(R,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Ae(R,this.mergedValue,this.renderedNames)))}});function Ae(e,n,s,f,c,y,v){const u=[];return e.forEach(g=>{const{name:w,displayDirective:S,"display-directive":$}=g.props,L=T=>S===T||$===T,R=n===w;if(g.key!==void 0&&(g.key=w),R||L("show")||L("show:lazy")&&s.has(w)){s.has(w)||s.add(w);const T=!L("if");u.push(T?Gt(g,[[Ut,R]]):g)}}),v?d(qt,{name:`${v}-transition`,onBeforeLeave:f,onEnter:c,onAfterEnter:y},{default:()=>u}):u}function Be(e,n){return d(xe,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:n,disabled:typeof e=="object"&&e.disabled})}function je(e){const n=Yt(e);return n.props?n.props.internalLeftPadded=!0:n.props={internalLeftPadded:!0},n}function me(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}const ka=K({__name:"LogsView",setup(e){const n=[{title:"时间",key:"time"},{title:"级别",key:"level",render:f=>d(ea,{type:f.level==="error"?"error":f.level==="warn"?"warning":"success"},{default:()=>f.level})},{title:"请求",key:"request"},{title:"用户",key:"user"},{title:"摘要",key:"summary"}],s=[{time:"10:24:33",level:"error",request:"GET /api/articles",user:"uid: 18",summary:"token refresh failed once, request replay success"},{time:"10:18:12",level:"warn",request:"POST /api/ai/overwrite",user:"uid: 26",summary:"upstream timeout after 12s"},{time:"09:42:05",level:"info",request:"POST /api/users/login",user:"uid: 3",summary:"login success with password"}];return(f,c)=>(Zt(),Jt(h(Qt),{vertical:"",size:20},{default:A(()=>[m(h(ue),{title:"日志类型"},{default:A(()=>[m(h(Ca),{type:"segment"},{default:A(()=>[m(h(he),{name:"runtime",tab:"运行日志"}),m(h(he),{name:"login",tab:"登录日志"}),m(h(he),{name:"action",tab:"审计日志"})]),_:1}),m(h(ke),{class:"section-gap",cols:24,"x-gap":16,responsive:"screen"},{default:A(()=>[m(h(Y),{span:6},{default:A(()=>[m(h(ne),{value:"2026-04-08 00:00:00"})]),_:1}),m(h(Y),{span:6},{default:A(()=>[m(h(ne),{value:"2026-04-08 23:59:59"})]),_:1}),m(h(Y),{span:6},{default:A(()=>[m(h(ne),{value:"api / error"})]),_:1}),m(h(Y),{span:6},{default:A(()=>[m(h(ne),{value:"/api/articles"})]),_:1})]),_:1})]),_:1}),m(h(ke),{cols:24,"x-gap":20,responsive:"screen"},{default:A(()=>[m(h(Y),{span:16},{default:A(()=>[m(h(ue),{title:"日志列表"},{default:A(()=>[m(h(ta),{columns:n,data:s,pagination:!1})]),_:1})]),_:1}),m(h(Y),{span:8},{default:A(()=>[m(h(ue),{title:"日志详情面板"},{default:A(()=>[m(h(aa),null,{default:A(()=>[m(h(pe),{content:"trace_id：7d30ca82f0f249c4a3af12f7"}),m(h(pe),{content:"message：refresh token invalid, request retried after silent logout"}),m(h(pe),{content:'extra_json：{ "path": "/api/articles", "status_code": 200, "biz_code": 1001 }'})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}});export{ka as default};
