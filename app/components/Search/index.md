```
const { Provider } = require('react-redux');
const configureStore = require('app/utils/configureStore').default;
const store = configureStore({ state });

<Provider store={store}>
  <div style={{ position: 'sticky', height: "300px" }}>
    {/* Hack to make it stick in the right position*/}
    <Search />
  </div>
</Provider>
```
