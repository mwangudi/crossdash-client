import { persistCombineReducers } from 'redux-persist';
import { routerReducer as routing } from 'react-router-redux';
import storage from 'redux-persist/lib/storage';
import shared from '../domains/Shared/reducer';
import claim from '../domains/Claims/reducer';
import auth from '../domains/Auth/reducer';
import customer from '../domains/Customers/reducer';
import vehicle from '../domains/Vehicles/reducer';
import assess from '../domains/Assess/reducer';
import admin from '../domains/Admin/reducer';
import review from '../domains/Review/reducer';
import approve from '../domains/Approve/reducer';
import finance from '../domains/Finance/reducer';

const config = {
  key: 'crossdash-account',
  storage,
  whitelist: ['auth', 'claim', 'customer', 'vehicle'],
};

const rootReducer = persistCombineReducers(config, {
  routing,
  shared,
  claim,
  auth,
  customer,
  vehicle,
  assess,
  admin,
  review,
  approve,
  finance,
});

export default rootReducer;
