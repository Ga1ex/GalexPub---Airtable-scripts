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
let query=await tableOne.selectRecordsAsync({fields:tfields})
tfields.splice(tfields.indexOf(sField.name),1)
let newmap=new Set(query.records.map(r=>r.getCellValueAsString(sField)))

output.text(`New ${newmap.size} records will be created in table ${sumtab} with links. Choose fields to add now as text values. 
\n Later you can add others via rollup or lookup`)
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
const source=val=>query.records.filter(r=>r.getCellValueAsString(sField)===val)
const rollup=(v,f)=>[...new Set(source(v).map(s=>s.getCellValueAsString(f)))].join()
const prime=v=>[[sField.name,v],[LNK,source(v).map(r=>({'id':r.id}))]]
const row=v=>Object.fromEntries([...prime(v),...chosen.map(f=>([f,rollup(v,f)]))])
const crt=[...newmap].map(v=>({'fields':row(v)}))
output.text(`Starting write ${crt.length} rows into new table.... `)
while (crt.length) await newtab.createRecordsAsync(crt.splice(0,50))
output.markdown(`Table **${newtab.name}** created and filled succesfully. Task Done`)