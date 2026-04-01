import{useState,useRef,useCallback,useEffect,Component}from"react";

var GS=32,HL=150,WT=150,SC=300;
var T={WALL_L:"wall_l",WALL_M:"wall_m",WALL_S:"wall_s",DOOR:"door",FLOOR:"floor",DECO_L:"deco_l",DECO_M:"deco_m",DECO_S:"deco_s",STAIRS:"stairs",HSTAIRS:"half_stairs",WATER:"water",MOVABLE:"movable",LADDER:"ladder",ERASER:"eraser"};
var L={G:0,S:1,E:2};
var EC=[0,1,-1];
var ELB={"0":"기본","1":"+반층","-1":"-반층"};
var ECOL={"0":"#3a3a4a","1":"#4a5a3a","-1":"#3a3a5a"};
var EI={"0":"◻","1":"△◻","-1":"▽◻"};
var EA={"0":"░","1":"▲","-1":"▼"};
var TC={};
TC[T.FLOOR]={l:L.G,label:"바닥",icon:"◻",color:"#3a3a4a",sc:"F"};
TC[T.WATER]={l:L.G,label:"물",icon:"≋",color:"#1a5276",sc:"W"};
TC[T.WALL_L]={l:L.S,label:"벽 大",icon:"▣",color:"#6a6a8e",sc:"1"};
TC[T.WALL_M]={l:L.S,label:"벽 中",icon:"▪",color:"#8b8b9e",sc:"2"};
TC[T.WALL_S]={l:L.S,label:"벽 小",icon:"▫",color:"#ababbe",sc:"3"};
TC[T.DOOR]={l:L.S,label:"문",icon:"🚪",color:"#a0522d",sc:"4"};
TC[T.STAIRS]={l:L.S,label:"계단",icon:"⌗",color:"#2ecc71",sc:"5"};
TC[T.HSTAIRS]={l:L.S,label:"반층계단",icon:"⌗½",color:"#1a8a50",sc:"6"};
TC[T.DECO_L]={l:L.E,label:"데코大",icon:"🗿",color:"#7d6e57",sc:"Q"};
TC[T.DECO_M]={l:L.E,label:"데코中",icon:"🪑",color:"#6e5a3e",sc:"R"};
TC[T.DECO_S]={l:L.E,label:"데코小",icon:"📦",color:"#5a4a30",sc:"V"};
TC[T.MOVABLE]={l:L.E,label:"무버블",icon:"🟧",color:"#c0392b",sc:"M"};
TC[T.LADDER]={l:L.S,label:"사다리",icon:"🪜",color:"#8e44ad",sc:"B"};
var ER={label:"지우개",icon:"✕",color:"#e74c3c",sc:"X"};
var TB={background:"none",border:"1px solid #2a2a3a",color:"#9999aa",cursor:"pointer",borderRadius:6,padding:"8px 14px",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"};

function kf(x,y){return x+","+y;}
function pk(k){var a=k.split(",");return{x:Number(a[0]),y:Number(a[1])};}
function mf(name,w,h,tiles){return{id:Date.now()+"_"+Math.random(),name:name,width:w||20,height:h||15,tiles:tiles||{}};}

function mb(obj){
  function set(x,y,tp,layer,elev){
    var d={type:tp,layer:layer};
    if(elev!==undefined)d.elevation=elev;
    var k=(layer===L.E)?kf(x,y)+",e":kf(x,y);
    obj[k]=d;
  }
  function wH(x1,x2,y){var i;for(i=x1;i<=x2;i++)set(i,y,"wall_l",L.S);}
  function wV(x,y1,y2){var i;for(i=y1;i<=y2;i++)set(x,i,"wall_l",L.S);}
  function fR(x1,y1,x2,y2,e){var i,j;if(e===undefined)e=0;for(j=y1;j<=y2;j++)for(i=x1;i<=x2;i++)set(i,j,"floor",L.G,e);}
  function wR(x1,y1,x2,y2){wH(x1,x2,y1);wH(x1,x2,y2);wV(x1,y1,y2);wV(x2,y1,y2);}
  return{set:set,wH:wH,wV:wV,fR:fR,wR:wR};
}

function genDungeon(){
  var t1={};var b=mb(t1);
  var s=b.set,H=b.wH,V=b.wV,F=b.fR,R=b.wR;
  F(1,1,8,7);R(0,0,9,8);s(9,3,"door",L.S);s(9,4,"door",L.S);s(2,2,"deco_l",L.E);s(7,6,"deco_s",L.E);
  F(10,3,12,4);H(10,12,2);H(10,12,5);
  F(13,1,20,8);R(12,0,21,9);F(17,1,20,5,1);s(16,3,"half_stairs",L.S);s(21,3,"door",L.S);s(21,4,"door",L.S);s(13,2,"deco_m",L.E);s(19,6,"deco_s",L.E);
  F(22,3,24,4);H(22,24,2);H(22,24,5);
  F(25,1,32,8);R(24,0,33,9);s(26,2,"deco_l",L.E);s(31,2,"deco_l",L.E);s(28,5,"deco_m",L.E);s(33,4,"stairs",L.S);
  F(16,9,17,11);V(15,9,11);V(18,9,11);s(16,9,"door",L.S);s(17,9,"door",L.S);
  F(11,12,22,18);R(10,11,23,19);F(11,12,15,16,-1);s(16,14,"half_stairs",L.S);s(10,14,"door",L.S);s(10,15,"door",L.S);s(23,14,"door",L.S);s(23,15,"door",L.S);s(21,13,"deco_l",L.E);s(12,17,"deco_s",L.E);
  F(1,12,9,19);R(0,11,9,20);F(9,14,9,15);
  var wi,wj;for(wj=13;wj<=17;wj++)for(wi=2;wi<=7;wi++)s(wi,wj,"water",L.G);
  s(1,12,"deco_l",L.E);s(8,19,"deco_s",L.E);
  F(24,12,31,18);R(23,11,32,19);F(24,12,28,15,1);s(24,16,"half_stairs",L.S);s(26,13,"deco_l",L.E);s(30,17,"deco_m",L.E);s(32,15,"stairs",L.S);
  var t2={};var b2=mb(t2);
  var s2=b2.set,H2=b2.wH,V2=b2.wV,F2=b2.fR,R2=b2.wR;
  F2(1,1,8,7);R2(0,0,9,8);s2(1,4,"stairs",L.S);s2(9,3,"door",L.S);s2(9,4,"door",L.S);s2(3,2,"deco_s",L.E);s2(7,6,"deco_s",L.E);
  F2(10,3,12,4);H2(10,12,2);H2(10,12,5);
  F2(13,1,24,10);R2(12,0,25,11);F2(19,1,24,6,1);s2(18,3,"half_stairs",L.S);s2(13,2,"deco_l",L.E);s2(23,2,"deco_l",L.E);s2(21,4,"deco_l",L.E);s2(15,7,"deco_m",L.E);s2(22,8,"deco_m",L.E);s2(25,4,"door",L.S);s2(25,5,"door",L.S);
  F2(26,2,32,9);R2(25,1,33,10);s2(26,3,"deco_l",L.E);s2(31,3,"deco_l",L.E);s2(28,7,"deco_m",L.E);s2(33,5,"stairs",L.S);
  F2(1,10,8,16);R2(0,9,9,17);s2(1,13,"stairs",L.S);s2(9,12,"door",L.S);s2(9,13,"door",L.S);s2(2,10,"deco_l",L.E);s2(7,15,"deco_s",L.E);
  return{floors:[mf("B1",34,20,t1),mf("B2",34,18,t2)],levelName:"던전 탐험",stairLinks:[
    {fromFloor:0,fromX:33,fromY:4,toFloor:1,toX:1,toY:4},
    {fromFloor:0,fromX:32,fromY:15,toFloor:1,toX:1,toY:13},
    {fromFloor:1,fromX:1,fromY:4,toFloor:0,toX:33,toY:4},
    {fromFloor:1,fromX:1,fromY:13,toFloor:0,toX:32,toY:15},
  ]};
}

function genSmall(){
  var t1={};var b=mb(t1);
  var s=b.set,H=b.wH,V=b.wV,F=b.fR,R=b.wR;
  F(1,1,6,6);R(0,0,7,7);s(7,3,"door",L.S);s(7,4,"door",L.S);
  s(2,2,"deco_l",L.E);s(2,5,"deco_s",L.E);s(3,4,"movable",L.E);
  t1[kf(4,4)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t1[kf(5,4)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t1[kf(4,5)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t1[kf(5,5)]={type:"ladder",layer:L.S,originX:4,originY:4};
  F(8,3,9,4);H(8,9,2);H(8,9,5);
  F(10,1,17,7);R(9,0,18,8);F(14,1,17,4,1);s(13,2,"half_stairs",L.S);
  s(18,3,"door",L.S);s(18,4,"door",L.S);s(10,2,"deco_m",L.E);s(16,6,"deco_s",L.E);s(15,5,"movable",L.E);
  F(19,3,20,4);H(19,20,2);H(19,20,5);
  F(21,1,26,7);R(20,0,27,8);F(21,3,24,5,-1);s(21,3,"half_stairs",L.S);
  var wi,wj;for(wj=3;wj<=5;wj++)for(wi=22;wi<=24;wi++)s(wi,wj,"water",L.G);
  s(21,1,"deco_l",L.E);s(25,6,"deco_s",L.E);s(27,4,"stairs",L.S);
  var t2={};var b2=mb(t2);
  var s2=b2.set,H2=b2.wH,F2=b2.fR,R2=b2.wR;
  F2(1,1,7,7);R2(0,0,8,8);
  t2[kf(4,4)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t2[kf(5,4)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t2[kf(4,5)]={type:"ladder",layer:L.S,originX:4,originY:4};
  t2[kf(5,5)]={type:"ladder",layer:L.S,originX:4,originY:4};
  s2(1,4,"stairs",L.S);s2(8,3,"door",L.S);s2(8,4,"door",L.S);
  s2(2,2,"deco_s",L.E);s2(6,6,"deco_s",L.E);s2(3,5,"movable",L.E);
  F2(9,3,10,4);H2(9,10,2);H2(9,10,5);
  F2(11,1,20,9);R2(10,0,21,10);F2(16,1,20,5,1);s2(15,3,"half_stairs",L.S);
  s2(11,2,"deco_l",L.E);s2(19,2,"deco_l",L.E);s2(18,3,"deco_l",L.E);
  s2(13,6,"deco_m",L.E);s2(18,7,"deco_m",L.E);s2(12,8,"deco_s",L.E);s2(19,8,"deco_s",L.E);s2(14,5,"movable",L.E);
  return{floors:[mf("S1",28,9,t1),mf("S2",22,11,t2)],levelName:"소형 테스트 던전",stairLinks:[
    {fromFloor:0,fromX:27,fromY:4,toFloor:1,toX:1,toY:4},
    {fromFloor:1,fromX:1,fromY:4,toFloor:0,toX:27,toY:4},
  ]};
}

function genCurved(){
  var t1={};var b=mb(t1);
  var s=b.set,H=b.wH,V=b.wV,F=b.fR,R=b.wR;
  var i,j,ddx,ddy,dd;
  var cx=22,cy=20,r=8;
  for(j=cy-r-1;j<=cy+r+1;j++){
    for(i=cx-r-1;i<=cx+r+1;i++){
      ddx=i-cx;ddy=j-cy;dd=ddx*ddx+ddy*ddy;
      if(dd<=r*r)s(i,j,"floor",L.G,0);
      else if(dd<=(r+1)*(r+1))s(i,j,"wall_l",L.S);
    }
  }
  s(cx,cy,"deco_l",L.E);
  s(cx-4,cy-4,"deco_m",L.E);s(cx+4,cy-4,"deco_m",L.E);
  s(cx-4,cy+4,"deco_s",L.E);s(cx+4,cy+4,"deco_s",L.E);
  F(cx-r-1,cy-1,cx-r-1,cy);s(cx-r-1,cy-1,"door",L.S);s(cx-r-1,cy,"door",L.S);
  F(cx-r-5,cy-1,cx-r-2,cy);H(cx-r-5,cx-r-2,cy-2);H(cx-r-5,cx-r-2,cy+1);V(cx-r-6,cy-2,cy+1);
  var nwx=6,nwy=6;
  F(nwx+1,nwy+1,nwx+7,nwy+7);R(nwx,nwy,nwx+8,nwy+8);
  t1[kf(nwx+8,cy-1)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(nwx+8,cy)]={type:"floor",layer:L.G,elevation:0};
  s(nwx+2,nwy+2,"deco_l",L.E);s(nwx+6,nwy+2,"deco_l",L.E);
  s(nwx+2,nwy+6,"deco_s",L.E);s(nwx+6,nwy+6,"deco_s",L.E);
  F(cx-1,cy-r-2,cx,cy-r-1);s(cx-1,cy-r-1,"door",L.S);s(cx,cy-r-1,"door",L.S);
  F(cx-1,cy-r-5,cx,cy-r-2);V(cx-2,cy-r-5,cy-r-2);V(cx+1,cy-r-5,cy-r-2);
  F(cx-1,cy-r-5,cx+3,cy-r-4);F(cx,cy-r-5,cx+12,cy-r-4);
  H(cx-1,cx+12,cy-r-6);H(cx,cx+12,cy-r-3);V(cx-2,cy-r-6,cy-r-3);
  F(cx+r+1,cy-1,cx+r+2,cy);s(cx+r+1,cy-1,"door",L.S);s(cx+r+1,cy,"door",L.S);
  var ecx=40,ecy=20,er=6;
  for(j=ecy-er-1;j<=ecy+er+1;j++){
    for(i=ecx-er-1;i<=ecx+er+1;i++){
      ddx=i-ecx;ddy=j-ecy;dd=ddx*ddx+ddy*ddy;
      if(dd<=er*er&&i<=ecx)s(i,j,"floor",L.G,0);
      else if(dd<=(er+1)*(er+1)&&i<=ecx)s(i,j,"wall_l",L.S);
    }
  }
  V(ecx+1,ecy-er-1,ecy+er+1);
  t1[kf(ecx-er,ecy-1)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(ecx-er,ecy)]={type:"floor",layer:L.G,elevation:0};
  s(ecx-er,ecy-1,"door",L.S);s(ecx-er,ecy,"door",L.S);
  s(ecx-3,ecy,"deco_l",L.E);s(ecx-2,ecy-3,"deco_m",L.E);s(ecx-2,ecy+3,"deco_m",L.E);
  for(j=ecy-2;j<=ecy+2;j++){
    for(i=ecx-4;i<=ecx-2;i++){
      if(t1[kf(i,j)]&&t1[kf(i,j)].type==="floor")t1[kf(i,j)].elevation=1;
    }
  }
  s(ecx-5,ecy,"half_stairs",L.S);
  var lEndX=cx+12;
  F(lEndX+1,cy-r-4,lEndX+2,ecy);V(lEndX,cy-r-4,ecy);V(lEndX+3,cy-r-4,ecy);
  F(lEndX+1,ecy-1,ecx-er,ecy);H(lEndX+1,ecx-er-1,ecy-2);H(lEndX+1,ecx-er-1,ecy+1);V(lEndX,ecy-2,ecy+1);
  F(cx-1,cy+r+1,cx,cy+r+4);s(cx-1,cy+r+1,"door",L.S);s(cx,cy+r+1,"door",L.S);
  V(cx-2,cy+r+1,cy+r+4);V(cx+1,cy+r+1,cy+r+4);
  var ssx=16,ssy=cy+r+5;
  F(ssx+1,ssy+1,ssx+9,ssy+7);R(ssx,ssy,ssx+10,ssy+8);
  t1[kf(cx-1,ssy)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(cx,ssy)]={type:"floor",layer:L.G,elevation:0};
  s(cx-1,ssy,"door",L.S);s(cx,ssy,"door",L.S);
  s(ssx+2,ssy+2,"deco_l",L.E);s(ssx+7,ssy+2,"deco_l",L.E);s(ssx+4,ssy+5,"deco_m",L.E);
  return{floors:[mf("C1 - 곡선 던전",50,42,t1)],levelName:"곡선 테스트 던전",stairLinks:[]};
}

function genStairTest(){
  var t1={};var b=mb(t1);
  var s=b.set,H=b.wH,V=b.wV,F=b.fR,R=b.wR;
  F(1,1,8,8);R(0,0,9,9);
  t1[kf(4,0)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(5,0)]={type:"floor",layer:L.G,elevation:0};
  s(4,0,"door",L.S);s(5,0,"door",L.S);
  s(2,2,"deco_l",L.E);s(7,7,"deco_s",L.E);
  s(4,1,"stairs",L.S);s(5,1,"stairs",L.S);
  F(10,3,30,5);H(10,30,2);H(10,30,6);V(9,2,6);
  F(11,3,14,5);F(16,3,20,5,1);
  t1[kf(15,3)]={type:"half_stairs",layer:L.S,dir:"E"};
  t1[kf(15,4)]={type:"half_stairs",layer:L.S,dir:"E"};
  t1[kf(15,5)]={type:"half_stairs",layer:L.S,dir:"E"};
  s(12,4,"deco_s",L.E);s(18,4,"deco_s",L.E);s(11,3,"deco_m",L.E);
  F(21,3,24,5,1);F(26,3,30,5);
  t1[kf(25,3)]={type:"half_stairs",layer:L.S,dir:"E"};
  t1[kf(25,4)]={type:"half_stairs",layer:L.S,dir:"E"};
  t1[kf(25,5)]={type:"half_stairs",layer:L.S,dir:"E"};
  s(22,4,"deco_s",L.E);s(28,4,"deco_s",L.E);
  F(31,1,38,8);R(30,0,39,9);
  t1[kf(30,3)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(30,4)]={type:"floor",layer:L.G,elevation:0};
  t1[kf(30,5)]={type:"floor",layer:L.G,elevation:0};
  s(30,3,"door",L.S);s(30,4,"door",L.S);s(30,5,"door",L.S);
  s(33,2,"deco_l",L.E);s(36,7,"deco_s",L.E);
  var t2={};var b2=mb(t2);
  var s2=b2.set,H2=b2.wH,V2=b2.wV,F2=b2.fR,R2=b2.wR;
  F2(1,1,8,8);R2(0,0,9,9);
  t2[kf(4,9)]={type:"floor",layer:L.G,elevation:0};
  t2[kf(5,9)]={type:"floor",layer:L.G,elevation:0};
  s2(4,9,"door",L.S);s2(5,9,"door",L.S);
  s2(2,2,"deco_l",L.E);s2(7,7,"deco_s",L.E);
  s2(4,8,"stairs",L.S);s2(5,8,"stairs",L.S);
  F2(10,3,30,5);H2(10,30,2);H2(10,30,6);V2(9,2,6);
  F2(11,3,14,5);F2(16,3,20,5,-1);
  t2[kf(15,3)]={type:"half_stairs",layer:L.S,dir:"E"};
  t2[kf(15,4)]={type:"half_stairs",layer:L.S,dir:"E"};
  t2[kf(15,5)]={type:"half_stairs",layer:L.S,dir:"E"};
  s2(12,4,"deco_s",L.E);s2(18,4,"deco_s",L.E);s2(11,3,"deco_m",L.E);
  F2(21,3,24,5,-1);F2(26,3,30,5);
  t2[kf(25,3)]={type:"half_stairs",layer:L.S,dir:"E"};
  t2[kf(25,4)]={type:"half_stairs",layer:L.S,dir:"E"};
  t2[kf(25,5)]={type:"half_stairs",layer:L.S,dir:"E"};
  s2(22,4,"deco_s",L.E);s2(28,4,"deco_s",L.E);
  F2(31,1,38,8);R2(30,0,39,9);
  t2[kf(30,3)]={type:"floor",layer:L.G,elevation:0};
  t2[kf(30,4)]={type:"floor",layer:L.G,elevation:0};
  t2[kf(30,5)]={type:"floor",layer:L.G,elevation:0};
  s2(30,3,"door",L.S);s2(30,4,"door",L.S);s2(30,5,"door",L.S);
  s2(33,2,"deco_l",L.E);s2(36,7,"deco_s",L.E);
  return{
    floors:[mf("T1 - 1층",40,10,t1),mf("T2 - 2층",40,10,t2)],
    levelName:"계단 테스트",
    stairLinks:[
      {fromFloor:0,fromX:4,fromY:1,toFloor:1,toX:4,toY:8},
      {fromFloor:0,fromX:5,fromY:1,toFloor:1,toX:5,toY:8},
      {fromFloor:1,fromX:4,fromY:8,toFloor:0,toX:4,toY:1},
      {fromFloor:1,fromX:5,fromY:8,toFloor:0,toX:5,toY:1},
    ],
  };
}

var PRESETS=[
  {id:"d2",label:"던전 2층 (B1+B2)",desc:"반층 3곳, 계단 2쌍",icon:"⚔",generate:genDungeon},
  {id:"s2",label:"소형 테스트 (S1+S2)",desc:"반층 2곳, 계단 1쌍",icon:"🗺",generate:genSmall},
  {id:"c1",label:"곡선 테스트 (C1)",desc:"원형 광장, L자 복도, 반원형 방",icon:"🌀",generate:genCurved},
  {id:"st",label:"계단 테스트 (T1+T2)",desc:"전층계단 1쌍 + 반층계단 4개",icon:"🪜",generate:genStairTest},
];

function getElevAt(ft,x,y){
  try{
    var ns=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]],fl=[];
    var i,t;
    for(i=0;i<ns.length;i++){t=ft[kf(ns[i][0],ns[i][1])];if(t&&t.type==="floor")fl.push(t);}
    var cnt={},k,e;
    for(i=0;i<fl.length;i++){e=String(fl[i].elevation||0);cnt[e]=(cnt[e]||0)+1;}
    var top=null,topV=0;
    for(k in cnt){if(cnt[k]>topV){topV=cnt[k];top=k;}}
    return top&&topV>=2?Number(top):0;
  }catch(e){return 0;}
}

function calcStaircase(lk,floors,cellSz,floorGap){
  if(!cellSz)cellSz=SC;if(!floorGap)floorGap=400;
  var zA=lk.fromFloor*floorGap,zB=lk.toFloor*floorGap;
  var xA=Math.round((lk.fromX+0.5)*cellSz),yA=Math.round((lk.fromY+0.5)*cellSz);
  var xB=Math.round((lk.toX+0.5)*cellSz),yB=Math.round((lk.toY+0.5)*cellSz);
  var zDiff=Math.abs(zB-zA);
  var dx=xB-xA,dy=yB-yA,hDist=Math.round(Math.sqrt(dx*dx+dy*dy));
  var neededHoriz=Math.round(zDiff*1.5),isTooClose=hDist<neededHoriz*0.5;
  var midX=Math.round(xA+(xA<=xB?neededHoriz/2:-neededHoriz/2)),midY=yA,midZ=Math.round((zA+zB)/2);
  var segments=isTooClose?[
    {type:"stair_run",from:{x:xA,y:yA,z:zA},to:{x:midX,y:midY,z:midZ},width:cellSz,desc:"1구간: 하단->중간랜딩"},
    {type:"landing",pos:{x:midX,y:midY,z:midZ},size:cellSz+"x"+cellSz,desc:"중간 랜딩 (180도 전환)"},
    {type:"stair_run",from:{x:midX,y:midY,z:midZ},to:{x:xB,y:yB,z:zB},width:cellSz,desc:"2구간: 중간랜딩->상단"},
  ]:[{type:"stair_run",from:{x:xA,y:yA,z:zA},to:{x:xB,y:yB,z:zB},width:cellSz,desc:"직선 계단"}];
  return{xA:xA,yA:yA,zA:zA,xB:xB,yB:yB,zB:zB,zDiff:zDiff,hDist:hDist,neededHoriz:neededHoriz,isTooClose:isTooClose,segments:segments};
}

function stairMd(lk,floors,cellSz,floorGap){
  if(!cellSz)cellSz=SC;if(!floorGap)floorGap=400;
  var fa=(floors[lk.fromFloor]&&floors[lk.fromFloor].name)||"?";
  var fb=(floors[lk.toFloor]&&floors[lk.toFloor].name)||"?";
  var sc2;
  try{sc2=calcStaircase(lk,floors,cellSz,floorGap);}catch(e){return "\n> 계단실 계산 오류: "+e.message+"\n";}
  var md="\n#### 계단실 상세: "+fa+" <-> "+fb+"\n\n";
  md+="| 항목 | 값 |\n|---|---|\n";
  md+="| 출발 | "+fa+" UE("+sc2.xA+","+sc2.yA+","+sc2.zA+") |\n";
  md+="| 도착 | "+fb+" UE("+sc2.xB+","+sc2.yB+","+sc2.zB+") |\n";
  md+="| 높이차 | "+sc2.zDiff+" UU ("+sc2.zDiff/100+"m) |\n";
  md+="| 현재 수평거리 | "+sc2.hDist+" UU |\n";
  md+="| 필요 수평거리 (1:1.5) | "+sc2.neededHoriz+" UU |\n";
  md+="| 구조 | "+(sc2.isTooClose?"꺾임 계단실 (중간 랜딩 필요)":"직선 계단")+" |\n\n";
  if(sc2.isTooClose)md+="- 수평거리("+sc2.hDist+" UU)가 부족합니다. U턴형 꺾임 계단실로 배치하세요.\n\n";
  md+="**배치 구성**\n\n";
  var i,seg;
  for(i=0;i<sc2.segments.length;i++){
    seg=sc2.segments[i];
    if(seg.type==="stair_run"){
      md+=(i+1)+". "+seg.desc+"\n";
      md+="   - From: UE("+seg.from.x+","+seg.from.y+","+seg.from.z+")\n";
      md+="   - To:   UE("+seg.to.x+","+seg.to.y+","+seg.to.z+")\n";
      md+="   - 폭: "+seg.width+" UU | 경사: "+(seg.to.z-seg.from.z>0?"상행":"하행")+"\n\n";
    }else if(seg.type==="landing"){
      md+=(i+1)+". "+seg.desc+"\n";
      md+="   - 위치: UE("+seg.pos.x+","+seg.pos.y+","+seg.pos.z+")\n";
      md+="   - 크기: "+seg.size+" UU\n\n";
    }
  }
  return md;
}

function wallSegMd(wArr,label,hUU,z,cellSz,merge){
  if(!wArr||!wArr.length)return "";
  var i,j,p,ri,ci2;
  var out="### Walls_"+label+" (높이 "+hUU+"UU)\n";
  if(merge){
    var rects=packRects(wArr);
    out+="※ 아래 각 항목을 **하나의 Static Mesh Box**로 생성하세요.\n\n";
    out+="| # | Gx | Gy | Gw | Gh | Center X | Center Y | Z | Size X | Size Y | Size Z |\n";
    out+="|---|---|---|---|---|---|---|---|---|---|---|\n";
    for(ri=0;ri<rects.length;ri++){
      var rc=rects[ri];
      var cx=Math.round((rc.x+rc.w/2)*cellSz),cy=Math.round((rc.y+rc.h/2)*cellSz);
      out+="| "+(ri+1)+" | "+rc.x+" | "+rc.y+" | "+rc.w+" | "+rc.h+" | "+cx+" | "+cy+" | "+z+" | "+(rc.w*cellSz)+" | "+(rc.h*cellSz)+" | "+hUU+" |\n";
    }
    out+="\n";
    return out;
  }
  var byRow={},used={},segs=[];
  for(i=0;i<wArr.length;i++){p=wArr[i];if(!byRow[p.y])byRow[p.y]=[];byRow[p.y].push(p.x);}
  var rowKeys=Object.keys(byRow).sort(function(a,b){return Number(a)-Number(b);});
  var rs,rp,jj,ry,rxs;
  for(ri=0;ri<rowKeys.length;ri++){
    ry=Number(rowKeys[ri]);rxs=byRow[ry].sort(function(a,b){return a-b;});
    rs=rxs[0];rp=rxs[0];
    for(j=1;j<=rxs.length;j++){
      if(j<rxs.length&&rxs[j]===rp+1){rp=rxs[j];}
      else{
        if(rp>rs){
          for(jj=rs;jj<=rp;jj++)used[kf(jj,ry)]=true;
          segs.push("- H ("+rs+"-"+rp+","+ry+") Center("+Math.round((rs+rp+1)/2*cellSz)+","+Math.round((ry+0.5)*cellSz)+","+z+") Size("+(rp-rs+1)*cellSz+","+WT+","+hUU+")");
        }
        if(j<rxs.length){rs=rxs[j];rp=rxs[j];}
      }
    }
  }
  var byCol={},cs,cp,cx2,cys;
  for(i=0;i<wArr.length;i++){p=wArr[i];if(!used[kf(p.x,p.y)]){if(!byCol[p.x])byCol[p.x]=[];byCol[p.x].push(p.y);}}
  var colKeys=Object.keys(byCol).sort(function(a,b){return Number(a)-Number(b);});
  for(ci2=0;ci2<colKeys.length;ci2++){
    cx2=Number(colKeys[ci2]);cys=byCol[cx2].sort(function(a,b){return a-b;});
    cs=cys[0];cp=cys[0];
    for(j=1;j<=cys.length;j++){
      if(j<cys.length&&cys[j]===cp+1){cp=cys[j];}
      else{
        if(cp>cs){segs.push("- V ("+cx2+","+cs+"-"+cp+") Center("+Math.round((cx2+0.5)*cellSz)+","+Math.round((cs+cp+1)/2*cellSz)+","+z+") Size("+WT+","+(cp-cs+1)*cellSz+","+hUU+")");}
        else{segs.push("- Pt ("+cx2+","+cs+") Center("+Math.round((cx2+0.5)*cellSz)+","+Math.round((cs+0.5)*cellSz)+","+z+") Size("+cellSz+","+cellSz+","+hUU+")");}
        if(j<cys.length){cs=cys[j];cp=cys[j];}
      }
    }
  }
  out+=segs.join("\n")+"\n\n";
  return out;
}

function findClusters(pts){
  var set={},i,visited={},clusters=[],keys,cluster,queue,cur,nb,nk;
  for(i=0;i<pts.length;i++)set[kf(pts[i].x,pts[i].y)]=pts[i];
  keys=Object.keys(set);
  for(i=0;i<keys.length;i++){
    if(visited[keys[i]])continue;
    cluster=[];queue=[set[keys[i]]];visited[keys[i]]=true;
    while(queue.length>0){
      cur=queue.shift();cluster.push(cur);
      nb=[[cur.x+1,cur.y],[cur.x-1,cur.y],[cur.x,cur.y+1],[cur.x,cur.y-1]];
      var ji;for(ji=0;ji<nb.length;ji++){nk=kf(nb[ji][0],nb[ji][1]);if(set[nk]&&!visited[nk]){visited[nk]=true;queue.push(set[nk]);}}
    }
    clusters.push(cluster);
  }
  return clusters;
}

function detectCircle(pts){
  if(pts.length<7)return null;
  var i,sumX=0,sumY=0,dx,dy,dr,sumR=0,r,circleArea,ratio,varR=0;
  for(i=0;i<pts.length;i++){sumX+=pts[i].x+0.5;sumY+=pts[i].y+0.5;}
  var cx=sumX/pts.length,cy=sumY/pts.length;
  for(i=0;i<pts.length;i++){dx=pts[i].x+0.5-cx;dy=pts[i].y+0.5-cy;sumR+=Math.sqrt(dx*dx+dy*dy);}
  r=sumR/pts.length;if(r<2)return null;
  circleArea=Math.PI*r*r;ratio=pts.length/circleArea;
  if(ratio<0.65||ratio>1.2)return null;
  for(i=0;i<pts.length;i++){dx=pts[i].x+0.5-cx;dy=pts[i].y+0.5-cy;dr=Math.sqrt(dx*dx+dy*dy)-r;varR+=dr*dr;}
  varR=Math.sqrt(varR/pts.length);
  if(varR>r*0.35)return null;
  return{cx:cx,cy:cy,r:r};
}

function packRects(pts){
  if(!pts||!pts.length)return[];
  var remaining={},i,p,maxW,h,wx,tw,th,ok,bestW,bestH,bestA,bestArea,bestRect,dy,dx,rects=[];
  for(i=0;i<pts.length;i++)remaining[kf(pts[i].x,pts[i].y)]=true;
  while(Object.keys(remaining).length>0){
    var keys=Object.keys(remaining);
    bestArea=0;bestRect=null;
    for(i=0;i<keys.length;i++){
      p=pk(keys[i]);if(!remaining[kf(p.x,p.y)])continue;
      maxW=0;while(remaining[kf(p.x+maxW,p.y)])maxW++;
      if(maxW===0)continue;
      h=1;
      while(true){ok=true;for(wx=0;wx<maxW;wx++){if(!remaining[kf(p.x+wx,p.y+h)]){ok=false;break;}}if(!ok)break;h++;}
      bestW=maxW;bestH=h;bestA=maxW*h;
      for(tw=maxW-1;tw>=1;tw--){
        th=1;
        while(true){ok=true;for(wx=0;wx<tw;wx++){if(!remaining[kf(p.x+wx,p.y+th)]){ok=false;break;}}if(!ok)break;th++;}
        if(tw*th>bestA){bestA=tw*th;bestW=tw;bestH=th;}
      }
      if(bestA>bestArea){bestArea=bestA;bestRect={x:p.x,y:p.y,w:bestW,h:bestH};}
    }
    if(!bestRect)break;
    for(dy=0;dy<bestRect.h;dy++)for(dx=0;dx<bestRect.w;dx++)delete remaining[kf(bestRect.x+dx,bestRect.y+dy)];
    rects.push(bestRect);
  }
  return rects;
}

function buildFloorMd(floor,fi,floors,links,cellSz,floorGap,wHL,wHM,wHS,dHL,dHM,dHS,merge){
  if(!cellSz)cellSz=SC;if(!floorGap)floorGap=400;
  if(!wHL)wHL=500;if(!wHM)wHM=250;if(!wHS)wHS=150;
  if(!dHL)dHL=300;if(!dHM)dHM=200;if(!dHS)dHS=100;
  var ft=floor.tiles||{},mw=floor.width||20,mh=floor.height||15,z=fi*floorGap;
  var wLT=[],wMT=[],wST=[],stT=[],hsT=[],dL=[],dM=[],dS=[],doorT=[],movT=[],ladT=[];
  var eg={"0":[],"1":[],"-1":[]};
  var keys=Object.keys(ft),i,k,t,isEK,p,e;
  for(i=0;i<keys.length;i++){
    k=keys[i];t=ft[k];
    isEK=k.indexOf(",e")===k.length-2;
    p=pk(isEK?k.slice(0,k.length-2):k);
    if(t.type==="wall_l")wLT.push(p);
    else if(t.type==="wall_m")wMT.push(p);
    else if(t.type==="wall_s")wST.push(p);
    else if(t.type==="door")doorT.push(p);
    else if(t.type==="stairs")stT.push(p);
    else if(t.type==="half_stairs")hsT.push(p);
    else if(t.type==="deco_l")dL.push(p);
    else if(t.type==="deco_m")dM.push(p);
    else if(t.type==="deco_s")dS.push(p);
    else if(t.type==="movable")movT.push(p);
    else if(t.type==="ladder"&&t.originX===p.x&&t.originY===p.y)ladT.push(p);
    else if(t.type==="floor"){e=String(t.elevation||0);if(eg[e])eg[e].push(p);else eg["0"].push(p);}
  }
  var md="## Floor "+(fi+1)+": "+floor.name+"\n- Grid: "+mw+"x"+mh+" | Z: "+z+" | +반층: "+(z+HL)+" | -반층: "+(z-HL)+"\n\n";
  md+="```\n   ";
  var x,y;
  for(x=0;x<mw;x++)md+=(x%5===0)?String(x).padEnd(1):" ";
  md+="\n";
  for(y=0;y<mh;y++){
    md+=String(y).padStart(2)+" ";
    for(x=0;x<mw;x++){
      t=ft[kf(x,y)];
      if(!t){md+="·";continue;}
      if(t.type==="wall_l"||t.type==="wall_m"||t.type==="wall_s")md+="#";
      else if(t.type==="door")md+="D";
      else if(t.type==="floor")md+=(EA[String(t.elevation||0)]||"░");
      else if(t.type==="water")md+="~";
      else if(t.type==="stairs")md+="S";
      else if(t.type==="half_stairs")md+="H";
      else if(t.type==="ladder")md+=(t.originX===x&&t.originY===y?"J":"j");
      else if(t.type==="deco_l")md+="L";
      else if(t.type==="deco_m")md+="M";
      else if(t.type==="deco_s")md+="s";
      else if(t.type==="movable")md+="P";
      else md+="?";
    }
    md+="\n";
  }
  md+="```\n\n";
  var elevList=[["0","기본",z],["1","+반층",z+HL],["-1","-반층",z-HL]];
  var ei,ee,lb,ez,g,ci2,cv,ux,uy,ur,rects,ri,rc,rcx,rcy,br,pp,ys,row,ranges,rs2,rp2,j2;
  for(ei=0;ei<elevList.length;ei++){
    ee=elevList[ei][0];lb=elevList[ei][1];ez=elevList[ei][2];
    g=eg[ee]||[];if(!g.length)continue;
    md+="### "+lb+" (Z="+ez+")\n";
    if(merge){
      var clusters=findClusters(g),cylinders=[],boxPts=[],pi;
      for(ci2=0;ci2<clusters.length;ci2++){
        cv=detectCircle(clusters[ci2]);
        if(cv){cylinders.push({circ:cv});}
        else{for(pi=0;pi<clusters[ci2].length;pi++)boxPts.push(clusters[ci2][pi]);}
      }
      if(cylinders.length){
        md+="#### 실린더\n| # | Center X | Center Y | Z | Radius(UU) |\n|---|---|---|---|---|\n";
        for(ci2=0;ci2<cylinders.length;ci2++){
          cv=cylinders[ci2].circ;ux=Math.round(cv.cx*cellSz);uy=Math.round(cv.cy*cellSz);ur=Math.round(cv.r*cellSz);
          md+="| "+(ci2+1)+" | "+ux+" | "+uy+" | "+ez+" | "+ur+" |\n";
        }
        md+="\n";
      }
      if(boxPts.length){
        rects=packRects(boxPts);
        md+="#### 박스\n| # | Gx | Gy | Gw | Gh | Center X | Center Y | Z | Size X | Size Y |\n|---|---|---|---|---|---|---|---|---|---|\n";
        for(ri=0;ri<rects.length;ri++){
          rc=rects[ri];rcx=Math.round((rc.x+rc.w/2)*cellSz);rcy=Math.round((rc.y+rc.h/2)*cellSz);
          md+="| "+(ri+1)+" | "+rc.x+" | "+rc.y+" | "+rc.w+" | "+rc.h+" | "+rcx+" | "+rcy+" | "+ez+" | "+(rc.w*cellSz)+" | "+(rc.h*cellSz)+" |\n";
        }
        md+="\n";
      }
    } else {
      br={};
      for(i=0;i<g.length;i++){pp=g[i];if(!br[pp.y])br[pp.y]=[];br[pp.y].push(pp.x);}
      ys=Object.keys(br).sort(function(a,b){return Number(a)-Number(b);});
      for(i=0;i<ys.length;i++){
        row=br[ys[i]].sort(function(a,b){return a-b;});
        ranges=[];rs2=row[0];rp2=row[0];
        for(j2=1;j2<row.length;j2++){if(row[j2]===rp2+1)rp2=row[j2];else{ranges.push(rs2===rp2?String(rs2):rs2+"-"+rp2);rs2=row[j2];rp2=row[j2];}}
        ranges.push(rs2===rp2?String(rs2):rs2+"-"+rp2);
        md+="- row "+ys[i]+": x="+ranges.join(",")+"\n";
      }
      md+="\n";
    }
  }
  md+=wallSegMd(wLT,"L",wHL,z,cellSz,merge);
  md+=wallSegMd(wMT,"M",wHM,z,cellSz,merge);
  md+=wallSegMd(wST,"S",wHS,z,cellSz,merge);
  var fillSegs=[],fk,ft2,fp,fev,dirs,di,nk2,nb2,nev,zHigh,zLow2,fillH,fillZ,fcx,fcy,fsx,fsy;
  var allKeys=Object.keys(ft);
  dirs=[{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
  for(i=0;i<allKeys.length;i++){
    fk=allKeys[i];if(fk.indexOf(",e")===fk.length-2)continue;
    ft2=ft[fk];if(ft2.type!=="floor")continue;
    fp=pk(fk);fev=(ft2.elevation||0);
    for(di=0;di<dirs.length;di++){
      nk2=kf(fp.x+dirs[di].dx,fp.y+dirs[di].dy);nb2=ft[nk2];
      nev=(nb2&&nb2.type==="floor")?(nb2.elevation||0):null;
      if(nev===null||nev===fev||fev<=nev)continue;
      zHigh=fev*HL+z;zLow2=nev*HL+z;fillH=Math.abs(zHigh-zLow2);fillZ=Math.round((zHigh+zLow2)/2);
      if(dirs[di].dx!==0){fcx=Math.round((fp.x+0.5+dirs[di].dx*0.5)*cellSz);fcy=Math.round((fp.y+0.5)*cellSz);fsx=4;fsy=cellSz;}
      else{fcx=Math.round((fp.x+0.5)*cellSz);fcy=Math.round((fp.y+0.5+dirs[di].dy*0.5)*cellSz);fsx=cellSz;fsy=4;}
      fillSegs.push({cx:fcx,cy:fcy,cz:fillZ,sx:fsx,sy:fsy,sz:fillH});
    }
  }
  if(fillSegs.length){
    md+="### HalfLevel SideFill\n| # | Center X | Center Y | Center Z | Size X | Size Y | Size Z |\n|---|---|---|---|---|---|---|\n";
    for(i=0;i<fillSegs.length;i++){var sg=fillSegs[i];md+="| "+(i+1)+" | "+sg.cx+" | "+sg.cy+" | "+sg.cz+" | "+sg.sx+" | "+sg.sy+" | "+sg.sz+" |\n";}
    md+="\n";
  }
  if(doorT.length){
    md+="### Doors\n";
    for(i=0;i<doorT.length;i++){p=doorT[i];md+="- ("+p.x+","+p.y+") UE("+Math.round((p.x+0.5)*cellSz)+","+Math.round((p.y+0.5)*cellSz)+","+z+")\n";}
    md+="\n";
  }
  if(stT.length||hsT.length){
    md+="### Stairs\n";
    md+="> **축 규칙**: 그리드 X+ = UE World X+, 그리드 Y+ = UE World Y+\n";
    md+="> **메시 축 확인됨**: 메시 로컬 Y+ 방향 = 경사로 내려가는 방향(낮은쪽).\n";
    md+="> 따라서 Yaw는 '내려가는 방향 UE벡터' 기준 atan2(Y,X)로 계산됨.\n\n";
    var st,cxs,cys2,lk,iF,oF,oX,oY,zS,zD,df,oName,dxLink,dyLink,yawDeg,sc3,seg0,segDx,segDy,segDz,segH,pitchDeg,pitchSign,j3;
    var nbs,nb3,lowE,highE,highDir,highNbx,highNby,zLow3,zHigh3,rampH,rampLen,targetAngleRad,actualAngle;
    var dirVecMap={E:[1,0],W:[-1,0],S:[0,1],N:[0,-1]};
    for(i=0;i<stT.length;i++){
      st=stT[i];cxs=Math.round((st.x+0.5)*cellSz);cys2=Math.round((st.y+0.5)*cellSz);lk=null;
      for(j3=0;j3<links.length;j3++){var l=links[j3];if((l.fromFloor===fi&&l.fromX===st.x&&l.fromY===st.y)||(l.toFloor===fi&&l.toX===st.x&&l.toY===st.y)){lk=l;break;}}
      if(lk){
        iF=(lk.fromFloor===fi&&lk.fromX===st.x&&lk.fromY===st.y);
        oF=iF?lk.toFloor:lk.fromFloor;oX=iF?lk.toX:lk.fromX;oY=iF?lk.toY:lk.fromY;
        zS=fi*floorGap;zD=oF*floorGap;df=zD-zS;oName=(floors[oF]&&floors[oF].name)||"?";
        dxLink=oX-st.x;dyLink=oY-st.y;
        var riseVecXs=Math.round(dxLink*cellSz),riseVecYs=Math.round(dyLink*cellSz);
        var descVecXs=df>=0?-riseVecXs:riseVecXs,descVecYs=df>=0?-riseVecYs:riseVecYs;
        yawDeg=Math.round(Math.atan2(descVecYs,descVecXs)*180/Math.PI);
        sc3=null;try{sc3=calcStaircase({fromFloor:fi,fromX:st.x,fromY:st.y,toFloor:oF,toX:oX,toY:oY},floors,cellSz,floorGap);}catch(e2){}
        if(sc3&&sc3.segments&&sc3.segments.length>0){
          seg0=sc3.segments[0];segDx=seg0.to.x-seg0.from.x;segDy=seg0.to.y-seg0.from.y;segDz=Math.abs(seg0.to.z-seg0.from.z);
          segH=Math.sqrt(segDx*segDx+segDy*segDy);pitchDeg=segH>0?Math.round(Math.atan2(segDz,segH)*180/Math.PI):30;
        }else{pitchDeg=30;}
        pitchSign=df<0?1:-1;
        md+="- [전층계단] 그리드("+st.x+","+st.y+") → UE 위치("+cxs+","+cys2+","+zS+")\n";
        md+="  - 연결: 이 층(Z="+zS+") → "+oName+" 그리드("+oX+","+oY+") (Z="+zD+") | 높이차: "+(df>0?"+":"")+df+" UU\n";
        md+="  - 오르는 방향 UE벡터: (X="+riseVecXs+", Y="+riseVecYs+") | 내려가는 방향 UE벡터(=메시 Y+): (X="+descVecXs+", Y="+descVecYs+")\n";
        md+="  - **Rotation: Yaw="+yawDeg+"도 (내려가는 방향 atan2 기준) | Pitch="+(pitchSign*pitchDeg)+"도 (반전: "+(pitchSign*pitchDeg*-1)+"도) | Roll=0**\n\n";
      }else{md+="- [전층계단] ("+st.x+","+st.y+") unlinked\n";}
    }
    for(i=0;i<hsT.length;i++){
      st=hsT[i];cxs=Math.round((st.x+0.5)*cellSz);cys2=Math.round((st.y+0.5)*cellSz);
      nbs=[[st.x+1,st.y,"E"],[st.x-1,st.y,"W"],[st.x,st.y+1,"S"],[st.x,st.y-1,"N"]];
      lowE=0;highE=0;highDir="";highNbx=st.x;highNby=st.y;
      if(st.dir){
        highDir=st.dir;
        var dv=dirVecMap[st.dir]||[1,0];highNbx=st.x+dv[0];highNby=st.y+dv[1];
        for(j3=0;j3<nbs.length;j3++){nb3=ft[kf(nbs[j3][0],nbs[j3][1])];if(nb3&&nb3.type==="floor"){e=nb3.elevation||0;if(e>highE)highE=e;if(e<lowE)lowE=e;}}
      }else{
        for(j3=0;j3<nbs.length;j3++){nb3=ft[kf(nbs[j3][0],nbs[j3][1])];if(nb3&&nb3.type==="floor"){e=nb3.elevation||0;if(e>highE){highE=e;highDir=nbs[j3][2];var dv2=dirVecMap[nbs[j3][2]]||[1,0];highNbx=nbs[j3][0];highNby=nbs[j3][1];}if(e<lowE)lowE=e;}}
      }
      zLow3=lowE*HL+z;zHigh3=highE*HL+z;
      targetAngleRad=26*Math.PI/180;rampH=Math.abs(zHigh3-zLow3);rampLen=Math.round(rampH/Math.tan(targetAngleRad));actualAngle=Math.round(Math.atan2(rampH,rampLen)*180/Math.PI);
      var highUeX=Math.round((highNbx+0.5)*cellSz),highUeY=Math.round((highNby+0.5)*cellSz);
      var lowNbDir=highDir==="E"?"W":highDir==="W"?"E":highDir==="S"?"N":"S";
      var ldv=dirVecMap[lowNbDir]||[-1,0];
      var lowNbx=st.x+ldv[0],lowNby=st.y+ldv[1];
      var lowUeX=Math.round((lowNbx+0.5)*cellSz),lowUeY=Math.round((lowNby+0.5)*cellSz);
      var riseVecX=highUeX-lowUeX,riseVecY=highUeY-lowUeY;
      var descVecX=-riseVecX,descVecY=-riseVecY;
      var descYaw=Math.round(Math.atan2(descVecY,descVecX)*180/Math.PI);
      md+="\n- [반층계단] 그리드("+st.x+","+st.y+")\n";
      md+="  | 항목 | 값 |\n  |---|---|\n";
      md+="  | 메시 타입 | **Ramp** — BSP Box 사용 금지 |\n";
      md+="  | 중심 위치 | X="+cxs+", Y="+cys2+", Z="+Math.round((zLow3+zHigh3)/2)+" |\n";
      md+="  | 낮은쪽 이웃 | 그리드("+lowNbx+","+lowNby+") → UE("+lowUeX+","+lowUeY+","+zLow3+") |\n";
      md+="  | 높은쪽 이웃 | 그리드("+highNbx+","+highNby+") → UE("+highUeX+","+highUeY+","+zHigh3+") |\n";
      md+="  | 오르는 방향 UE벡터 | X="+riseVecX+", Y="+riseVecY+" (그리드 "+highDir+" 방향) |\n";
      md+="  | 내려가는 방향 UE벡터 (=메시 Y+) | X="+descVecX+", Y="+descVecY+" |\n";
      md+="  | **Rotation Yaw** | **"+descYaw+"도** (내려가는 방향 atan2 기준) |\n";
      md+="  | **Rotation Pitch** | **-"+actualAngle+"도** (부호 반전 시도: +"+actualAngle+"도) |\n";
      md+="  | 수평 길이 | "+rampLen+" UU | 높이차 | "+rampH+" UU |\n";
      md+="  | 낮은쪽 Z | "+zLow3+" | 높은쪽 Z | "+zHigh3+" |\n\n";
    }
    md+="\n";
  }
  if(ladT.length){
    md+="### Ladders\n- 점유: 2×2 타일 ("+2*cellSz+"UU × "+2*cellSz+"UU)\n- 해당 2×2 바닥 콜리전 제거 (Floor Hole)\n- Climbable 콜리전 하단까지 연장\n\n";
    md+="| # | Origin Gx | Origin Gy | Center X | Center Y | Top Z | Bottom Z | 높이 |\n|---|---|---|---|---|---|---|---|\n";
    var ldy,ldx,lowerFt,hasFloor,fj;
    for(i=0;i<ladT.length;i++){
      p=ladT[i];var lcx=Math.round((p.x+1)*cellSz),lcy=Math.round((p.y+1)*cellSz);
      var topZ=z,botZ=topZ-floorGap;
      for(fj=fi-1;fj>=0;fj--){
        lowerFt=floors[fj]&&floors[fj].tiles||{};hasFloor=false;
        for(ldy=0;ldy<=1&&!hasFloor;ldy++)for(ldx=0;ldx<=1&&!hasFloor;ldx++)if(lowerFt[kf(p.x+ldx,p.y+ldy)]&&lowerFt[kf(p.x+ldx,p.y+ldy)].type==="floor")hasFloor=true;
        if(hasFloor){botZ=fj*floorGap;break;}
      }
      md+="| "+(i+1)+" | "+p.x+" | "+p.y+" | "+lcx+" | "+lcy+" | "+topZ+" | "+botZ+" | "+(topZ-botZ)+" |\n";
    }
    md+="\n";
  }
  if(dL.length||dM.length||dS.length){
    md+="### Deco\n| Type | Gx | Gy | Cx | Cy | FloorZ | HeightUU |\n|---|---|---|---|---|---|---|\n";
    var all=[],ev2,fz;
    for(i=0;i<dL.length;i++)all.push({x:dL[i].x,y:dL[i].y,t:"大",h:dHL});
    for(i=0;i<dM.length;i++)all.push({x:dM[i].x,y:dM[i].y,t:"中",h:dHM});
    for(i=0;i<dS.length;i++)all.push({x:dS[i].x,y:dS[i].y,t:"小",h:dHS});
    for(i=0;i<all.length;i++){p=all[i];ev2=getElevAt(ft,p.x,p.y);fz=z+ev2*HL;md+="| "+p.t+" | "+p.x+" | "+p.y+" | "+Math.round((p.x+0.5)*cellSz)+" | "+Math.round((p.y+0.5)*cellSz)+" | "+fz+" | "+p.h+" |\n";}
    md+="\n";
  }
  if(movT.length){
    md+="### Movable Actors\n- Mobility: Movable | Simulate Physics: true | Collision: PhysicsActor\n- Size: 200UU × 100UU × 180UU\n\n";
    md+="| # | Gx | Gy | Center X | Center Y | Base Z |\n|---|---|---|---|---|---|\n";
    var ev3,fz3;
    for(i=0;i<movT.length;i++){p=movT[i];ev3=getElevAt(ft,p.x,p.y);fz3=z+ev3*HL;md+="| "+(i+1)+" | "+p.x+" | "+p.y+" | "+Math.round((p.x+0.5)*cellSz)+" | "+Math.round((p.y+0.5)*cellSz)+" | "+fz3+" |\n";}
    md+="\n";
  }
  return md;
}

function buildMd(floors,links,name,cellSz,floorGap,wHL,wHM,wHS,dHL,dHM,dHS,merge){
  if(!cellSz)cellSz=100;if(!floorGap)floorGap=400;
  if(!wHL)wHL=500;if(!wHM)wHM=250;if(!wHS)wHS=150;
  if(!dHL)dHL=300;if(!dHM)dHM=200;if(!dHS)dHS=100;
  try{
    var i,f,tv,j,hu,hd,l,fa,fb;
    var md="# "+name+"\n\n";
    md+="| 항목 | 값 |\n|---|---|\n";
    md+="| 층 수 | "+floors.length+" |\n";
    md+="| 셀 크기 | "+cellSz+" UU ("+cellSz/100+"m) |\n";
    md+="| **층간 Z 간격** | **"+floorGap+" UU ("+floorGap/100+"m)** |\n";
    md+="| 반층 오프셋 | +-"+HL+" UU |\n";
    md+="| 벽 大 높이 | "+wHL+" UU ("+wHL/100+"m) |\n";
    md+="| 벽 中 높이 | "+wHM+" UU ("+wHM/100+"m) |\n";
    md+="| 벽 小 높이 | "+wHS+" UU ("+wHS/100+"m) |\n";
    md+="| 데코 大 높이 | "+dHL+" UU ("+dHL/100+"m) |\n";
    md+="| 데코 中 높이 | "+dHM+" UU ("+dHM/100+"m) |\n";
    md+="| 데코 小 높이 | "+dHS+" UU ("+dHS/100+"m) |\n\n";
    md+="## Outliner\n```\n"+name+"/\n";
    for(i=0;i<floors.length;i++){
      f=floors[i];hu=false;hd=false;tv=Object.values(f.tiles||{});
      for(j=0;j<tv.length;j++){if(tv[j].type==="floor"&&(tv[j].elevation||0)===1)hu=true;if(tv[j].type==="floor"&&(tv[j].elevation||0)===-1)hd=true;}
      md+="|-- "+f.name+"/\n|   |-- Floors/\n|   |   |-- Floor_Default/ Z="+(i*floorGap)+"\n";
      if(hu)md+="|   |   |-- Floor_HalfUp/ Z="+(i*floorGap+HL)+"\n";
      if(hd)md+="|   |   |-- Floor_HalfDown/ Z="+(i*floorGap-HL)+"\n";
      md+="|   |-- Walls_L/ |-- Walls_M/ |-- Walls_S/\n|   |-- Doors/ |-- Stairs/ |-- HalfStairs/ |-- Ladders/ |-- Water/\n|   |-- Deco/ |-- Movable/\n";
    }
    md+="```\n\n";
    if(links.length){
      md+="## Stair Connections\n\n";
      for(i=0;i<links.length;i++){
        l=links[i];fa=(floors[l.fromFloor]&&floors[l.fromFloor].name)||"?";fb=(floors[l.toFloor]&&floors[l.toFloor].name)||"?";
        md+=(i+1)+". "+fa+"("+l.fromX+","+l.fromY+") <-> "+fb+"("+l.toX+","+l.toY+")\n";
        try{md+=stairMd(l,floors,cellSz,floorGap);}catch(e){md+="> 오류: "+e.message+"\n";}
      }
      md+="\n";
    }
    for(i=0;i<floors.length;i++){
      try{md+=buildFloorMd(floors[i],i,floors,links,cellSz,floorGap,wHL,wHM,wHS,dHL,dHM,dHS,merge);}catch(e){md+="## Floor "+(i+1)+"\n> 오류: "+e.message+"\n";}
      md+="---\n\n";
    }
    return md;
  }catch(e){return "# 오류\n"+e.message;}
}

function buildJSON(floors,links,name,cellSz,floorGap,wHL,wHM,wHS,dHL,dHM,dHS){
  if(!cellSz)cellSz=100;if(!floorGap)floorGap=400;
  try{
    var i,j,f,v,p,td,isEK,ks;
    var obj={name:name,cellSize:cellSz,cellSizeM:cellSz/100,floorGap:floorGap,floorGapM:floorGap/100,halfOffset:HL,
      wallHeights:{large:wHL||500,medium:wHM||250,small:wHS||150},
      decoHeights:{large:dHL||300,medium:dHM||200,small:dHS||100},
      stairLinks:[],floors:[]};
    for(i=0;i<links.length;i++){var l=links[i];obj.stairLinks.push({fa:(floors[l.fromFloor]&&floors[l.fromFloor].name)||"?",xa:l.fromX,ya:l.fromY,fb:(floors[l.toFloor]&&floors[l.toFloor].name)||"?",xb:l.toX,yb:l.toY});}
    for(i=0;i<floors.length;i++){
      f=floors[i];var tArr=[];ks=Object.keys(f.tiles||{});
      for(j=0;j<ks.length;j++){
        isEK=ks[j].indexOf(",e")===ks[j].length-2;p=pk(isEK?ks[j].slice(0,ks[j].length-2):ks[j]);v=f.tiles[ks[j]];
        td={x:p.x,y:p.y,type:v.type,layer:v.layer};if(v.elevation!==undefined)td.elevation=v.elevation;tArr.push(td);
      }
      obj.floors.push({name:f.name,w:f.width,h:f.height,z:i*floorGap,tiles:tArr});
    }
    return JSON.stringify(obj,null,2);
  }catch(e){return '{"error":"'+e.message+'"}';}
}

class ErrBoundary extends Component{
  constructor(p){super(p);this.state={err:null};}
  static getDerivedStateFromError(e){return{err:e};}
  render(){
    if(this.state.err){
      var msg=String(this.state.err)+"\n\n"+(this.state.err.stack||"");
      return(
        <div style={{padding:20,background:"#1a0a0a",color:"#e74c3c",fontFamily:"monospace",fontSize:12,height:"100vh",overflow:"auto"}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>크래시</div>
          <pre style={{background:"#2a0a0a",padding:14,borderRadius:7,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{msg}</pre>
          <button onClick={function(){this.setState({err:null});}.bind(this)} style={{marginTop:12,padding:"7px 18px",background:"#e74c3c",color:"#fff",border:"none",borderRadius:5,cursor:"pointer"}}>닫기</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App(){
  var r0=useState([mf("1F",20,15,{})]);var floors=r0[0],setFloors=r0[1];
  var r1=useState(0);var ci=r1[0],setCi=r1[1];
  var r2=useState("Level 1");var lname=r2[0],setLname=r2[1];
  var r3=useState(100);var cellSize=r3[0],setCellSize=r3[1];
  var r3b=useState(400);var floorGap=r3b[0],setFloorGap=r3b[1];
  var r4=useState(500);var wallHL=r4[0],setWallHL=r4[1];
  var r5=useState(250);var wallHM=r5[0],setWallHM=r5[1];
  var r6=useState(150);var wallHS=r6[0],setWallHS=r6[1];
  var r7=useState(300);var decoHL=r7[0],setDecoHL=r7[1];
  var r8=useState(200);var decoHM=r8[0],setDecoHM=r8[1];
  var r9=useState(100);var decoHS=r9[0],setDecoHS=r9[1];
  var r10=useState(T.WALL_L);var tool=r10[0],setTool=r10[1];
  var r11=useState(0);var elev=r11[0],setElev=r11[1];
  var r12=useState(1);var zoom=r12[0],setZoom=r12[1];
  var r13=useState({x:0,y:0});var pan=r13[0],setPan=r13[1];
  var r14=useState(false);var panning=r14[0],setPanning=r14[1];
  var r15=useState(false);var drawing=r15[0],setDrawing=r15[1];
  var r16=useState(true);var grid=r16[0],setGrid=r16[1];
  var r17=useState(null);var hover=r17[0],setHover=r17[1];
  var r18=useState(false);var showExp=r18[0],setShowExp=r18[1];
  var r19=useState("md");var expTab=r19[0],setExpTab=r19[1];
  var r20=useState("");var expContent=r20[0],setExpContent=r20[1];
  var r21=useState("all");var aLayer=r21[0],setALayer=r21[1];
  var r22=useState(false);var showPre=r22[0],setShowPre=r22[1];
  var r23=useState([]);var saved=r23[0],setSaved=r23[1];
  var r24=useState(false);var showSave=r24[0],setShowSave=r24[1];
  var r25=useState("");var saveName=r25[0],setSaveName=r25[1];
  var r26=useState(false);var showImp=r26[0],setShowImp=r26[1];
  var r27=useState("");var impTxt=r27[0],setImpTxt=r27[1];
  var r28=useState("");var impErr=r28[0],setImpErr=r28[1];
  var r29=useState(false);var copied=r29[0],setCopied=r29[1];
  var r30=useState([]);var links=r30[0],setLinks=r30[1];
  var r31=useState(null);var lmode=r31[0],setLmode=r31[1];
  var r32=useState(null);var msg=r32[0],setMsg=r32[1];
  var r33=useState({});var hmap=r33[0],setHmap=r33[1];
  var r34=useState({});var hidx=r34[0],setHidx=r34[1];
  var r35=useState(false);var showCfg=r35[0],setShowCfg=r35[1];
  var r36=useState(null);var tileParam=r36[0],setTileParam=r36[1];
  var r37=useState(false);var mergeMd=r37[0],setMergeMd=r37[1];
  var r38=useState(null);var hstairPick=r38[0],setHstairPick=r38[1];

  var panRef=useRef(null),cvRef=useRef(null),ctRef=useRef(null);
  var ciRef=useRef(ci);useEffect(function(){ciRef.current=ci;},[ci]);
  var flRef=useRef(floors);useEffect(function(){flRef.current=floors;},[floors]);

  var showM=useCallback(function(m,err){setMsg({m:m,err:!!err});setTimeout(function(){setMsg(null);},3000);},[]);

  var vfi=(lmode!=null&&lmode.tfi!=null)?lmode.tfi:ci;
  var vf=floors[vfi]||floors[0];
  var tiles=vf?vf.tiles||{}:{};
  var mw=vf?vf.width||20:20;
  var mh=vf?vf.height||15:15;
  var fid=floors[ci]?floors[ci].id:"";
  var isLP=!!(lmode&&!lmode.isH&&lmode.tfi!=null);
  var isLF=!!(lmode&&!lmode.isH&&lmode.tfi==null);

  var setTiles=useCallback(function(fn){
    setFloors(function(p){var i=ciRef.current,n=p.slice(),f=Object.assign({},n[i]);f.tiles=typeof fn==="function"?fn(f.tiles):fn;n[i]=f;return n;});
  },[]);

  var pushH=useCallback(function(nt){
    setHmap(function(h){var arr=h[fid]||[{}];var ii=hidx[fid]||0;var tr=arr.slice(0,ii+1);tr.push(JSON.parse(JSON.stringify(nt)));if(tr.length>50)tr.shift();var r=Object.assign({},h);r[fid]=tr;return r;});
    setHidx(function(h){var ii=h[fid]||0;var r=Object.assign({},h);r[fid]=Math.min(ii+1,49);return r;});
  },[fid,hidx]);

  var undo=useCallback(function(){var arr=hmap[fid]||[{}];var ii=hidx[fid]||0;if(ii>0){setHidx(function(h){var r=Object.assign({},h);r[fid]=ii-1;return r;});setTiles(JSON.parse(JSON.stringify(arr[ii-1])));};},[fid,hmap,hidx,setTiles]);
  var redo=useCallback(function(){var arr=hmap[fid]||[{}];var ii=hidx[fid]||0;if(ii<arr.length-1){setHidx(function(h){var r=Object.assign({},h);r[fid]=ii+1;return r;});setTiles(JSON.parse(JSON.stringify(arr[ii+1])));};},[fid,hmap,hidx,setTiles]);

  var SKEY="level_designer_v1_user_presets";
  useEffect(function(){try{var _raw=localStorage.getItem(SKEY);if(_raw)setSaved(JSON.parse(_raw));}catch(e){}},[]);

  var buildSaveData=useCallback(function(n){
    return{name:n,savedAt:new Date().toLocaleString("ko-KR"),levelName:lname,links:links,cellSize:cellSize,floorGap:floorGap,wallHL:wallHL,wallHM:wallHM,wallHS:wallHS,decoHL:decoHL,decoHM:decoHM,decoHS:decoHS,
      floors:floors.map(function(f){return{name:f.name,width:f.width,height:f.height,tiles:Object.keys(f.tiles||{}).map(function(k){var v=f.tiles[k],isEK=k.indexOf(",e")===k.length-2,p=pk(isEK?k.slice(0,k.length-2):k);return Object.assign({x:p.x,y:p.y},v);})};})};
  },[floors,lname,links,cellSize,floorGap,wallHL,wallHM,wallHS,decoHL,decoHM,decoHS]);

  var doSave=useCallback(function(sname){
    try{
      var n=(sname&&sname.trim())||lname;
      var data=buildSaveData(n);
      var next=saved.filter(function(p){return p.name!==n;}).concat([data]);
      setSaved(next);localStorage.setItem(SKEY,JSON.stringify(next));
      setShowSave(false);setSaveName("");showM('"'+n+'" 저장 완료');
    }catch(e){showM("저장 실패: "+e.message,true);}
  },[buildSaveData,lname,saved,showM]);

  var doOverwrite=useCallback(function(targetName){
    try{
      var data=buildSaveData(targetName);
      var next=saved.map(function(p){return p.name===targetName?data:p;});
      setSaved(next);localStorage.setItem(SKEY,JSON.stringify(next));
      showM('"'+targetName+'" 덮어쓰기 완료');
    }catch(e){showM("덮어쓰기 실패: "+e.message,true);}
  },[buildSaveData,saved,showM]);

  var doLoad=useCallback(function(data){
    try{
      var fl=data.floors.map(function(f){var t={};(f.tiles||[]).forEach(function(d){var td=Object.assign({},d);delete td.x;delete td.y;var k=(d.layer===L.E)?kf(d.x,d.y)+",e":kf(d.x,d.y);t[k]=td;});return mf(f.name,f.width,f.height,t);});
      setFloors(fl);setLname(data.levelName||"");setLinks(data.links||[]);
      if(data.cellSize)setCellSize(data.cellSize);if(data.floorGap)setFloorGap(data.floorGap);
      if(data.wallHL)setWallHL(data.wallHL);if(data.wallHM)setWallHM(data.wallHM);if(data.wallHS)setWallHS(data.wallHS);
      if(data.decoHL)setDecoHL(data.decoHL);if(data.decoHM)setDecoHM(data.decoHM);if(data.decoHS)setDecoHS(data.decoHS);
      setCi(0);setPan({x:0,y:0});setZoom(1);setHmap({});setHidx({});setLmode(null);setShowPre(false);showM("불러오기 완료");
    }catch(e){showM("불러오기 실패: "+e.message,true);}
  },[showM]);

  var doImport=useCallback(function(){
    setImpErr("");
    try{
      var p=JSON.parse(impTxt);
      var fl=(p.floors||[]).map(function(f){var t={};(f.tiles||[]).forEach(function(d){var td={type:d.type,layer:d.layer};if(d.elevation!==undefined)td.elevation=d.elevation;var k=(d.layer===L.E)?kf(d.x,d.y)+",e":kf(d.x,d.y);t[k]=td;});return mf(f.name,f.width,f.height,t);});
      if(!fl.length){setImpErr("floors 없음");return;}
      setFloors(fl);setLname(p.name||"Imported");setLinks([]);
      if(p.cellSize)setCellSize(p.cellSize);if(p.floorGap)setFloorGap(p.floorGap);
      setCi(0);setPan({x:0,y:0});setZoom(1);setHmap({});setHidx({});setLmode(null);setImpTxt("");setShowImp(false);showM("JSON 불러오기 완료");
    }catch(e){setImpErr("파싱 오류: "+e.message);}
  },[impTxt,showM]);

  var s2g=useCallback(function(cx,cy){var r=ctRef.current&&ctRef.current.getBoundingClientRect();if(!r)return null;return{x:Math.floor((cx-r.left-pan.x)/zoom/GS),y:Math.floor((cy-r.top-pan.y)/zoom/GS)};},[pan,zoom]);

  var place=useCallback(function(x,y,rc){
    try{
      if(x<0||x>=mw||y<0||y>=mh)return;
      var k=kf(x,y),curFi=ciRef.current,curFlen=flRef.current.length;
      var isStairs=!rc&&tool===T.STAIRS,isHStairs=!rc&&tool===T.HSTAIRS;
      setTiles(function(prev){
        var next=Object.assign({},prev);
        if(tool===T.ERASER){
          var lt=prev[k];
          if(lt&&lt.type==="ladder"){
            var ox=lt.originX,oy=lt.originY,n2=Object.assign({},next),edy,edx;
            for(edy=0;edy<=1;edy++)for(edx=0;edx<=1;edx++)delete n2[kf(ox+edx,oy+edy)];
            return n2;
          }
          delete next[k];delete next[k+",e"];
          setLinks(function(sl){return sl.filter(function(l){return!(l.fromFloor===curFi&&l.fromX===x&&l.fromY===y)&&!(l.toFloor===curFi&&l.toX===x&&l.toY===y);});});
          return next;
        }
        if(rc){
          if(prev[k]&&prev[k].type===T.FLOOR){var idx=EC.indexOf(prev[k].elevation||0);var r2=Object.assign({},prev);r2[k]=Object.assign({},prev[k],{elevation:EC[(idx+1)%EC.length]});return r2;}
          return prev;
        }
        if(tool===T.LADDER){
          if(x+1>=mw||y+1>=mh)return prev;
          if(prev[k]&&prev[k].type==="ladder")return prev;
          var nl=Object.assign({},next),ldy,ldx;
          for(ldy=0;ldy<=1;ldy++)for(ldx=0;ldx<=1;ldx++)nl[kf(x+ldx,y+ldy)]={type:"ladder",layer:L.S,originX:x,originY:y};
          return nl;
        }
        var isEntity=TC[tool]&&TC[tool].l===L.E,ek=isEntity?(k+",e"):k;
        if(isEntity){if(prev[ek]&&prev[ek].type===tool)return prev;next[ek]={type:tool,layer:L.E};return next;}
        if(prev[k]&&prev[k].type===tool&&(tool!==T.FLOOR||prev[k].elevation===elev))return prev;
        var td={type:tool,layer:TC[tool].l};if(tool===T.FLOOR)td.elevation=elev;
        next[k]=td;return next;
      });
      if(isStairs&&curFlen>1)setTimeout(function(){setLmode({ffi:curFi,fx:x,fy:y,isH:false,tfi:null});},50);
      if(isHStairs)setTimeout(function(){setHstairPick({x:x,y:y});},50);
    }catch(e){}
  },[tool,elev,mw,mh,setTiles]);

  var doLink=useCallback(function(x,y){
    if(!lmode||lmode.isH||lmode.tfi==null)return;
    var ffi=lmode.ffi,fx=lmode.fx,fy=lmode.fy,tfi=lmode.tfi;
    setLinks(function(sl){var f=sl.filter(function(l){return!(l.fromFloor===ffi&&l.fromX===fx&&l.fromY===fy)&&!(l.fromFloor===tfi&&l.fromX===x&&l.fromY===y);});return f.concat([{fromFloor:ffi,fromX:fx,fromY:fy,toFloor:tfi,toX:x,toY:y}]);});
    setCi(ffi);setLmode(null);
  },[lmode]);

  var onPD=useCallback(function(e){
    if(e.button===2||e.button===1||(e.button===0&&e.altKey)){
      e.preventDefault();
      var g=s2g(e.clientX,e.clientY);
      if(e.button===2&&g&&!lmode){place(g.x,g.y,true);setTiles(function(c){pushH(c);return c;});return;}
      setPanning(true);panRef.current={x:e.clientX-pan.x,y:e.clientY-pan.y};return;
    }
    if(e.button===0){var g=s2g(e.clientX,e.clientY);if(!g)return;if(isLP){doLink(g.x,g.y);return;}if(lmode)return;setDrawing(true);place(g.x,g.y);}
  },[pan,s2g,place,lmode,isLP,doLink,setTiles,pushH]);

  var onPM=useCallback(function(e){var g=s2g(e.clientX,e.clientY);setHover(g);if(panning&&panRef.current){setPan({x:e.clientX-panRef.current.x,y:e.clientY-panRef.current.y});return;}if(drawing&&g&&!lmode)place(g.x,g.y);},[panning,drawing,s2g,place,lmode]);
  var onPU=useCallback(function(){if(drawing&&!lmode)setTiles(function(c){pushH(c);return c;});setPanning(false);setDrawing(false);panRef.current=null;},[drawing,pushH,setTiles,lmode]);
  var onW=useCallback(function(e){e.preventDefault();setZoom(function(z){return Math.max(0.25,Math.min(3,z+(e.deltaY>0?-0.1:0.1)));});},[]);
  useEffect(function(){var el=ctRef.current;if(!el)return;el.addEventListener("wheel",onW,{passive:false});return function(){el.removeEventListener("wheel",onW);};},[onW]);

  useEffect(function(){
    function h(e){
      if(e.key==="Escape"){if(hstairPick){setHstairPick(null);return;}if(tileParam){setTileParam(null);return;}if(lmode){setLmode(null);return;}if(showCfg){setShowCfg(false);return;}}
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"){e.preventDefault();e.shiftKey?redo():undo();return;}
      if(lmode||hstairPick)return;
      var k2=e.key.toUpperCase(),i,tkeys=Object.keys(TC);
      for(i=0;i<tkeys.length;i++){if(TC[tkeys[i]].sc===k2){setTool(tkeys[i]);return;}}
      if(k2===ER.sc)setTool(T.ERASER);
      if(k2==="G")setGrid(function(v){return !v;});
      if(k2==="Z"&&tool===T.FLOOR){var idx=EC.indexOf(elev);setElev(EC[(idx+1)%EC.length]);}
    }
    window.addEventListener("keydown",h);return function(){window.removeEventListener("keydown",h);};
  },[undo,redo,lmode,tool,elev,showCfg,tileParam,hstairPick]);

  var addFloor=function(){setFloors(function(p){return p.concat([mf((p.length+1)+"F",mw,mh,{})]);});setCi(floors.length);};
  var dupFloor=function(){var f=floors[ci];setFloors(function(p){return p.concat([mf(f.name+"복사",f.width,f.height,JSON.parse(JSON.stringify(f.tiles||{})))]);});setCi(floors.length);};
  var delFloor=function(i){if(floors.length<=1)return;setFloors(function(p){return p.filter(function(_,j){return j!==i;});});setCi(function(v){return Math.min(v,floors.length-2);});};
  var clearAll=function(){setTiles({});pushH({});};

  var loadPre=useCallback(function(p){try{var d=p.generate();setFloors(d.floors);setLname(d.levelName);setLinks(d.stairLinks||[]);setCi(0);setPan({x:0,y:0});setZoom(1);setShowPre(false);setHmap({});setHidx({});setLmode(null);showM('"'+d.levelName+'" 불러오기 완료');}catch(e){showM("프리셋 오류: "+e.message,true);}},[showM]);

  var openExp=useCallback(function(tab){
    try{
      setExpContent(tab==="md"?buildMd(floors,links,lname,cellSize,floorGap,wallHL,wallHM,wallHS,decoHL,decoHM,decoHS,mergeMd):buildJSON(floors,links,lname,cellSize,floorGap,wallHL,wallHM,wallHS,decoHL,decoHM,decoHS));
      setExpTab(tab);setShowExp(true);
    }catch(e){showM("Export 오류: "+e.message,true);}
  },[floors,links,lname,cellSize,floorGap,wallHL,wallHM,wallHS,decoHL,decoHM,decoHS,mergeMd,showM]);

  var dlMd=function(){try{window.open("data:text/markdown;charset=utf-8,"+encodeURIComponent(expContent),"_blank");}catch(e){}};
  var doCopy=function(){
    function cp(t){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;left:-9999px";document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand("copy");setCopied(true);setTimeout(function(){setCopied(false);},1500);}finally{document.body.removeChild(ta);}}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(expContent).then(function(){setCopied(true);setTimeout(function(){setCopied(false);},1500);}).catch(function(){cp(expContent);});else cp(expContent);
  };

  var tileParamCfg={
    "wall_l":{label:"벽 大 높이",color:"#6a6a8e",getV:function(){return wallHL;},setV:setWallHL},
    "wall_m":{label:"벽 中 높이",color:"#8b8b9e",getV:function(){return wallHM;},setV:setWallHM},
    "wall_s":{label:"벽 小 높이",color:"#ababbe",getV:function(){return wallHS;},setV:setWallHS},
    "deco_l":{label:"데코 大 높이",color:"#7d6e57",getV:function(){return decoHL;},setV:setDecoHL},
    "deco_m":{label:"데코 中 높이",color:"#6e5a3e",getV:function(){return decoHM;},setV:setDecoHM},
    "deco_s":{label:"데코 小 높이",color:"#5a4a30",getV:function(){return decoHS;},setV:setDecoHS},
  };
  function openTileParam(tkey,e){e.stopPropagation();var cfg=tileParamCfg[tkey];if(!cfg)return;setTileParam({tkey:tkey,label:cfg.label,color:cfg.color,valUU:cfg.getV(),setV:cfg.setV});}

  function confirmHstairDir(dir){
    if(!hstairPick)return;
    var hx=hstairPick.x,hy=hstairPick.y;
    setTiles(function(prev){
      var k=kf(hx,hy);if(!prev[k]||prev[k].type!=="half_stairs")return prev;
      var next=Object.assign({},prev);next[k]=Object.assign({},prev[k],{dir:dir});return next;
    });
    setHstairPick(null);
  }

  var curTiles=floors[ci]?floors[ci].tiles||{}:{};
  var tc=Object.keys(curTiles).length;
  var tcount={};Object.values(curTiles).forEach(function(t){tcount[t.type]=(tcount[t.type]||0)+1;});

  var hstairOverlay=null;
  if(hstairPick){
    var hpx=(hstairPick.x*GS+GS/2)*zoom+pan.x;
    var hpy=(hstairPick.y*GS+GS/2)*zoom+pan.y;
    var arrowSize=Math.round(GS*zoom*1.2);
    var dirs2=[{d:"N",label:"↑",ox:0,oy:-1},{d:"S",label:"↓",ox:0,oy:1},{d:"W",label:"←",ox:-1,oy:0},{d:"E",label:"→",ox:1,oy:0}];
    hstairOverlay=(
      <div style={{position:"absolute",left:hpx,top:hpy,transform:"translate(-50%,-50%)",zIndex:500,pointerEvents:"none"}}>
        <div style={{position:"relative",width:arrowSize*3,height:arrowSize*3,left:-arrowSize,top:-arrowSize}} onPointerDown={function(e){e.stopPropagation();}} onClick={function(e){e.stopPropagation();}}>
          <div style={{position:"absolute",inset:0,background:"#0009",borderRadius:8}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:10,color:"#f1c40f",fontWeight:700,whiteSpace:"nowrap",textAlign:"center",lineHeight:1.2}}>높은쪽<br/>방향</div>
          {dirs2.map(function(ar){return(
            <div key={ar.d} style={{position:"absolute",left:"50%",top:"50%",transform:"translate(calc(-50% + "+(ar.ox*arrowSize)+"px), calc(-50% + "+(ar.oy*arrowSize)+"px))",width:arrowSize,height:arrowSize,background:"#f1c40f",color:"#000",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontSize:Math.max(12,arrowSize*0.5),fontWeight:700,cursor:"pointer",pointerEvents:"all",boxShadow:"0 2px 8px #0008"}} onClick={function(){confirmHstairDir(ar.d);}}>
              {ar.label}
            </div>
          );})}
        </div>
      </div>
    );
  }

  function renderTile(k,t){
    try{
      var isEK=k.indexOf(",e")===k.length-2;
      var coordK=isEK?k.slice(0,k.length-2):k;
      var pos=pk(coordK),x=pos.x,y=pos.y;
      if(t.type==="ladder"){
        if(t.originX!==x||t.originY!==y)return null;
        if(aLayer!=="all"&&t.layer!==Number(aLayer))return null;
        return(<div key={k} style={{position:"absolute",left:x*GS,top:y*GS,width:GS*2,height:GS*2,background:"#8e44ad",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",zIndex:L.S,pointerEvents:"none",userSelect:"none",border:"2px solid #a569bd",borderRadius:3,boxSizing:"border-box"}}>{"🪜"}</div>);
      }
      var cfg=TC[t.type];if(!cfg)return null;
      if(aLayer!=="all"&&t.layer!==Number(aLayer))return null;
      var isSrc=!!(lmode&&lmode.ffi===vfi&&lmode.fx===x&&lmode.fy===y);
      var lk=null,i;
      if(t.type===T.STAIRS||t.type===T.HSTAIRS){for(i=0;i<links.length;i++){var l=links[i];if((l.fromFloor===vfi&&l.fromX===x&&l.fromY===y)||(l.toFloor===vfi&&l.toX===x&&l.toY===y)){lk=l;break;}}}
      var lfi=lk?(lk.fromFloor===vfi&&lk.fromX===x&&lk.fromY===y?lk.toFloor:lk.fromFloor):null;
      var ev=t.elevation||0;
      var bg=isSrc?"#f1c40f":(t.type===T.FLOOR?ECOL[String(ev)]:cfg.color);
      var dirIconMap={N:"↑",S:"↓",W:"←",E:"→"};
      return(
        <div key={k} style={{position:"absolute",left:x*GS,top:y*GS,width:GS,height:GS,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:t.layer===L.E?13:10,color:"#fff",opacity:aLayer==="all"||t.layer===Number(aLayer)?1:0.25,borderRadius:t.type===T.DOOR?2:0,boxShadow:isSrc?"0 0 14px #f1c40f":(lk?"0 0 8px #2ecc71":(t.layer===L.E?"0 0 6px "+cfg.color+"88":"")),zIndex:t.layer,pointerEvents:"none",userSelect:"none",outline:isSrc?"2px solid #fff":(ev===1?"1px solid #6a8a5a":(ev===-1?"1px solid #5a5a7a":"none"))}}>
          <span style={{fontSize:10}}>{t.type===T.FLOOR?EI[String(ev)]:cfg.icon}</span>
          {t.type==="half_stairs"&&t.dir&&<div style={{position:"absolute",bottom:1,right:2,fontSize:9,color:"#f1c40f",fontWeight:700}}>{dirIconMap[t.dir]||"?"}</div>}
          {lk&&!isSrc&&lfi!=null&&floors[lfi]&&<div style={{position:"absolute",top:-9,right:-9,background:"#2ecc71",color:"#000",fontSize:8,padding:"1px 3px",borderRadius:3,whiteSpace:"nowrap",zIndex:200,fontWeight:700}}>{floors[lfi].name}</div>}
          {t.type===T.FLOOR&&ev!==0&&<div style={{position:"absolute",bottom:1,right:2,fontSize:7,color:ev===1?"#9aba8a":"#8a8aaa",fontWeight:700}}>{ev===1?"+1/2":"-1/2"}</div>}
        </div>
      );
    }catch(e){return null;}
  }

  var glines=[],gx,gy;
  if(grid){for(gx=0;gx<=mw;gx++)glines.push(<line key={"v"+gx} x1={gx*GS} y1={0} x2={gx*GS} y2={mh*GS} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>);for(gy=0;gy<=mh;gy++)glines.push(<line key={"h"+gy} x1={0} y1={gy*GS} x2={mw*GS} y2={gy*GS} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>);}

  var lnames=["바닥","구조물","엔티티"];
  var inp={background:"#1a1a28",border:"1px solid #2a2a3a",borderRadius:5,color:"#e8e8f0",outline:"none",boxSizing:"border-box"};

  return(
    <div style={{width:"100%",height:"100vh",display:"flex",background:"#0e0e14",fontFamily:"monospace",color:"#c8c8d4",overflow:"hidden",fontSize:"200%"}}>
      <style>{"@keyframes fU{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}"}</style>
      {msg&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:msg.err?"#c0392b":"#27ae60",color:"#fff",padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:600,zIndex:9999,pointerEvents:"none",animation:"fU .15s ease"}}>{msg.m}</div>}

      <div style={{width:280,minWidth:280,background:"#14141e",borderRight:"1px solid #2a2a3a",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 14px 12px",borderBottom:"1px solid #2a2a3a"}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#6c6c8a",marginBottom:8}}>Level Designer</div>
          <input value={lname} onChange={function(e){setLname(e.target.value);}} placeholder="프로젝트 이름" style={Object.assign({},inp,{width:"100%",padding:"8px 10px",fontSize:15})}/>
        </div>

        {lmode&&(lmode.isH||flRef.current.length>1)&&(
          <div style={{padding:"10px 12px",background:"#1a1a0a",borderBottom:"2px solid #f1c40f",flexShrink:0}}>
            <div style={{fontSize:15,fontWeight:700,color:"#f1c40f",marginBottom:8}}>계단 연결</div>
            <div style={{fontSize:13,color:"#9a8a5a",marginBottom:10,lineHeight:1.5}}>
              {floors[lmode.ffi]&&<span style={{color:"#f1c40f",fontWeight:700}}>{floors[lmode.ffi].name}</span>} ({lmode.fx},{lmode.fy})<br/>
              {isLF?"연결할 층 선택":("연결: "+(floors[lmode.tfi]&&floors[lmode.tfi].name)+" -- 클릭")}
            </div>
            {!lmode.isH&&(
              <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8}}>
                {floors.map(function(f,i){if(i===lmode.ffi)return null;var sel=lmode.tfi===i;return(
                  <button key={i} onClick={function(){var idx=i;setLmode(function(lm){return Object.assign({},lm,{tfi:idx});});setPan({x:0,y:0});}} style={{padding:"5px 8px",borderRadius:5,border:"1px solid "+(sel?"#2ecc71":"#2a2a3a"),background:sel?"#2ecc7122":"#0e0e14",color:sel?"#2ecc71":"#9999aa",fontSize:12,cursor:"pointer",textAlign:"left"}}>
                    {sel?"▶ ":""}{f.name}
                  </button>
                );})}
              </div>
            )}
            <button onClick={function(){setLmode(null);}} style={{width:"100%",padding:"6px 0",background:"transparent",color:"#e74c3c88",border:"1px solid #e74c3c33",borderRadius:5,cursor:"pointer",fontSize:12}}>ESC 취소</button>
          </div>
        )}

        {!lmode&&(
          <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{padding:"8px 12px",borderBottom:"1px solid #2a2a3a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:600,color:"#6c6c8a",textTransform:"uppercase"}}>층 관리</span>
                <div style={{display:"flex",gap:3}}>
                  <button onClick={addFloor} style={{background:"#2ecc7122",border:"1px solid #2ecc7144",color:"#2ecc71",borderRadius:4,padding:"2px 9px",cursor:"pointer",fontSize:16,fontWeight:700}}>+</button>
                  <button onClick={dupFloor} style={{background:"#5865f222",border:"1px solid #5865f244",color:"#8b93ff",borderRadius:4,padding:"2px 9px",cursor:"pointer",fontSize:14}}>{"⧉"}</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2,maxHeight:90,overflowY:"auto"}}>
                {floors.map(function(f,i){return(
                  <div key={f.id} style={{display:"flex",alignItems:"center",gap:3}}>
                    <button onClick={function(){var idx=i;setCi(idx);setPan({x:0,y:0});}} style={{flex:1,padding:"6px 9px",borderRadius:4,border:"1px solid "+(i===ci?"#5865f2":"#2a2a3a"),background:i===ci?"#5865f222":"transparent",color:i===ci?"#8b93ff":"#9999aa",fontSize:14,cursor:"pointer",textAlign:"left",fontWeight:i===ci?700:400}}>{f.name}</button>
                    {floors.length>1&&<button onClick={function(){delFloor(i);}} style={{background:"none",border:"1px solid #e74c3c33",color:"#e74c3c88",borderRadius:3,padding:"2px 6px",cursor:"pointer",fontSize:12}}>{"✕"}</button>}
                  </div>
                );})}
              </div>
            </div>
            <div style={{padding:"8px 12px",borderBottom:"1px solid #2a2a3a"}}>
              <input value={floors[ci]?floors[ci].name:""} onChange={function(e){var v=e.target.value;setFloors(function(p){var i=ciRef.current,n=p.slice();n[i]=Object.assign({},n[i],{name:v});return n;});}} placeholder="층 이름" style={Object.assign({},inp,{width:"100%",padding:"5px 7px",fontSize:12,marginBottom:5})}/>
              <div style={{display:"flex",gap:6}}>
                {[["W",mw,function(w){setFloors(function(p){var i=ciRef.current,n=p.slice();n[i]=Object.assign({},n[i],{width:w});return n;});}],["H",mh,function(h){setFloors(function(p){var i=ciRef.current,n=p.slice();n[i]=Object.assign({},n[i],{height:h});return n;});}]].map(function(item){return(
                  <div key={item[0]} style={{flex:1}}>
                    <div style={{fontSize:10,color:"#555",marginBottom:2}}>{item[0]}</div>
                    <input type="number" value={item[1]} min={5} max={200} onChange={function(e){item[2](Math.max(5,Number(e.target.value)));}} style={Object.assign({},inp,{width:"100%",padding:"4px 5px",fontSize:12})}/>
                  </div>
                );})}
              </div>
            </div>
            <div style={{padding:"8px 12px",borderBottom:"1px solid #2a2a3a"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#6c6c8a",marginBottom:6,textTransform:"uppercase"}}>레이어</div>
              <div style={{display:"flex",gap:4}}>
                {["all","0","1","2"].map(function(l){return <button key={l} onClick={function(){setALayer(l);}} style={{flex:1,padding:"5px 0",borderRadius:4,border:"1px solid "+(aLayer===l?"#5865f2":"#2a2a3a"),background:aLayer===l?"#5865f222":"transparent",color:aLayer===l?"#8b93ff":"#6c6c8a",fontSize:12,cursor:"pointer",fontWeight:600}}>{l==="all"?"전체":lnames[Number(l)]}</button>;})}
              </div>
            </div>
            <div style={{padding:"8px 12px",flex:1,overflowY:"auto"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#6c6c8a",marginBottom:6,textTransform:"uppercase"}}>도구</div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {Object.keys(TC).map(function(tkey){
                  var cfg=TC[tkey],hasPm=!!tileParamCfg[tkey];
                  return(
                    <div key={tkey}>
                      <div style={{display:"flex",alignItems:"center",gap:2}}>
                        <button onClick={function(){setTool(tkey);}} style={{flex:1,display:"flex",alignItems:"center",gap:7,padding:"7px 8px",borderRadius:4,border:"none",background:tool===tkey?"#5865f222":"transparent",cursor:"pointer",color:tool===tkey?"#8b93ff":"#9999aa",fontSize:14,textAlign:"left",outline:tool===tkey?"1px solid #5865f2":"none"}}>
                          <span style={{width:26,height:26,borderRadius:3,background:(tkey===T.FLOOR&&tool===tkey)?ECOL[String(elev)]:cfg.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",flexShrink:0}}>{(tkey===T.FLOOR&&tool===tkey)?EI[String(elev)]:cfg.icon}</span>
                          <span style={{flex:1,fontSize:13}}>{cfg.label}{(tkey===T.FLOOR&&tool===tkey)?(" ("+ELB[String(elev)]+")"):""}</span>
                          <span style={{fontSize:12,color:"#555"}}>{cfg.sc}</span>
                        </button>
                        {hasPm&&<button onClick={function(e){openTileParam(tkey,e);}} style={{flexShrink:0,width:22,height:22,borderRadius:4,border:"1px solid #2a2a3a",background:"#1a1a28",color:"#666",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{"⚙"}</button>}
                      </div>
                      {tkey===T.FLOOR&&tool===T.FLOOR&&(
                        <div style={{display:"flex",gap:2,padding:"2px 8px 5px"}}>
                          {EC.map(function(e){return <button key={e} onClick={function(){setElev(e);}} style={{flex:1,padding:"3px 0",borderRadius:3,border:"1px solid "+(elev===e?ECOL[String(e)]:"#2a2a3a"),background:elev===e?ECOL[String(e)]+"44":"transparent",color:elev===e?"#e8e8f0":"#666",fontSize:11,cursor:"pointer",fontWeight:elev===e?700:400}}>{EI[String(e)]} {ELB[String(e)]}</button>;})}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={function(){setTool(T.ERASER);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 8px",borderRadius:4,border:"none",background:tool===T.ERASER?"#5865f222":"transparent",cursor:"pointer",color:tool===T.ERASER?"#8b93ff":"#9999aa",fontSize:14,textAlign:"left",outline:tool===T.ERASER?"1px solid #5865f2":"none",marginTop:4}}>
                  <span style={{width:26,height:26,borderRadius:3,background:ER.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",flexShrink:0}}>{ER.icon}</span>
                  <span style={{flex:1,fontSize:13}}>{ER.label}</span>
                  <span style={{fontSize:12,color:"#555"}}>{ER.sc}</span>
                </button>
              </div>
              <div style={{marginTop:9,padding:"7px 8px",background:"#1a1a28",borderRadius:4,fontSize:11,color:"#555",lineHeight:1.6}}>바닥 우클릭: elevation | Z: 전환</div>
            </div>
            <div style={{padding:"8px 12px",borderTop:"1px solid #2a2a3a",fontSize:11,color:"#6c6c8a"}}>
              <div style={{marginBottom:3}}>타일: {tc}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"1px 8px",fontSize:10}}>{Object.keys(tcount).map(function(t){return <span key={t}>{TC[t]?TC[t].label:t}:{tcount[t]}</span>;})}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:52,background:lmode?"#1a1a0a":"#14141e",borderBottom:"1px solid "+(lmode?"#f1c40f44":"#2a2a3a"),display:"flex",alignItems:"center",padding:"0 14px",gap:6,flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700,color:lmode?"#f1c40f":"#8b93ff",padding:"3px 10px",background:lmode?"#f1c40f22":"#5865f222",borderRadius:4,border:"1px solid "+(lmode?"#f1c40f44":"#5865f244"),marginRight:3}}>{vf&&vf.name}{lmode&&<span style={{fontSize:12,color:"#9a8a5a",marginLeft:5}}>{isLP?"클릭 연결":"층 선택"}</span>}</div>
          {!lmode&&(
            <React.Fragment>
              <div style={{width:1,height:20,background:"#2a2a3a"}}/>
              <button onClick={undo} style={TB}>{"↩"}</button>
              <button onClick={redo} style={TB}>{"↪"}</button>
              <div style={{width:1,height:20,background:"#2a2a3a"}}/>
              <button onClick={function(){setGrid(function(v){return !v;});}} style={Object.assign({},TB,{color:grid?"#8b93ff":"#6c6c8a"})}>{"▦"}</button>
            </React.Fragment>
          )}
          <button onClick={function(){setZoom(function(z){return Math.min(3,z+0.2);});}} style={TB}>+</button>
          <span style={{fontSize:11,color:"#6c6c8a",minWidth:40,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={function(){setZoom(function(z){return Math.max(0.25,z-0.2);});}} style={TB}>-</button>
          <button onClick={function(){setZoom(1);setPan({x:0,y:0});}} style={TB}>{"⌂"}</button>
          <div style={{flex:1}}/>
          {hover&&hover.x>=0&&hover.x<mw&&hover.y>=0&&hover.y<mh&&<span style={{fontSize:13,color:"#6c6c8a"}}>({hover.x},{hover.y})</span>}
          {!lmode&&(
            <React.Fragment>
              <div style={{width:1,height:20,background:"#2a2a3a"}}/>
              <button onClick={function(){setShowCfg(true);}} style={Object.assign({},TB,{color:"#f39c12",fontSize:13})}>{"⚙"}</button>
              <button onClick={clearAll} style={Object.assign({},TB,{color:"#e74c3c"})}>{"🗑"}</button>
              <button onClick={function(){setShowPre(true);}} style={Object.assign({},TB,{color:"#2ecc71",fontSize:12})}>{"📦 프리셋"}</button>
              <button onClick={function(){setSaveName(lname);setShowSave(true);}} style={Object.assign({},TB,{color:"#f1c40f",fontSize:12})}>{"💾"}</button>
              <button onClick={function(){setImpTxt("");setImpErr("");setShowImp(true);}} style={Object.assign({},TB,{color:"#9b59b6",fontSize:12})}>{"📥"}</button>
              <button onClick={function(){setMergeMd(function(v){return !v;});}} style={Object.assign({},TB,{background:mergeMd?"#f39c1233":"transparent",color:mergeMd?"#f39c12":"#6c6c8a",border:"1px solid "+(mergeMd?"#f39c1266":"#2a2a3a"),borderRadius:5,padding:"5px 10px",fontSize:11,fontWeight:700,flexDirection:"column",lineHeight:1.2,gap:2})}>
                <span style={{fontSize:13}}>{"⬛"}</span>
                <span style={{fontSize:9,whiteSpace:"nowrap"}}>{mergeMd?"병합ON":"병합OFF"}</span>
              </button>
              <button onClick={function(){openExp("md");}} style={Object.assign({},TB,{background:"#5865f2",color:"#fff",borderRadius:5,padding:"5px 14px",fontSize:12})}>Export</button>
            </React.Fragment>
          )}
          {lmode&&<button onClick={function(){setLmode(null);}} style={Object.assign({},TB,{color:"#e74c3c",borderColor:"#e74c3c44",fontSize:12})}>ESC</button>}
        </div>

        <div style={{position:"relative",flex:1,overflow:"hidden"}}>
          {isLF&&<div style={{position:"absolute",inset:0,background:"#0008",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,pointerEvents:"none"}}><div style={{textAlign:"center",color:"#f1c40f"}}><div style={{fontSize:36,marginBottom:6}}>{"⌗"}</div><div style={{fontSize:16,fontWeight:700}}>연결할 층을 왼쪽에서 선택하세요</div></div></div>}
          {isLP&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#1a1a0acc",border:"1px solid #f1c40f55",borderRadius:7,padding:"7px 16px",zIndex:50,pointerEvents:"none",display:"flex",alignItems:"center",gap:7}}><span style={{color:"#f1c40f"}}>{"⌗"}</span><span style={{fontSize:12,color:"#e8e8f0"}}>연결할 지점 클릭</span><span style={{fontSize:10,color:"#9a8a5a"}}>ESC</span></div>}
          <div ref={ctRef} style={{width:"100%",height:"100%",overflow:"hidden",cursor:isLP?"crosshair":(panning?"grabbing":"crosshair"),background:"#0a0a12"}} onContextMenu={function(e){e.preventDefault();}} onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU}>
            <div ref={cvRef} style={{position:"absolute",left:0,top:0,transform:"translate("+pan.x+"px,"+pan.y+"px) scale("+zoom+")",transformOrigin:"0 0"}}>
              <div style={{width:mw*GS,height:mh*GS,background:"#181824",position:"relative",boxShadow:"0 0 60px #0005",outline:isLP?"2px solid #f1c40f55":"none"}}>
                <svg width={mw*GS} height={mh*GS} style={{position:"absolute",top:0,left:0,pointerEvents:"none"}}>{glines}</svg>
                {Object.keys(tiles).map(function(k){return renderTile(k,tiles[k]);})}
                {hstairPick&&hstairOverlay}
                {hover&&hover.x>=0&&hover.x<mw&&hover.y>=0&&hover.y<mh&&<div style={{position:"absolute",left:hover.x*GS,top:hover.y*GS,width:GS,height:GS,border:"2px solid "+(isLP?"#f1c40f88":"#5865f288"),borderRadius:2,pointerEvents:"none",zIndex:100,boxSizing:"border-box"}}/>}
              </div>
            </div>
            {tc===0&&!lmode&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",color:"#3a3a5a",pointerEvents:"none"}}><div style={{fontSize:50,marginBottom:8}}>{"▣"}</div><div style={{fontSize:16,fontWeight:600}}>클릭하여 타일 배치</div></div>}
          </div>
        </div>
      </div>

      {tileParam&&(
        <div style={{position:"fixed",inset:0,background:"#0006",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1300}} onClick={function(){setTileParam(null);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"2px solid "+tileParam.color,padding:22,width:260,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:12,height:12,borderRadius:2,background:tileParam.color,display:"inline-block",flexShrink:0}}/>
              <span style={{fontWeight:700,fontSize:13,color:"#e8e8f0",flex:1}}>{tileParam.label}</span>
              <button onClick={function(){setTileParam(null);}} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:18,lineHeight:1,padding:0}}>{"×"}</button>
            </div>
            <div>
              <div style={{fontSize:11,color:"#6c6c8a",marginBottom:6}}>높이 (m)</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" autoFocus value={tileParam.valUU/100} min={0.1} max={20} step={0.1}
                  onChange={function(e){var v=Math.round(Number(e.target.value)*100);setTileParam(function(p){return Object.assign({},p,{valUU:v});});}}
                  onKeyDown={function(e){if(e.key==="Enter"){tileParam.setV(tileParam.valUU);showM(tileParam.label+" "+(tileParam.valUU/100)+"m 적용");setTileParam(null);}if(e.key==="Escape")setTileParam(null);}}
                  style={Object.assign({},inp,{flex:1,padding:"8px 10px",fontSize:16,fontWeight:700})}/>
                <span style={{fontSize:12,color:"#6c6c8a",minWidth:52,textAlign:"right"}}>{tileParam.valUU+" UU"}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){tileParam.setV(tileParam.valUU);showM(tileParam.label+" "+(tileParam.valUU/100)+"m 적용");setTileParam(null);}} style={{flex:1,padding:"9px 0",background:tileParam.color,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:13}}>적용</button>
              <button onClick={function(){setTileParam(null);}} style={{flex:1,padding:"9px 0",background:"transparent",color:"#9999aa",border:"1px solid #2a2a3a",borderRadius:6,cursor:"pointer",fontSize:13}}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showCfg&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200}} onClick={function(){setShowCfg(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"1px solid #f39c1244",padding:22,width:380,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#f39c12"}}>{"⚙ UE 단위 설정"}</span>
              <button onClick={function(){setShowCfg(false);}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>{"×"}</button>
            </div>
            {[
              ["셀 크기 (m/칸)",cellSize/100,function(v){setCellSize(Math.round(v*100));},0.5,10,"기본 1m/칸"],
              ["층간 Z 간격 (m)",floorGap/100,function(v){setFloorGap(Math.round(v*100));},1,20,"기본 4m"],
              ["벽 大 높이 (m)",wallHL/100,function(v){setWallHL(Math.round(v*100));},0.5,20,"기본 5m"],
              ["벽 中 높이 (m)",wallHM/100,function(v){setWallHM(Math.round(v*100));},0.5,10,"기본 2.5m"],
              ["벽 小 높이 (m)",wallHS/100,function(v){setWallHS(Math.round(v*100));},0.5,5,"기본 1.5m"],
              ["데코 大 높이 (m)",decoHL/100,function(v){setDecoHL(Math.round(v*100));},0.1,10,"기본 3m"],
              ["데코 中 높이 (m)",decoHM/100,function(v){setDecoHM(Math.round(v*100));},0.1,5,"기본 2m"],
              ["데코 小 높이 (m)",decoHS/100,function(v){setDecoHS(Math.round(v*100));},0.1,3,"기본 1m"],
            ].map(function(item,idx){return(
              <div key={idx} style={{borderTop:idx===2?"1px solid #2a2a3a":undefined,paddingTop:idx===2?10:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,color:idx>=5?"#7d6e57":"#c8c8d4"}}>{item[0]}</span>
                  <span style={{fontSize:10,color:"#555"}}>{item[5]}</span>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input type="number" value={item[1]} min={item[3]} max={item[4]} step={0.1} onChange={function(e){item[2](Number(e.target.value));}} style={Object.assign({},inp,{flex:1,padding:"6px 8px",fontSize:13})}/>
                  <span style={{fontSize:11,color:"#6c6c8a",minWidth:52}}>{Math.round(item[1]*100)+" UU"}</span>
                </div>
              </div>
            );})}
            <button onClick={function(){setShowCfg(false);showM("설정 저장됨");}} style={{padding:"9px 0",background:"#f39c12",color:"#000",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:13}}>확인</button>
          </div>
        </div>
      )}

      {showPre&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={function(){setShowPre(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"1px solid #2a2a3a",padding:20,width:460,maxHeight:"80vh",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:15}}>프리셋 / 내 저장</span>
              <button onClick={function(){setShowPre(false);}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>{"×"}</button>
            </div>
            <div style={{fontSize:12,color:"#e74c3c",padding:"7px 10px",background:"#e74c3c11",borderRadius:5,border:"1px solid #e74c3c33"}}>현재 작업이 교체됩니다.</div>
            <div style={{fontSize:10,fontWeight:700,color:"#6c6c8a",textTransform:"uppercase"}}>기본 프리셋</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {PRESETS.map(function(p){return(
                <button key={p.id} onClick={function(){loadPre(p);}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 10px",borderRadius:7,border:"1px solid #2a2a3a",background:"#14141e",cursor:"pointer",textAlign:"left"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="#5865f2";e.currentTarget.style.background="#5865f211";}} onMouseLeave={function(e){e.currentTarget.style.borderColor="#2a2a3a";e.currentTarget.style.background="#14141e";}}>
                  <span style={{fontSize:24,lineHeight:1,flexShrink:0}}>{p.icon}</span>
                  <div><div style={{fontWeight:700,fontSize:12,color:"#e8e8f0",marginBottom:2}}>{p.label}</div><div style={{fontSize:11,color:"#6c6c8a"}}>{p.desc}</div></div>
                </button>
              );})}
            </div>
            <div style={{fontSize:10,fontWeight:700,color:"#6c6c8a",textTransform:"uppercase"}}>{"내 저장 프리셋"+(saved.length>0?" ("+saved.length+")":"")}</div>
            {saved.length===0
              ?<div style={{fontSize:11,color:"#444",padding:"10px",textAlign:"center",border:"1px dashed #2a2a3a",borderRadius:7}}>저장된 프리셋 없음</div>
              :<div style={{display:"flex",flexDirection:"column",gap:4,overflowY:"auto",maxHeight:160}}>
                {saved.map(function(p){return(
                  <div key={p.name} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderRadius:7,border:"1px solid #2a2a3a",background:"#14141e"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:12,color:"#e8e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                      <div style={{fontSize:10,color:"#555"}}>{p.savedAt+" · "+(p.floors&&p.floors.length)+"층"}</div>
                    </div>
                    <button onClick={function(){doLoad(p);}} style={{padding:"4px 10px",borderRadius:5,border:"1px solid #5865f244",background:"#5865f222",color:"#8b93ff",cursor:"pointer",fontSize:11,fontWeight:700}}>불러오기</button>
                    <button onClick={function(){doOverwrite(p.name);}} title="현재 작업으로 덮어쓰기" style={{padding:"4px 8px",borderRadius:5,border:"1px solid #f39c1244",background:"#f39c1211",color:"#f39c12",cursor:"pointer",fontSize:11,fontWeight:700}}>{"↩저장"}</button>
                    <button onClick={function(){var n=saved.filter(function(x){return x.name!==p.name;});setSaved(n);localStorage.setItem(SKEY,JSON.stringify(n));}} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #e74c3c33",background:"none",color:"#e74c3c88",cursor:"pointer",fontSize:11}}>{"×"}</button>
                  </div>
                );})}
              </div>}
          </div>
        </div>
      )}

      {showSave&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100}} onClick={function(){setShowSave(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"1px solid #f1c40f44",padding:20,width:360,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#f1c40f"}}>{"💾 저장"}</span>
              <button onClick={function(){setShowSave(false);}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>{"×"}</button>
            </div>
            <input value={saveName} onChange={function(e){setSaveName(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")doSave(saveName);}} placeholder="프리셋 이름..." autoFocus style={Object.assign({},inp,{width:"100%",padding:"8px 10px",fontSize:13})}/>
            {saved.some(function(p){return p.name===(saveName&&saveName.trim()||lname);})&&(
              <React.Fragment>
                <div style={{fontSize:11,color:"#f39c12",padding:"6px 9px",background:"#f39c1211",borderRadius:4,border:"1px solid #f39c1233"}}>{"⚠ '"+(saveName&&saveName.trim()||lname)+"' 이(가) 이미 존재합니다."}</div>
                <button onClick={function(){doOverwrite(saveName&&saveName.trim()||lname);setShowSave(false);setSaveName("");}} style={{width:"100%",padding:"9px 0",background:"#e67e22",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:13}}>{"↩ 덮어쓰기"}</button>
                <div style={{textAlign:"center",fontSize:10,color:"#555",marginTop:-4}}>또는 아래에서 새 이름으로 저장</div>
              </React.Fragment>
            )}
            <div style={{display:"flex",gap:7}}>
              <button onClick={function(){doSave(saveName);}} style={{flex:1,padding:"9px 0",background:"#f1c40f",color:"#000",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:13}}>저장</button>
              <button onClick={function(){setShowSave(false);}} style={{flex:1,padding:"9px 0",background:"transparent",color:"#9999aa",border:"1px solid #2a2a3a",borderRadius:6,cursor:"pointer",fontSize:13}}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showImp&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100}} onClick={function(){setShowImp(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"1px solid #9b59b644",padding:20,width:480,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#9b59b6"}}>{"📥 JSON 불러오기"}</span>
              <button onClick={function(){setShowImp(false);}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>{"×"}</button>
            </div>
            <textarea value={impTxt} onChange={function(e){setImpTxt(e.target.value);setImpErr("");}} placeholder='{"name":"...","floors":[...]}' style={Object.assign({},inp,{width:"100%",height:140,color:"#8b93ff",fontSize:11,fontFamily:"monospace",padding:10,resize:"none",border:"1px solid "+(impErr?"#e74c3c":"#9b59b644")})}/>
            {impErr&&<div style={{fontSize:11,color:"#e74c3c"}}>{impErr}</div>}
            <div style={{display:"flex",gap:7}}>
              <button onClick={doImport} style={{flex:1,padding:"9px 0",background:"#9b59b6",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:13}}>불러오기</button>
              <button onClick={function(){setShowImp(false);}} style={{flex:1,padding:"9px 0",background:"transparent",color:"#9999aa",border:"1px solid #2a2a3a",borderRadius:6,cursor:"pointer",fontSize:13}}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showExp&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={function(){setShowExp(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#1a1a28",borderRadius:10,border:"1px solid #2a2a3a",padding:20,width:660,maxHeight:"90vh",display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14}}>{"Export ("+floors.length+"개 층 · "+cellSize+"UU/칸 · "+floorGap+"UU 층간격)"}</span>
              <button onClick={function(){setShowExp(false);}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>{"×"}</button>
            </div>
            <div style={{display:"flex",gap:5}}>
              {[["md","Markdown"],["json","JSON"]].map(function(item){return(
                <button key={item[0]} onClick={function(){openExp(item[0]);}} style={{padding:"6px 16px",borderRadius:5,border:"1px solid "+(expTab===item[0]?"#5865f2":"#2a2a3a"),background:expTab===item[0]?"#5865f222":"transparent",color:expTab===item[0]?"#8b93ff":"#6c6c8a",cursor:"pointer",fontSize:12,fontWeight:600}}>{item[1]}</button>
              );})}
            </div>
            <textarea readOnly value={expContent} style={Object.assign({},inp,{width:"100%",flex:1,minHeight:320,color:expTab==="md"?"#c8c8d4":"#8b93ff",fontSize:11,fontFamily:"monospace",padding:12,resize:"none",whiteSpace:"pre",overflowY:"auto",border:"1px solid #2a2a3a"})}/>
            <div style={{display:"flex",gap:8}}>
              {expTab==="md"&&<button onClick={dlMd} style={{flex:1,padding:"10px 0",background:"#2ecc71",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:12}}>{"📥 .md 다운로드"}</button>}
              <button onClick={doCopy} style={{flex:1,padding:"10px 0",background:"#5865f2",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:12}}>{copied?"복사됨!":"📋 복사"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Root(){return(<ErrBoundary><App/></ErrBoundary>);}
