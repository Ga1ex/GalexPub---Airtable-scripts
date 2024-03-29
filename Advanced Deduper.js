const config=input.config({ title:'Advanced Deduper',items:[input.config.table('table',{label:'Select table'}),
input.config.view('myView',{label:'Select view', parentTable:'table'}),
input.config.field('CHECK',{label:'field to CHECK', parentTable:'table'}),
input.config.field('MARK',{label:'field to MARK', parentTable:'table'})]})
const {table,myView,CHECK,MARK}=config
const query=await myView.selectRecordsAsync({fields:[CHECK]})
const norm=r=>r.getCellValueAsString(CHECK).toLowerCase() 
.split(' ').sort().filter(n=>n.length>2).map(m=>m.replace(/W/,'')).join('');
//remove line above for exact match. otherwise it ignores order, punctuation and 1-2 letter words
const valueMap=new Map(query.records.map(rec=>[norm(rec),rec.id]))
const valueSet=[...valueMap.values()]
const others=query.recordIds.filter(id=>(!valueSet.includes(id))) 
const othervals=new Set(others.map(id=>norm(query.getRecord(id))))
const dupes=[...valueMap.keys()].filter(val=>othervals.has(val))
const upd=query.records.filter(r=>dupes.includes(norm(r))).map(u=>({'id':u.id,'fields':{[MARK.name]:dupes.indexOf(norm(u)).toString()}}))
output.inspect(upd.map(u=>query.getRecord(u.id).getCellValue(CHECK))); output.text(`Found: ${upd.length} records`)
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))