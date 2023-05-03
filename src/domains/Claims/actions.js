import { omit, isNil, trimEnd, forEach, isEmpty, differenceBy } from 'lodash';

import * as types from './actionTypes';
import Api from '../../api';
import utils, { extractDataToFile } from '../../utils';

export const actions = {
  updateAccidentForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_ACCIDENT_DETAILS_FORM,
      payload,
    });
  },
  updateDriverForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_DRIVER_DETAILS_FORM,
      payload,
    });
  },
  populateClaims: payload => dispatch => {
    dispatch({
      type: types.POPULATE_CLAIMS,
      payload,
    });
  },
  updatedPoliceDetailsForm: payload => dispatch => {
    dispatch({
      type: types.UPDATE_POLICE_DETAILS_FORM,
      payload,
    });
  },
  updateClaimsLoader: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CLAIMS_LOADER,
      payload,
    });
  },
  updateSelectedClaim: payload => dispatch => {
    dispatch({
      type: types.UPDATE_SELECTED_CLAIM,
      payload,
    });
  },
  manageOtherParty: payload => dispatch => {
    dispatch({
      type: types.MANAGE_OTHER_PARTIES,
      payload,
    });
  },
  managePassengers: payload => dispatch => {
    dispatch({
      type: types.MANAGE_PASSENGERS,
      payload,
    });
  },
  manageInjuredPerson: payload => dispatch => {
    dispatch({
      type: types.MANAGE_INJURED_PEOPLE,
      payload,
    });
  },
  manageWitness: payload => dispatch => {
    dispatch({
      type: types.MANAGE_WITNESS,
      payload,
    });
  },
  manageVehicleDamage: payload => dispatch => {
    dispatch({
      type: types.MANAGE_VEHICLE_DAMAGE_DETAILS,
      payload,
    });
  },
  updateClaimPaginationLinks: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CLAIM_PAGINATION_LINKS,
      payload,
    });
  },
  updateClaimPagination: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CLAIM_PAGINATION,
      payload,
    });
  },
  updateClaimantStatement: payload => dispatch => {
    dispatch({
      type: types.UPDATE_CLAIMANT_STATEMENT,
      payload,
    });
  },
  populateVehicleDamageDetails: payload => dispatch => {
    dispatch({
      type: types.POPULATE_VEHICLE_DAMAGE_DETAILS,
      payload,
    });
  },
  populateOtherParties: payload => dispatch => {
    dispatch({
      type: types.POPULATE_OTHER_PARTIES,
      payload,
    });
  },
  populateWitnesses: payload => dispatch => {
    dispatch({
      type: types.POPULATE_WITNESS,
      payload,
    });
  },
  populateInjuredPersons: payload => dispatch => {
    dispatch({
      type: types.POPULATE_INJURED_PEOPLE,
      payload,
    });
  },
  populatePassengers: payload => dispatch => {
    dispatch({
      type: types.POPULATE_PASSENGERS,
      payload,
    });
  },
  fetchClaims: payload => dispatch => {
    dispatch(actions.updateClaimsLoader({ fetchAllClaims: true }));
    dispatch(actions.populateClaims({ empty: true }));
    return Api.fetchAll(payload)
      .then(({ data }) => {
        dispatch(
          actions.populateClaims(utils.camelizeKeys({ claims: data.data })),
        );
        dispatch(
          actions.updateClaimPaginationLinks(
            utils.camelizeKeys({ ...data.links }),
          ),
        );
        dispatch(actions.updateClaimsLoader({ fetchAllClaims: false }));
      })
      .catch(() => {
        dispatch(actions.populateClaims({ empty: true }));
        dispatch(actions.updateClaimsLoader({ fetchAllClaims: false }));
      });
  },
  clearEmptyClaimsForm: () => dispatch => {
    dispatch(actions.updateDriverForm({ empty: true }));
    dispatch(actions.updateAccidentForm({ empty: true }));
    dispatch(actions.updateClaimantStatement({ empty: true }));
    dispatch(actions.manageInjuredPerson({ empty: true }));
    dispatch(actions.manageVehicleDamage({ empty: true }));
    dispatch(actions.updatedPoliceDetailsForm({ empty: true }));
    dispatch(actions.manageOtherParty({ empty: true }));
    dispatch(actions.managePassengers({ empty: true }));
    dispatch(actions.manageWitness({ empty: true }));
  },
  fileClaim: (payload, notificationHandler, successHandler) => (
    dispatch,
    getState,
  ) => {
    dispatch(actions.updateClaimsLoader({ submit: true }));
    const {
      claim: {
        accidentForm,
        driverForm,
        claimantStatement,
        policeForm,
        vehicleDamages,
        otherParties,
        passengers,
        witnesses,
        injuredPeople,
      },
      customer: { selectedCustomer },
      vehicle: { selectedVehicle },
    } = getState();
    const driverName = trimEnd(`${
      isNil(selectedCustomer.attributes.firstName)
        ? ''
        : selectedCustomer.attributes.firstName
    }${
      isNil(selectedCustomer.attributes.middleName)
        ? ''
        : ` ${selectedCustomer.attributes.middleName}`
    }${
      isNil(selectedCustomer.attributes.lastName)
        ? ''
        : ` ${selectedCustomer.attributes.lastName}`
    }
      ${
        isNil(selectedCustomer.attributes.name)
          ? ''
          : ` ${selectedCustomer.attributes.name}`
      }`);

    const claimData = {
      claimant_id: selectedCustomer.id,
      vehicle_id: selectedVehicle.id,
      claimant_type: selectedCustomer.type.includes('corporate')
        ? 'corporate_customer'
        : 'individual_customer',
      claimant_statement: claimantStatement[0],
      ...utils.dataPreprocessor(
        {
          ...utils.decamelizeKeys({
            ...omit(driverForm, ['accidentDates', 'convictionDetails']),
            driverName: driverForm.driverWasSelf
              ? `${driverName}`
              : `${driverForm.firstName} ${driverForm.surname} ${driverForm.lastName}`,
            driverDateOfBirth: driverForm.driverWasSelf
              ? utils.formatDate(
                  selectedCustomer.attributes.driverDateOfBirth,
                  'YYYY-MM-DD',
                )
              : utils.formatDate(driverForm.dateOfBirth, 'YYYY-MM-DD'),
            driverPhoneNumber: driverForm.driverWasSelf
              ? selectedCustomer.attributes.phoneNumber
              : driverForm.driverPhoneNumber,
            dateLicensed: utils.formatDate(
              driverForm.dateLicensed,
              'YYYY-MM-DD',
            ),
            accidentCount: driverForm.accidentDates.length,
          }),
          driver_statement: driverForm.driverStatement[0],
        },
        'driver_detail_attributes',
      ),
      ...utils.dataPreprocessor(
        {
          ...utils.decamelizeKeys({
            ...omit(accidentForm, ['accidentPhotos']),
            dateOfAccident: utils.formatDate(
              accidentForm.dateOfAccident,
              'YYYY-MM-DD',
            ),
          }),
          'accident_photos[]': accidentForm.accidentPhotos,
          accident_sketch: accidentForm.accidentSketch[0],
        },
        'accident_detail_attributes',
      ),
      ...utils.dataPreprocessor(
        utils.decamelizeKeys({ ...policeForm }),
        'police_detail_attributes',
      ),
      ...utils.dataPreprocessArray(
        [...utils.decamelizeKeys(vehicleDamages.map(v => omit(v, ['id'])))],
        'vehicle_damage_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...otherParties.map(otherParty => {
            return {
              ...utils.decamelizeKeys(
                omit(otherParty, ['vehicleDamages', 'id']),
              ),
              name: `${otherParty.firstName} ${otherParty.surname} ${otherParty.lastName}`,
              'vehicle_damages[]': otherParty.vehicleDamages,
            };
          }),
        ],
        'other_party_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...witnesses.map(witness => {
            return {
              ...utils.decamelizeKeys(omit(witness, ['id'])),
              name: `${witness.firstName} ${witness.surname} ${witness.lastName}`,
            };
          }),
        ],
        'witness_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...passengers.map(passenger => {
            return {
              ...utils.decamelizeKeys(omit(passenger, ['id'])),
              name: `${passenger.firstName} ${passenger.surname} ${passenger.lastName}`,
            };
          }),
        ],
        'passenger_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...injuredPeople.map(injured => {
            return {
              ...utils.decamelizeKeys(omit(injured, ['id'])),
              name: `${injured.firstName} ${injured.surname} ${injured.lastName}`,
            };
          }),
        ],
        'injured_person_details_attributes',
      ),
    };

    const formData = extractDataToFile(claimData);
    if (!isEmpty(driverForm.convictionDetails)) {
      forEach(driverForm.convictionDetails, c => {
        formData.append(
          'driver_detail_attributes[conviction_details][]',
          c.details,
        );
      });
    }
    if (!isEmpty(driverForm.accidentDates)) {
      forEach(driverForm.convictionDetails, c => {
        formData.append(
          'driver_detail_attributes[accident_dates][]',
          c.details,
        );
      });
    }

    return Api.upload({
      ...utils.decamelizeKeys(payload),
      data: formData,
    })
      .then(() => {
        dispatch(actions.clearEmptyClaimsForm());
        dispatch(actions.updateClaimsLoader({ submit: false }));
        successHandler();
        notificationHandler('Claim submitted', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateClaimsLoader({ submit: false }));
      });
  },
  updateClaim: (payload, notificationHandler, successHandler) => (
    dispatch,
    getState,
  ) => {
    dispatch(actions.updateClaimsLoader({ submit: true }));
    const {
      claim: {
        accidentForm,
        driverForm,
        claimantStatement,
        policeForm,
        vehicleDamages,
        otherParties,
        passengers,
        witnesses,
        injuredPeople,
        selectedClaim: {
          attributes: {
            vehicleDamageDetails,

            passengerDetails,
            witnessDetails,
            otherPartyDetails,
            injuredPersonDetails,
          },
        },
      },
    } = getState();

    const claimData = {
      claimant_statement: claimantStatement[0],
      ...utils.dataPreprocessor(
        {
          ...utils.decamelizeKeys({
            ...omit(driverForm, ['accidentDates', 'convictionDetails']),
            driverDateOfBirth: utils.formatDate(
              driverForm.dateOfBirth,
              'YYYY-MM-DD',
            ),
            driverPhoneNumber: driverForm.driverPhoneNumber,
            dateLicensed: utils.formatDate(
              driverForm.dateLicensed,
              'YYYY-MM-DD',
            ),
            accidentCount: driverForm.accidentDates.length,
          }),
          driver_statement: driverForm.driverStatement[0],
        },
        'driver_detail_attributes',
      ),
      ...utils.dataPreprocessor(
        {
          ...utils.decamelizeKeys({
            ...omit(accidentForm, ['accidentPhotos']),
            dateOfAccident: utils.formatDate(
              accidentForm.dateOfAccident,
              'YYYY-MM-DD',
            ),
          }),
          'accident_photos[]': accidentForm.accidentPhotos,
          accident_sketch: accidentForm.accidentSketch[0],
        },
        'accident_detail_attributes',
      ),
      ...utils.dataPreprocessor(
        utils.decamelizeKeys({ ...policeForm }),
        'police_detail_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...utils.decamelizeKeys(
            differenceBy(vehicleDamages, vehicleDamageDetails, 'id').map(v =>
              omit(v, ['id']),
            ),
          ),
        ],
        'vehicle_damage_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...differenceBy(otherParties, otherPartyDetails, 'id').map(
            otherParty => {
              return {
                ...utils.decamelizeKeys(
                  omit(otherParty, ['vehicleDamages', 'id']),
                ),
                name: `${otherParty.firstName} ${otherParty.surname} ${otherParty.lastName}`,
                'vehicle_damages[]': otherParty.vehicleDamages,
              };
            },
          ),
        ],
        'other_party_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...differenceBy(witnesses, witnessDetails, 'id').map(witness => {
            return {
              ...utils.decamelizeKeys(omit(witness, ['id'])),
              name: `${witness.firstName} ${witness.surname} ${witness.lastName}`,
            };
          }),
        ],
        'witness_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...differenceBy(passengers, passengerDetails, 'id').map(passenger => {
            return {
              ...utils.decamelizeKeys(omit(passenger, ['id'])),
              name: `${passenger.firstName} ${passenger.surname} ${passenger.lastName}`,
            };
          }),
        ],
        'passenger_details_attributes',
      ),
      ...utils.dataPreprocessArray(
        [
          ...differenceBy(injuredPeople, injuredPersonDetails, 'id').map(
            injured => {
              return {
                ...utils.decamelizeKeys(omit(injured, ['id'])),
                name: `${injured.firstName} ${injured.surname} ${injured.lastName}`,
              };
            },
          ),
        ],
        'injured_person_details_attributes',
      ),
    };

    if (isEmpty(driverForm.driverStatement)) {
      delete claimData['driver_detail_attributes[driver_statement]'];
    }
    if (isEmpty(claimantStatement)) {
      delete claimData.claimant_statement;
    }

    if (isEmpty(accidentForm.accidentPhotos)) {
      delete claimData['accident_detail_attributes[accident_photos][]'];
    }

    if (isEmpty(accidentForm.accidentSketch)) {
      delete claimData['accident_detail_attributes[accident_sketch]'];
    }

    if (isEmpty(policeForm.noticeOfProsecution)) {
      delete claimData['police_detail_attributes[notice_of_prosecution]'];
    }

    const formData = extractDataToFile(claimData);
    if (!isEmpty(driverForm.convictionDetails)) {
      forEach(driverForm.convictionDetails, c => {
        formData.append(
          'driver_detail_attributes[conviction_details][]',
          c.details,
        );
      });
    }
    if (!isEmpty(driverForm.accidentDates)) {
      forEach(driverForm.convictionDetails, c => {
        formData.append(
          'driver_detail_attributes[accident_dates][]',
          c.details,
        );
      });
    }

    return Api.uploadWithUpdate({
      ...payload,
      data: formData,
    })
      .then(() => {
        dispatch(actions.clearEmptyClaimsForm());
        dispatch(actions.updateClaimsLoader({ submit: false }));
        successHandler();
        notificationHandler('Claim updated', {
          variant: 'success',
        });
      })
      .catch(() => {
        notificationHandler('Something went wrong', {
          variant: 'error',
        });
        dispatch(actions.updateClaimsLoader({ submit: false }));
      });
  },
  fetchClaim: payload => dispatch => {
    dispatch(actions.updateClaimsLoader({ fetch: true }));
    return Api.fetch(payload)
      .then(({ data }) => {
        dispatch(
          actions.updateSelectedClaim(utils.camelizeKeys({ ...data.data })),
        );
        dispatch(actions.updateClaimsLoader({ fetch: false }));
      })
      .catch(() => {
        dispatch(actions.updateClaimsLoader({ fetch: false }));
      });
  },
};

export default actions;
