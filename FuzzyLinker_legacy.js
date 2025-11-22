//galex 2024 ver 1010  Fuzzy-linker
//Set tables and fields. Query tables, prepare basic functions
let settings = input.config({
    title:'Fuzzy-Linker',
    description: 'Select tables, fields that must match, and value(s) in both  tables to compare:',
    items:[input.config.table('source', {label: 'Select SOURCE table' }),
           input.config.field('uwSRC',{label: 'Select field that must match',parentTable:'source'}),
           input.config.table('dest', {label: 'Select DESTINATION table to link' }),
           input.config.field('uwDEST',{label: 'Select field in 2nd table that must match',parentTable:'dest'})]})
const {source,dest,uwSRC,uwDEST}=settings

const FUZZY=0.597 // Value of Jaro-Winkler distance
const choseFields=async tab=>{ 
    let ask='';  let chosen=[]
    let flds=tab.fields.map(f=>f.name.toString()).sort()
    let selector=['DONE', ...flds]
    while (ask!='DONE') {
    output.text('Fields chosen: '+chosen.join(', '))
    output.text('Press DONE to finish')
    ask=selector.length==1? 'DONE':await input.buttonsAsync('Choose:', selector)
    chosen.push(selector.splice(selector.indexOf(ask),1)[0]);
    output.clear; output.text('==================')}
    chosen.pop() // put out All or Done from chosen
    return chosen; }


//Autofind Link and check field for result. If absent - create
const [LNK,TXT]=['Link '+dest.name.split(' ')[0] , 'autolink_results' ]
const lOpt={linkedTableId:dest.id}
const findlinkTC=arr=>arr.find(f=>f.type=='multipleRecordLinks'&&f.options['linkedTableId']==dest.id)
const linkID=findlinkTC(source.fields)?.id||await source.createFieldAsync(LNK,'multipleRecordLinks',lOpt)
const resultID=source.fields.find(f=>f.name==TXT)?.id||await source.createFieldAsync(TXT,'singleLineText')
const [linkFld,resultFld]=[linkID,resultID].map(id=>source.getField(id).name)

//querying tables, prepare matchfield map
console.log('Select field(s) in SOURCE table to compare. Click DONE when finished')
const NAMES=await choseFields(source)
console.log('Select field(s) in DESTINATION table to compare. Click DONE when finished')
const NAMED=await choseFields(dest)
const qsource=await source.selectRecordsAsync({fields:[...NAMES,uwSRC]}).
then(q=>q.records.filter(r=>r.getCellValue(NAMES[0])))
const qdest=await dest.selectRecordsAsync({fields:[...NAMED,uwDEST]}).
then(q=>q.records.filter(r=>r.getCellValue(NAMED[0])))
const uw=r=>r.getCellValue(uwDEST)
const UWEEK=qdest.reduce((a,r)=>a.set(uw(r),[...a.get(uw(r))||[],r]),new Map())


// This piece used for Odd Even stuff and should be disabled when not needed  
/*
const both=[...new Set([...UWEEK.keys()].map(k=>k.slice(0,-1)))]
for (let key of both) UWEEK.set(key,[...UWEEK.get(key+'E'),...UWEEK.get(key+'O')])
*/

//Functions to find same UnitWeek and compare names
const words=txt=>txt? txt.split(' ').filter(n=>n.length>3):[]
const tolink=(tr,u=tr.getCellValue(uwSRC))=>u? UWEEK.get(u)||[]:[]
const ingrantee=(n,grt)=>grt.includes(n)? 1:Math.max(...words(grt).map(w=>(n&&w)? jaro(n,w):0))  
const score=(grt,fn,nx=words(fn))=>grt? (ingrantee(nx.shift(),grt)*0.8+
 (nx.length? nx.map(n=>ingrantee(n,grt)).reduce((a,b)=>a+b,0) : 0))/(nx.length+1):0
const owner=(fname,rec)=>NAMED.map(n=>({'id':rec.id,'grantee':rec.getCellValue(n),
match:score(rec.getCellValue(n)?.toUpperCase(),fname?.toUpperCase())}))

//  Jaro-Winkler function to compare 2 words (full mismatch is 0, full match is 1)
const jaro=(w1,w2,s1=w1.length,s2=w2.length,f=Math.round(Math.max(s1,s2)/2-1))=>{
    let match=i=>w2.slice((i<f? 0:i-f),Math.min(i+f,s2)).includes(w1[i])
    let mm=0 ; let tt=0 ; let dd=0; //d is dummy
    [...w1].forEach((char,ix)=>{match(ix)? mm++ : w2.includes(char)? tt++:dd++})
        let jaro=mm? (mm/s1+mm/s2+(mm-tt/2)/mm)/3 : 0
        let wink=[...w1.slice(0,4)].map((a,ix)=>w2[ix]==a).filter(n=>n).length
        let jarowin=jaro+0.1*wink*(1-jaro)
// console.log([w1,w2,mm,tt,jarowin]) // (for debug) 
    return jarowin}

const findlink=rec=>{
  console.log([UWEEK, rec, tolink(rec)]) //for debug
 let arr=NAMES.flatMap(n=>tolink(rec).flatMap(r=>owner(rec.getCellValue(n),r)))
 let max=Math.max(...arr.map(a=>a.match))
 let found=arr.filter(a=>(max>FUZZY)&&(a.match==max))
 if(found.length>1) console.log({Qty:found.length,name:NAMES,...found[0],grantee2:found[1].grantee})
 const linx=found.map(({id,...others})=>({id})) 
 const calx=arr.map(a=>a.grantee?.slice(0,50)+' : '+a.match).join('\n') 
 const result={[linkFld]:linx,[resultFld]:calx}
return result}

const upd=qsource.map(r=>({id:r.id,fields:findlink(r)}))
console.log(upd)
while(upd.length) await source.updateRecordsAsync(upd.splice(0,50))
