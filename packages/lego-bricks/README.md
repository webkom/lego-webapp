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

### Setup for navigation-components

If you are using client-side routing, like f.ex. `react-router`, you need to wrap your application in a `RouterProvider` for navigation-components like `LinkButton` to work correctly.

`RouterProvider` is re-exported by `lego-bricks`, so you don't need `react-aria-components` as a direct dependency.
See the [react-spectrum](https://react-spectrum.adobe.com/react-aria/routing.html#routerprovider) docs for more info.

```typescript jsx
import { RouterProvider } from '@webkom/lego-webapp'

const App = () => (
  <RouterProvider>
    {... your app}
  </RouterProvider>
)
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
