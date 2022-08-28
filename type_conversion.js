const table=base.getTable('Example')
const flds=table.fields.filter(f=>(!['formula','createdBy','multipleLookupValues'].includes(f.type)))
const convert=(fieldType,value)=>value===0? 0: value===null? null: value===[]? []: 
fieldType=='singleSelect'? {'name':value.name}: 
fieldType=='multipleSelects'? value.map(v=>({'name':v.name})): 
fieldType=='multipleAttachments'? value.url: 
fieldType=='multipleRecordLinks'? value.map(v=>({'id':v.id})): 
value;
const newrow=(r)=>({'fields':Object.fromEntries(
    [...flds.map(f=>[f.name,convert(f.type,r.getCellValue(f))])]    )})