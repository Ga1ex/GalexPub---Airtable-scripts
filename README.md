Gallery:  https://airtable.com/embed/shr3rV52eZV30UqN1

"# GalexPub" 
This repo contains small scripts (10-20 lines) for Airtable to manage table data

Advanced deduper - a classic AT task. Do you know that you can quickly evaluate duplicates in column by 'Customize field - single select' (don't press save, just look at the list of field unique values, sorted by frequency, available to copypaste)?
Includes UI to select table, fields to check and mark. Sometimes very helpful in scenarios where extension is almost useless.
Can ignore case, 1-2 letter words, order of words, non-letter symbols (useful for addresses and names list). 'Doe, John == JOHN R. DOE'. Not a fuzzy-match, but it's just a little script. Important update - instead of mark 'duplicate', it sets number. Then you can group by mark field, collapse all, set 'Unique' totals for check field to normalize a big list.

Alike - fuzzy compare for sentences (may be used to compare Addresses from different sources etc)  
Alike UI - same with input.config and select field and phrase
(Levenstein - fuzzy compare with Levenstein distance, usable but incomplete)

Attachment size - summary size of all attachments in all base tables, per table

Check Untrimmed - check 'untrimmed' values in some fields (name contains word entered by user, for example 'owner') in all base tables.
You can redefine function to check

DownloadAttach - vbs-script for Windows. Download all attachments from csv into current folder. Can be used for backup to be sure you files are stored in your location. Each attachment has 8-digit code in link, it appends to filename. Then you can restore all including attachments via uploader. Note that you should run it within 2 hours from CSV download, so links will be available before change due to Nov 2022 Airtable attachment storage policy change. Requirements: csv file must be named Backup.csv

Bulk Uploader - runs from separate table by button. Add attachments to selected table, using text info in second selected field. Attachments must be uploded to 'Files' field. Might contain 'Status' single-select field.

Find field by ID - find field by ID or it's part

Find duplicates - light version of deduper, no UI, only exact match. 1st line must be adjucted to select fields to check and to mark

Join multiple tables - when you have many similar tables in a base, with similar fields, you can join all this data in a Master table.
If you need only several fields and others should be ignored, edit Master table design - script uses it's fields as a fieldlist to take data.

Horizont_to_Vert - transpose table, turning some data rows with 'Name 1', 'Name 2', 'Name 3' to vertical columns 'Name','num'

Links and Lookups - Shows all linked fields and their lookups

OryxFetch - fetch data from site oryxspioenkop.com, about equipment losses in war, parse it into small group of head lines, write to table

Match probe - generate match probability formula for 2 fields. Designed to check and compare names from different sources

TableCreate - it's a script for table 'TableCreator', used as tool to create tables by script. Select types, put names and press button. 
Create table, await base.createTableAsync('TableCreator',[{name:'Name',type:'singleLineText'},{name:'prepare',type:'singleLineText'},{name:'Fieldnames',type:'multilineText'},{name:'Command',type:'multilineText'},{name:'Fieldtypes',type:'multipleSelects',options:{choices:[{name:'singleLineText'},{name:'multilineText'}]}}])
turn prepare to button. use bulleted text for names, comma-separate inside the same type, new row for new type

UpdateCreate - get data from some API, in json, check records in table. If such ID exists, update. If not, create new record

Vlookup - set links between 2 tables comparing 2 given fields in them. Supports large tables and multiple linking.
VlookupUI - input table and field, the rest autodetects. Raised speed, vital for 25k+ rows. Avoids double loop by hashmapping second array.

If you are interested in details of scripts, don't hesitate to ask.
Additional contact info: gusev80@gmail.com, @galex80 (telegram)
