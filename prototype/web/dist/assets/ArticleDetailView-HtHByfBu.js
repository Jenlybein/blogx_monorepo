import{q as te,s as ie,v as ne,x as a,y,z as b,A as v,d as I,B as W,C as M,D as z,E as oe,G as le,H as A,I as q,J as re,K as se,L as ae,M as V,O as C,P as ce,c as O,u as t,p as me,o as h,w as n,a as i,N as j,b as f,e as S,f as o,m as $,k as r,j as _,Q as g,t as u,R as de,g as k,F as R,h as B,l as L}from"./index-DjK_y70T.js";let E=!1;function ue(){if(te&&window.CSS&&!E&&(E=!0,"registerProperty"in window?.CSS))try{CSS.registerProperty({name:"--n-color-start",syntax:"<color>",inherits:!1,initialValue:"#0000"}),CSS.registerProperty({name:"--n-color-end",syntax:"<color>",inherits:!1,initialValue:"#0000"})}catch{}}function pe(l){const{textColor3:c,infoColor:m,errorColor:p,successColor:e,warningColor:s,textColor1:d,textColor2:x,railColor:w,fontWeightStrong:P,fontSize:N}=l;return Object.assign(Object.assign({},ne),{contentFontSize:N,titleFontWeight:P,circleBorder:`2px solid ${c}`,circleBorderInfo:`2px solid ${m}`,circleBorderError:`2px solid ${p}`,circleBorderSuccess:`2px solid ${e}`,circleBorderWarning:`2px solid ${s}`,iconColor:c,iconColorInfo:m,iconColorError:p,iconColorSuccess:e,iconColorWarning:s,titleTextColor:d,contentTextColor:x,metaTextColor:c,lineColor:w})}const fe={common:ie,self:pe},F=1.25,ge=a("timeline",`
 position: relative;
 width: 100%;
 display: flex;
 flex-direction: column;
 line-height: ${F};
`,[y("horizontal",`
 flex-direction: row;
 `,[b(">",[a("timeline-item",`
 flex-shrink: 0;
 padding-right: 40px;
 `,[y("dashed-line-type",[b(">",[a("timeline-item-timeline",[v("line",`
 background-image: linear-gradient(90deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 10px 1px;
 `)])])]),b(">",[a("timeline-item-content",`
 margin-top: calc(var(--n-icon-size) + 12px);
 `,[b(">",[v("meta",`
 margin-top: 6px;
 margin-bottom: unset;
 `)])]),a("timeline-item-timeline",`
 width: 100%;
 height: calc(var(--n-icon-size) + 12px);
 `,[v("line",`
 left: var(--n-icon-size);
 top: calc(var(--n-icon-size) / 2 - 1px);
 right: 0px;
 width: unset;
 height: 2px;
 `)])])])])]),y("right-placement",[a("timeline-item",[a("timeline-item-content",`
 text-align: right;
 margin-right: calc(var(--n-icon-size) + 12px);
 `),a("timeline-item-timeline",`
 width: var(--n-icon-size);
 right: 0;
 `)])]),y("left-placement",[a("timeline-item",[a("timeline-item-content",`
 margin-left: calc(var(--n-icon-size) + 12px);
 `),a("timeline-item-timeline",`
 left: 0;
 `)])]),a("timeline-item",`
 position: relative;
 `,[b("&:last-child",[a("timeline-item-timeline",[v("line",`
 display: none;
 `)]),a("timeline-item-content",[v("meta",`
 margin-bottom: 0;
 `)])]),a("timeline-item-content",[v("title",`
 margin: var(--n-title-margin);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),v("content",`
 transition: color .3s var(--n-bezier);
 font-size: var(--n-content-font-size);
 color: var(--n-content-text-color);
 `),v("meta",`
 transition: color .3s var(--n-bezier);
 font-size: 12px;
 margin-top: 6px;
 margin-bottom: 20px;
 color: var(--n-meta-text-color);
 `)]),y("dashed-line-type",[a("timeline-item-timeline",[v("line",`
 --n-color-start: var(--n-line-color);
 transition: --n-color-start .3s var(--n-bezier);
 background-color: transparent;
 background-image: linear-gradient(180deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 1px 10px;
 `)])]),a("timeline-item-timeline",`
 width: calc(var(--n-icon-size) + 12px);
 position: absolute;
 top: calc(var(--n-title-font-size) * ${F} / 2 - var(--n-icon-size) / 2);
 height: 100%;
 `,[v("circle",`
 border: var(--n-circle-border);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 border-radius: var(--n-icon-size);
 box-sizing: border-box;
 `),v("icon",`
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 display: flex;
 align-items: center;
 justify-content: center;
 `),v("line",`
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 top: var(--n-icon-size);
 left: calc(var(--n-icon-size) / 2 - 1px);
 bottom: 0px;
 width: 2px;
 background-color: var(--n-line-color);
 `)])])]),ve=Object.assign(Object.assign({},M.props),{horizontal:Boolean,itemPlacement:{type:String,default:"left"},size:{type:String,default:"medium"},iconSize:Number}),D=oe("n-timeline"),ze=I({name:"Timeline",props:ve,setup(l,{slots:c}){const{mergedClsPrefixRef:m}=W(l),p=M("Timeline","-timeline",ge,fe,l,m);return le(D,{props:l,mergedThemeRef:p,mergedClsPrefixRef:m}),()=>{const{value:e}=m;return z("div",{class:[`${e}-timeline`,l.horizontal&&`${e}-timeline--horizontal`,`${e}-timeline--${l.size}-size`,!l.horizontal&&`${e}-timeline--${l.itemPlacement}-placement`]},c)}}}),_e={time:[String,Number],title:String,content:String,color:String,lineType:{type:String,default:"default"},type:{type:String,default:"default"}},T=I({name:"TimelineItem",props:_e,slots:Object,setup(l){const c=re(D);c||se("timeline-item","`n-timeline-item` must be placed inside `n-timeline`."),ue();const{inlineThemeDisabled:m}=W(),p=V(()=>{const{props:{size:s,iconSize:d},mergedThemeRef:x}=c,{type:w}=l,{self:{titleTextColor:P,contentTextColor:N,metaTextColor:H,lineColor:K,titleFontWeight:G,contentFontSize:U,[C("iconSize",s)]:J,[C("titleMargin",s)]:Q,[C("titleFontSize",s)]:X,[C("circleBorder",w)]:Y,[C("iconColor",w)]:Z},common:{cubicBezierEaseInOut:ee}}=x.value;return{"--n-bezier":ee,"--n-circle-border":Y,"--n-icon-color":Z,"--n-content-font-size":U,"--n-content-text-color":N,"--n-line-color":K,"--n-meta-text-color":H,"--n-title-font-size":X,"--n-title-font-weight":G,"--n-title-margin":Q,"--n-title-text-color":P,"--n-icon-size":ce(d)||J}}),e=m?ae("timeline-item",V(()=>{const{props:{size:s,iconSize:d}}=c,{type:x}=l;return`${s[0]}${d||"a"}${x[0]}`}),p,c.props):void 0;return{mergedClsPrefix:c.mergedClsPrefixRef,cssVars:m?void 0:p,themeClass:e?.themeClass,onRender:e?.onRender}},render(){const{mergedClsPrefix:l,color:c,onRender:m,$slots:p}=this;return m?.(),z("div",{class:[`${l}-timeline-item`,this.themeClass,`${l}-timeline-item--${this.type}-type`,`${l}-timeline-item--${this.lineType}-line-type`],style:this.cssVars},z("div",{class:`${l}-timeline-item-timeline`},z("div",{class:`${l}-timeline-item-timeline__line`}),A(p.icon,e=>e?z("div",{class:`${l}-timeline-item-timeline__icon`,style:{color:c}},e):z("div",{class:`${l}-timeline-item-timeline__circle`,style:{borderColor:c}}))),z("div",{class:`${l}-timeline-item-content`},A(p.header,e=>e||this.title?z("div",{class:`${l}-timeline-item-content__title`},e||this.title):null),z("div",{class:`${l}-timeline-item-content__content`},q(p.default,()=>[this.content])),z("div",{class:`${l}-timeline-item-content__meta`},q(p.footer,()=>[this.time]))))}}),he={class:"article-comment-composer"},xe={class:"article-comment-composer__head article-comment-composer__head--simple"},ye={class:"article-comment-composer__body"},be={class:"article-comment-composer__main"},Ce={class:"article-comment-composer__footer"},Se={class:"article-comment-thread"},$e={class:"article-comment-item__main"},ke={class:"article-comment-item__content"},we={class:"article-comment-item__meta"},Te={class:"muted"},Pe={class:"article-comment-item__text"},Ne={key:0,class:"article-comment-replies"},Re={class:"article-comment-reply__content"},Be={class:"article-comment-reply__meta"},Ie={class:"muted"},Ae={class:"article-comment-item__text article-comment-item__text--reply"},qe={class:"article-comment-replies__pager"},Ve={class:"muted"},je=I({__name:"ArticleDetailView",setup(l){const c=["接口设计","数据流","分页","鉴权","错误处理"],m=[{author:"River",avatar:"RV",time:"2026-04-09 21:18",content:"这一版把 store 只放跨页面状态说得很清楚，特别适合避免把每个列表都塞进 Pinia 的常见误区。要是能再补一段 route query 和查询状态怎么同步，就更完整了。",likes:18,replies:[{author:"Aster",avatar:"AS",time:"2026-04-09 21:36",content:"这个点很关键，我后面准备把列表筛选和 URL 同步单独拉一段出来，避免页面刷新后状态丢失。",likes:6,highlight:"作者回复"},{author:"Louis",avatar:"LO",time:"2026-04-09 22:04",content:"我也踩过这个坑，尤其是后台列表页，一旦筛选条件不进 URL，协作排查会很痛苦。",likes:3},{author:"Nina",avatar:"NI",time:"2026-04-09 22:18",content:"如果后面补这段，我建议顺手把 query 和分页参数的关系一起讲透，会更完整。",likes:2}]},{author:"Louis",avatar:"LO",time:"2026-04-09 20:47",content:"建议再强调一下 OpenAPI 不完全准确时，为什么不要全量依赖自动生成 runtime client。否则团队会默认 schema 永远可信，最后把错误处理散在页面里。",likes:9,replies:[{author:"River",avatar:"RV",time:"2026-04-09 21:02",content:"同意，尤其是业务失败仍然返回 200 这种接口，前端不自己 unwrap 很容易越写越乱。",likes:4}]}];return(p,e)=>(h(),O(t(me),{cols:24,"x-gap":20,responsive:"screen"},{default:n(()=>[i(t(j),{span:17},{default:n(()=>[i(t(f),{vertical:"",size:20},{default:n(()=>[i(t(S),{size:"large"},{default:n(()=>[e[8]||(e[8]=o("p",{class:"eyebrow"},"Architecture / OpenAPI / Nuxt",-1)),e[9]||(e[9]=o("h2",null,"基于既有 OpenAPI 反向设计前端架构：从页面到数据流的完整思路",-1)),i(t(f),{align:"center"},{default:n(()=>[i(t(f),{size:"small",align:"center"},{default:n(()=>[i(t($),{round:"",size:"small"},{default:n(()=>[...e[0]||(e[0]=[r("AS",-1)])]),_:1}),e[1]||(e[1]=o("strong",null,"Aster",-1))]),_:1}),i(t(_),null,{default:n(()=>[...e[2]||(e[2]=[r("2026-04-08 发布",-1)])]),_:1}),i(t(_),null,{default:n(()=>[...e[3]||(e[3]=[r("22 分钟阅读",-1)])]),_:1}),i(t(_),null,{default:n(()=>[...e[4]||(e[4]=[r("1,284 浏览",-1)])]),_:1})]),_:1}),i(t(f),{class:"section-gap"},{default:n(()=>[i(t(g),{type:"primary"},{default:n(()=>[...e[5]||(e[5]=[r("点赞 286",-1)])]),_:1}),i(t(g),{secondary:""},{default:n(()=>[...e[6]||(e[6]=[r("收藏 123",-1)])]),_:1}),i(t(g),{quaternary:""},{default:n(()=>[...e[7]||(e[7]=[r("分享链接",-1)])]),_:1})]),_:1})]),_:1}),i(t(S),{title:"正文内容",size:"large"},{default:n(()=>[i(t(f),{vertical:"",size:18},{default:n(()=>[...e[10]||(e[10]=[o("p",null,"当后端接口已经确定，前端最容易犯的错不是不会做，而是照着接口名直接堆页面，最后导致模块边界混乱、状态散落、页面职责重叠。",-1),o("p",null,"更稳妥的做法是把接口先按业务域归类，再从页面职责反推模块：页面只负责组织组合，业务组件承接交互细节，service 管调用，composable 管查询与副作用，store 只持有跨页面共享状态。",-1),o("div",{class:"fake-code"},"packages/ api-contract/ api-client/ apps/ web/ admin/ packages/shared/ constants/ ui/",-1),o("p",null,"在这套结构里，文章列表和日志列表虽然都具备分页筛选，但不建议直接抽成“万能列表页面”，而应该抽成复用查询模型与基础表格外壳。",-1)])]),_:1})]),_:1}),i(t(S),{title:"评论区",size:"large"},{default:n(()=>[o("div",he,[o("div",xe,[i(t(_),{round:""},{default:n(()=>[r(u(m.length+4)+" 条评论",1)]),_:1})]),o("div",ye,[i(t($),{round:"",size:"large"},{default:n(()=>[...e[11]||(e[11]=[r("ME",-1)])]),_:1}),o("div",be,[i(t(de),{type:"textarea",placeholder:"写下你对这篇文章的看法，也可以补充你的项目实践。",autosize:{minRows:4,maxRows:6}}),o("div",Ce,[i(t(f),{size:"small"},{default:n(()=>[(h(),k(R,null,B(c,s=>i(t(_),{key:s,round:"",size:"small"},{default:n(()=>[r(u(s),1)]),_:2},1024)),64))]),_:1}),i(t(f),null,{default:n(()=>[i(t(g),{quaternary:""},{default:n(()=>[...e[12]||(e[12]=[r("取消",-1)])]),_:1}),i(t(g),{type:"primary"},{default:n(()=>[...e[13]||(e[13]=[r("发表评论",-1)])]),_:1})]),_:1})])])])]),o("div",Se,[(h(),k(R,null,B(m,s=>o("div",{key:`${s.author}-${s.time}`,class:"article-comment-item"},[o("div",$e,[i(t($),{round:"",size:"large"},{default:n(()=>[r(u(s.avatar),1)]),_:2},1024),o("div",ke,[o("div",we,[o("strong",null,u(s.author),1),o("span",Te,u(s.time),1)]),o("p",Pe,u(s.content),1),i(t(f),{size:"small"},{default:n(()=>[i(t(g),{quaternary:"",size:"small"},{default:n(()=>[r("点赞 "+u(s.likes),1)]),_:2},1024),i(t(g),{quaternary:"",size:"small"},{default:n(()=>[...e[14]||(e[14]=[r("回复",-1)])]),_:1})]),_:2},1024)])]),s.replies.length?(h(),k("div",Ne,[(h(!0),k(R,null,B(s.replies,d=>(h(),k("div",{key:`${d.author}-${d.time}`,class:"article-comment-reply"},[i(t($),{round:"",size:"small"},{default:n(()=>[r(u(d.avatar),1)]),_:2},1024),o("div",Re,[o("div",Be,[o("strong",null,u(d.author),1),d.highlight?(h(),O(t(_),{key:0,size:"small",round:"",type:"success"},{default:n(()=>[r(u(d.highlight),1)]),_:2},1024)):L("",!0),o("span",Ie,u(d.time),1)]),o("p",Ae,u(d.content),1),i(t(f),{size:"small"},{default:n(()=>[i(t(g),{quaternary:"",size:"tiny"},{default:n(()=>[r("点赞 "+u(d.likes),1)]),_:2},1024),i(t(g),{quaternary:"",size:"tiny"},{default:n(()=>[...e[15]||(e[15]=[r("回复",-1)])]),_:1})]),_:2},1024)])]))),128)),o("div",qe,[i(t(g),{quaternary:"",size:"tiny",circle:""},{default:n(()=>[...e[16]||(e[16]=[r("<",-1)])]),_:1}),o("span",Ve,"2 / "+u(s.replies.length)+" 条回复",1),i(t(g),{quaternary:"",size:"tiny",circle:""},{default:n(()=>[...e[17]||(e[17]=[r(">",-1)])]),_:1})])])):L("",!0)])),64))])]),_:1})]),_:1})]),_:1}),i(t(j),{span:7},{default:n(()=>[i(t(f),{vertical:"",size:20},{default:n(()=>[i(t(S),{title:"作者信息"},{default:n(()=>[i(t(f),{align:"center"},{default:n(()=>[i(t($),{round:"",size:"large"},{default:n(()=>[...e[18]||(e[18]=[r("AS",-1)])]),_:1}),e[19]||(e[19]=o("strong",null,"Aster",-1))]),_:1}),e[24]||(e[24]=o("p",{class:"muted"},"前端架构师，关注 API 驱动设计、文档体验、复杂后台的结构整理。",-1)),i(t(f),null,{default:n(()=>[i(t(_),null,{default:n(()=>[...e[20]||(e[20]=[r("124 篇文章",-1)])]),_:1}),i(t(_),null,{default:n(()=>[...e[21]||(e[21]=[r("8.2k 粉丝",-1)])]),_:1})]),_:1}),i(t(f),{class:"section-gap"},{default:n(()=>[i(t(g),{secondary:""},{default:n(()=>[...e[22]||(e[22]=[r("关注作者",-1)])]),_:1}),i(t(g),{quaternary:""},{default:n(()=>[...e[23]||(e[23]=[r("查看主页",-1)])]),_:1})]),_:1})]),_:1}),i(t(S),{title:"目录"},{default:n(()=>[i(t(ze),null,{default:n(()=>[i(t(T),{content:"1. 为什么要反推页面结构"}),i(t(T),{content:"2. 页面、组件、数据流三层关系"}),i(t(T),{content:"3. API 调用层的分层策略"}),i(t(T),{content:"4. 鉴权、刷新、错误处理"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}});export{je as default};
