## Using layouts

### TL;DR;

Use

```
// default flex-direction: row
// Put items next to each other
<Flex />
```

### Flex

```
import { Flex } from 'app/components/Layout';
```

If you need wrapping, use

```
<Flex wrap />
// or
<Flex wrapReverse />

// flex-direction: column
// Stack children vertically
<Flex column />
```

and put stuff inside them.

They support the props `alignItems`, `justifyContent`, `padding`, `flex` and
`width`, which should be sufficient for most purposes (the default values are
usually fine).

These components are only responsible for how items are laid out, and have no
opinions on colors etc. They are just `div` elements with flex styling.
