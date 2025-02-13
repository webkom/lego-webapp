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

For client-side routing (with f.ex. `react-router`) and certain dark-mode features to work, you need to wrap your application in a `Provider`.

```typescript jsx
import { Provider } from '@webkom/lego-webapp';
import { useNavigate } from 'react-router';

const App = () => {
  const navigate = useNavigate();

  return (
    <Provider navigate={navigate} theme="light">
      <YourApp />
    </Provider>
  )
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
