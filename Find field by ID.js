let f_id=await input.textAsync('field ID or part'); 
let fid=arr=>arr.filter(el=>el.id.includes(f_id));
output.table(base.tables.filter(n=>fid(n.fields).length).
map(t=>[t.name,fid(t.fields).map(f=>f.name).join()]))