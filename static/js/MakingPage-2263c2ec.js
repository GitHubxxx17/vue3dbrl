import{_ as x,a5 as L,V as P,r as d,i as V,b as S,c as I,d as o,f as W,p as C,h as $,a as B,t as M,w as h,W as y,u as v,U as T,v as D}from"./index-deb0c6b3.js";import{u as F,M as H,U as z}from"./memory-daa8a025.js";const r=a=>(C("data-v-470c0387"),a=a(),$(),a),E={class:"header_left"},R={class:"daoru"},j=r(()=>o("span",{class:"icon iconfont icon-daoru"},null,-1)),A=r(()=>o("div",{class:"name"},"导入",-1)),q=r(()=>o("span",{class:"shuxian"},"|",-1)),G={class:"kuohao"},J=r(()=>o("span",{class:"icon iconfont icon-gongxiangtubiaozhuangtaileicaozuolei37"},null,-1)),K=r(()=>o("div",{class:"name"},"保存",-1)),O=[J,K],Q={__name:"Mkheader",props:["tp"],setup(a){const s=a,l=L(),i=P();let p=d(null).value,c=d(null).value,_=d(null).value,f=d(null).value;const g=()=>{p.offsetLeft==0?(p.style.left=25/3.95+"vw",p.style.backgroundColor="#b6a2f0",c.style.backgroundColor="#8777ae",l.isIdentifyWk=!0):(p.style.left="0px",p.style.backgroundColor="#bfbfbf",c.style.backgroundColor="#b1adbb",l.isIdentifyWk=!1)},m=e=>{e.stopPropagation(),l.tipsIsShow=!l.tipsIsShow},b=e=>{if(e.stopPropagation(),s.tp.modleTitle==""){l.popup2IsShow=!0,l.popup2Cont="标题不能为空";return}for(let t of i.tp)if(s.tp.modleTitle==t.modleTitle){l.popup2IsShow=!0,l.popup2Cont="标题不能重复";return}s.tp.label=="标签"?(l.popup2IsShow=!0,l.popup2Cont="标签不能为空"):l.popupisShow=!0};V(()=>l.tipsIsShow,(e,t)=>{e&&(_.style.transform="scale(1)"),t&&(_.style.transform="scale(0)")});const w=async e=>{let t=e.target.files[0];if(console.log(t),e.target.files.length!=0){l.isLoading=!0;let n=new FormData(f),k=await F(n);if(console.log(k),k.data.msg.code==200){l.isLoading=!1;let U=k.data.msg.data.context.replaceAll(`
`,"<br>");s.tp.context=U,s.tp.modleTitle=t.name,e.target.value="",l.popup2IsShow=!0,l.popup2Cont="文件解析成功"}}};return(e,t)=>(S(),I("header",null,[o("div",E,[o("div",R,[j,A,o("form",{class:"upload_form",ref_key:"upload_form",ref:f},[o("input",{type:"file",accept:"application/msword, application/pdf ",name:"upLoadFile",onChange:t[0]||(t[0]=n=>w(n))},null,32)],512)]),q,o("div",G,[o("div",{class:"switch",ref_key:"switchRef",ref:c,onClick:g},[o("div",{class:"ball",ref_key:"ball",ref:p},null,512)],512),W("   "),o("span",{onClick:t[1]||(t[1]=n=>m(n)),class:"iconfont icon-tuoyuankaobei"})]),o("div",{class:"tips",ref_key:"tips",ref:_},"打开开关即可自动识别括号挖空",512)]),o("div",{class:"header_right",onClick:t[2]||(t[2]=n=>b(n))},O)]))}},X=x(Q,[["__scopeId","data-v-470c0387"]]);const Y={},N=a=>(C("data-v-662cc238"),a=a(),$(),a),Z={class:"loading"},oo=N(()=>o("div",{class:"spinner"},null,-1)),to=N(()=>o("div",{class:"text"},"上传文件中",-1)),eo=[oo,to];function so(a,s){return S(),I("div",Z,eo)}const lo=x(Y,[["render",so],["__scopeId","data-v-662cc238"]]);const u=a=>(C("data-v-91e14cbc"),a=a(),$(),a),no={class:"popup"},ao={class:"popup2 modify_succani2"},io={class:"popup_box"},po={class:"container"},co={class:"title"},_o={class:"label_cont"},ro=u(()=>o("span",{class:"icon iconfont icon-xiangxiajiantou"},null,-1)),uo=u(()=>o("div",{class:"triangle"},null,-1)),fo=u(()=>o("li",null,"考研",-1)),ho=u(()=>o("li",null,"教资",-1)),vo=u(()=>o("li",null,"通识课",-1)),go=[fo,ho,vo],mo={__name:"MakingPage",setup(a){const s=L(),l=P(),i=B({context:"",modleTitle:"",label:"标签"});let p=d(null).value,c=d(null).value;s.popup2IsShow=!1,s.popupisShow=!1,s.tipsIsShow=!1;const _=()=>{c.style.transform="scale(0)",s.tipsIsShow=!1,s.popupisShow=!1,s.popup2IsShow=!1},f=e=>{e.stopPropagation()},g=e=>{e.stopPropagation(),c.style.transform="scale(1)"},m=e=>{e.stopPropagation(),e.target.tagName=="LI"&&(i.label=e.target.innerHTML,c.style.transform="scale(0)")};V(()=>i.context,()=>{p.innerHTML=i.context});async function b(){let e=await H(p.innerHTML,i.modleTitle,0,l.switchLabel(!1,i.label));console.log(e),e.data.msg.code==200&&(l.getTp(z),s.popup2IsShow=!0,s.popup2Cont="保存成功",s.popupisShow=!1)}const w=()=>{};return(e,t)=>(S(),I("div",{class:"Making_page",onClick:_},[M(X,{tp:i},null,8,["tp"]),h(M(lo,null,null,512),[[y,v(s).isLoading]]),h(o("div",no,[o("div",{class:"popup_box",onClick:t[1]||(t[1]=n=>f(n))},[o("button",{onClick:b},"直接保存"),o("button",{onClick:t[0]||(t[0]=n=>w())},"进入编辑")])],512),[[y,v(s).popupisShow]]),h(o("div",ao,[o("div",io,T(v(s).popup2Cont),1)],512),[[y,v(s).popup2IsShow]]),o("div",po,[o("div",co,[o("div",{class:"label",onClick:t[3]||(t[3]=n=>g(n))},[o("div",_o,[o("span",null,T(i.label),1),ro]),o("div",{class:"label_menu",ref_key:"label_menu",ref:c},[uo,o("ul",{onClick:t[2]||(t[2]=n=>m(n))},go)],512)]),h(o("input",{type:"text","onUpdate:modelValue":t[4]||(t[4]=n=>i.modleTitle=n)},null,512),[[D,i.modleTitle]])]),o("div",{class:"text_box",ref_key:"text_box",ref:p,contenteditable:"true"},null,512)])]))}},ko=x(mo,[["__scopeId","data-v-91e14cbc"]]);export{ko as default};