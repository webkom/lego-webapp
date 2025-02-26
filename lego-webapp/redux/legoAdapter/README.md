# WTF is legoAdapter?

`legoAdapter` is a function that helps us create the redux slices for different entities (articles, events, users, etc.)
in the webapp. It extends the functionality of the [entityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)
from `@reduxjs/toolkit`.

## What does it do?

The main purpose of `legoAdapter` is to add and manage the following pieces of state for each entity:

- `ids`: An array of the all loaded IDs of the entity
- `entities`: An object that maps the IDs to the entities themselves
- _The above are provided by the redux-toolkit entityAdapter_
- `actionGrant`: What actions the current user can perform on the entity
- `fetching`: Whether a _fetch_-query for this entity is currently being loaded
- `paginationNext`: Information about pagination for each paginated query
  - `query`: What query was used to fetch the entities
  - `fetching`: Whether this query is currently being loaded
  - `next`: The URL to fetch the next page of entities
  - `hasMore`: Whether there are more entities to fetch
  - `previous`: The URL to fetch the previous page of entities
  - `hasMoreBackwards`: Whether there are more entities to fetch backwards
  - `ids`: The IDs of the entities fetched in this query (pages that are already fetched)

These pieces of state are automatically set whenever entities are fetched using the
[callApi](../actions/callAPI.ts)-action

It also creates a bunch of selectors automatically, to make it easier to get the data you need from the state.

- `selectAll`: Get all entities of this type
- `selectAllPaginated`: Get all entities that were fetched with a certain paginated query
- `selectById`: Get a single entity by its ID
- `selectByField`: Get all entities where a field has a certain value
- `selectEntities`: Get the entities object
- `selectIds`: Get the IDs array

## How do I use it?

Take a look at an example slice: [emailLists](../slices/emailLists.ts)

When initializing the adapter with entityType:

```typescript
const legoAdapter = createLegoAdapter(EntityType.EmailLists);
```

Make sure that the entity type is added to the `EntityType`-enum and that the correct types are provided in [entities.ts](../models/entities.ts).

This will avoid type errors and provide correct types when using the generated selectors.

The adapter is used like a normal entityAdapter, but with some changes to the reducers:

```typescript
const emailListSlice = createSlice({
  name: 'emailLists',
  initialState: legoAdapter.getInitialState(),
  reducers: {
    // Add any additional reducers here
  },
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [EmailList.FETCH],
    deleteActions: [EmailList.DELETE],
    extraCases: (addCase) => {
      // Add any extra case reducers here
    },
    extraMatchers: (addMatcher) => {
      // Add any extra matcher reducers here
    },
    defaultCaseReducer: (action) => {
      // Add a default case reducers here
    },
  }),
});
```

- Fetch actions must be added for `fetching`-state to work
- Delete actions must be added for deleted entities to be removed from the state

Extra reducers can be added using the `extraCases`, `extraMatchers` and `defaultCaseReducer`-options:

The selectors are generated using the `getSelectors`-function (in this example they are renamed to avoid name conflicts with other slices):

```typescript
export const {
  selectAllPaginated: selectAllEvents,
  selectById: selectEventById,
  selectEntities: selectEventEntities,
  selectIds: selectEventIds,
  selectByField: selectEventsByField,
} = legoAdapter.getSelectors((state: RootState) => state.events);
```
