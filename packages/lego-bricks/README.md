# lego-bricks

Component library for LEGO-webapp and other related projects.

## Installation

1. Add the package
   ```sh
   yarn add @webkom/lego-bricks
   ```
2. Import components and stylesheet in your project

   ```typescript jsx
   import { Button, Card } from '@webkom/lego-editor';
   // Add the stylesheet
   import '@webkom/lego-bricks/dist/style.css';

   const YourComponent = () => (
     <Card>
       <Button onPress={() => alert("Pressed!")}>Press me!</Button>
     </Card>
   );
   ```

### Provider

For client-side routing (with f.ex. `react-router`), certain dark-mode features, and components like Tabs to work you need to wrap your application in a `Provider`.

```typescript jsx
import { Provider } from '@webkom/lego-webapp';
import { useLocation, useNavigate } from 'react-router';

const App = () => {
  const navigate = useNavigate();

  return (
    <Provider navigate={navigate} useLocation={useLocation} theme="light">
       <YourApp />
    </Provider>
  )
}
```

The navigate hook might have additional options as the second argument, f.ex. `replace: true` to replace the current history entry instead of adding a new one. These options can be used on Links with the `routerOptions`prop.
The types are configured with a declaration like this:

```typescript
declare module 'react-aria-components' {
   interface RouterConfig {
      routerOptions: {
         replace?: boolean;
         state?: unknown;
      };
   }
}
```

## Development

We use storybook to demo and test components. To start it run:

```sh
yarn storybook
```

### Publishing new version

1. Bump version in `package.json`
2. Make sure everything is merged into master
3. Run `yarn build` to compile the package
4. Run `yarn publish` to publish the package to npm
