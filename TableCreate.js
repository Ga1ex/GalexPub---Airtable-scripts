const table=base.getTable('TableCreator')
const query=await table.selectRecordsAsync({fields:table.fields})
const [TNAME,FNAMES,FTYPES,COMM]=['Name','Fieldnames','Fieldtypes','Command']
const rec=await input.recordAsync('',table);
if (!rec) throw new Error('record not defined');
const cutter=text=>text.split('"').join('').split(`\n`).join('')
const tname=rec.getCellValue(TNAME);
const fnames=cutter(rec.getCellValue(FNAMES)).split('- ').splice(1);
const ftypes=rec.getCellValue(FTYPES).map(t=>t.name);
if ((fnames.length<ftypes.length)||(!tname)) throw new Error('Names not defined')

const typSet=[...new Set(base.tables.flatMap(t=>t.fields.map(f=>f.type)))]
const sch='[]' //<<to get all types use =JSON.stringify(typSet.map(t=>({'name':t})))

const empty=['singleLineText','multilineText'].map(name=>[name,''])
const numeric=[['number','{precision:0}'],['currency','{precision:0,"symbol":"$"}']]
const select=['multipleSelects','singleSelect'].map(name=>[name,`{choises:${sch}}`])
const opt=(Object.fromEntries([...empty,...numeric,...select]))
const option=x=>opt[x]? ', options:'+(opt[x])+'}':'}'
const convert=(name,t)=>`{'name':'${name}','type':'${t}'`+ option(t)

const flds=ftypes.flatMap((t,ix)=>fnames[ix].split(', ').map(fname=>convert(fname,t)))
const command=`output.text(await base.createTableAsync('${tname}',[${[flds.join()]}])`
await table.updateRecordAsync(rec,{[COMM]:command})

