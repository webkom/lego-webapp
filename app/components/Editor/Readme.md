```
initialValue = { value: "<p>the starting value for the editor</p>" };
<Editor onChange={html => setState({ value: html })} value={initialValue.value} />
{initialValue.value}
```
