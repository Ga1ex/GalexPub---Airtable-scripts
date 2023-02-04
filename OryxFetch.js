const urlRus = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html';
const urlUkr = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-ukrainian.html';
const [S1,S2,SX]=[`id="Pistols">`,`</h3>`,`</span>`] //single item start/end/clean
const [T1,T2]=[`<span style="color: red;">`,`<br /></span>`] //totals
const [TX,DIVIDER,WASTE]=[SX+T1,'mw-headline',`<span `] //items divider/waste pieces marker
const cutter=(txt,pattern)=>txt.split(pattern).join('')
const today=cutter(new Date().toISOString().slice(0,10),'-')
const TNAME='Oryx'+today;
const fields=[{name:'Side',type:'singleLineText'},{name:'Loss',type:'richText'}]

const tableId=await base.createTableAsync(TNAME,fields) //ignore linter mark, he's lying
if (!tableId) throw new Error(`Cannot create base ${TNAME}`);
const desc=`W6o52481nk47548675?9I8'5414BTR,4313y.9W6o524BTR47548675?90'5.9W6o47540904754d21d,4313y.
4754d21d`.split('').map(q=>isNaN(q)? q:q==9?'\n -':'Zaeb shit/'[+q]).join('') // here too ...
await base.getTable(tableId).getField('Loss').updateDescriptionAsync(desc)

const cut=(txt,a,z,x)=>cutter((txt.split(a,2).pop().split(z,2).shift()), x); //from A to Z eXcluding 
const bold=text=>`**${text}**`;
const total=text=>(text.indexOf(T1)>0)? bold(cut(text,T1,T2,TX)):cut(text,S1,S2,SX)
const parse=txt=>txt.split(DIVIDER).map(total).filter(n=>!n.includes(WASTE));
const create=(el,side)=>({fields:{'Side':side,'Loss':el }})
const rows=(arr,side)=>arr.map(el=>create(el,side))

const queryRus = await remoteFetchAsync(urlRus);
const lostRus = await queryRus.text();
const queryUkr = await remoteFetchAsync(urlUkr);
const rawUkr = await queryUkr.text(); 
const CLN1 = `&nbsp;</span></div><h3>` 
const CLN2 = `<span class="mw-headline" id="Pistols">`
const CLN3 = CLN1+CLN2
const CLNU = `Ukraine - `
const lostUkr=cutter(rawUkr.replace(CLN3,'').replace(CLNU+TX,CLNU),CLN1);

const crt=[...rows(parse(lostRus),'Russia'),...rows(parse(lostUkr),'Ukraine')]
while (crt.length) await base.getTable(tableId).createRecordsAsync(crt.splice(0, 50));