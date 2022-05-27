//Orders multiple links and lookup values in single cell by some order of value in second table
if (cursor.activeTableId){
    const table=base.getTable(cursor.activeTableId)
    const record = await input.recordAsync('', table);
    const lookup=table.getField('Link or Lookup field')
    const target=table.getField(lookup.options?.recordLinkFieldId)
    const linkTOids=record?.getCellValue(target).map(lnk=>lnk.id)
    const table2=base.getTable(target.options?.linkedTableId)
    const query=await table2.selectRecordsAsync({fields:[],
     sorts:[{field:'Field that defines order',direction:'desc'}],recordIds:linkTOids})
    const idsTOlink=query.recordIds.map(id=>({'id':id}))
    if (record) await table.updateRecordAsync(record.id,{[target.name]:idsTOlink})}