const skip=['Tables to skip','EXAMPLE1','example2'].map(n=>n.toUpperCase())
const target=base.tables.filter(t=>!skip.includes(t.name.toUpperCase()))
const check=(fld,mustBe)=>fld.name!=mustBe? {field:fld,fname:mustBe}:null
const linkName=fld=>base.getTable(fld.options.linkedTableId).name
const links=t=>t.fields.filter(f=>f.type.includes('Links')).map(fl=>check(fl,`Link to ${linkName(fl)}`))
const lkpName=(tab,f,lnk=tab.getField(f.options.recordLinkFieldId))=>
`${base.getTable(linkName(lnk)).getField(f.options.fieldIdInLinkedTable).name} (from ${linkName(lnk)})`
const lookups=t=>t.fields.filter(f=>f.type.includes('Lookup')).map(fl=>check(fl,lkpName(t,fl)))
const text=obj=>`\nField **${obj.field.name}** must be **${obj.fname}** \n`
const scan=(t,upd)=>{ output.markdown(`Checking ${t.name} :\n ${upd.map(text).join('')||'All OK'}`)
    return upd }
const updates=target.flatMap(t=>scan(t,[...links(t),...lookups(t)].filter(Boolean)))
if(updates.length) {
const ask=await input.buttonsAsync('Proceed with bulk-correct of ALL listed fields?',['GO', 'Quit'])
if(ask=='GO') for (let go of updates) await go.field.updateNameAsync(go.fname);
console.log(ask=='GO'? 'Done':'Cancelled' ) }