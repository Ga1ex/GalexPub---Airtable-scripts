let response = await remoteFetchAsync(“APIURL”, requestOptions); 
let json = await response.json();
let table = base.getTable('Archive'); 
let query=await table.selectRecordsAsync({fields:['ID']});
let existed=new Map(query.records.map(r=>[r.getCellValue('ID'),r.id]))
let write=json.reduce((arr,el)=>{existed.has(el.ID)
? arr.upd.push({id:existed.get(el.ID),fields:{'Title':el.Title}}) 
: arr.create.push({fields:{'Title':el.Title,'ID':el.ID }})}, {upd:[],cr:[]})
while (write.upd.length) await table.updateRecordsAsync(write.upd.splice(0,50));
while (write.cr.length) await table.createRecordsAsync(write.cr.splice(0,50));
