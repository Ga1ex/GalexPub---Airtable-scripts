const response = await remoteFetchAsync('APIURL', requestOptions);
const json = await response.json();
const table = base.getTable('Tab2');
const query=await table.selectRecordsAsync({fields:['ID']});
const existed=new Map(query.records.map(r=>[r.getCellValue('ID'),r.id]))
const update=(el)=>({'id':existed.get(el.ID),'fields':{'Title':el['Title']}})
const create=(el)=>({fields:{'Title':el.Title,'ID':el.ID }})
const upd=[];const crt=[]
// i never used it in real life, wrote to help someone in community
// and just holding it here to copypaste lines 6+11, or 7+12
json.forEach( j=>{ existed.has(j.ID)? upd.push(update(j)) : crt.push(create(j)) }) 
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))
while (crt.length) await table.createRecordsAsync(crt.splice(0,50))