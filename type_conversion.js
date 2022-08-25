const table=base.getTable('Tasks')
const flds=table.fields.filter(f=>(!['formula','createdBy','multipleLookupValues'].includes(f.type)))
const convert=(ftype,val)=>!val? null: !val.length? []: ftype=='multipleAttachments'? val.url: 
ftype=='singleSelect'? {'name':val.name}: ftype=='multipleSelects'? val.map(v=>({'name':v.name})): 
ftype=='multipleRecordLinks'? val.map(v=>({'id':v.id})): val
const newrow=(r)=>({'fields':Object.fromEntries([...flds.map(f=>[f.name,convert(f.type,r.getCellValue(f))])])})