const response = await remoteFetchAsync('APIURL', requestOptions);
const json = await response.json();
const table = base.getTable('Tab2');
const query=await table.selectRecordsAsync({fields:['ID']});
const existed=new Map(query.records.map(r=>[r.getCellValue('ID'),r.id]))
const update=(el)=>({'id':existed.get(el.ID),'fields':{'Title':el['Title']}})
const create=(el)=>({fields:{'Title':el.Title,'ID':el.ID }})
const upd=[];const crt=[]
json.forEach( j=>{ existed.has(j.ID)? upd.push(update(j)) : crt.push(create(j)) }) 
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))
while (crt.length) await table.createRecordsAsync(crt.splice(0,50))