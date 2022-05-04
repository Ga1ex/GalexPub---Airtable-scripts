const table=base.getTable('Oryx');
const urlRus = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html';
const urlUkr = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-ukrainian.html';
const [S1,S2,SX]=[`id="Pistols">`,`</h3>`,`</span>`] //single item start/end/clean
const [T1,T2]=[`<span style="color: red;">`,`<br /></span>`] //totals start/end
const [TX,DIVIDER,WASTE]=[SX+T1,'mw-headline',`<span `] //items divider/waste pieces marker

const cutter=(txt,pattern)=>txt.split(pattern).join('')
const cut=(txt,a,z,x)=>cutter((txt.split(a,2).pop().split(z,2).shift()), x);
const bold=text=>`**${text}**`;
const total=text=>(text.indexOf(T1)>0)? bold(cut(text,T1,T2,TX)):cut(text,S1,S2,SX)
const parse=txt=>txt.split(DIVIDER).map(total).filter(n=>!n.includes(WASTE));

const create=(el,side)=>({fields:{'Side':side,'Loss':el }})
const rows=(arr,side)=>arr.map(el=>create(el,side))
const existing=await table.selectRecordsAsync({fields:['Side']})
await table.deleteRecordsAsync(existing.recordIds);

const queryRus = await fetch(urlRus);
const lostRus = await queryRus.text();
const queryUkr = await fetch(urlUkr);
const rawUkr = await queryUkr.text(); 
const CLN1 = `&nbsp;</span></div><h3>` 
const CLN2 = `<span class="mw-headline" id="Pistols">`
const CLN3 = CLN1+CLN2
const CLNU = `Ukraine - `
const lostUkr=cutter(rawUkr.replace(CLN3,'').replace(CLNU+TX,CLNU),CLN1);

const crt=[...rows(parse(lostRus),'Russia'),...rows(parse(lostUkr),'Ukraine')]
while (crt.length) await table.createRecordsAsync(crt.splice(0, 50));