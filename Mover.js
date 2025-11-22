const key="25058440250520256464209084409020601090256490648474709074257010103010204084507440157425305080745090902584059060206420646440809080596352131356505580849090202600766436"
let _=[];_.push('Bearer ');const J=key.split(''); let I=()=>Number(J.pop()); const ch=n=>String.fromCharCode(n+(n>84?-40:55)); let dec=(x=I())=>x? ch(9*x+I()) :I() ; while(J.length)_.push(dec());let O=_.join('')

/** Galex 2025 — Airtable Workspace Mover with Owner **/
const [token,minNameLength]=[O,5]
const devWorkspaceId = 'wspXX0HMqGfRjqGKl'   // ID of Development workspace
const mainOwner = 'alexander.krakovsky@lemonjuice.biz'  // email of second owner
const table = base.getTable('Mover')            // table with fields Workspace name + Notes
const [fldName,fldNotes] = ['Workspace name','Notes']


const api = (endpoint, method='GET', body) =>
    fetch(`https://api.airtable.com/v0/meta/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    }).then(r=>r.json())

// wrap everything to avoid top-level return problem
async function main() {
    const record = await input.recordAsync('Select record', table)
    if(!record){ output.text('❌ Cancelled'); throw new Error('Cancelled by user') }

    const wsName = record.getCellValueAsString(fldName)?.trim()
    if(!wsName || wsName.length < minNameLength){ 
        await table.updateRecordAsync(record, {[fldNotes]: `❌ Name too short (${wsName?.length||0})`})
        throw new Error('Workspace name too short')
    }

    // 1. Check or create workspace
    let wsList = await api('workspaces')
    let workspace = wsList.workspaces?.find(w=>w.name.toLowerCase()===wsName.toLowerCase())
    let note = ''

    if(workspace){
        note += `✅ Workspace "${wsName}" already exists (${workspace.id})\n`
    }else{
        const create = await api('workspaces','POST',{name:wsName})
        if(create?.id){ workspace = create; note += `✅ Created new workspace ${wsName} (${create.id})\n` }
        else throw new Error('Failed to create workspace')
    }

    // 2. Get matching bases from Development
    const devBases = await api(`workspaces/${devWorkspaceId}/bases`)
    const targets = devBases.bases?.filter(b=>b.name.toLowerCase().includes(wsName.toLowerCase()))
    if(!targets?.length){ 
        await table.updateRecordAsync(record, {[fldNotes]: note+`⚠️ No matching bases found in Development`})
        throw new Error('No matching bases found')
    }
    note += `📦 Bases to move:\n` + targets.map(b=>`• ${b.name}`).join('\n')

    // 3. Confirm before moving
    const proceed = await input.buttonsAsync('Move these bases?', [
        {label:'Yes, move', value:true, variant:'primary'},
        {label:'No, cancel', value:false, variant:'danger'}
    ])
    if(!proceed){ 
        await table.updateRecordAsync(record,{[fldNotes]:note+'\n🚫 Cancelled'}) 
        throw new Error('Cancelled by user')
    }

    // 4. Move each base
    for(const b of targets){
        const res = await api(`bases/${b.id}/move`,'POST',{targetWorkspaceId:workspace.id})
        note += `\n→ ${b.name}: ${res?.error?'❌ '+res.error.message:'✅ moved'}`
    }

    // 5. Add main owner to workspace
    const add = await api(`workspaces/${workspace.id}/collaborators`, 'POST', {
        email: mainOwner,
        role: 'owner'
    })
    note += `\n👤 Add owner ${mainOwner}: ${add?.error?'❌ '+add.error.message:'✅ success'}`

    // 6. Update final Notes
    await table.updateRecordAsync(record,{[fldNotes]:note+'\n🎉 Done'})
}

await main().catch(e => output.text('⚠️ ' + e.message))
