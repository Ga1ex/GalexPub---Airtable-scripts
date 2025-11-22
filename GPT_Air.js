const free_key='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'
const hook='https://https://api.openai.com/v1/completions'
const options={
    method:'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${free_key}`
    }
}

const table = base.getTable('MyTable');
const record=await input.recordAsync('Select a record',table);
const prompt=record?.getCellValue('Prompt');
if (!prompt) throw new Error('Prompt is empty or record not selected');
options.body=JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.7
});

const responce=await remoteFetchAsync(hook,options);
const result=await responce.json()
console.log(result)

