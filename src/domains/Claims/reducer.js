import dayjs from 'dayjs';
import { isEqual, isNil } from 'lodash';

import * as types from './actionTypes';

const now = dayjs().toString();

const emptyAccidentForm = {
  placeOfAccident: '',
  dateOfAccident: now,
  roadWet: false,
  typeOfRoad: '',
  visibilityDuringAccident: false,
  weatherConditions: '',
  vehicleUseDuringAccident: '',
  warnedOtherParty: false,
  wasTheLightsOn: false,
  hadTrailerAttached: false,
  trailerWeight: 0,
  vehicleWeightDuringAccident: 0,
  goodsCarriedDetails: '',
  estimatedSpeed: 0,
  hadGoodsDuringAccident: false,
  accidentPhotos: [],
  accidentSketch: [],
};

const emptyPoliceForm = {
  constablePoliceStation: '',
  constableForceNumber: '',
  isProsecuting: false,
  reportingPoliceStation: '',
  noticeOfProsecution: [],
};

const emptyDriverForm = {
  driverWasSelf: true,
  isEmployee: false,
  yearsInYourService: 0,
  wasDrivingWithPermission: false,
  firstName: '',
  lastName: '',
  surname: '',
  driverDateOfBirth: now,
  driverPhoneNumber: '',
  accidentDates: [],
  isLicensed: false,
  drivingLicenseNumber: '',
  dateLicensed: now,
  yearsOfDrivingExperience: 0,
  hasAdmittedLiability: false,
  hasBeenConvicted: false,
  convictionDetails: [],
  hasVehicle: false,
  insurerName: '',
  insurerPolicyNumber: '',
  isDriverToBlame: false,
  driverStatement: [],
};

const emptyOtherPartyForm = {
  firstName: '',
  lastName: '',
  surname: '',
  identificationNumber: '',
  identificationTypeId: '',
  insurerPolicyNumber: '',
  insurer: '',
  vehicleDamages: '',
  vehicleRegistrationNumber: '',
};

const emptyPassengerForm = {
  firstName: '',
  lastName: '',
  surname: '',
  phoneNumber: '',
  gender: '',
  isAdult: false,
  address: '',
};

const emptyWitnessForm = {
  firstName: '',
  lastName: '',
  surname: '',
  phoneNumber: '',
  gender: '',
  isAdult: false,
  address: '',
};

const emptyInjuredPersonForm = {
  firstName: '',
  lastName: '',
  surname: '',
  gender: '',
  identificationTypeId: '',
  identificationNumber: '',
  isAdult: false,
  relationToClaimant: '',
  wasInAVehicle: false,
  wasDriver: false,
  vehicleRegistrationNumber: '',
};

const emptyVehicleDamagesForm = {
  id: '',
  damage: '',
  estimatedRepairCost: 0,
  repairDetails: '',
};

const stepsToFileClaim = [
  { title: 'Driver Details', skip: false },
  { title: 'Claimant Statement', skip: true },
  { title: 'Accident Details', skip: false },
  { title: 'Vehicle Damages', skip: true },
  { title: 'Police Details', skip: false },
  { title: 'Injured Persons Details', skip: true },
  { title: 'Other Party Details', skip: true },
  { title: 'Witness Details', skip: true },
  { title: 'Passenger Details', skip: true },
];

export const initialState = {
  steps: [...stepsToFileClaim],
  claimsLoader: {
    fetch: false,
    fetchAllClaims: false,
    submit: false,
  },
  claimsPagination: {
    pageNumber: 1,
    pageSize: 15,
  },
  accidentForm: {
    ...emptyAccidentForm,
  },
  otherPartyForm: {
    ...emptyOtherPartyForm,
  },
  passengerForm: {
    ...emptyPassengerForm,
  },
  witnessForm: {
    ...emptyWitnessForm,
  },
  driverForm: { ...emptyDriverForm },
  injuredPersonForm: { ...emptyInjuredPersonForm },
  vehicleDamagesForm: {
    ...emptyVehicleDamagesForm,
  },
  claims: [],
  claimPaginationLinks: {},
  selectedClaim: {},
  policeForm: {
    ...emptyPoliceForm,
  },
  otherParties: [],
  passengers: [],
  witnesses: [],
  injuredPeople: [],
  vehicleDamages: [],
  claimantStatement: [],
};

export const reducer = (state = initialState, action) => {
  let selectedClaim = {};
  let claims = [];
  let otherParties = [];
  let passengers = [];
  let witnesses = [];
  let injuredPeople = [];
  let claimPaginationLinks = {};
  let vehicleDamages = [];
  let claimantStatement = [];
  let vehicleDamagesForm = { ...emptyVehicleDamagesForm };
  let injuredPersonForm = { ...emptyInjuredPersonForm };
  let otherPartyForm = { ...emptyOtherPartyForm };
  let witnessForm = { ...emptyWitnessForm };
  let passengerForm = { ...emptyPassengerForm };
  switch (action.type) {
    case types.UPDATE_ACCIDENT_DETAILS_FORM:
      return {
        ...state,
        accidentForm: action.payload.empty
          ? { ...emptyAccidentForm }
          : {
              ...state.accidentForm,
              ...action.payload,
            },
      };
    case types.UPDATE_SELECTED_CLAIM:
      if (!action.payload.empty) {
        selectedClaim = { ...action.payload };
      }
      return {
        ...state,
        selectedClaim,
      };

    case types.UPDATE_DRIVER_DETAILS_FORM:
      return {
        ...state,
        driverForm: action.payload.empty
          ? { ...emptyDriverForm }
          : {
              ...state.driverForm,
              ...action.payload,
            },
      };
    case types.UPDATE_POLICE_DETAILS_FORM:
      return {
        ...state,
        policeForm: action.payload.empty
          ? { ...emptyPoliceForm }
          : {
              ...state.policeForm,
              ...action.payload,
            },
      };
    case types.MANAGE_OTHER_PARTIES:
      if (action.payload.empty) {
        otherParties = [];
      } else if (action.payload.removeOtherParty) {
        otherParties = [
          ...state.otherParties.filter(
            otherParty => !isEqual(otherParty.id, action.payload.otherParty.id),
          ),
        ];
      } else if (action.payload.newOtherParty) {
        otherParties = [
          { ...action.payload.otherParty },
          ...state.otherParties,
        ].reduce(
          (unique, item) =>
            unique.find(uItem => uItem.id === item.id)
              ? unique
              : [...unique, item],
          [],
        );
      } else if (action.payload.editOtherParty) {
        otherParties = [...state.otherParties];
        otherPartyForm = action.payload.otherParty;
      } else {
        otherParties = [
          ...state.otherParties.map(otherParty =>
            isEqual(otherParty.id, action.payload.otherParty.id)
              ? action.payload.otherParty
              : otherParty,
          ),
        ];
      }
      return {
        ...state,
        otherParties: [...otherParties],
        otherPartyForm: { ...otherPartyForm },
      };
    case types.MANAGE_PASSENGERS:
      if (action.payload.empty) {
        passengers = [];
      } else if (action.payload.removePassenger) {
        passengers = [
          ...state.passengers.filter(
            passenger => !isEqual(passenger.id, action.payload.passenger.id),
          ),
        ];
      } else if (action.payload.newPassenger) {
        passengers = [
          { ...action.payload.passenger },
          ...state.passengers,
        ].reduce(
          (unique, item) =>
            unique.find(uItem => uItem.id === item.id)
              ? unique
              : [...unique, item],
          [],
        );
      } else if (action.payload.editPassanger) {
        passengers = [...state.passengers];
        passengerForm = action.payload.passenger;
      } else {
        passengers = [
          ...state.passengers.map(passenger =>
            isEqual(passenger.id, action.payload.passenger.id)
              ? action.payload.passenger
              : passenger,
          ),
        ];
      }
      return {
        ...state,
        passengers: [...passengers],
        passengerForm: { ...passengerForm },
      };
    case types.MANAGE_WITNESS:
      if (action.payload.empty) {
        witnesses = [];
      } else if (action.payload.removeWitness) {
        witnesses = [
          ...state.witnesses.filter(
            witness => !isEqual(witness.id, action.payload.witness.id),
          ),
        ];
      } else if (action.payload.newWitness) {
        witnesses = [{ ...action.payload.witness }, ...state.witnesses].reduce(
          (unique, item) =>
            unique.find(uItem => uItem.id === item.id)
              ? unique
              : [...unique, item],
          [],
        );
      } else if (action.payload.editWitness) {
        witnesses = [...state.witnesses];
        witnessForm = action.payload.witness;
      } else {
        witnesses = [
          ...state.witnesses.map(witness =>
            isEqual(witness.id, action.payload.witness.id)
              ? action.payload.witness
              : witness,
          ),
        ];
      }
      return {
        ...state,
        witnesses: [...witnesses],
        witnessForm: { ...witnessForm },
      };
    case types.MANAGE_INJURED_PEOPLE:
      if (action.payload.empty) {
        injuredPeople = [];
      } else if (action.payload.removeInjured) {
        injuredPeople = [
          ...state.injuredPeople.filter(
            injured => !isEqual(injured.id, action.payload.injured.id),
          ),
        ];
      } else if (action.payload.newInjured) {
        injuredPeople = [
          { ...action.payload.injured },
          ...state.injuredPeople,
        ].reduce(
          (unique, item) =>
            unique.find(uItem => uItem.id === item.id)
              ? unique
              : [...unique, item],
          [],
        );
      } else if (action.payload.editInjured) {
        injuredPeople = [...state.injuredPeople];
        injuredPersonForm = action.payload.injured;
      } else {
        injuredPeople = [
          ...state.injuredPeople.map(injured =>
            isEqual(injured.id, action.payload.injured.id)
              ? action.payload.injured
              : injured,
          ),
        ];
      }
      return {
        ...state,
        injuredPeople: [...injuredPeople],
        injuredPersonForm: { ...injuredPersonForm },
      };
    case types.POPULATE_CLAIMS:
      if (!action.payload.empty) {
        claims = [...action.payload.claims];
      }
      return {
        ...state,
        claims,
      };
    case types.UPDATE_CLAIM_PAGINATION:
      return {
        ...state,
        claimsPagination: {
          ...state.claimsPagination,
          ...action.payload,
        },
      };
    case types.UPDATE_CLAIM_PAGINATION_LINKS:
      if (!action.payload.empty) {
        claimPaginationLinks = {
          ...action.payload,
        };
      }
      return {
        ...state,
        claimPaginationLinks,
      };
    case types.UPDATE_CLAIMS_LOADER:
      return {
        ...state,
        claimsLoader: {
          ...state.claimsLoader,
          ...action.payload,
        },
      };
    case types.MANAGE_VEHICLE_DAMAGE_DETAILS:
      if (action.payload.empty) {
        vehicleDamages = [];
      } else if (action.payload.removeDamages) {
        vehicleDamages = [
          ...state.vehicleDamages.filter(
            vehicleDamage =>
              !isEqual(vehicleDamage.id, action.payload.vehicleDamage.id),
          ),
        ];
      } else if (action.payload.newDamages) {
        vehicleDamages = [
          { ...action.payload.vehicleDamage },
          ...state.vehicleDamages,
        ].reduce(
          (unique, item) =>
            unique.find(uItem => uItem.id === item.id)
              ? unique
              : [...unique, item],
          [],
        );
      } else if (action.payload.editDamage) {
        vehicleDamages = [...state.vehicleDamages];
        vehicleDamagesForm = action.payload.vehicleDamage;
      } else {
        vehicleDamages = [
          ...state.vehicleDamages.map(vehicleDamage =>
            isEqual(vehicleDamage.id, action.payload.vehicleDamage.id)
              ? action.payload.vehicleDamage
              : vehicleDamage,
          ),
        ];
      }
      return {
        ...state,
        vehicleDamages: [...vehicleDamages],
        vehicleDamagesForm: { ...vehicleDamagesForm },
      };
    case types.UPDATE_CLAIMANT_STATEMENT:
      if (!action.payload.empty) {
        claimantStatement = [...action.payload];
      }
      return {
        ...state,
        claimantStatement,
      };
    case types.MANAGE_CLAIMS:
      if (!isNil(action.payload.newClaim) && action.payload.newClaim) {
        claims = [{ ...action.payload.claim }, ...state.claims];
      } else {
        claims = [
          ...state.claims.map(claim =>
            isEqual(claim.id, action.payload.id)
              ? {
                  ...claim,
                  attributes: {
                    ...claim.attributes,
                    currentStatus: 'in processing',
                  },
                }
              : claim,
          ),
        ];
      }
      return {
        ...state,
        claims,
      };
    case types.POPULATE_VEHICLE_DAMAGE_DETAILS:
      if (!action.payload.empty) {
        vehicleDamages = [...action.payload];
      }
      return {
        ...state,
        vehicleDamages,
      };
    case types.POPULATE_INJURED_PEOPLE:
      if (!action.payload.empty) {
        injuredPeople = [...action.payload];
      }
      return {
        ...state,
        injuredPeople,
      };
    case types.POPULATE_PASSENGERS:
      if (!action.payload.empty) {
        passengers = [...action.payload];
      }
      return {
        ...state,
        passengers,
      };
    case types.POPULATE_WITNESS:
      if (!action.payload.empty) {
        witnesses = [...action.payload];
      }
      return {
        ...state,
        witnesses,
      };
    case types.POPULATE_OTHER_PARTIES:
      if (!action.payload.empty) {
        otherParties = [...action.payload];
      }
      return {
        ...state,
        otherParties,
      };
    default:
      return state;
  }
};

export default reducer;
