import{s as Ce,a8 as Se,a9 as Be,x as te,A as n,aa as se,z as H,y as p,ab as ie,d as ne,ac as L,D as c,H as V,ad as Re,ae as ze,B as Ve,C as ae,af as $e,T as y,ag as Fe,L as Ne,M as U,ah as q,O as $,ai as E,aj as w,a7 as Te,c as oe,w as r,u as i,b as O,o as J,a as l,e as X,f as t,R as D,m as Pe,k as m,Q as F,g as Ae,F as Oe,h as je,j as Y,t as Me}from"./index-Uik7TMz9.js";import{N as le}from"./Select-DIibpKo0.js";import"./VirtualList-C_pAIaOE.js";function Ue(s){const{primaryColor:d,opacityDisabled:v,borderRadius:u,textColor3:b}=s;return Object.assign(Object.assign({},Se),{iconColor:b,textColor:"white",loadingColor:d,opacityDisabled:v,railColor:"rgba(0, 0, 0, .14)",railColorActive:d,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:u,railBorderRadiusMedium:u,railBorderRadiusLarge:u,buttonBorderRadiusSmall:u,buttonBorderRadiusMedium:u,buttonBorderRadiusLarge:u,boxShadowFocus:`0 0 0 2px ${Be(d,{alpha:.2})}`})}const De={common:Ce,self:Ue},Ie=te("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[n("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),n("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),n("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),te("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[se({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),n("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),n("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),n("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),H("&:focus",[n("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),p("round",[n("rail","border-radius: calc(var(--n-rail-height) / 2);",[n("button","border-radius: calc(var(--n-button-height) / 2);")])]),ie("disabled",[ie("icon",[p("rubber-band",[p("pressed",[n("rail",[n("button","max-width: var(--n-button-width-pressed);")])]),n("rail",[H("&:active",[n("button","max-width: var(--n-button-width-pressed);")])]),p("active",[p("pressed",[n("rail",[n("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),n("rail",[H("&:active",[n("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),p("active",[n("rail",[n("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),n("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[n("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[se()]),n("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),p("active",[n("rail","background-color: var(--n-rail-color-active);")]),p("loading",[n("rail",`
 cursor: wait;
 `)]),p("disabled",[n("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Qe=Object.assign(Object.assign({},ae.props),{size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]});let j;const Z=ne({name:"Switch",props:Qe,slots:Object,setup(s){j===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?j=CSS.supports("width","max(1px)"):j=!1:j=!0);const{mergedClsPrefixRef:d,inlineThemeDisabled:v,mergedComponentPropsRef:u}=Ve(s),b=ae("Switch","-switch",Ie,De,s,d),h=$e(s,{mergedSize(o){var k,C;if(s.size!==void 0)return s.size;if(o)return o.mergedSize.value;const z=(C=(k=u?.value)===null||k===void 0?void 0:k.Switch)===null||C===void 0?void 0:C.size;return z||"medium"}}),{mergedSizeRef:x,mergedDisabledRef:g}=h,R=y(s.defaultValue),N=Te(s,"value"),_=Fe(N,R),f=U(()=>_.value===s.checkedValue),e=y(!1),a=y(!1),T=U(()=>{const{railStyle:o}=s;if(o)return o({focused:a.value,checked:f.value})});function M(o){const{"onUpdate:value":k,onChange:C,onUpdateValue:z}=s,{nTriggerFormInput:I,nTriggerFormChange:Q}=h;k&&q(k,o),z&&q(z,o),C&&q(C,o),R.value=o,I(),Q()}function re(){const{nTriggerFormFocus:o}=h;o()}function de(){const{nTriggerFormBlur:o}=h;o()}function ue(){s.loading||g.value||(_.value!==s.checkedValue?M(s.checkedValue):M(s.uncheckedValue))}function ce(){a.value=!0,re()}function ve(){a.value=!1,de(),e.value=!1}function fe(o){s.loading||g.value||o.key===" "&&(_.value!==s.checkedValue?M(s.checkedValue):M(s.uncheckedValue),e.value=!1)}function me(o){s.loading||g.value||o.key===" "&&(o.preventDefault(),e.value=!0)}const ee=U(()=>{const{value:o}=x,{self:{opacityDisabled:k,railColor:C,railColorActive:z,buttonBoxShadow:I,buttonColor:Q,boxShadowFocus:be,loadingColor:he,textColor:ge,iconColor:_e,[$("buttonHeight",o)]:S,[$("buttonWidth",o)]:pe,[$("buttonWidthPressed",o)]:we,[$("railHeight",o)]:B,[$("railWidth",o)]:A,[$("railBorderRadius",o)]:ye,[$("buttonBorderRadius",o)]:xe},common:{cubicBezierEaseInOut:ke}}=b.value;let W,K,G;return j?(W=`calc((${B} - ${S}) / 2)`,K=`max(${B}, ${S})`,G=`max(${A}, calc(${A} + ${S} - ${B}))`):(W=E((w(B)-w(S))/2),K=E(Math.max(w(B),w(S))),G=w(B)>w(S)?A:E(w(A)+w(S)-w(B))),{"--n-bezier":ke,"--n-button-border-radius":xe,"--n-button-box-shadow":I,"--n-button-color":Q,"--n-button-width":pe,"--n-button-width-pressed":we,"--n-button-height":S,"--n-height":K,"--n-offset":W,"--n-opacity-disabled":k,"--n-rail-border-radius":ye,"--n-rail-color":C,"--n-rail-color-active":z,"--n-rail-height":B,"--n-rail-width":A,"--n-width":G,"--n-box-shadow-focus":be,"--n-loading-color":he,"--n-text-color":ge,"--n-icon-color":_e}}),P=v?Ne("switch",U(()=>x.value[0]),ee,s):void 0;return{handleClick:ue,handleBlur:ve,handleFocus:ce,handleKeyup:fe,handleKeydown:me,mergedRailStyle:T,pressed:e,mergedClsPrefix:d,mergedValue:_,checked:f,mergedDisabled:g,cssVars:v?void 0:ee,themeClass:P?.themeClass,onRender:P?.onRender}},render(){const{mergedClsPrefix:s,mergedDisabled:d,checked:v,mergedRailStyle:u,onRender:b,$slots:h}=this;b?.();const{checked:x,unchecked:g,icon:R,"checked-icon":N,"unchecked-icon":_}=h,f=!(L(R)&&L(N)&&L(_));return c("div",{role:"switch","aria-checked":v,class:[`${s}-switch`,this.themeClass,f&&`${s}-switch--icon`,v&&`${s}-switch--active`,d&&`${s}-switch--disabled`,this.round&&`${s}-switch--round`,this.loading&&`${s}-switch--loading`,this.pressed&&`${s}-switch--pressed`,this.rubberBand&&`${s}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},c("div",{class:`${s}-switch__rail`,"aria-hidden":"true",style:u},V(x,e=>V(g,a=>e||a?c("div",{"aria-hidden":!0,class:`${s}-switch__children-placeholder`},c("div",{class:`${s}-switch__rail-placeholder`},c("div",{class:`${s}-switch__button-placeholder`}),e),c("div",{class:`${s}-switch__rail-placeholder`},c("div",{class:`${s}-switch__button-placeholder`}),a)):null)),c("div",{class:`${s}-switch__button`},V(R,e=>V(N,a=>V(_,T=>c(Re,null,{default:()=>this.loading?c(ze,Object.assign({key:"loading",clsPrefix:s,strokeWidth:20},this.spinProps)):this.checked&&(a||e)?c("div",{class:`${s}-switch__button-icon`,key:a?"checked-icon":"icon"},a||e):!this.checked&&(T||e)?c("div",{class:`${s}-switch__button-icon`,key:T?"unchecked-icon":"icon"},T||e):null})))),V(x,e=>e&&c("div",{key:"checked",class:`${s}-switch__checked`},e)),V(g,e=>e&&c("div",{key:"unchecked",class:`${s}-switch__unchecked`},e)))))}}),We={class:"settings-profile-layout"},Ke={class:"settings-form-column"},Ge={class:"settings-form-grid"},He={class:"settings-form-item"},Le={class:"settings-form-item__control"},qe={class:"settings-form-item"},Ee={class:"settings-form-item__control"},Je={class:"settings-form-item"},Xe={class:"settings-form-item__control"},Ye={class:"settings-form-item"},Ze={class:"settings-form-item__control"},et={class:"settings-form-item settings-form-item--textarea"},tt={class:"settings-form-item__control"},st={class:"settings-form-item"},it={class:"settings-form-item__control settings-form-item__control--switch"},ot={class:"settings-form-item"},lt={class:"settings-form-item__control settings-form-item__control--switch"},nt={class:"settings-form-item"},at={class:"settings-form-item__control settings-form-item__control--switch"},rt={class:"settings-avatar-panel"},dt={class:"settings-avatar-panel__preview"},ut={class:"settings-tag-section"},ct={class:"settings-form-item settings-form-item--tags"},vt={class:"settings-form-item__control settings-tags-control"},ft={class:"settings-tag-list"},mt={class:"settings-bind-list"},bt={class:"settings-form-item settings-form-item--bind"},ht={class:"settings-form-item__control"},gt={class:"settings-bind-row"},_t={class:"settings-bind-row__main"},pt={class:"settings-bind-row__line"},wt={class:"settings-form-item settings-form-item--bind"},yt={class:"settings-form-item__control"},xt={class:"settings-bind-row"},kt={class:"settings-bind-row__main"},Ct={class:"settings-bind-row__line"},St={class:"settings-form-item settings-form-item--bind"},Bt={class:"settings-form-item__control"},Rt={class:"settings-bind-row"},zt={class:"settings-footer-actions"},Nt=ne({__name:"SettingsView",setup(s){const d=y(["开发工具","编辑语言","前端","前沿技术","AIGC"]),v=y(null),u=y(2),b=y(!0),h=y(!0),x=y(!1),g=[{label:"默认样式",value:1},{label:"简洁资料卡",value:2},{label:"内容流优先",value:3}],R=[{label:"开发工具",value:"开发工具"},{label:"编辑语言",value:"编辑语言"},{label:"前端",value:"前端"},{label:"前沿技术",value:"前沿技术"},{label:"AIGC",value:"AIGC"},{label:"OpenAPI",value:"OpenAPI"},{label:"Monorepo",value:"Monorepo"},{label:"搜索",value:"搜索"}];function N(f){f&&(d.value.includes(f)||(d.value=[...d.value,f]),v.value=null)}function _(f){d.value=d.value.filter(e=>e!==f)}return(f,e)=>(J(),oe(i(O),{vertical:"",size:20},{default:r(()=>[l(i(X),{class:"settings-profile-panel",title:"基本信息"},{default:r(()=>[t("div",We,[t("div",Ke,[t("div",Ge,[t("div",He,[e[5]||(e[5]=t("label",{class:"settings-form-item__label settings-form-item__label--required"},"用户名",-1)),t("div",Le,[l(i(D),{value:"river",maxlength:"20","show-count":""})])]),t("div",qe,[e[6]||(e[6]=t("label",{class:"settings-form-item__label settings-form-item__label--required"},"昵称",-1)),t("div",Ee,[l(i(D),{value:"River",maxlength:"20","show-count":""})])]),t("div",Je,[e[7]||(e[7]=t("label",{class:"settings-form-item__label"},"站龄",-1)),t("div",Xe,[l(i(D),{value:"已加入 2 年 3 个月",disabled:""})])]),t("div",Ye,[e[8]||(e[8]=t("label",{class:"settings-form-item__label"},"主页样式",-1)),t("div",Ze,[l(i(le),{value:u.value,"onUpdate:value":e[0]||(e[0]=a=>u.value=a),options:g},null,8,["value"])])]),t("div",et,[e[9]||(e[9]=t("label",{class:"settings-form-item__label"},"个人介绍",-1)),t("div",tt,[l(i(D),{type:"textarea",autosize:{minRows:5,maxRows:7},value:"前端架构师，关注 API 驱动设计、可维护性和研发体验。",maxlength:"100","show-count":""})])]),t("div",st,[e[10]||(e[10]=t("label",{class:"settings-form-item__label"},"收藏夹可见",-1)),t("div",it,[l(i(Z),{value:b.value,"onUpdate:value":e[1]||(e[1]=a=>b.value=a)},null,8,["value"])])]),t("div",ot,[e[11]||(e[11]=t("label",{class:"settings-form-item__label"},"关注列表可见",-1)),t("div",lt,[l(i(Z),{value:h.value,"onUpdate:value":e[2]||(e[2]=a=>h.value=a)},null,8,["value"])])]),t("div",nt,[e[12]||(e[12]=t("label",{class:"settings-form-item__label"},"粉丝列表可见",-1)),t("div",at,[l(i(Z),{value:x.value,"onUpdate:value":e[3]||(e[3]=a=>x.value=a)},null,8,["value"])])])])]),t("aside",rt,[t("div",dt,[l(i(Pe),{round:"",size:104},{default:r(()=>[...e[13]||(e[13]=[m("RV",-1)])]),_:1})]),e[15]||(e[15]=t("strong",null,"上传头像",-1)),e[16]||(e[16]=t("span",{class:"muted"},"格式：支持 JPG、PNG、JPEG",-1)),e[17]||(e[17]=t("span",{class:"muted"},"大小：5MB 以内",-1)),l(i(O),{vertical:"",size:10,class:"settings-avatar-panel__actions"},{default:r(()=>[l(i(F),{type:"primary",block:""},{default:r(()=>[...e[14]||(e[14]=[m("上传头像",-1)])]),_:1})]),_:1})])])]),_:1}),l(i(X),{title:"兴趣标签管理"},{default:r(()=>[t("div",ut,[t("div",ct,[e[18]||(e[18]=t("label",{class:"settings-form-item__label settings-form-item__label--required"},"兴趣标签",-1)),t("div",vt,[t("div",ft,[(J(!0),Ae(Oe,null,je(d.value,a=>(J(),oe(i(Y),{key:a,closable:"",onClose:T=>_(a)},{default:r(()=>[m(Me(a),1)]),_:2},1032,["onClose"]))),128))]),l(i(le),{value:v.value,"onUpdate:value":[e[4]||(e[4]=a=>v.value=a),N],class:"settings-tag-select",options:R,placeholder:"请选择兴趣标签"},null,8,["value"])])]),e[19]||(e[19]=t("p",{class:"muted"},"偏好标签会用于首页推荐、搜索召回和个性化内容展示。",-1))])]),_:1}),l(i(X),{title:"绑定信息"},{default:r(()=>[t("div",mt,[t("div",bt,[e[25]||(e[25]=t("label",{class:"settings-form-item__label"},"邮箱",-1)),t("div",ht,[t("div",gt,[t("div",_t,[t("div",pt,[e[21]||(e[21]=t("span",null,"river@blogx.dev",-1)),l(i(Y),{type:"success"},{default:r(()=>[...e[20]||(e[20]=[m("已绑定",-1)])]),_:1})]),e[22]||(e[22]=t("p",{class:"muted"},"用于登录验证、密码找回和重要通知提醒。",-1))]),l(i(O),null,{default:r(()=>[l(i(F),{size:"small",secondary:""},{default:r(()=>[...e[23]||(e[23]=[m("更换邮箱",-1)])]),_:1}),l(i(F),{size:"small",quaternary:""},{default:r(()=>[...e[24]||(e[24]=[m("发送验证邮件",-1)])]),_:1})]),_:1})])])]),t("div",wt,[e[30]||(e[30]=t("label",{class:"settings-form-item__label"},"QQ",-1)),t("div",yt,[t("div",xt,[t("div",kt,[t("div",Ct,[e[27]||(e[27]=t("span",null,"未绑定 QQ 账号",-1)),l(i(Y),null,{default:r(()=>[...e[26]||(e[26]=[m("未绑定",-1)])]),_:1})]),e[28]||(e[28]=t("p",{class:"muted"},"绑定后可直接使用 QQ 登录，并同步第三方头像信息。",-1))]),l(i(O),null,{default:r(()=>[l(i(F),{size:"small",type:"primary"},{default:r(()=>[...e[29]||(e[29]=[m("绑定 QQ",-1)])]),_:1})]),_:1})])])]),t("div",St,[e[33]||(e[33]=t("label",{class:"settings-form-item__label"},"密码",-1)),t("div",Bt,[t("div",Rt,[e[32]||(e[32]=t("div",{class:"settings-bind-row__main"},[t("div",{class:"settings-bind-row__line"},[t("span",null,"已设置登录密码")]),t("p",{class:"muted"},"建议定期更新密码，并避免与其他平台使用相同凭证。")],-1)),l(i(O),null,{default:r(()=>[l(i(F),{size:"small",secondary:""},{default:r(()=>[...e[31]||(e[31]=[m("重置密码",-1)])]),_:1})]),_:1})])])])])]),_:1}),t("div",zt,[l(i(F),{quaternary:""},{default:r(()=>[...e[34]||(e[34]=[m("重置修改",-1)])]),_:1}),l(i(F),{type:"primary"},{default:r(()=>[...e[35]||(e[35]=[m("保存资料",-1)])]),_:1})])]),_:1}))}});export{Nt as default};
