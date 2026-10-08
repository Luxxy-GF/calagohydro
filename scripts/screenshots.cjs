/* Capture real theme pages using schema-valid local demo fixtures. No live panel writes. */
const {mock, fixture, base, chromium, fs, path} = require('./preview-fixtures.cjs');
const photos = process.argv[3] || path.resolve(__dirname, '../photos');
const pages = [
 ['admin','/admin','.hydro-workspace'],
 ['servers','/','.hydro-source-server-row'],
 ['console','/server/00000001','.hydro-console-terminal .xterm-screen'],
 ['files','/server/00000001/files','.hydro-file-row'],
 ['databases','/server/00000001/databases','.hydro-resource-list'],
 ['network','/server/00000001/network','.hydro-resource-list'],
 ['backups','/server/00000001/backups','.hydro-resource-list'],
 ['users','/server/00000001/subusers','.hydro-resource-list'],
 ['schedules','/server/00000001/schedules','.hydro-cron-row'],
 ['startup','/server/00000001/startup','.hydro-workspace'],
 ['settings','/server/00000001/settings','.hydro-workspace'],
 ['activity','/server/00000001/activity','.hydro-workspace'],
 ['account','/account','.hydro-workspace'],
 ['api-keys','/account/api-keys','.hydro-workspace'],
 ['ssh-keys','/account/ssh-keys','.hydro-workspace'],
 ['account-activity','/account/activity','.hydro-workspace'],
];
(async()=>{
 fs.mkdirSync(photos,{recursive:true});
 fixture.settings.app.icon='/icon.svg';fixture.settings.app.name='CalagoHydro';
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});await mock(context);
 let page;const errors=[];
 const openPage=async()=>{const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));return p;};
 for(const [name,url,ready] of pages){
 page=await openPage();
 await page.goto(base+url);await page.waitForSelector(ready,{timeout:60000});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
 await page.screenshot({path:path.join(photos,name+'.png')});await page.close();console.log('Captured '+name);
 }
 for(const [name,url,ready] of pages.filter(p=>['console','files','account','admin'].includes(p[0]))){
 page=await openPage();await page.setViewportSize({width:390,height:844});await page.goto(base+url);await page.waitForSelector(ready,{timeout:60000});await page.waitForTimeout(1800);
 await page.screenshot({path:path.join(photos,'mobile-'+name+'.png')});await page.close();console.log('Captured mobile-'+name);
 }
 const auth=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});await mock(auth,false);const login=await auth.newPage();
 await login.goto(base+'/auth/login');await login.waitForSelector('.hydro-auth-layout');await login.waitForTimeout(1800);await login.screenshot({path:path.join(photos,'login.png')});
 await login.setViewportSize({width:390,height:844});await login.screenshot({path:path.join(photos,'mobile-login.png')});
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Captured 22 screenshots without page errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
