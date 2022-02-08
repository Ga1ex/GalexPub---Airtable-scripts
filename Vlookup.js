//Set table and field names
const mainTable = base.getTable('Orders'); 
const secondTable=base.getTable('Product');
const [mainField,secField,linkField]=['Barcode','item.barcode','Product']
//Define functions
const linkObject=rec=>({id:rec.id})
const updateLink=(ord,m)=>({id:ord.id,fields:{[linkField]:m.map(linkObject)}}) 
const compare=(o,p)=>(p.getCellValue(secField)===o.getCellValue(mainField))
const findMatches=order=>products.records.filter(prod=>compare(order,prod))
//read data
const orders = await mainTable.selectRecordsAsync({fields:[mainField]});
const products = await secondTable.selectRecordsAsync({fields:[secField]});
//Process and write
const updates=orders.records.map(ord=>updateLink(ord,findMatches(ord)))
while(updates.length) await mainTable.updateRecordsAsync(updates.splice(0,50))