const table=base.getTable('Testing_Dupes')
const check=['First name','Last Name','Residence']
const merge=['Phone Number','Email Address'] 
const query=await table.selectRecordsAsync({fields:[...check,...merge]})
const val=r=>check.map(f=>r.getCellValue(f)).join('')
const valrecs=query.records.reduce((a,v)=>a.set(val(v),[...a.get(val(v))||[],v]),new Map())
const combine=(arr,i)=>merge.map(f=>[f,i? 'DBL':arr.map(r=>r.getCellValue(f)).join('\n')])
const mrg=(arr,ix)=>Object.fromEntries(combine(arr,ix))
const values=[...valrecs.keys()]
const upds=values.flatMap(v=>valrecs.get(v).map((r,ix,arr)=>({id:r.id,fields:mrg(arr,ix)})))
console.log('Values merged, duplicates marked. Writing..'); output.table(upds)
//while (upds.length) await table.updateRecordsAsync(upds.splice(0,50))