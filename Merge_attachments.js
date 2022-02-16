//Get attachments from Field2, join with Field1, remove duplicates, write to 1
const TABLE='TABLENAME'; 
const FIELDS={
    'doc1':'AttachField1',
    'doc2':'AttachField1'
}  //change fields here if you change them in Table

let rootTable = base.getTable(TABLE);

let fieldCheck=(rootTable.fields).flatMap(field=>field.name).
        filter(field=>Object.values(FIELDS).includes(field)).length;
if (fieldCheck<2) throw new Error( // both fields should be present in table
    'Script '+Object.values(FIELDS).join('&')+' failed, check these fields');

let config = input.config();
let query = await rootTable.selectRecordsAsync()
let record = query.getRecord(config.recordId);

let doc1=record.getCellValue(FIELDS.doc1);
let doc2=record.getCellValue(FIELDS.doc2);

if (!(doc1&&doc2)) doc2=doc1||doc2; // if empty field, take other field
else{ //check to ignore duplicate docs
    doc1.forEach(doc=>
    doc2.flatMap(lien=>lien.filename).includes(doc.filename) ?
         doc1.pop():doc2.push(doc))
}

await rootTable.updateRecordAsync(record, {
    [FIELDS.doc1]:doc2
});