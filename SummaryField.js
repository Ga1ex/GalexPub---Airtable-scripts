// galex,2022.
let settings = input.config({title: 'Summary by field',
items:  [input.config.table('tableOne', {label: 'Select table' }),
input.config.field('sField',{label: 'Select field',parentTable:'tableOne'})]  })
const {tableOne,sField}=settings
const tabnames=base.tables.map(t=>t.name.toString());
let sumtab=tabnames[0]
while (tabnames.includes(sumtab)) {
sumtab=await input.textAsync('Input summary table name: ');
if (tabnames.includes(sumtab)) output.text(sumtab+' already exists')}

let tfields=tableOne.fields.map(f=>f.name.toString())
const val=x=>x.getCellValueAsString(sField)
let query=await tableOne.selectRecordsAsync({fields:[sField]})
let filled=query.records.filter(r=>val(r)!=null&&val(r)!='')
tfields.splice(tfields.indexOf(sField.name),1)
let newset=new Set(filled.map(val))
let newmap=filled.reduce((a,v)=>a.set(val(v),[...a.get(val(v))||[],v.id]),new Map())
output.text(`New ${newset.size} records will be created in table ${sumtab} with links. Choose fields to add now as text values. 
\n Later you can add others via rollup or lookup`)
output.text(`Number of empty ${sField.name} rows : ${query.records.length-filled.length} of ${query.records.length}` )
let ask=''; let chosen=[]; tfields.unshift('DONE!');
while (ask!='DONE!') {
ask=tfields.length==1? 'DONE!':await input.buttonsAsync('Choose fields: ', tfields)
chosen.push(tfields.splice(tfields.indexOf(ask),1)[0]);
output.clear; output.text('Chosen fields: '+chosen.join(', '));
output.text('==================')
}
chosen.pop();
const flCrt=f=>({'name':f,'type':'singleLineText'})
const newfields=[flCrt(sField.name),...chosen.map(flCrt)]
const LNK='LinkTO_'+tableOne.name
// @ts-ignore
const newtab=await base.createTableAsync(sumtab,newfields).then(x=>base.getTable(x))
await newtab.createFieldAsync(LNK,'multipleRecordLinks',{linkedTableId:tableOne.id})
query=await tableOne.selectRecordsAsync({fields:[...chosen,sField]})
const source=v=>newmap.get(v)||[]
const rollup=(v,f)=>[...new Set(source(v).map(id=>query.getRecord(id).getCellValueAsString(f)))].join()
const prime=v=>[[sField.name,v],[LNK,source(v).map(r=>({'id':r}))]]
const row=v=>Object.fromEntries([...prime(v),...chosen.map(f=>([f,rollup(v,f)]))])
//newset.forEach(n=>{console.log(n);console.log(source(n));console.log(row(n))})
const crt=[...newset].map(v=>({'fields':row(v)}))
output.text(`Starting write ${crt.length} rows into new table.... `)
output.inspect(crt)
while (crt.length) await newtab.createRecordsAsync(crt.splice(0,50))
output.markdown(`Table **${newtab.name}** created and filled succesfully. Task Done`)
