import{q as U,s as X,v as Y,x as r,y as x,z as b,A as c,d as N,B as j,C as L,D as u,E as Z,G as ee,H as _,I as k,J as te,K as ie,L as ne,M as B,O as C,P as oe,c as le,u as t,p as re,o as se,w as n,a as i,N as I,b as d,e as y,f as p,m as $,k as s,j as S,Q as g,i as A}from"./index-Uik7TMz9.js";import{N as ae,a as R}from"./ListItem-BtKWDYCM.js";let O=!1;function me(){if(U&&window.CSS&&!O&&(O=!0,"registerProperty"in window?.CSS))try{CSS.registerProperty({name:"--n-color-start",syntax:"<color>",inherits:!1,initialValue:"#0000"}),CSS.registerProperty({name:"--n-color-end",syntax:"<color>",inherits:!1,initialValue:"#0000"})}catch{}}function ce(o){const{textColor3:a,infoColor:e,errorColor:m,successColor:l,warningColor:f,textColor1:v,textColor2:z,railColor:h,fontWeightStrong:T,fontSize:P}=o;return Object.assign(Object.assign({},Y),{contentFontSize:P,titleFontWeight:T,circleBorder:`2px solid ${a}`,circleBorderInfo:`2px solid ${e}`,circleBorderError:`2px solid ${m}`,circleBorderSuccess:`2px solid ${l}`,circleBorderWarning:`2px solid ${f}`,iconColor:a,iconColorInfo:e,iconColorError:m,iconColorSuccess:l,iconColorWarning:f,titleTextColor:v,contentTextColor:z,metaTextColor:a,lineColor:h})}const de={common:X,self:ce},V=1.25,ue=r("timeline",`
 position: relative;
 width: 100%;
 display: flex;
 flex-direction: column;
 line-height: ${V};
`,[x("horizontal",`
 flex-direction: row;
 `,[b(">",[r("timeline-item",`
 flex-shrink: 0;
 padding-right: 40px;
 `,[x("dashed-line-type",[b(">",[r("timeline-item-timeline",[c("line",`
 background-image: linear-gradient(90deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 10px 1px;
 `)])])]),b(">",[r("timeline-item-content",`
 margin-top: calc(var(--n-icon-size) + 12px);
 `,[b(">",[c("meta",`
 margin-top: 6px;
 margin-bottom: unset;
 `)])]),r("timeline-item-timeline",`
 width: 100%;
 height: calc(var(--n-icon-size) + 12px);
 `,[c("line",`
 left: var(--n-icon-size);
 top: calc(var(--n-icon-size) / 2 - 1px);
 right: 0px;
 width: unset;
 height: 2px;
 `)])])])])]),x("right-placement",[r("timeline-item",[r("timeline-item-content",`
 text-align: right;
 margin-right: calc(var(--n-icon-size) + 12px);
 `),r("timeline-item-timeline",`
 width: var(--n-icon-size);
 right: 0;
 `)])]),x("left-placement",[r("timeline-item",[r("timeline-item-content",`
 margin-left: calc(var(--n-icon-size) + 12px);
 `),r("timeline-item-timeline",`
 left: 0;
 `)])]),r("timeline-item",`
 position: relative;
 `,[b("&:last-child",[r("timeline-item-timeline",[c("line",`
 display: none;
 `)]),r("timeline-item-content",[c("meta",`
 margin-bottom: 0;
 `)])]),r("timeline-item-content",[c("title",`
 margin: var(--n-title-margin);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),c("content",`
 transition: color .3s var(--n-bezier);
 font-size: var(--n-content-font-size);
 color: var(--n-content-text-color);
 `),c("meta",`
 transition: color .3s var(--n-bezier);
 font-size: 12px;
 margin-top: 6px;
 margin-bottom: 20px;
 color: var(--n-meta-text-color);
 `)]),x("dashed-line-type",[r("timeline-item-timeline",[c("line",`
 --n-color-start: var(--n-line-color);
 transition: --n-color-start .3s var(--n-bezier);
 background-color: transparent;
 background-image: linear-gradient(180deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 1px 10px;
 `)])]),r("timeline-item-timeline",`
 width: calc(var(--n-icon-size) + 12px);
 position: absolute;
 top: calc(var(--n-title-font-size) * ${V} / 2 - var(--n-icon-size) / 2);
 height: 100%;
 `,[c("circle",`
 border: var(--n-circle-border);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 border-radius: var(--n-icon-size);
 box-sizing: border-box;
 `),c("icon",`
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 display: flex;
 align-items: center;
 justify-content: center;
 `),c("line",`
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 top: var(--n-icon-size);
 left: calc(var(--n-icon-size) / 2 - 1px);
 bottom: 0px;
 width: 2px;
 background-color: var(--n-line-color);
 `)])])]),fe=Object.assign(Object.assign({},L.props),{horizontal:Boolean,itemPlacement:{type:String,default:"left"},size:{type:String,default:"medium"},iconSize:Number}),E=Z("n-timeline"),pe=N({name:"Timeline",props:fe,setup(o,{slots:a}){const{mergedClsPrefixRef:e}=j(o),m=L("Timeline","-timeline",ue,de,o,e);return ee(E,{props:o,mergedThemeRef:m,mergedClsPrefixRef:e}),()=>{const{value:l}=e;return u("div",{class:[`${l}-timeline`,o.horizontal&&`${l}-timeline--horizontal`,`${l}-timeline--${o.size}-size`,!o.horizontal&&`${l}-timeline--${o.itemPlacement}-placement`]},a)}}}),ge={time:[String,Number],title:String,content:String,color:String,lineType:{type:String,default:"default"},type:{type:String,default:"default"}},w=N({name:"TimelineItem",props:ge,slots:Object,setup(o){const a=te(E);a||ie("timeline-item","`n-timeline-item` must be placed inside `n-timeline`."),me();const{inlineThemeDisabled:e}=j(),m=B(()=>{const{props:{size:f,iconSize:v},mergedThemeRef:z}=a,{type:h}=o,{self:{titleTextColor:T,contentTextColor:P,metaTextColor:F,lineColor:W,titleFontWeight:q,contentFontSize:H,[C("iconSize",f)]:K,[C("titleMargin",f)]:M,[C("titleFontSize",f)]:D,[C("circleBorder",h)]:G,[C("iconColor",h)]:J},common:{cubicBezierEaseInOut:Q}}=z.value;return{"--n-bezier":Q,"--n-circle-border":G,"--n-icon-color":J,"--n-content-font-size":H,"--n-content-text-color":P,"--n-line-color":W,"--n-meta-text-color":F,"--n-title-font-size":D,"--n-title-font-weight":q,"--n-title-margin":M,"--n-title-text-color":T,"--n-icon-size":oe(v)||K}}),l=e?ne("timeline-item",B(()=>{const{props:{size:f,iconSize:v}}=a,{type:z}=o;return`${f[0]}${v||"a"}${z[0]}`}),m,a.props):void 0;return{mergedClsPrefix:a.mergedClsPrefixRef,cssVars:e?void 0:m,themeClass:l?.themeClass,onRender:l?.onRender}},render(){const{mergedClsPrefix:o,color:a,onRender:e,$slots:m}=this;return e?.(),u("div",{class:[`${o}-timeline-item`,this.themeClass,`${o}-timeline-item--${this.type}-type`,`${o}-timeline-item--${this.lineType}-line-type`],style:this.cssVars},u("div",{class:`${o}-timeline-item-timeline`},u("div",{class:`${o}-timeline-item-timeline__line`}),_(m.icon,l=>l?u("div",{class:`${o}-timeline-item-timeline__icon`,style:{color:a}},l):u("div",{class:`${o}-timeline-item-timeline__circle`,style:{borderColor:a}}))),u("div",{class:`${o}-timeline-item-content`},_(m.header,l=>l||this.title?u("div",{class:`${o}-timeline-item-content__title`},l||this.title):null),u("div",{class:`${o}-timeline-item-content__content`},k(m.default,()=>[this.content])),u("div",{class:`${o}-timeline-item-content__meta`},k(m.footer,()=>[this.time]))))}}),xe=N({__name:"ArticleDetailView",setup(o){return(a,e)=>(se(),le(t(re),{cols:24,"x-gap":20,responsive:"screen"},{default:n(()=>[i(t(I),{span:17},{default:n(()=>[i(t(d),{vertical:"",size:20},{default:n(()=>[i(t(y),{size:"large"},{default:n(()=>[e[8]||(e[8]=p("p",{class:"eyebrow"},"Architecture / OpenAPI / Nuxt",-1)),e[9]||(e[9]=p("h2",null,"基于既有 OpenAPI 反向设计前端架构：从页面到数据流的完整思路",-1)),i(t(d),{align:"center"},{default:n(()=>[i(t(d),{size:"small",align:"center"},{default:n(()=>[i(t($),{round:"",size:"small"},{default:n(()=>[...e[0]||(e[0]=[s("AS",-1)])]),_:1}),e[1]||(e[1]=p("strong",null,"Aster",-1))]),_:1}),i(t(S),null,{default:n(()=>[...e[2]||(e[2]=[s("2026-04-08 发布",-1)])]),_:1}),i(t(S),null,{default:n(()=>[...e[3]||(e[3]=[s("22 分钟阅读",-1)])]),_:1}),i(t(S),null,{default:n(()=>[...e[4]||(e[4]=[s("1,284 浏览",-1)])]),_:1})]),_:1}),i(t(d),{class:"section-gap"},{default:n(()=>[i(t(g),{type:"primary"},{default:n(()=>[...e[5]||(e[5]=[s("点赞 286",-1)])]),_:1}),i(t(g),{secondary:""},{default:n(()=>[...e[6]||(e[6]=[s("收藏 123",-1)])]),_:1}),i(t(g),{quaternary:""},{default:n(()=>[...e[7]||(e[7]=[s("分享链接",-1)])]),_:1})]),_:1})]),_:1}),i(t(y),{title:"正文内容",size:"large"},{default:n(()=>[i(t(d),{vertical:"",size:18},{default:n(()=>[...e[10]||(e[10]=[p("p",null,"当后端接口已经确定，前端最容易犯的错不是不会做，而是照着接口名直接堆页面，最后导致模块边界混乱、状态散落、页面职责重叠。",-1),p("p",null,"更稳妥的做法是把接口先按业务域归类，再从页面职责反推模块：页面只负责组织组合，业务组件承接交互细节，service 管调用，composable 管查询与副作用，store 只持有跨页面共享状态。",-1),p("div",{class:"fake-code"},"packages/ api-contract/ api-client/ apps/ web/ admin/ packages/shared/ constants/ ui/",-1),p("p",null,"在这套结构里，文章列表和日志列表虽然都具备分页筛选，但不建议直接抽成“万能列表页面”，而应该抽成复用查询模型与基础表格外壳。",-1)])]),_:1})]),_:1}),i(t(y),{title:"评论区",size:"large"},{default:n(()=>[i(t(ae),null,{default:n(()=>[i(t(R),null,{default:n(()=>[i(t(A),{title:"River",description:"这一版把 store 只放跨页面状态说得很清楚，特别适合避免把每个列表都塞进 Pinia 的常见误区。"},{avatar:n(()=>[i(t($),{round:""},{default:n(()=>[...e[11]||(e[11]=[s("RV",-1)])]),_:1})]),footer:n(()=>[i(t(d),null,{default:n(()=>[i(t(g),{quaternary:"",size:"small"},{default:n(()=>[...e[12]||(e[12]=[s("点赞 18",-1)])]),_:1}),i(t(g),{quaternary:"",size:"small"},{default:n(()=>[...e[13]||(e[13]=[s("回复",-1)])]),_:1})]),_:1})]),_:1})]),_:1}),i(t(R),null,{default:n(()=>[i(t(A),{title:"Louis",description:"建议再强调一下 OpenAPI 不完全准确时，为什么不要全量依赖自动生成 runtime client。"},{avatar:n(()=>[i(t($),{round:""},{default:n(()=>[...e[14]||(e[14]=[s("LO",-1)])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),i(t(I),{span:7},{default:n(()=>[i(t(d),{vertical:"",size:20},{default:n(()=>[i(t(y),{title:"作者信息"},{default:n(()=>[i(t(d),{align:"center"},{default:n(()=>[i(t($),{round:"",size:"large"},{default:n(()=>[...e[15]||(e[15]=[s("AS",-1)])]),_:1}),e[16]||(e[16]=p("strong",null,"Aster",-1))]),_:1}),e[21]||(e[21]=p("p",{class:"muted"},"前端架构师，关注 API 驱动设计、文档体验、复杂后台的结构整理。",-1)),i(t(d),null,{default:n(()=>[i(t(S),null,{default:n(()=>[...e[17]||(e[17]=[s("124 篇文章",-1)])]),_:1}),i(t(S),null,{default:n(()=>[...e[18]||(e[18]=[s("8.2k 粉丝",-1)])]),_:1})]),_:1}),i(t(d),{class:"section-gap"},{default:n(()=>[i(t(g),{secondary:""},{default:n(()=>[...e[19]||(e[19]=[s("关注作者",-1)])]),_:1}),i(t(g),{quaternary:""},{default:n(()=>[...e[20]||(e[20]=[s("查看主页",-1)])]),_:1})]),_:1})]),_:1}),i(t(y),{title:"目录"},{default:n(()=>[i(t(pe),null,{default:n(()=>[i(t(w),{content:"1. 为什么要反推页面结构"}),i(t(w),{content:"2. 页面、组件、数据流三层关系"}),i(t(w),{content:"3. API 调用层的分层策略"}),i(t(w),{content:"4. 鉴权、刷新、错误处理"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}});export{xe as default};
