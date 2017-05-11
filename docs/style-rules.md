# Style rules

This document aims to clarify which guidelines should be followed when creating or designing a
new page. It also specifies which CSS rules should be composed and/or which components
should be used for various purposes.


All CSS files references in this document are located in the `app/styles` folder.
All colors and other constants like `page width` are defined in `variables.css`, while all classes
that should be composed like `.contentContainer` are found in `utilities.css`.
You compose a css class as such:
```
.myClass {
  composes: contentContainer;
  padding: 40px;
  ...
}
```

### Available classes to compose
- `container`
- `contentContainer`
- `withShadow`
- `truncateString`
- `hiddenOnMobile`
- `sidebar`

### Global classes
These are added by simply adding a `className=x`.
- `u-small`
- `u-mb`
- `u-ui-heading`
- `table-header`

## Guidelines

### Headers
The default `h1`, `h2`, and `h3` tags provide all the styling your average header or title will need.
Some headers will want more margin bottom, which can be added by adding the classname
`u-mb`. You can also make an extra small header using the `u-small` class. Headers should not
be custom styled to any notable degree. `u-ui-heading` can also be used (TODO: what for?)

### Sidebars
(Example text) All sidebars should be located to the right of the rest of the page. They should
compose the `sidebar` class. No links in the sidebars should have icons unless they add something
the link text doesn't.

### Mobile
Basic content should automatically be responsive by composing responsive classes like `contentContainer`.
If you want to completely hide something on mobile, add the `hiddenOnMobile` class. Be hesitant to use this, as we do not want the mobile version to have any less functionality than the
full version.

Make sure to double check that your feature is responsive; this is 2017.

### Tables
The global rules for tables should take care of most styling you need. You will need to add
the `table-header` class to your `<tr>` with header elements. You should use a structure like this:
```
<table>
  <thead>
    <tr>
      <th>Header for Row 1</th>
      ...
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

### Backgrounds
(TODO)

### List items
(TODO)

### More rules!
Let me know what other rules we want!
