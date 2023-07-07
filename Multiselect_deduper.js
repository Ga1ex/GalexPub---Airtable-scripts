const table=base.getTable('List')
const flds=table.fields.filter(f=>f.type=='multipleSelects')
if(!flds.length) throw new Error('No multiselect fields in this table');
const ask=(flds.length>1)? await input.buttonsAsync('Select field: ',flds.map(f=>f.name)):flds[0].name
const vals=[...new Map(table.getField(ask).options?.['choices'].map(x=>[x['name'],x['color']]))]
output.inspect(vals)
const newitem=arr=>({name:arr[0],color:arr[1]})
await table.createFieldAsync(ask+'_deduped','multipleSelects',{choices:vals.map(newitem)})
