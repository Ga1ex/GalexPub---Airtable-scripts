//galex 2023
// Required: run from button in table 'uploader', attachments in 'Files'. Edit first 2 lines to change
// Optional: field Status with 'LOADING'/'idle' choices. You can edit or remove Status change lines 
// to do: autodetect/autocreate Status field and options
const table=base.getTable('uploader')
const FLS='Files'
const dest=await input.tableAsync('Where to upload?')
const rec=await input.recordAsync('',table)
if(!rec) throw new Error(`No rec defined`)
const data=rec.getCellValue(FLS)
if(!data) throw new Error('Nothing to upload')
const fld=dest.fields.filter(f=>f.type.toString()=='multipleAttachments')
if(!fld) throw new Error(`No attachment fields in ${dest.name}`)
const myfld=(fld.length>1)? await input.buttonsAsync('Choose field',fld.map(f=>f.name)):fld.pop()?.name||''
output.text(`Field to store files: ${myfld} `)
const imgurl=await input.fieldAsync('Which field contain filenames, to put files in respective records?',dest)
const IMG=imgurl.name
await table.updateRecordAsync(rec,{'Status':{name:'LOADING'}})   //Status change to Loading
const xname=file=>file.size+file.filename

const query=await dest.selectRecordsAsync({fields:[IMG,myfld]})
const fname=el=>el.filename.split('/').pop()
output.text(data.length+' files to go. Locating place by filenames...')
const rec_id=el=>query.records.find(r=>r.getCellValue(IMG)?.includes(fname(el)))?.id||'not_found'
const writer=data.reduce((a,e)=>a.set(rec_id(e),[...a.get(rec_id(e))||[], e]),new Map())
output.text('Done')
output.text('Data to write:')
output.inspect(writer)

const notfound=writer.has('not_found')? writer.get('not_found'):[]
if(notfound.length) writer.delete('not_found')
const existing=new Map([...writer.keys()].map(k=>[k,query.getRecord(k).getCellValue(myfld)||[]]))
output.text('Files currently located in destination places:')
output.inspect(existing)
const allexist=[...existing.values()].flat().map(xname)
const dupes=data.filter(d=>allexist.includes(xname(d)))
if(dupes.length) output.text( `Some files (${dupes.length}) already present in table:`)
if(dupes.length) output.inspect(dupes.map(d=>d.filename))
const xdupes=dupes.map(xname)
const newfile=({filename,url,...rest})=>({filename,url})
const check=rid=>writer.get(rid).filter(f=>!xdupes.includes(xname(f))).map(newfile)
const update=r=>({[myfld]:[...existing.get(r),...check(r)]})
const upd=[...writer.keys()].filter(r=>check(r).length).map(k=>({id:k,fields:update(k)}))
const uploadedNum=data.length-dupes.length-(notfound?.length||0)
output.text(`Uploading photos: ${uploadedNum} \n Records to be updated : ${upd.length}`)
if (upd.length) { 
  console.log(upd)
  const go=await input.buttonsAsync('Press GO to start',['GO','Quit'])
  if(go=='GO') while (upd.length) await dest.updateRecordsAsync(upd.splice(0,50))
  output.text(go=='Quit'? 'upload skipped...':'Done') 
  }
output.text('Press button to Clean cell or exit without cleaning.')
if(notfound.length) output.text (`Unable to locate place for ${notfound.length} photo${notfound.length>1? 's':''} . They remain in cell, please review`)
const question=[`Clean (${uploadedNum})`, 'Exit']
if(dupes.length) question.push(`Clean loaded (${uploadedNum}) and existing (${dupes.length}) `)
const ask=await input.buttonsAsync('Select: ', question)
if(ask.includes('Clean')) await table.updateRecordAsync(rec.id,{'Files':ask.includes('existing')? [...notfound]:[...notfound,...dupes]})
await table.updateRecordAsync(rec,{'Status':{name:'idle'}}) //Status change to idle
output.text('Script completed')
