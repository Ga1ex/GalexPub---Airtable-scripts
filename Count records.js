let tabLen=tab=>tab.selectRecordsAsync().then(q=>[tab.name,q.records.length])
let sizes=await Promise.all(base.tables.map(tabLen))
let total=['TOTAL',sizes.reduce((a,b)=>a+b[1],0)]
output.table(Object.fromEntries([['Table Name','# of records'],...sizes,total]))