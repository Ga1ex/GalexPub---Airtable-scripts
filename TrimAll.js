let table = await input.tableAsync("Select the table to trim text fields")
let fields=table.fields.filter(f=>f.type.includes('Text')).map(f=>f.name)
const query=await table.selectRecordsAsync({fields});
const trimmed=rec=>fields.map(f=>[f,rec.getCellValue(f)?.trim()])
const change=rec=>Object.fromEntries(trimmed(rec).filter(([f,v])=>v!=rec.getCellValue(f)))
const upd=query.records.map(rec=>({id:rec.id,fields:change(rec)})).filter(u=>Object.keys(u.fields).length)
console.log(`Fields processed: ${fields.join(', ')}. \nFound ${upd.length} records to update`)
console.log(upd.slice(0,50))
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))
