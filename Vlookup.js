//Set table and field names
let mainTable = base.getTable('Orders'); 
let secondTable=base.getTable('Product');
let mainField='Barcode';let secField='item.barcode'
let linkField='Product'
//Define functions
const linkObject=rec=>({id:rec.id})
const updateLink=(ord,m)=>({id:ord.id,fields:{[linkField]:m.map(linkObject)}}) 
const compare=(o,p)=>(p.getCellValue(secField)===o.getCellValue(mainField))
const findMatches=order=>products.records.filter(prod=>compare(order,prod))
//read data
let orders = await mainTable.selectRecordsAsync({fields:[mainField]});
let products = await secondTable.selectRecordsAsync({fields:[secField]});
//Process and write
let updates=orders.records.map(ord=>updateLink(ord,findMatches(ord)))
while(updates.length) await mainTable.updateRecordsAsync(updates.splice(0,50))