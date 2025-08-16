"use strict";(()=>{var a=class{constructor(e){this.id=e,this.createdAt=new Date}getId(){return this.id}getAge(){return Date.now()-this.createdAt.getTime()}},o=class s extends a{constructor(e,t,r,i,n){super(e),this.name=t,this.email=r,this.age=n,this.preferences=i}validate(){return this.name.length>0&&this.email.includes("@")&&(this.age===void 0||this.age>0)}updatePreferences(e){this.preferences={...this.preferences,...e}}static createUser(e){let t=Math.random().toString(36).substr(2,9);return new s(t,e.name,e.email,e.preferences,e.age)}},c=class{constructor(){this.items=new Map}save(e){this.items.set(e.getId(),e)}findById(e){return this.items.get(e)}findAll(){return Array.from(this.items.values())}delete(e){return this.items.delete(e)}count(){return this.items.size}findWhere(e,t){return this.findAll().filter(r=>r[e]===t)}},l=class{constructor(e="/api"){this.baseUrl=e}async request(e,t,r){try{let i=await fetch(`${this.baseUrl}${t}`,{method:e,headers:{"Content-Type":"application/json"},body:r?JSON.stringify(r):void 0}),n=await i.json();return{success:i.ok,data:n,message:i.ok?"Success":"Request failed",timestamp:Date.now()}}catch(i){return{success:!1,data:null,message:i instanceof Error?i.message:"Unknown error",timestamp:Date.now()}}}async getUsers(){return this.request("GET","/users")}async getUserById(e){return this.request("GET",`/users/${e}`)}async updateUser(e,t){return this.request("PUT",`/users/${e}`,t)}},p=class{constructor(){this.listeners=new Map}on(e,t){this.listeners.has(e)||this.listeners.set(e,[]),this.listeners.get(e).push(t)}emit(e,...t){let r=this.listeners.get(e);r&&r.forEach(i=>i(...t))}off(e,t){let r=this.listeners.get(e);if(r){let i=r.indexOf(t);i>-1&&r.splice(i,1)}}};function g(){return{theme:"light",language:"zh-CN",notifications:{email:!0,push:!0,sms:!1}}}function m(s){return s&&typeof s.id=="string"&&typeof s.name=="string"&&typeof s.email=="string"&&s.preferences&&s.createdAt instanceof Date}function d(s,e,t){let r=t.value;t.value=function(...i){console.log(`\u8C03\u7528\u65B9\u6CD5: ${e}`,i);let n=r.apply(this,i);return console.log(`\u65B9\u6CD5\u7ED3\u679C: ${e}`,n),n}}var u=class{constructor(){this.userRepository=new c,this.apiService=new l,this.eventEmitter=new p,this.setupEventListeners()}setupEventListeners(){this.eventEmitter.on("userCreated",e=>{console.log("\u2705 \u7528\u6237\u521B\u5EFA:",e.name)}),this.eventEmitter.on("userUpdated",(e,t)=>{console.log("\u{1F4DD} \u7528\u6237\u66F4\u65B0:",e.name,t)}),this.eventEmitter.on("error",e=>{console.error("\u274C \u9519\u8BEF:",e.message)})}@d createUser(e){try{let t=o.createUser(e);if(!t.validate())throw new Error("\u7528\u6237\u6570\u636E\u9A8C\u8BC1\u5931\u8D25");return this.userRepository.save(t),this.eventEmitter.emit("userCreated",t),t}catch(t){throw this.eventEmitter.emit("error",t),t}}@d updateUser(e,t){try{let r=this.userRepository.findById(e);if(!r)throw new Error(`\u7528\u6237\u4E0D\u5B58\u5728: ${e}`);if(Object.assign(r,t),!r.validate())throw new Error("\u66F4\u65B0\u540E\u7684\u7528\u6237\u6570\u636E\u9A8C\u8BC1\u5931\u8D25");return this.userRepository.save(r),this.eventEmitter.emit("userUpdated",r,t),r}catch(r){return this.eventEmitter.emit("error",r),null}}getUsers(){return this.userRepository.findAll()}getUserById(e){return this.userRepository.findById(e)}async syncWithServer(){try{console.log("\u{1F504} \u5F00\u59CB\u4E0E\u670D\u52A1\u5668\u540C\u6B65...");let e=await this.apiService.getUsers();if(e.success&&Array.isArray(e.data))e.data.forEach(t=>{if(m(t)){let r=new o(t.id,t.name,t.email,t.preferences,t.age);this.userRepository.save(r)}}),console.log(`\u2705 \u540C\u6B65\u5B8C\u6210: ${e.data.length} \u4E2A\u7528\u6237`);else throw new Error(e.message)}catch(e){this.eventEmitter.emit("error",e)}}};async function h(){console.log("\u{1F680} TypeScript \u7279\u6027\u6F14\u793A\u5F00\u59CB");let s=new u,e=s.createUser({name:"\u5F20\u4E09",email:"zhangsan@example.com",age:30,preferences:g()}),t=s.createUser({name:"\u674E\u56DB",email:"lisi@example.com",preferences:{theme:"dark",language:"en-US",notifications:{email:!1,push:!0}}});return console.log("\u{1F465} \u521B\u5EFA\u7684\u7528\u6237:",s.getUsers().map(r=>r.name)),s.updateUser(e.getId(),{name:"\u5F20\u4E09\u4E30",preferences:{theme:"dark",language:"zh-CN",notifications:{email:!0,push:!0,sms:!0}}}),console.log("\u{1F4DD} \u66F4\u65B0\u540E\u7684\u7528\u6237:",s.getUserById(e.getId())?.name),console.log("\u{1F4CA} TypeScript \u7F16\u8BD1\u4FE1\u606F:"),console.log("- \u6240\u6709\u7C7B\u578B\u68C0\u67E5\u90FD\u5728\u7F16\u8BD1\u65F6\u5B8C\u6210"),console.log("- ESBuild \u79FB\u9664\u4E86\u6240\u6709\u7C7B\u578B\u6CE8\u89E3"),console.log("- \u4FDD\u7559\u4E86\u8FD0\u884C\u65F6\u7684 JavaScript \u903B\u8F91"),console.log("- \u652F\u6301\u6700\u65B0\u7684 TypeScript \u7279\u6027"),Promise.resolve()}typeof document<"u"&&document.addEventListener("DOMContentLoaded",async()=>{let s=document.createElement("div");s.style.cssText=`
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    `,s.innerHTML=`
      <h1 style="text-align: center; margin-bottom: 30px;">
        \u{1F537} ESBuild TypeScript \u652F\u6301\u6F14\u793A
      </h1>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2>\u{1F3AF} TypeScript \u7279\u6027</h2>
        <ul style="line-height: 1.8;">
          <li>\u2705 \u7C7B\u548C\u63A5\u53E3\u5B9A\u4E49</li>
          <li>\u2705 \u6CDB\u578B\u7F16\u7A0B</li>
          <li>\u2705 \u7C7B\u578B\u63A8\u65AD\u548C\u68C0\u67E5</li>
          <li>\u2705 \u88C5\u9970\u5668\u652F\u6301</li>
          <li>\u2705 \u679A\u4E3E\u548C\u8054\u5408\u7C7B\u578B</li>
          <li>\u2705 \u6A21\u5757\u5BFC\u5165\u5BFC\u51FA</li>
          <li>\u2705 \u5F02\u6B65/\u7B49\u5F85\u8BED\u6CD5</li>
          <li>\u2705 \u7C7B\u578B\u5B88\u536B\u548C\u65AD\u8A00</li>
        </ul>
      </div>
      <div id="output" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p>\u6B63\u5728\u6267\u884C TypeScript \u6F14\u793A...</p>
      </div>
    `,document.body.appendChild(s);try{await h();let e=document.getElementById("output");e.innerHTML=`
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p style="color: #00ff88; font-weight: bold;">\u2705 TypeScript \u6F14\u793A\u5B8C\u6210\uFF01</p>
        <p>\u8BF7\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u67E5\u770B\u8BE6\u7EC6\u8F93\u51FA</p>
        <div style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 5px;">
          <h3>\u{1F527} \u6784\u5EFA\u547D\u4EE4</h3>
          <pre style="margin: 10px 0; color: #ffd700;">npm run build:ts</pre>
          <p style="font-size: 0.9em;">ESBuild \u81EA\u52A8\u5904\u7406 TypeScript \u7F16\u8BD1\uFF0C\u65E0\u9700\u989D\u5916\u914D\u7F6E\uFF01</p>
        </div>
      `}catch(e){let t=document.getElementById("output");t.innerHTML=`
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p style="color: #ff6b6b; font-weight: bold;">\u274C \u6267\u884C\u51FA\u9519: ${e.message}</p>
      `}});})();
//# sourceMappingURL=esbuild-typescript.js.map
