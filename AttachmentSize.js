//Size of all attachments in all bases. Galex 2021
const inMb=(bytes)=>(bytes?`${Math.round(bytes/Math.pow(1024,2))} Mb`:'');const ts=[];
for(var table of base.tables) ts.push(await count(table))
if (sum(ts)) {output.table(ts.filter(n=>n).map(x=>(x?{size:inMb(x.size),name:x.tname}:{})));
output.markdown(`**Total: **${inMb(sum(ts)?.size)}`)}

function sum(arr){return (!arr||!arr.length||!(arr.some(n=>n)))? null:
{size:arr.filter(n=>n).map(x=>x.size).reduce((x,y)=>x+y),tname:table.name}};
async function count(table){
  let flds=table.fields.filter(fld=>fld.type.includes('Attach'));
  let query=await table.selectRecordsAsync({fields:flds});
return sum(flds.flatMap(fl=>query.records.map(x=>x.getCellValue(fl)).map(sum)));}