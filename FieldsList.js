// galex 2024  FieldList. Create table or clean if already exists
const inv=base.getTable(base.tables.map(t=>t.name.toString()).includes('FieldList')? 'FieldList'
: await base.createTableAsync('FieldList',[
    {'name':'Name','type':'singleLineText'},
    {'name':'Type','type':'singleLineText'},
    {'name':'Unique','type':'number', options:{precision:0}},
    {'name':'Filled','type':'number', options:{precision:0}},
    {'name':'Example_5','type':'multilineText'}]))
const table=await input.tableAsync('Select table to process fields')
const flds=table.fields.map(f=>f.name.toString())
const query=await table.selectRecordsAsync({fields:flds})
const filled=fld=>query.records.map(r=>r.getCellValueAsString(fld)).filter(Boolean)
const sample=f=>filled(f).slice(0,5).join('; ')
const uniq=fld=>[...new Set(filled(fld))]
const fdata=f=>({'Name':f,'Unique':uniq(f).length,'Filled':filled(f).length,'Example_5':sample(f),'Type':table.getField(f).type})
const total=flds.map(f=>({fields:fdata(f)}))
const getlist=await inv.selectRecordsAsync({fields:[]}).then(q=>[...q.recordIds])
while(getlist.length) await inv.deleteRecordsAsync(getlist.splice(0,50))
while(total.length) await inv.createRecordsAsync(total.splice(0,50))
console.log('Done')