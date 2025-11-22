//galex 2024 ver 1107  AutoLINKER
//Set tables and fields. Query tables, prepare basic functions
let settings = input.config({
    title:'AutoLinker',
    description: 'Select tables, fields that must match, and value(s) in both  tables to compare:',
    items:[input.config.table('source', {label: 'Select SOURCE table' }),
           input.config.view('sview', {label:'Select SOURCE view', parentTable:'source'}),
           input.config.field('uwSRC',{label: 'Select field that must match',parentTable:'source'}),
           input.config.table('dest', {label: 'Select DESTINATION table to link' }),
           input.config.field('uwDEST',{label: 'Select field in 2nd table that must match',parentTable:'dest'})]})
const {source,sview,dest,uwSRC,uwDEST}=settings
const FUZZY=0.725 // Value of mininum Jaro-Winkler distance to count as MATCH

const choseFields=async tab=>{   //Function to chose field(s) in given table
    let palette=el=>({label:el,'variant': el=='DONE'? 'danger':  
     ['name','grant'].some(x=>el.toLowerCase().includes(x))? 'primary':
     tab.getField(el).isComputed? 'secondary':'default' })
      let ask='';  let chosen=[]
      let flds=tab.fields.map(f=>f.name.toString()).sort()
      let selector=['DONE', ...flds]
      let butns=()=>selector.map(palette)
  
      while (ask!='DONE') {
      output.text('Fields chosen: '+chosen.join(', '))
      output.text('Press DONE to finish')
      // @ts-ignore
      ask=selector.length==1? 'DONE':await input.buttonsAsync('Choose:', butns())
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

const qsource=await sview.selectRecordsAsync({fields:[...NAMES,uwSRC]}).
then(q=>q.records.filter(r=>r.getCellValue(NAMES[0])))
const qdest=await dest.selectRecordsAsync({fields:[...NAMED,uwDEST]}).
then(q=>q.records.filter(r=>r.getCellValue(NAMED[0])))
console.log(`Searching best match for ${qsource.length} records against ${qdest.length} of ${dest.name} records`)
const uw=r=>r.getCellValue(uwDEST)
const MustMatch=qdest.reduce((a,r)=>a.set(uw(r),[...a.get(uw(r))||[],r]),new Map())


// This piece used for Odd Even stuff and should be disabled when not needed  
// maybe it's not needed at all as best match will point to the correct period.
// if I won't use this part till 2025, it has to be removed 
//  
/* const both=[...new Set([...MustMatch.keys()].map(k=>k.slice(0,-1)))]
for (let key of both) MustMatch.set(key,[...MustMatch.get(key+'E'),...MustMatch.get(key+'O')]) */

//Functions to find same UnitWeek and compare names
const words=txt=>txt? txt.split(' ').filter(n=>n.length>2):[]
const tolink=(tr,u=tr.getCellValue(uwSRC))=>u? MustMatch.get(u)||[]:[]
const inSecName=(n,secName)=>secName.includes(n)? 1:Math.max(...words(secName).map(w=>(n&&w)? jaro(n,w):0))  
const score=(secName,fn,nx=words(fn))=>secName? (inSecName(nx.shift(),secName)*0.8+
 (nx.length? nx.map(n=>inSecName(n,secName)).reduce((a,b)=>a+b,0) : 0))/(nx.length+1):0
//Add reverse check, because 'John Doe' vs 'sir John Patrick Doe senior' is <50% match, reverse is >90%
const compare=(x,y)=>(x&&y)? Math.max(score(x,y),score(y,x)) : 0
const owner=(fname,rec)=>NAMED.map(n=>({'id':rec.id,'grantee':rec.getCellValue(n),
match:compare(rec.getCellValue(n)?.toUpperCase(),fname?.toUpperCase())}))
const descmatch=(x,y)=>(y.match-x.match) // sorting for results, descending

//  Jaro-Winkler function to compare 2 words (full mismatch is 0, full match is 1)
const jaro=(w1,w2,s1=w1.length,s2=w2.length,f=Math.round(Math.max(s1,s2)/2-1))=>{
    let match=i=>w2.slice((i<f? 0:i-f),Math.min(i+f,s2)).includes(w1[i])
    let mm=0 ; let tt=0 ; let dd=0; //d is dummy
    [...w1].forEach((char,ix)=>{match(ix)? mm++ : w2.includes(char)? tt++:dd++})
        let jaro=mm? (mm/s1+mm/s2+(mm-tt/2)/mm)/3 : 0
        let wink=[...w1.slice(0,4)].map((a,ix)=>w2[ix]==a).filter(n=>n).length
        let jarowin=jaro+0.1*wink*(1-jaro)  //console.log([w1,w2,mm,tt,jarowin]) // (for debug) 
    return jarowin}

const findlink=rec=>{
 // console.log([MustMatch, rec, tolink(rec)]) //for debug
 let arr=NAMES.flatMap(n=>tolink(rec).flatMap(r=>owner(rec.getCellValue(n),r)))
 let max=Math.max(...arr.map(a=>a.match))
 let found=arr.filter(a=>(max>FUZZY)&&(a.match==max))
 const linx=[...new Set(found.map(x=>x.id))].map(y=>({id:y}))
 const calx=arr.filter(n=>n.grantee).sort(descmatch).map(a=>a.grantee.slice(0,50)+' : '+a.match).join('\n') 
 const result={[linkFld]:linx,[resultFld]:calx}
return result}

const upd=qsource.map(r=>({id:r.id,fields:findlink(r)}))
console.log(upd)
console.log('All matches counted, updating table with links...')
while(upd.length) await source.updateRecordsAsync(upd.splice(0,50))
console.log('Done')