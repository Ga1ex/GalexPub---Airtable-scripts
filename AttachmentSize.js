let totalSize=[]; //Total size of attachments in base
for(var table of base.tables) totalSize.push(await count(table))
if (sum(totalSize)) {output.table(totalSize.filter(n=>n));
output.markdown(`**Total: **${Math.round(sum(totalSize)?.size/1.05e6)} Mb`)}

function sum(arr){return (!arr||!arr.length||!(arr.some(n=>n)))? null:
{size:arr.filter(n=>n).map(x=>x.size).reduce((x,y)=>x+y),tname:table.name}}

async function count(table){
  let flds=table.fields.filter(fld=>fld.type.includes('Attach'));
  let query=await table.selectRecordsAsync({fields:flds});
return sum(flds.flatMap(fl=>query.records.map(x=>x.getCellValue(fl)).map(sum)));}