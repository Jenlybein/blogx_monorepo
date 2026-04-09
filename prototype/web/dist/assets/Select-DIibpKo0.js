import{ak as tn,al as Ze,am as me,an as vn,d as ae,D as i,x as O,A as z,z as X,ao as hn,B as je,C as ce,ap as qn,aq as gn,L as He,M as S,O as re,ar as Re,J as pn,as as on,at as Je,au as bn,y as U,ab as en,av as mn,H as ln,ae as Zn,aw as Jn,I as Qn,a5 as wn,a7 as j,ax as Xn,T as P,ay as Ie,az as Yn,aA as yn,aj as et,aB as Be,G as rn,aC as nt,aD as tt,aE as ot,j as Qe,aF as an,F as it,$ as lt,aG as rt,aH as at,aI as st,aJ as dt,aK as ut,aL as nn,W as ct,X as ft,aM as sn,aN as vt,ag as dn,af as ht,aO as gt,aP as pt,aQ as bt,aR as mt,ah as te,aS as wt}from"./index-Uik7TMz9.js";import{V as yt}from"./VirtualList-C_pAIaOE.js";function xn(e,r){r&&(tn(()=>{const{value:s}=e;s&&Ze.registerHandler(s,r)}),me(e,(s,d)=>{d&&Ze.unregisterHandler(d)},{deep:!1}),vn(()=>{const{value:s}=e;s&&Ze.unregisterHandler(s)}))}function un(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function Xe(e){const r=e.filter(s=>s!==void 0);if(r.length!==0)return r.length===1?r[0]:s=>{e.forEach(d=>{d&&d(s)})}}const xt=ae({name:"Checkmark",render(){return i("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},i("g",{fill:"none"},i("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Ct=ae({name:"Empty",render(){return i("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),i("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),Ot=ae({props:{onFocus:Function,onBlur:Function},setup(e){return()=>i("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}}),St=O("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[z("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[X("+",[z("description",`
 margin-top: 8px;
 `)])]),z("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),z("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Rt=Object.assign(Object.assign({},ce.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),Ft=ae({name:"Empty",props:Rt,slots:Object,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:s,mergedComponentPropsRef:d}=je(e),v=ce("Empty","-empty",St,qn,e,r),{localeRef:p}=gn("Empty"),f=S(()=>{var x,b,k;return(x=e.description)!==null&&x!==void 0?x:(k=(b=d?.value)===null||b===void 0?void 0:b.Empty)===null||k===void 0?void 0:k.description}),a=S(()=>{var x,b;return((b=(x=d?.value)===null||x===void 0?void 0:x.Empty)===null||b===void 0?void 0:b.renderIcon)||(()=>i(Ct,null))}),I=S(()=>{const{size:x}=e,{common:{cubicBezierEaseInOut:b},self:{[re("iconSize",x)]:k,[re("fontSize",x)]:F,textColor:g,iconColor:_,extraTextColor:V}}=v.value;return{"--n-icon-size":k,"--n-font-size":F,"--n-bezier":b,"--n-text-color":g,"--n-icon-color":_,"--n-extra-text-color":V}}),R=s?He("empty",S(()=>{let x="";const{size:b}=e;return x+=b[0],x}),I,e):void 0;return{mergedClsPrefix:r,mergedRenderIcon:a,localizedDescription:S(()=>f.value||p.value.description),cssVars:s?void 0:I,themeClass:R?.themeClass,onRender:R?.onRender}},render(){const{$slots:e,mergedClsPrefix:r,onRender:s}=this;return s?.(),i("div",{class:[`${r}-empty`,this.themeClass],style:this.cssVars},this.showIcon?i("div",{class:`${r}-empty__icon`},e.icon?e.icon():i(hn,{clsPrefix:r},{default:this.mergedRenderIcon})):null,this.showDescription?i("div",{class:`${r}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?i("div",{class:`${r}-empty__extra`},e.extra()):null)}}),cn=ae({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:r,labelFieldRef:s,nodePropsRef:d}=pn(on);return{labelField:s,nodeProps:d,renderLabel:e,renderOption:r}},render(){const{clsPrefix:e,renderLabel:r,renderOption:s,nodeProps:d,tmNode:{rawNode:v}}=this,p=d?.(v),f=r?r(v,!1):Re(v[this.labelField],v,!1),a=i("div",Object.assign({},p,{class:[`${e}-base-select-group-header`,p?.class]}),f);return v.render?v.render({node:a,option:v}):s?s({node:a,option:v,selected:!1}):a}});function zt(e,r){return i(bn,{name:"fade-in-scale-up-transition"},{default:()=>e?i(hn,{clsPrefix:r,class:`${r}-base-select-option__check`},{default:()=>i(xt)}):null})}const fn=ae({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:r,pendingTmNodeRef:s,multipleRef:d,valueSetRef:v,renderLabelRef:p,renderOptionRef:f,labelFieldRef:a,valueFieldRef:I,showCheckmarkRef:R,nodePropsRef:x,handleOptionClick:b,handleOptionMouseEnter:k}=pn(on),F=Je(()=>{const{value:M}=s;return M?e.tmNode.key===M.key:!1});function g(M){const{tmNode:T}=e;T.disabled||b(M,T)}function _(M){const{tmNode:T}=e;T.disabled||k(M,T)}function V(M){const{tmNode:T}=e,{value:D}=F;T.disabled||D||k(M,T)}return{multiple:d,isGrouped:Je(()=>{const{tmNode:M}=e,{parent:T}=M;return T&&T.rawNode.type==="group"}),showCheckmark:R,nodeProps:x,isPending:F,isSelected:Je(()=>{const{value:M}=r,{value:T}=d;if(M===null)return!1;const D=e.tmNode.rawNode[I.value];if(T){const{value:H}=v;return H.has(D)}else return M===D}),labelField:a,renderLabel:p,renderOption:f,handleMouseMove:V,handleMouseEnter:_,handleClick:g}},render(){const{clsPrefix:e,tmNode:{rawNode:r},isSelected:s,isPending:d,isGrouped:v,showCheckmark:p,nodeProps:f,renderOption:a,renderLabel:I,handleClick:R,handleMouseEnter:x,handleMouseMove:b}=this,k=zt(s,e),F=I?[I(r,s),p&&k]:[Re(r[this.labelField],r,s),p&&k],g=f?.(r),_=i("div",Object.assign({},g,{class:[`${e}-base-select-option`,r.class,g?.class,{[`${e}-base-select-option--disabled`]:r.disabled,[`${e}-base-select-option--selected`]:s,[`${e}-base-select-option--grouped`]:v,[`${e}-base-select-option--pending`]:d,[`${e}-base-select-option--show-checkmark`]:p}],style:[g?.style||"",r.style||""],onClick:Xe([R,g?.onClick]),onMouseenter:Xe([x,g?.onMouseenter]),onMousemove:Xe([b,g?.onMousemove])}),i("div",{class:`${e}-base-select-option__content`},F));return r.render?r.render({node:_,option:r,selected:s}):a?a({node:_,option:r,selected:s}):_}}),Pt=O("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[O("scrollbar",`
 max-height: var(--n-height);
 `),O("virtual-list",`
 max-height: var(--n-height);
 `),O("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[z("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),O("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),O("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),z("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),z("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),z("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),z("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),O("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),O("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[U("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),X("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),X("&:active",`
 color: var(--n-option-text-color-pressed);
 `),U("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),U("pending",[X("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),U("selected",`
 color: var(--n-option-text-color-active);
 `,[X("&::before",`
 background-color: var(--n-option-color-active);
 `),U("pending",[X("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),U("disabled",`
 cursor: not-allowed;
 `,[en("selected",`
 color: var(--n-option-text-color-disabled);
 `),U("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),z("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[mn({enterScale:"0.5"})])])]),Tt=ae({name:"InternalSelectMenu",props:Object.assign(Object.assign({},ce.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,scrollbarProps:Object,onToggle:Function}),setup(e){const{mergedClsPrefixRef:r,mergedRtlRef:s,mergedComponentPropsRef:d}=je(e),v=wn("InternalSelectMenu",s,r),p=ce("InternalSelectMenu","-internal-select-menu",Pt,Xn,e,j(e,"clsPrefix")),f=P(null),a=P(null),I=P(null),R=S(()=>e.treeMate.getFlattenedNodes()),x=S(()=>Yn(R.value)),b=P(null);function k(){const{treeMate:o}=e;let c=null;const{value:$}=e;$===null?c=o.getFirstAvailableNode():(e.multiple?c=o.getNode(($||[])[($||[]).length-1]):c=o.getNode($),(!c||c.disabled)&&(c=o.getFirstAvailableNode())),Y(c||null)}function F(){const{value:o}=b;o&&!e.treeMate.getNode(o.key)&&(b.value=null)}let g;me(()=>e.show,o=>{o?g=me(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?k():F(),yn(ie)):F()},{immediate:!0}):g?.()},{immediate:!0}),vn(()=>{g?.()});const _=S(()=>et(p.value.self[re("optionHeight",e.size)])),V=S(()=>Be(p.value.self[re("padding",e.size)])),M=S(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),T=S(()=>{const o=R.value;return o&&o.length===0}),D=S(()=>{var o,c;return(c=(o=d?.value)===null||o===void 0?void 0:o.Select)===null||c===void 0?void 0:c.renderEmpty});function H(o){const{onToggle:c}=e;c&&c(o)}function E(o){const{onScroll:c}=e;c&&c(o)}function B(o){var c;(c=I.value)===null||c===void 0||c.sync(),E(o)}function oe(){var o;(o=I.value)===null||o===void 0||o.sync()}function q(){const{value:o}=b;return o||null}function fe(o,c){c.disabled||Y(c,!1)}function we(o,c){c.disabled||H(c)}function G(o){var c;Ie(o,"action")||(c=e.onKeyup)===null||c===void 0||c.call(e,o)}function Z(o){var c;Ie(o,"action")||(c=e.onKeydown)===null||c===void 0||c.call(e,o)}function A(o){var c;(c=e.onMousedown)===null||c===void 0||c.call(e,o),!e.focusable&&o.preventDefault()}function ve(){const{value:o}=b;o&&Y(o.getNext({loop:!0}),!0)}function ye(){const{value:o}=b;o&&Y(o.getPrev({loop:!0}),!0)}function Y(o,c=!1){b.value=o,c&&ie()}function ie(){var o,c;const $=b.value;if(!$)return;const ee=x.value($.key);ee!==null&&(e.virtualScroll?(o=a.value)===null||o===void 0||o.scrollTo({index:ee}):(c=I.value)===null||c===void 0||c.scrollTo({index:ee,elSize:_.value}))}function Fe(o){var c,$;!((c=f.value)===null||c===void 0)&&c.contains(o.target)&&(($=e.onFocus)===null||$===void 0||$.call(e,o))}function se(o){var c,$;!((c=f.value)===null||c===void 0)&&c.contains(o.relatedTarget)||($=e.onBlur)===null||$===void 0||$.call(e,o)}rn(on,{handleOptionMouseEnter:fe,handleOptionClick:we,valueSetRef:M,pendingTmNodeRef:b,nodePropsRef:j(e,"nodeProps"),showCheckmarkRef:j(e,"showCheckmark"),multipleRef:j(e,"multiple"),valueRef:j(e,"value"),renderLabelRef:j(e,"renderLabel"),renderOptionRef:j(e,"renderOption"),labelFieldRef:j(e,"labelField"),valueFieldRef:j(e,"valueField")}),rn(nt,f),tn(()=>{const{value:o}=I;o&&o.sync()});const he=S(()=>{const{size:o}=e,{common:{cubicBezierEaseInOut:c},self:{height:$,borderRadius:ee,color:xe,groupHeaderTextColor:le,actionDividerColor:K,optionTextColorPressed:Ce,optionTextColor:de,optionTextColorDisabled:ze,optionTextColorActive:Pe,optionOpacityDisabled:Te,optionCheckColor:pe,actionTextColor:be,optionColorPending:Me,optionColorActive:ke,loadingColor:_e,loadingSize:Oe,optionColorActivePending:Se,[re("optionFontSize",o)]:Q,[re("optionHeight",o)]:t,[re("optionPadding",o)]:u}}=p.value;return{"--n-height":$,"--n-action-divider-color":K,"--n-action-text-color":be,"--n-bezier":c,"--n-border-radius":ee,"--n-color":xe,"--n-option-font-size":Q,"--n-group-header-text-color":le,"--n-option-check-color":pe,"--n-option-color-pending":Me,"--n-option-color-active":ke,"--n-option-color-active-pending":Se,"--n-option-height":t,"--n-option-opacity-disabled":Te,"--n-option-text-color":de,"--n-option-text-color-active":Pe,"--n-option-text-color-disabled":ze,"--n-option-text-color-pressed":Ce,"--n-option-padding":u,"--n-option-padding-left":Be(u,"left"),"--n-option-padding-right":Be(u,"right"),"--n-loading-color":_e,"--n-loading-size":Oe}}),{inlineThemeDisabled:W}=e,J=W?He("internal-select-menu",S(()=>e.size[0]),he,e):void 0,ge={selfRef:f,next:ve,prev:ye,getPendingTmNode:q};return xn(f,e.onResize),Object.assign({mergedTheme:p,mergedClsPrefix:r,rtlEnabled:v,virtualListRef:a,scrollbarRef:I,itemSize:_,padding:V,flattenedNodes:R,empty:T,mergedRenderEmpty:D,virtualListContainer(){const{value:o}=a;return o?.listElRef},virtualListContent(){const{value:o}=a;return o?.itemsElRef},doScroll:E,handleFocusin:Fe,handleFocusout:se,handleKeyUp:G,handleKeyDown:Z,handleMouseDown:A,handleVirtualListResize:oe,handleVirtualListScroll:B,cssVars:W?void 0:he,themeClass:J?.themeClass,onRender:J?.onRender},ge)},render(){const{$slots:e,virtualScroll:r,clsPrefix:s,mergedTheme:d,themeClass:v,onRender:p}=this;return p?.(),i("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${s}-base-select-menu`,`${s}-base-select-menu--${this.size}-size`,this.rtlEnabled&&`${s}-base-select-menu--rtl`,v,this.multiple&&`${s}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},ln(e.header,f=>f&&i("div",{class:`${s}-base-select-menu__header`,"data-header":!0,key:"header"},f)),this.loading?i("div",{class:`${s}-base-select-menu__loading`},i(Zn,{clsPrefix:s,strokeWidth:20})):this.empty?i("div",{class:`${s}-base-select-menu__empty`,"data-empty":!0},Qn(e.empty,()=>{var f;return[((f=this.mergedRenderEmpty)===null||f===void 0?void 0:f.call(this))||i(Ft,{theme:d.peers.Empty,themeOverrides:d.peerOverrides.Empty,size:this.size})]})):i(Jn,Object.assign({ref:"scrollbarRef",theme:d.peers.Scrollbar,themeOverrides:d.peerOverrides.Scrollbar,scrollable:this.scrollable,container:r?this.virtualListContainer:void 0,content:r?this.virtualListContent:void 0,onScroll:r?void 0:this.doScroll},this.scrollbarProps),{default:()=>r?i(yt,{ref:"virtualListRef",class:`${s}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:f})=>f.isGroup?i(cn,{key:f.key,clsPrefix:s,tmNode:f}):f.ignored?null:i(fn,{clsPrefix:s,key:f.key,tmNode:f})}):i("div",{class:`${s}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(f=>f.isGroup?i(cn,{key:f.key,clsPrefix:s,tmNode:f}):i(fn,{clsPrefix:s,key:f.key,tmNode:f})))}),ln(e.action,f=>f&&[i("div",{class:`${s}-base-select-menu__action`,"data-action":!0,key:"action"},f),i(Ot,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),Mt=X([O("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[O("base-loading",`
 color: var(--n-loading-color);
 `),O("base-selection-tags","min-height: var(--n-height);"),z("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),z("state-border",`
 z-index: 1;
 border-color: #0000;
 `),O("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[z("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),O("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[z("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),O("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[z("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),O("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),O("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[O("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[z("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),z("render-label",`
 color: var(--n-text-color);
 `)]),en("disabled",[X("&:hover",[z("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),U("focus",[z("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),U("active",[z("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),O("base-selection-label","background-color: var(--n-color-active);"),O("base-selection-tags","background-color: var(--n-color-active);")])]),U("disabled","cursor: not-allowed;",[z("arrow",`
 color: var(--n-arrow-color-disabled);
 `),O("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[O("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),z("render-label",`
 color: var(--n-text-color-disabled);
 `)]),O("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),O("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),O("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[z("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),z("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>U(`${e}-status`,[z("state-border",`border: var(--n-border-${e});`),en("disabled",[X("&:hover",[z("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),U("active",[z("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),O("base-selection-label",`background-color: var(--n-color-active-${e});`),O("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),U("focus",[z("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),O("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),O("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[X("&:last-child","padding-right: 0;"),O("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[z("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),kt=ae({name:"InternalSelection",props:Object.assign(Object.assign({},ce.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:r,mergedRtlRef:s}=je(e),d=wn("InternalSelection",s,r),v=P(null),p=P(null),f=P(null),a=P(null),I=P(null),R=P(null),x=P(null),b=P(null),k=P(null),F=P(null),g=P(!1),_=P(!1),V=P(!1),M=ce("InternalSelection","-internal-selection",Mt,rt,e,j(e,"clsPrefix")),T=S(()=>e.clearable&&!e.disabled&&(V.value||e.active)),D=S(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Re(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),H=S(()=>{const t=e.selectedOption;if(t)return t[e.labelField]}),E=S(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function B(){var t;const{value:u}=v;if(u){const{value:N}=p;N&&(N.style.width=`${u.offsetWidth}px`,e.maxTagCount!=="responsive"&&((t=k.value)===null||t===void 0||t.sync({showAllItemsBeforeCalculate:!1})))}}function oe(){const{value:t}=F;t&&(t.style.display="none")}function q(){const{value:t}=F;t&&(t.style.display="inline-block")}me(j(e,"active"),t=>{t||oe()}),me(j(e,"pattern"),()=>{e.multiple&&yn(B)});function fe(t){const{onFocus:u}=e;u&&u(t)}function we(t){const{onBlur:u}=e;u&&u(t)}function G(t){const{onDeleteOption:u}=e;u&&u(t)}function Z(t){const{onClear:u}=e;u&&u(t)}function A(t){const{onPatternInput:u}=e;u&&u(t)}function ve(t){var u;(!t.relatedTarget||!(!((u=f.value)===null||u===void 0)&&u.contains(t.relatedTarget)))&&fe(t)}function ye(t){var u;!((u=f.value)===null||u===void 0)&&u.contains(t.relatedTarget)||we(t)}function Y(t){Z(t)}function ie(){V.value=!0}function Fe(){V.value=!1}function se(t){!e.active||!e.filterable||t.target!==p.value&&t.preventDefault()}function he(t){G(t)}const W=P(!1);function J(t){if(t.key==="Backspace"&&!W.value&&!e.pattern.length){const{selectedOptions:u}=e;u?.length&&he(u[u.length-1])}}let ge=null;function o(t){const{value:u}=v;if(u){const N=t.target.value;u.textContent=N,B()}e.ignoreComposition&&W.value?ge=t:A(t)}function c(){W.value=!0}function $(){W.value=!1,e.ignoreComposition&&A(ge),ge=null}function ee(t){var u;_.value=!0,(u=e.onPatternFocus)===null||u===void 0||u.call(e,t)}function xe(t){var u;_.value=!1,(u=e.onPatternBlur)===null||u===void 0||u.call(e,t)}function le(){var t,u;if(e.filterable)_.value=!1,(t=R.value)===null||t===void 0||t.blur(),(u=p.value)===null||u===void 0||u.blur();else if(e.multiple){const{value:N}=a;N?.blur()}else{const{value:N}=I;N?.blur()}}function K(){var t,u,N;e.filterable?(_.value=!1,(t=R.value)===null||t===void 0||t.focus()):e.multiple?(u=a.value)===null||u===void 0||u.focus():(N=I.value)===null||N===void 0||N.focus()}function Ce(){const{value:t}=p;t&&(q(),t.focus())}function de(){const{value:t}=p;t&&t.blur()}function ze(t){const{value:u}=x;u&&u.setTextContent(`+${t}`)}function Pe(){const{value:t}=b;return t}function Te(){return p.value}let pe=null;function be(){pe!==null&&window.clearTimeout(pe)}function Me(){e.active||(be(),pe=window.setTimeout(()=>{E.value&&(g.value=!0)},100))}function ke(){be()}function _e(t){t||(be(),g.value=!1)}me(E,t=>{t||(g.value=!1)}),tn(()=>{at(()=>{const t=R.value;t&&(e.disabled?t.removeAttribute("tabindex"):t.tabIndex=_.value?-1:0)})}),xn(f,e.onResize);const{inlineThemeDisabled:Oe}=e,Se=S(()=>{const{size:t}=e,{common:{cubicBezierEaseInOut:u},self:{fontWeight:N,borderRadius:We,color:Ke,placeholderColor:Ue,textColor:$e,paddingSingle:Ee,paddingMultiple:Ae,caretColor:Ge,colorDisabled:qe,textColorDisabled:Ne,placeholderColorDisabled:ue,colorActive:n,boxShadowFocus:l,boxShadowActive:h,boxShadowHover:y,border:m,borderFocus:w,borderHover:C,borderActive:L,arrowColor:ne,arrowColorDisabled:On,loadingColor:Sn,colorActiveWarning:Rn,boxShadowFocusWarning:Fn,boxShadowActiveWarning:zn,boxShadowHoverWarning:Pn,borderWarning:Tn,borderFocusWarning:Mn,borderHoverWarning:kn,borderActiveWarning:_n,colorActiveError:In,boxShadowFocusError:Bn,boxShadowActiveError:$n,boxShadowHoverError:En,borderError:An,borderFocusError:Nn,borderHoverError:Dn,borderActiveError:Ln,clearColor:Vn,clearColorHover:jn,clearColorPressed:Hn,clearSize:Wn,arrowSize:Kn,[re("height",t)]:Un,[re("fontSize",t)]:Gn}}=M.value,De=Be(Ee),Le=Be(Ae);return{"--n-bezier":u,"--n-border":m,"--n-border-active":L,"--n-border-focus":w,"--n-border-hover":C,"--n-border-radius":We,"--n-box-shadow-active":h,"--n-box-shadow-focus":l,"--n-box-shadow-hover":y,"--n-caret-color":Ge,"--n-color":Ke,"--n-color-active":n,"--n-color-disabled":qe,"--n-font-size":Gn,"--n-height":Un,"--n-padding-single-top":De.top,"--n-padding-multiple-top":Le.top,"--n-padding-single-right":De.right,"--n-padding-multiple-right":Le.right,"--n-padding-single-left":De.left,"--n-padding-multiple-left":Le.left,"--n-padding-single-bottom":De.bottom,"--n-padding-multiple-bottom":Le.bottom,"--n-placeholder-color":Ue,"--n-placeholder-color-disabled":ue,"--n-text-color":$e,"--n-text-color-disabled":Ne,"--n-arrow-color":ne,"--n-arrow-color-disabled":On,"--n-loading-color":Sn,"--n-color-active-warning":Rn,"--n-box-shadow-focus-warning":Fn,"--n-box-shadow-active-warning":zn,"--n-box-shadow-hover-warning":Pn,"--n-border-warning":Tn,"--n-border-focus-warning":Mn,"--n-border-hover-warning":kn,"--n-border-active-warning":_n,"--n-color-active-error":In,"--n-box-shadow-focus-error":Bn,"--n-box-shadow-active-error":$n,"--n-box-shadow-hover-error":En,"--n-border-error":An,"--n-border-focus-error":Nn,"--n-border-hover-error":Dn,"--n-border-active-error":Ln,"--n-clear-size":Wn,"--n-clear-color":Vn,"--n-clear-color-hover":jn,"--n-clear-color-pressed":Hn,"--n-arrow-size":Kn,"--n-font-weight":N}}),Q=Oe?He("internal-selection",S(()=>e.size[0]),Se,e):void 0;return{mergedTheme:M,mergedClearable:T,mergedClsPrefix:r,rtlEnabled:d,patternInputFocused:_,filterablePlaceholder:D,label:H,selected:E,showTagsPanel:g,isComposing:W,counterRef:x,counterWrapperRef:b,patternInputMirrorRef:v,patternInputRef:p,selfRef:f,multipleElRef:a,singleElRef:I,patternInputWrapperRef:R,overflowRef:k,inputTagElRef:F,handleMouseDown:se,handleFocusin:ve,handleClear:Y,handleMouseEnter:ie,handleMouseLeave:Fe,handleDeleteOption:he,handlePatternKeyDown:J,handlePatternInputInput:o,handlePatternInputBlur:xe,handlePatternInputFocus:ee,handleMouseEnterCounter:Me,handleMouseLeaveCounter:ke,handleFocusout:ye,handleCompositionEnd:$,handleCompositionStart:c,onPopoverUpdateShow:_e,focus:K,focusInput:Ce,blur:le,blurInput:de,updateCounter:ze,getCounter:Pe,getTail:Te,renderLabel:e.renderLabel,cssVars:Oe?void 0:Se,themeClass:Q?.themeClass,onRender:Q?.onRender}},render(){const{status:e,multiple:r,size:s,disabled:d,filterable:v,maxTagCount:p,bordered:f,clsPrefix:a,ellipsisTagPopoverProps:I,onRender:R,renderTag:x,renderLabel:b}=this;R?.();const k=p==="responsive",F=typeof p=="number",g=k||F,_=i(tt,null,{default:()=>i(ot,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var M,T;return(T=(M=this.$slots).arrow)===null||T===void 0?void 0:T.call(M)}})});let V;if(r){const{labelField:M}=this,T=A=>i("div",{class:`${a}-base-selection-tag-wrapper`,key:A.value},x?x({option:A,handleClose:()=>{this.handleDeleteOption(A)}}):i(Qe,{size:s,closable:!A.disabled,disabled:d,onClose:()=>{this.handleDeleteOption(A)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>b?b(A,!0):Re(A[M],A,!0)})),D=()=>(F?this.selectedOptions.slice(0,p):this.selectedOptions).map(T),H=v?i("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},i("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:d,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),i("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,E=k?()=>i("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},i(Qe,{size:s,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:d})):void 0;let B;if(F){const A=this.selectedOptions.length-p;A>0&&(B=i("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},i(Qe,{size:s,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:d},{default:()=>`+${A}`})))}const oe=k?v?i(an,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:D,counter:E,tail:()=>H}):i(an,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:D,counter:E}):F&&B?D().concat(B):D(),q=g?()=>i("div",{class:`${a}-base-selection-popover`},k?D():this.selectedOptions.map(T)):void 0,fe=g?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},I):null,G=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?i("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},i("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,Z=v?i("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},oe,k?null:H,_):i("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:d?void 0:0},oe,_);V=i(it,null,g?i(lt,Object.assign({},fe,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>Z,default:q}):Z,G)}else if(v){const M=this.pattern||this.isComposing,T=this.active?!M:!this.selected,D=this.active?!1:this.selected;V=i("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:un(this.label)},i("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:d,disabled:d,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),D?i("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},i("div",{class:`${a}-base-selection-overlay__wrapper`},x?x({option:this.selectedOption,handleClose:()=>{}}):b?b(this.selectedOption,!0):Re(this.label,this.selectedOption,!0))):null,T?i("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},i("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,_)}else V=i("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?i("div",{class:`${a}-base-selection-input`,title:un(this.label),key:"input"},i("div",{class:`${a}-base-selection-input__content`},x?x({option:this.selectedOption,handleClose:()=>{}}):b?b(this.selectedOption,!0):Re(this.label,this.selectedOption,!0))):i("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},i("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),_);return i("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},V,f?i("div",{class:`${a}-base-selection__border`}):null,f?i("div",{class:`${a}-base-selection__state-border`}):null)}});function Ve(e){return e.type==="group"}function Cn(e){return e.type==="ignored"}function Ye(e,r){try{return!!(1+r.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function _t(e,r){return{getIsGroup:Ve,getIgnored:Cn,getKey(d){return Ve(d)?d.name||d.key||"key-required":d[e]},getChildren(d){return d[r]}}}function It(e,r,s,d){if(!r)return e;function v(p){if(!Array.isArray(p))return[];const f=[];for(const a of p)if(Ve(a)){const I=v(a[d]);I.length&&f.push(Object.assign({},a,{[d]:I}))}else{if(Cn(a))continue;r(s,a)&&f.push(a)}return f}return v(e)}function Bt(e,r,s){const d=new Map;return e.forEach(v=>{Ve(v)?v[s].forEach(p=>{d.set(p[r],p)}):d.set(v[r],v)}),d}const $t=X([O("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `),O("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[mn({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),Et=Object.assign(Object.assign({},ce.props),{to:nn.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearCreatedOptionsOnClear:{type:Boolean,default:!0},clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,menuSize:{type:String},filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},scrollbarProps:Object,onChange:[Function,Array],items:Array}),Dt=ae({name:"Select",props:Et,slots:Object,setup(e){const{mergedClsPrefixRef:r,mergedBorderedRef:s,namespaceRef:d,inlineThemeDisabled:v,mergedComponentPropsRef:p}=je(e),f=ce("Select","-select",$t,vt,e,r),a=P(e.defaultValue),I=j(e,"value"),R=dn(I,a),x=P(!1),b=P(""),k=mt(e,["items","options"]),F=P([]),g=P([]),_=S(()=>g.value.concat(F.value).concat(k.value)),V=S(()=>{const{filter:n}=e;if(n)return n;const{labelField:l,valueField:h}=e;return(y,m)=>{if(!m)return!1;const w=m[l];if(typeof w=="string")return Ye(y,w);const C=m[h];return typeof C=="string"?Ye(y,C):typeof C=="number"?Ye(y,String(C)):!1}}),M=S(()=>{if(e.remote)return k.value;{const{value:n}=_,{value:l}=b;return!l.length||!e.filterable?n:It(n,V.value,l,e.childrenField)}}),T=S(()=>{const{valueField:n,childrenField:l}=e,h=_t(n,l);return wt(M.value,h)}),D=S(()=>Bt(_.value,e.valueField,e.childrenField)),H=P(!1),E=dn(j(e,"show"),H),B=P(null),oe=P(null),q=P(null),{localeRef:fe}=gn("Select"),we=S(()=>{var n;return(n=e.placeholder)!==null&&n!==void 0?n:fe.value.placeholder}),G=[],Z=P(new Map),A=S(()=>{const{fallbackOption:n}=e;if(n===void 0){const{labelField:l,valueField:h}=e;return y=>({[l]:String(y),[h]:y})}return n===!1?!1:l=>Object.assign(n(l),{value:l})});function ve(n){const l=e.remote,{value:h}=Z,{value:y}=D,{value:m}=A,w=[];return n.forEach(C=>{if(y.has(C))w.push(y.get(C));else if(l&&h.has(C))w.push(h.get(C));else if(m){const L=m(C);L&&w.push(L)}}),w}const ye=S(()=>{if(e.multiple){const{value:n}=R;return Array.isArray(n)?ve(n):[]}return null}),Y=S(()=>{const{value:n}=R;return!e.multiple&&!Array.isArray(n)?n===null?null:ve([n])[0]||null:null}),ie=ht(e,{mergedSize:n=>{var l,h;const{size:y}=e;if(y)return y;const{mergedSize:m}=n||{};if(m?.value)return m.value;const w=(h=(l=p?.value)===null||l===void 0?void 0:l.Select)===null||h===void 0?void 0:h.size;return w||"medium"}}),{mergedSizeRef:Fe,mergedDisabledRef:se,mergedStatusRef:he}=ie;function W(n,l){const{onChange:h,"onUpdate:value":y,onUpdateValue:m}=e,{nTriggerFormChange:w,nTriggerFormInput:C}=ie;h&&te(h,n,l),m&&te(m,n,l),y&&te(y,n,l),a.value=n,w(),C()}function J(n){const{onBlur:l}=e,{nTriggerFormBlur:h}=ie;l&&te(l,n),h()}function ge(){const{onClear:n}=e;n&&te(n)}function o(n){const{onFocus:l,showOnFocus:h}=e,{nTriggerFormFocus:y}=ie;l&&te(l,n),y(),h&&le()}function c(n){const{onSearch:l}=e;l&&te(l,n)}function $(n){const{onScroll:l}=e;l&&te(l,n)}function ee(){var n;const{remote:l,multiple:h}=e;if(l){const{value:y}=Z;if(h){const{valueField:m}=e;(n=ye.value)===null||n===void 0||n.forEach(w=>{y.set(w[m],w)})}else{const m=Y.value;m&&y.set(m[e.valueField],m)}}}function xe(n){const{onUpdateShow:l,"onUpdate:show":h}=e;l&&te(l,n),h&&te(h,n),H.value=n}function le(){se.value||(xe(!0),H.value=!0,e.filterable&&Ae())}function K(){xe(!1)}function Ce(){b.value="",g.value=G}const de=P(!1);function ze(){e.filterable&&(de.value=!0)}function Pe(){e.filterable&&(de.value=!1,E.value||Ce())}function Te(){se.value||(E.value?e.filterable?Ae():K():le())}function pe(n){var l,h;!((h=(l=q.value)===null||l===void 0?void 0:l.selfRef)===null||h===void 0)&&h.contains(n.relatedTarget)||(x.value=!1,J(n),K())}function be(n){o(n),x.value=!0}function Me(){x.value=!0}function ke(n){var l;!((l=B.value)===null||l===void 0)&&l.$el.contains(n.relatedTarget)||(x.value=!1,J(n),K())}function _e(){var n;(n=B.value)===null||n===void 0||n.focus(),K()}function Oe(n){var l;E.value&&(!((l=B.value)===null||l===void 0)&&l.$el.contains(pt(n))||K())}function Se(n){if(!Array.isArray(n))return[];if(A.value)return Array.from(n);{const{remote:l}=e,{value:h}=D;if(l){const{value:y}=Z;return n.filter(m=>h.has(m)||y.has(m))}else return n.filter(y=>h.has(y))}}function Q(n){t(n.rawNode)}function t(n){if(se.value)return;const{tag:l,remote:h,clearFilterAfterSelect:y,valueField:m}=e;if(l&&!h){const{value:w}=g,C=w[0]||null;if(C){const L=F.value;L.length?L.push(C):F.value=[C],g.value=G}}if(h&&Z.value.set(n[m],n),e.multiple){const w=Se(R.value),C=w.findIndex(L=>L===n[m]);if(~C){if(w.splice(C,1),l&&!h){const L=u(n[m]);~L&&(F.value.splice(L,1),y&&(b.value=""))}}else w.push(n[m]),y&&(b.value="");W(w,ve(w))}else{if(l&&!h){const w=u(n[m]);~w?F.value=[F.value[w]]:F.value=G}Ee(),K(),W(n[m],n)}}function u(n){return F.value.findIndex(h=>h[e.valueField]===n)}function N(n){E.value||le();const{value:l}=n.target;b.value=l;const{tag:h,remote:y}=e;if(c(l),h&&!y){if(!l){g.value=G;return}const{onCreate:m}=e,w=m?m(l):{[e.labelField]:l,[e.valueField]:l},{valueField:C,labelField:L}=e;k.value.some(ne=>ne[C]===w[C]||ne[L]===w[L])||F.value.some(ne=>ne[C]===w[C]||ne[L]===w[L])?g.value=G:g.value=[w]}}function We(n){n.stopPropagation();const{multiple:l,tag:h,remote:y,clearCreatedOptionsOnClear:m}=e;!l&&e.filterable&&K(),h&&!y&&m&&(F.value=G),ge(),l?W([],[]):W(null,null)}function Ke(n){!Ie(n,"action")&&!Ie(n,"empty")&&!Ie(n,"header")&&n.preventDefault()}function Ue(n){$(n)}function $e(n){var l,h,y,m,w;if(!e.keyboard){n.preventDefault();return}switch(n.key){case" ":if(e.filterable)break;n.preventDefault();case"Enter":if(!(!((l=B.value)===null||l===void 0)&&l.isComposing)){if(E.value){const C=(h=q.value)===null||h===void 0?void 0:h.getPendingTmNode();C?Q(C):e.filterable||(K(),Ee())}else if(le(),e.tag&&de.value){const C=g.value[0];if(C){const L=C[e.valueField],{value:ne}=R;e.multiple&&Array.isArray(ne)&&ne.includes(L)||t(C)}}}n.preventDefault();break;case"ArrowUp":if(n.preventDefault(),e.loading)return;E.value&&((y=q.value)===null||y===void 0||y.prev());break;case"ArrowDown":if(n.preventDefault(),e.loading)return;E.value?(m=q.value)===null||m===void 0||m.next():le();break;case"Escape":E.value&&(bt(n),K()),(w=B.value)===null||w===void 0||w.focus();break}}function Ee(){var n;(n=B.value)===null||n===void 0||n.focus()}function Ae(){var n;(n=B.value)===null||n===void 0||n.focusInput()}function Ge(){var n;E.value&&((n=oe.value)===null||n===void 0||n.syncPosition())}ee(),me(j(e,"options"),ee);const qe={focus:()=>{var n;(n=B.value)===null||n===void 0||n.focus()},focusInput:()=>{var n;(n=B.value)===null||n===void 0||n.focusInput()},blur:()=>{var n;(n=B.value)===null||n===void 0||n.blur()},blurInput:()=>{var n;(n=B.value)===null||n===void 0||n.blurInput()}},Ne=S(()=>{const{self:{menuBoxShadow:n}}=f.value;return{"--n-menu-box-shadow":n}}),ue=v?He("select",void 0,Ne,e):void 0;return Object.assign(Object.assign({},qe),{mergedStatus:he,mergedClsPrefix:r,mergedBordered:s,namespace:d,treeMate:T,isMounted:gt(),triggerRef:B,menuRef:q,pattern:b,uncontrolledShow:H,mergedShow:E,adjustedTo:nn(e),uncontrolledValue:a,mergedValue:R,followerRef:oe,localizedPlaceholder:we,selectedOption:Y,selectedOptions:ye,mergedSize:Fe,mergedDisabled:se,focused:x,activeWithoutMenuOpen:de,inlineThemeDisabled:v,onTriggerInputFocus:ze,onTriggerInputBlur:Pe,handleTriggerOrMenuResize:Ge,handleMenuFocus:Me,handleMenuBlur:ke,handleMenuTabOut:_e,handleTriggerClick:Te,handleToggle:Q,handleDeleteOption:t,handlePatternInput:N,handleClear:We,handleTriggerBlur:pe,handleTriggerFocus:be,handleKeydown:$e,handleMenuAfterLeave:Ce,handleMenuClickOutside:Oe,handleMenuScroll:Ue,handleMenuKeydown:$e,handleMenuMousedown:Ke,mergedTheme:f,cssVars:v?void 0:Ne,themeClass:ue?.themeClass,onRender:ue?.onRender})},render(){return i("div",{class:`${this.mergedClsPrefix}-select`},i(st,null,{default:()=>[i(dt,null,{default:()=>i(kt,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,r;return[(r=(e=this.$slots).arrow)===null||r===void 0?void 0:r.call(e)]}})}),i(ut,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===nn.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>i(bn,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,r,s;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),ct(i(Tt,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(r=this.menuProps)===null||r===void 0?void 0:r.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:this.menuSize,renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(s=this.menuProps)===null||s===void 0?void 0:s.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange,scrollbarProps:this.scrollbarProps}),{empty:()=>{var d,v;return[(v=(d=this.$slots).empty)===null||v===void 0?void 0:v.call(d)]},header:()=>{var d,v;return[(v=(d=this.$slots).header)===null||v===void 0?void 0:v.call(d)]},action:()=>{var d,v;return[(v=(d=this.$slots).action)===null||v===void 0?void 0:v.call(d)]}}),this.displayDirective==="show"?[[ft,this.mergedShow],[sn,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[sn,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}});export{Dt as N};
