// App-Installation – keine Registrierung, kein Server-Speicher für Lernpunkte.
let lernweltenInstallPrompt = null;
const pwaEl = id => document.getElementById(id);
const pwaStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  lernweltenInstallPrompt=event;
  const btn=pwaEl('pwaPromptBtn');
  if(btn) btn.style.display='inline-block';
});
window.addEventListener('appinstalled', () => {
  lernweltenInstallPrompt=null;
  closeInstallGuide();
  const btn=pwaEl('installAppButton');
  if(btn)btn.style.display='none';
  if(typeof toast==='function')toast('🎉 Die Lernwelten sind jetzt als App installiert!');
});
function showInstallGuide(){
  if(pwaStandalone()){
    if(typeof toast==='function')toast('✅ Die Lernwelten laufen bereits als App!');
    return;
  }
  pwaEl('pwaInstallLayer').classList.remove('hidden');
  if(lernweltenInstallPrompt) pwaEl('pwaPromptBtn').style.display='inline-block';
}
function closeInstallGuide(){pwaEl('pwaInstallLayer').classList.add('hidden');}
async function installAppNow(){
  if(!lernweltenInstallPrompt)return;
  const prompt=lernweltenInstallPrompt;
  lernweltenInstallPrompt=null;
  pwaEl('pwaPromptBtn').style.display='none';
  try { await prompt.prompt(); await prompt.userChoice; } catch(_){}
}
window.addEventListener('keydown', event => {
  if(event.key==='Escape' && !pwaEl('pwaInstallLayer').classList.contains('hidden'))closeInstallGuide();
});
pwaEl('pwaInstallLayer').addEventListener('click',event=>{
  if(event.target===pwaEl('pwaInstallLayer'))closeInstallGuide();
});
if(pwaStandalone())pwaEl('installAppButton').style.display='none';
if('serviceWorker' in navigator && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname))){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js',{scope:'./'})
      .catch(err=>{console.warn('Offline-Installation derzeit nicht möglich:',err);});
  });
}
