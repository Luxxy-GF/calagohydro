/* Integration/visual check of the real Calagopus frontend with intercepted local fixtures.
 * Run against Vite preview, not against a deployed panel. No API writes leave this browser.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { decode } = require(path.resolve(__dirname, '../../../frontend/node_modules/@msgpack/msgpack'));
const base = process.env.THEME_PREVIEW_URL || 'http://127.0.0.1:4173';
const fixture = JSON.parse(fs.readFileSync(process.argv[2] || '/tmp/hydrodactyl-fixtures.json'));
const output = process.argv[3] || '/tmp/hydrodactyl-previews';
fs.mkdirSync(output, { recursive: true });
const pag = (data=[]) => ({ total: data.length, per_page: 50, page: 1, data });
const requests = new Set();
const failures = [];
const results = [];
async function mock(context, authenticated=true, enabled=true, readOnly=false, emptyResources=false) {
 // Vite's /assets proxy normally points at Rust; serve the production build locally.
 await context.route('**/assets/**', async route => {
  const name = decodeURIComponent(new URL(route.request().url()).pathname).slice('/assets/'.length);
  const assets = path.resolve(__dirname, '../../../frontend/dist/assets');
  const file = path.resolve(assets, name);
  if (!file.startsWith(assets + path.sep) || !fs.existsSync(file)) return route.fulfill({status:404});
  const ext = path.extname(file);
  const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : ext === '.woff2' ? 'font/woff2' : 'application/octet-stream';
  await route.fulfill({contentType,body:fs.readFileSync(file)});
 });
 await context.route('**/api/**', async route => {
  const u=new URL(route.request().url()), p=u.pathname;
  requests.add(p);
  let data={}; let status=200;
  if(p==='/api/settings')data={...fixture.settings,disabled_extensions:enabled?[]:['com.luxxy.hydrodactyl'],time:new Date().toISOString(),app:{...fixture.settings.app,url:base}};

  else if(p==='/api/admin/system/overview')data={version:'1.2.4',container_type:'official_heavy',architecture:'x86_64',kernel_version:'6.12.107',cpu:{name:'CPU',brand:'AMD Ryzen 9 7950X 16-Core Processor',vendor_id:'AMD',frequency_mhz:4500,cpu_count:16},memory:{total_bytes:17179869184,free_bytes:12079595520,used_bytes:5100273664,used_bytes_process:85228257},cache:{version:'9.1.2',total_calls:78,total_hits:48,total_misses:20,average_hit_latency_ns:81910000,average_miss_latency_ns:121900000,max_call_latency_ns:166960000,local_hits:{calls:48,average_latency_ns:81910000},remote_hits:{calls:0,average_latency_ns:0},coalesced_waits:{calls:0,average_latency_ns:0}},database:{version:'PostgreSQL 18.6',size_bytes:154560921,total_read_connections:5,idle_read_connections:4,total_write_connections:5,idle_write_connections:4}};
  else if(p==='/api/admin/stats/general')data={stats:{users:5,servers:4,locations:1,nodes:1,nest_eggs:2,database_hosts:0,backup_configurations:1,roles:0}};
  else if(p==='/api/admin/stats/backups'){const empty={total:0,successful:0,successful_bytes:0,failed:0,deleted:0,deleted_bytes:0};const used={...empty,total:2,successful:2,successful_bytes:473320652};data={all_time:used,today:empty,week:empty,month:used};}
  else if(p==='/api/languages')data={languages:['en']};
  else if(p==='/api/announcements'||p.endsWith('/announcements'))data={announcements:[]};
  else if(p==='/api/client/account'){ data={user:fixture.user};if(!authenticated)status=401; }
  else if(p.endsWith('/settings'))data={settings:{}};
  else if(p.endsWith('/permissions'))data={admin_permissions:{},user_permissions:{},server_permissions:{}};
  else if(p==='/api/client/servers')data={servers:pag([fixture.server])};
  else if(p==='/api/client/servers/groups')data={server_groups:[]};
  else if(/^\/api\/client\/servers\/[^/]+$/.test(p))data={server:readOnly?{...fixture.server,is_owner:false,permissions:['databases.read']}:fixture.server};
  else if(p.endsWith('/websocket'))data={token:'fixture-only',url:base.replace('http','ws')+'/theme-visual-socket'};
  else if(p.endsWith('/databases/instances/templates'))data={templates:[],database_instance_templates:[]};
  else if(p.endsWith('/databases/instances'))data={database_instances:pag()};
  else if(p.endsWith('/databases/hosts'))data={database_hosts:[{uuid:fixture.server.uuid,name:'Local MySQL',host:'127.0.0.1',port:3306,type:'mysql',maintenance_enabled:false}]};
  else if(p.endsWith('/databases'))data={databases:pag([fixture.database])};
  else if(p.endsWith('/size'))data={size:1024};
  else if(p.endsWith('/allocations'))data={allocations:pag([fixture.allocation])};
  else if(p.endsWith('/subusers'))data={subusers:pag(emptyResources?[]:[fixture.subuser])};
  else if(p.endsWith('/schedules'))data={schedules:pag([fixture.schedule])};
  else if(p.endsWith('/backups/groups'))data={backup_groups:[]};
  else if(p.endsWith('/backups/usage'))data={usage:{count:1,bytes:33554432}};
  else if(p.endsWith('/backups'))data={backups:pag(emptyResources?[]:[fixture.backup])};
  else if(p.endsWith('/startup/variables'))data={variables:[fixture.variable]};
  else if(p.endsWith('/files/list'))data={is_filesystem_primary:true,is_filesystem_writable:true,is_filesystem_fast:true,entries:pag(u.searchParams.get('directory')==='/txData'?[{...fixture.files[0],name:'default',size:74752},{...fixture.files[1],name:'BasicServerEnhanced_B84E16.base',directory:true,file:false,mime:'inode/directory',size:34889482},{...fixture.files[2],name:'admins.json',size:445}]:fixture.files),uploads:[]};
  else if(p.endsWith('/files/operations'))data={operations:[]};
  else if(p.endsWith('/api-keys'))data={api_keys:pag([fixture.apiKey])};
  else if(p.endsWith('/ssh-keys'))data={ssh_keys:pag([fixture.sshKey])};
  else if(p.includes('/servers/eggs/')&&p.endsWith('/command-snippets'))data={command_snippets:[]};
  else if(p.endsWith('/command-snippets'))data={command_snippets:pag()};
  else if(p.endsWith('/activity'))data={activities:pag()};
  else if(p.endsWith('/nodes'))data={nodes:[]};
  else if(p.endsWith('/groups'))data={server_groups:[]};
  else if(p.endsWith('/oauth'))data={oauth_providers:[]};
  else if(p.endsWith('/security-keys'))data={security_keys:[]};
  else data={nodes:[],groups:[],providers:[],security_keys:[],uploads:[],operations:[],connections:pag(),firewall_rules:pag(),mounts:pag(),devices:pag(),sessions:pag(),oauth_links:pag()};
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 await context.routeWebSocket('**/theme-visual-socket*', ws => {
  const send=(event,args=[])=>ws.send(JSON.stringify({event,args}));
  ws.onMessage(raw=> {
   let msg;try{msg=typeof raw==='string'?JSON.parse(raw):decode(raw);}catch{return;}
   if(Array.isArray(msg))msg={event:msg[0],args:msg[1]};
   if(msg.event==='auth'){send('auth success');send('status',['offline']);}
   if(msg.event==='send stats')send('stats',[JSON.stringify({cpu_absolute:0,memory_bytes:0,disk_bytes:61,uptime:0,network:{rx_bytes:0,tx_bytes:0}})]);
   if(msg.event==='send logs')send('console output',['\u001b[33mcontainer@hydrodactyl~\u001b[0m Server marked as offline...']);
   if(msg.event==='ping')send('pong');
  });
 });
}
(async()=> {
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  await mock(context);
  const page=await context.newPage();
  page.on('pageerror',e=>failures.push({url:page.url(),message:e.message,stack:e.stack}));
  const routes=['/admin','/','/server/00000001','/server/00000001/files','/server/00000001/databases','/server/00000001/network','/server/00000001/backups','/server/00000001/subusers','/server/00000001/schedules','/server/00000001/startup','/server/00000001/settings','/server/00000001/activity','/account','/account/api-keys','/account/ssh-keys','/account/activity'];
  for(const url of routes){
   await page.goto(base+url);await page.waitForSelector('.hydro-app-header',{timeout:30000});await page.waitForTimeout(700);
   const name=url==='/'?'dashboard':url.replace(/^\//,'').replaceAll('/','-');
   await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,rail:document.querySelector('.hydro-sidebar-desktop')?.getBoundingClientRect().width,header:document.querySelector('.hydro-app-header')?.getBoundingClientRect().height,rows:document.querySelectorAll('.hydro-resource-row').length,body:document.body.innerText.slice(-250)}));
   if(layout.overflow)failures.push('Horizontal overflow on '+url);
   results.push({url,...layout});
   if(url==='/admin') {
    const navigation=page.locator('.hydro-sidebar-desktop .hydro-sidebar-navigation');
    const clipped=await navigation.locator('.hydro-nav-text').evaluateAll(nodes=>nodes.filter(node=>{
     const link=node.closest('a').getBoundingClientRect();
     const range=document.createRange();range.selectNodeContents(node);
     return node.scrollWidth>node.clientWidth+1||[...range.getClientRects()].some(r=>r.left<link.left-1||r.right>link.right+1||r.top<link.top-1||r.bottom>link.bottom+1);
    }).map(node=>node.textContent));
    if(clipped.length)failures.push('Clipped compact admin labels: '+clipped.join(', '));

    const icons=await navigation.locator('a[href^="/admin"] svg').evaluateAll(nodes=>[...new Set(nodes.map(node=>node.getAttribute('data-icon')||node.innerHTML))]);
    if(icons.length<12)failures.push('Admin navigation still repeats icons: '+icons.length);
    if(await page.locator('.hydro-sidebar-desktop .hydro-sidebar-utility a[href^="/admin"]').count())failures.push('Admin links remain outside the scroll container');
    await navigation.hover();await page.mouse.wheel(0,3000);await page.waitForTimeout(200);
    const scroll=await navigation.evaluate(node=>({top:node.scrollTop,height:node.clientHeight,total:node.scrollHeight}));
    if(scroll.top<=0||scroll.total<=scroll.height)failures.push('Desktop admin sidebar does not scroll');
    await navigation.locator('a').last().scrollIntoViewIfNeeded();
    const visible=await navigation.evaluate(node=>{const r=node.getBoundingClientRect(),last=node.querySelector('a:last-child')?.getBoundingClientRect();return !!last&&last.top>=r.top-1&&last.bottom<=r.bottom+1;});
    if(!visible)failures.push('Last admin link is unreachable on desktop');
    await page.screenshot({path:path.join(output,'admin-sidebar-scrolled.png')});
    results.push({check:'admin-sidebar',uniqueIcons:icons.length,...scroll});
   }

  }

  await page.goto(base+'/server/00000001/files');await page.waitForSelector('.hydro-file-row');
  const fileRow=page.locator('.hydro-file-row').first();
  const desktopAlign=await page.evaluate(()=>{const a=document.querySelector('.hydro-file-select-all input').getBoundingClientRect();const b=document.querySelector('.hydro-file-selection-cell input').getBoundingClientRect();return Math.abs(a.x-b.x);});
  if(desktopAlign>1)failures.push('Desktop file checkbox alignment: '+desktopAlign);

  const rowPaint=()=>fileRow.evaluate(row=>{const td=row.querySelector('td');const tr=getComputedStyle(row),cell=getComputedStyle(td);return {row:tr.backgroundColor,cell:cell.backgroundColor,border:cell.borderTopWidth,borderColor:cell.borderTopColor};});
  await page.mouse.move(1400,30);const normal=await rowPaint();
  if(normal.border!=='1px'||normal.cell!=='rgba(0, 0, 0, 0)')failures.push('File-row borders/background were overridden: '+JSON.stringify(normal));
  await fileRow.hover();const hover=await rowPaint();if(hover.row===normal.row)failures.push('File-row hover surface did not change');
  await fileRow.getByRole('checkbox').check();await page.mouse.move(1400,30);const selected=await rowPaint();
  if(selected.row===normal.row||selected.cell!=='rgba(0, 0, 0, 0)')failures.push('File-row selected surface was lost');
  await page.screenshot({path:path.join(output,'file-manager-selected.png'),fullPage:true});
  results.push({check:'file-row-colours',normal,hover,selected});
  const sourcePalette=await page.evaluate(()=>{const root=getComputedStyle(document.documentElement);return {shell:root.getPropertyValue('--mantine-color-body').trim(),text:root.getPropertyValue('--mantine-color-text').trim(),surface:root.getPropertyValue('--hydro-surface').trim(),row:root.getPropertyValue('--hydro-file-row').trim(),hover:root.getPropertyValue('--hydro-file-row-hover').trim()};});
  const expected={shell:'#000000',text:'#ffffff',surface:'#110f0d',row:'#1d1816',hover:'#29241f'};
  for(const [key,value] of Object.entries(expected))if(sourcePalette[key]!==value)failures.push('Upstream colour mismatch: '+key+' '+sourcePalette[key]+' expected '+value);
  results.push({check:'upstream-colours',...sourcePalette});

  await page.goto(base+'/admin');await page.waitForSelector('.hydro-titled-grey-box .hydro-card');
  const boxes=await page.locator('.hydro-titled-grey-box').first().evaluate(panel=>({panel:getComputedStyle(panel).backgroundColor,inset:getComputedStyle(panel.querySelector('.hydro-card')).backgroundColor}));
  if(boxes.panel===boxes.inset)failures.push('Admin panels lost their inset-card contrast');
  results.push({check:'admin-box-colours',...boxes});
  await page.goto(base+'/server/00000001/databases');await page.waitForSelector('.hydro-item-actions');
  await page.getByRole('button',{name:'Details',exact:true}).click();await page.getByRole('dialog').waitFor();
  await page.screenshot({path:path.join(output,'database-dialog.png')});await page.keyboard.press('Escape');
  await page.goto(base+'/server/00000001/schedules');await page.waitForSelector('.hydro-cron-row');
  await page.getByRole('button',{name:'Delete',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
  await page.goto(base+'/');await page.waitForSelector('.hydro-header-center');
  await page.getByRole('radio',{name:'Server layout'}).count();
  await page.setViewportSize({width:390,height:844});
  for(const url of ['/admin','/server/00000001','/server/00000001/files','/server/00000001/databases','/account']){
   await page.goto(base+url);await page.waitForSelector(url==='/admin'?'.hydro-app-header':'.hydro-bottom-nav');await page.waitForTimeout(500);
   const name='mobile-'+url.replace(/^\//,'').replaceAll('/','-');await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push('Mobile overflow on '+url);
   if(url==='/admin') {
    await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.getByRole('dialog').waitFor();
    const navigation=page.locator('.hydro-sidebar-mobile .hydro-sidebar-navigation');
    await navigation.locator('a').last().scrollIntoViewIfNeeded();
    const reached=await navigation.evaluate(node=>{const r=node.getBoundingClientRect(),last=node.querySelector('a:last-child')?.getBoundingClientRect();return {top:node.scrollTop,visible:!!last&&last.top>=r.top-1&&last.bottom<=r.bottom+1};});
    if(reached.top<=0||!reached.visible)failures.push('Last admin link is unreachable in the mobile drawer');
    await page.screenshot({path:path.join(output,'mobile-admin-sidebar-scrolled.png')});await page.keyboard.press('Escape');
   }

  }


  await page.goto(base+'/server/00000001/files');await page.waitForSelector('.hydro-file-select-all');
  const all=page.getByRole('checkbox',{name:'Select all files',exact:true});
  const rowChecks=page.locator('.hydro-file-selection-cell input[type=checkbox]');
  const align=await page.evaluate(()=>{const a=document.querySelector('.hydro-file-select-all input').getBoundingClientRect();const b=document.querySelector('.hydro-file-selection-cell input').getBoundingClientRect();return {all:a.x,row:b.x,width:a.width,height:a.height};});
  if(Math.abs(align.all-align.row)>1||align.width!==20||align.height!==20)failures.push('File checkbox alignment: '+JSON.stringify(align));
  await rowChecks.first().check();
  if(!await all.evaluate(node=>node.indeterminate))failures.push('Select-all lost partial-selection state');
  await page.screenshot({path:path.join(output,'mobile-files-partial-selection.png')});
  await all.check();
  if(await rowChecks.evaluateAll(nodes=>nodes.some(node=>!node.checked)))failures.push('Select-all failed to select file rows');
  await all.uncheck();if(await rowChecks.evaluateAll(nodes=>nodes.some(node=>node.checked)))failures.push('Select-all failed to clear file rows');
  await page.screenshot({path:path.join(output,'mobile-files-checkboxes.png')});
  results.push({check:'file-checkbox-selection',...align});
  await page.goto(base+'/server/00000001/files?directory=/txData');await page.waitForSelector('.hydro-file-parent-row');
  const parentPaint=await page.locator('.hydro-file-parent-row').evaluate(row=>({background:getComputedStyle(row).backgroundColor,icon:row.querySelector('[data-file-manager-icon]')?.getAttribute('data-file-manager-icon')}));
  const siblingPaint=await page.locator('.hydro-file-row:not(.hydro-file-parent-row)').first().evaluate(row=>getComputedStyle(row).backgroundColor);
  if(parentPaint.background!==siblingPaint||parentPaint.icon!=='folder')failures.push('Parent directory row differs from file-row theme');
  const fileName=await page.locator('.hydro-file-name').filter({hasText:'BasicServerEnhanced_B84E16.base'}).evaluate(node=>({whiteSpace:getComputedStyle(node).whiteSpace,height:node.getBoundingClientRect().height}));
  if(fileName.height>40)failures.push('Mobile filename is squeezed into more than two lines');
  const sizeHidden=await page.locator('.hydro-file-row:not(.hydro-file-parent-row)').first().evaluate(row=>getComputedStyle(row.children[2]).display==='none');
  if(!sizeHidden)failures.push('File size remains visible below the upstream sm breakpoint');
  if(fileName.whiteSpace!=='normal')failures.push('Mobile long filename remains clipped');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push('Subdirectory mobile overflow');
  await page.screenshot({path:path.join(output,'mobile-files-subdirectory.png'),fullPage:true});
  await page.screenshot({path:path.join(output,'mobile-files-subdirectory-top.png')});
  await page.locator('.hydro-file-parent-row').click();await page.waitForURL(url=>url.searchParams.get('directory')==='/');
  results.push({check:'mobile-parent-directory',...parentPaint,fileName});
  await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
  await context.close();
  const auth=await browser.newContext({viewport:{width:1440,height:960}});await mock(auth,false);const login=await auth.newPage();login.on('pageerror',e=>failures.push(e.message));
  await login.goto(base+'/auth/login');await login.waitForSelector('.hydro-auth-layout');await login.waitForTimeout(500);await login.screenshot({path:path.join(output,'login.png')});
  await login.setViewportSize({width:390,height:844});await login.screenshot({path:path.join(output,'mobile-login.png'),fullPage:true});await auth.close();

  const emptyContext=await browser.newContext({viewport:{width:390,height:844}});await mock(emptyContext,true,true,false,true);
  const emptyPage=await emptyContext.newPage();
  for(const pathName of ['backups','subusers']) {
   await emptyPage.goto(base+'/server/00000001/'+pathName);await emptyPage.waitForSelector('.hydro-resource-empty');
   if(await emptyPage.locator('.hydro-resource-select-all').count())failures.push('Stray checkbox on empty '+pathName);
   await emptyPage.screenshot({path:path.join(output,'mobile-empty-'+pathName+'.png')});
  }
  await emptyContext.close();
  const restricted=await browser.newContext();await mock(restricted,true,true,true);
  const rp=await restricted.newPage();await rp.goto(base+'/server/00000001/databases');await rp.waitForSelector('.hydro-item-actions');
  if(await rp.getByRole('button',{name:'Delete',exact:true}).count())failures.push('Read-only subuser received a database delete control');
  if(!await rp.getByRole('button',{name:'Details',exact:true}).count())failures.push('Read-only subuser lost database details');
  await restricted.close();
  const disabled=await browser.newContext();await mock(disabled,true,false);const dp=await disabled.newPage();
  await dp.goto(base+'/');await dp.getByText('dev',{exact:true}).first().waitFor();
  if(await dp.locator('.hydro-source-server-row,.hydro-app-header').count())failures.push('Disabled theme failed to restore native dashboard');
  await disabled.close();

 } catch(e) { failures.push(e.stack||e.message); }
 finally { await browser.close(); }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({results,failures,requests:[...requests]},null,2));
 console.log(JSON.stringify({pages:results.length,failures,output},null,2));
 if(failures.length)process.exitCode=1;
})();
