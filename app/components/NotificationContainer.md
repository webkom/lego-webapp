Testing:

```
const { Provider } = require('react-redux');
const configureStore = require('../utils/configureStore').default;
const store = configureStore({ state });
<Provider store={store}>
  <NotificationContainer />
</Provider>
```
