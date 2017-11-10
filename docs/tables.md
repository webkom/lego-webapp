The global rules for tables should take care of most styling you need. You will
need to add the `table-header` class to your `<tr>` with header elements. You
should use a structure like this:

```
<table>
  <thead>
    <tr>
      <th>Header for Row 1</th>
      <th>...</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Row 1, Column 1</td>
      <td>Row 1, Column 2</td>
      ...
    </tr>
    <tr>
      <td>Row 2, Column 1</td>
      <td>Row 2, Column 2</td>
      ...
    </tr>
    ...
  </tbody>
</table>
```
