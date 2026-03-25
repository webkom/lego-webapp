import { createSlice } from "@reduxjs/toolkit";
import { Exchange } from '~/redux/actionTypes';
import createLegoAdapter from "../legoAdapter/createLegoAdapter";
import { EntityType } from "../models/entities";

import type { RootState } from '~/redux/rootReducer';


const legoAdapter = createLegoAdapter(EntityType.Exchanges)

const exchangesSlice = createSlice({
    name: EntityType.Exchanges,
    initialState: legoAdapter.getInitialState(),
    reducers: {},
    extraReducers: legoAdapter.buildReducers({
        fetchActions: [Exchange.FETCH_ALL]
    })
})

export default exchangesSlice.reducer;

export const {
    selectAll: selectAllExchanges,
} = legoAdapter.getSelectors((state: RootState) => state.exchanges);
