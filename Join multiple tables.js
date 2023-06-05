const table=base.getTable('Master'); let data=[]
const excluded=['Master','Any other table to exclude','or several tables']
const xtables=base.tables.filter(t=>!excluded.includes(t.name))
const fld=table.fields.map(f=>f.name.toString()) //Master defines field list
const row=r=>({fields:Object.fromEntries(fld.map(f=>[f,r.getCellValueAsString(f)]))})
const gettab=async tab=>await tab.selectRecordsAsync({fields:tab.fields}).then(q=>q.records.map(row))
for(var t of xtables) data.push(...await gettab(t))
while (data.length) await table.createRecordsAsync(data.splice(0,50))