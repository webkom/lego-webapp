Test:

```
const { Provider } = require('react-redux');
const configureStore = require('app/utils/configureStore').default;
const store = configureStore({ state });
<Provider store={store}>
  <Footer />
</Provider>
```
