const UBS = ['users','bases','workspaces'];
const Cap = tab => tab.charAt(0).toUpperCase() + tab.slice(1)
const allData=new Map();
const toLoad=new Set(UBS);
while(toLoad.size) {
  console.log(`Waiting for user to upload CSV for: ${Array.from(toLoad).map(Cap).join(', ')}`);
   let loaded = await input.fileAsync('Upload CSV',{allowedFileTypes:['.csv'],hasHeaderRow:true})
  let {filename,parsedContents} = loaded
  if(UBS.every(t=>!filename.toLowerCase().includes(t))) {
    console.log(`Name ${filename} cannot be recognized as a valid upload (${UBS.join(', ')}).`)
    continue
  }
  let loadTab=UBS.find(t=>filename.toLowerCase().includes(t))
  allData.set(loadTab, parsedContents);
  if(!toLoad.has(loadTab)) console.log(`${loadTab} already loaded, rewriting.`); else toLoad.delete(loadTab)
  }
console.log(`All data loaded`)

const convert=(fieldType,value)=>value===0? 0: value===null? null:
 value==[]? []: value==undefined? undefined:
fieldType=='singleSelect'? {'name':value}: 
fieldType=='checkbox'? !!(value) :
fieldType=='multipleSelects'? value.split(', ').map(v=>({'name':v})): 
fieldType=='multipleRecordLinks'? value.split(', ').map(v=>({'id':v})): 
value; 

const writer = async tab => {
    let csvRows = allData.get(tab);
    let srcFields = Object.keys(csvRows[0]);
    let primary = srcFields.shift() || '';
    let fieldCheck = srcFields.every(checkFields);
    if (!fieldCheck) throw new Error('not found: ' + srcFields.filter(f => !checkFields(f)));
    let dstFields = srcFields.map(f => table.getField(f)).filter(n => n.type != 'multipleRecordLinks');
    const getdata = r => [...dstFields.map(f => [f.name, convert(f.type, r[f.name])])];
    const newrow = r => Object.fromEntries(getdata(r).filter(el => el[1] !== undefined));
    const query = await table.selectRecordsAsync({ fields: table.fields });
    const existed = new Map(query.records.map(r => [IDF(r), r.id]));
    const update = src => ({ id: existed.get(src[primary]), fields: newrow(src) });
    const create = src => ({ fields: { [primary]: src[primary], ...newrow(src) } });
    const upd = [];
    const crt = [];
    const exchoices = f => table.getField(f.name).options ? ['choices'].map(c => c['name']) : [];
    const addChoices = csvRows.reduce((a, v) => (selectors.forEach(fld => a.set(fld, [...(a.get(fld) || []), v[fld]])), a), new Map());

    await Promise.all(selectors.map(async f => {
        let field = table.getField(f), opts = field.options?.choices || [],
            existingNames = opts.map(c => c.name),
            newChoices = [...new Set((addChoices.get(f) || []).filter(v => v))].filter(c => !existingNames.includes(c));
        if (newChoices.length) await field.updateOptionsAsync({ choices: [...opts, ...newChoices.map(name => ({ name }))] });
    }));
    csvRows.forEach(j => { existed.has(j[primary]) ? upd.push(update(j)) : crt.push(create(j)) });
    console.log({ [`${Cap(tab)} Loaded rows`]: csvRows, 'New rows': crt, 'To update': upd });
    const ask = await input.buttonsAsync('Update table?', ['YES', 'No']);
    if (ask == 'YES') {
        while (upd.length) await table.updateRecordsAsync(upd.splice(0, 50));
        while (crt.length) await table.createRecordsAsync(crt.splice(0, 50));
    }
}

for (let tab of UBS) await writer(tab);
