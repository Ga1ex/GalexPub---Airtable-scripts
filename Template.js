const [FLD1,FLD2]=['Field1','Field2'] //field names
const TAB1=base.getTable('Table')
const query=await TAB1.selectRecordsAsync({fields:[FLD1]}) //set fields to read data
const clean=value=>value.split('').reverse().join('') //sample function - reverse word
const nonempty=r=>r.getCellValue(FLD1)!==null
const update=r=>({id:r.id,fields:{[FLD2]: example (r.getCellValue(FLD1))}})
const upd=query.records.filter(nonempty).map(update)
while (upd.length) await TAB1.updateRecordsAsync(upd.splice(0,50))
