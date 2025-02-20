# styles

Stuff in this folder is mostly global stuff and utilities consumable by
component specific CSS.

Do not import `globals.css` directly anywhere, as it is being imported in
`Root.js`.

## Utilities

Utility classes can be used by other classes by using the `composes` keyword
from CSS Modules:

```css
.myClassName {
  composes: utilityClassName from 'styles/utilities.module.css';
}
```

## Variables

Variables are stored in `variables.css` and should be used in other CSS files:

```css
@import 'styles/variables.css';

.myClassName {
  background: var(--background-color);
}
```
