"do{let name=await input.buttonsAsync('Select Table:',['EXIT',...base.tables.map(t=>t.name)]);
let LinksLookups=new Map(base.getTable(name).fields.filter(f=>(f.type.includes('Link'))).map(n=>
[n.name, base.getTable(name).fields.filter(e=>e.options?.recordLinkFieldId===n.id).map(y=>y.name)]));
output.clear(); output.inspect(LinksLookups)} while (this.name!='EXIT')"