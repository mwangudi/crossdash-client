import auth from '../domains/Auth/actions';
import shared from '../domains/Shared/actions';
import claim from '../domains/Claims/actions';
import customer from '../domains/Customers/actions';
import vehicle from '../domains/Vehicles/actions';
import assess from '../domains/Assess/actions';
import review from '../domains/Review/actions';
import admin from '../domains/Admin/actions';
import approve from '../domains/Approve/actions';
import finance from '../domains/Finance/actions';

export default {
  ...auth,
  ...shared,
  ...claim,
  ...customer,
  ...vehicle,
  ...assess,
  ...review,
  ...admin,
  ...approve,
  ...finance,
};
