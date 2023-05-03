import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNil, isEmpty, isArray } from 'lodash';

const Div = styled.div`
  .s-title {
    font-weight: 500;
    color: #616161;
    font-size: 0.9rem;
    padding-left: 2rem;
  }

  .sp-main-title {
    color: #616161;
    font-weight: 600;
  }
`;

const DataWrapper = styled.div`
  .text-dc-label {
    font-weight: 500;
    color: #616161;
    font-size: 0.9rem;

    ::before {
      content: '-> ';
    }
  }
`;

const DataContainer = ({ label, value, updateCount }) => {
  return (
    <DataWrapper className="w-100">
      {(() => {
        if (isNil(value)) {
          updateCount();
          return (
            <div className="d-flex flex-column align-items-start py-2">
              <p className="mb-0 text-dc-label px-3">{label}</p>
            </div>
          );
        }
        if (isArray(value) && isEmpty(value)) {
          updateCount();
          return (
            <div className="d-flex flex-column align-items-start py-2">
              <p className="mb-0 text-dc-label px-3">{label}</p>
            </div>
          );
        }
        return null;
      })()}
    </DataWrapper>
  );
};

DataContainer.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  updateCount: PropTypes.func,
};

DataContainer.defaultProps = {
  value: null,
  updateCount: () => {},
};

const ClaimViewMissingInfo = props => {
  const { claim } = props;
  const [missingCount, setMissingCount] = React.useState({
    claimant: false,
    accident: false,
    driver: false,
    police: false,
  });

  const updateClaimantCount = () => {
    if (!missingCount.claimant) {
      setMissingCount({
        ...missingCount,
        claimant: true,
      });
    }
  };

  const updateAccidentCount = () => {
    if (!missingCount.accident) {
      setMissingCount({
        ...missingCount,
        accident: true,
      });
    }
  };

  const updateDriverCount = () => {
    if (!missingCount.driver) {
      setMissingCount({
        ...missingCount,
        driver: true,
      });
    }
  };

  const updatePoliceCount = () => {
    if (!missingCount.police) {
      setMissingCount({
        ...missingCount,
        police: true,
      });
    }
  };

  return (
    <Div className="px-3 w-100">
      <div className="row">
        <div className="col-md-6 col-12 py-2">
          <p className="sp-main-title mb-0">Claimant & Vehicle Details</p>
          <DataContainer
            label="Claimant name"
            value={claim.claimant.name}
            updateCount={updateClaimantCount}
          />
          <DataContainer
            label="Customer type"
            value={claim.claimant.customerType}
            updateCount={updateClaimantCount}
          />
          <DataContainer
            label="Claimant statement"
            value={claim.claimant.statement.url}
            updateCount={updateClaimantCount}
          />
          <DataContainer
            label="Cover name"
            value={claim.vehicle.insurancePolicy.policyCover.name}
            updateCount={updateClaimantCount}
          />
          <DataContainer
            label="Cover Ref.no"
            value={claim.vehicle.insurancePolicy.policyNumber}
            updateCount={updateClaimantCount}
          />
          <DataContainer
            label="Vehicle Photos"
            value={claim.vehicle.vehiclePhotos.url}
            updateCount={updateClaimantCount}
          />
          {!missingCount.claimant && <p className="s-title">Nothing missing</p>}
        </div>
        <div className="col-md-6 col-12 py-2">
          <p className="sp-main-title mb-0">Accident Details</p>
          {isNil(claim.accidentDetails) ? (
            <DataContainer
              label="Unfilled section"
              value={claim.accidentDetails}
            />
          ) : (
            <>
              <DataContainer
                label="Date of accident"
                value={claim.accidentDetails.dateOfAccident}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Place of accident"
                value={claim.accidentDetails.placeOfAccident}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Weather conditions"
                value={claim.accidentDetails.weatherConditions}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Was there any visibility during accident"
                value={claim.accidentDetails.visibilityDuringAccident}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Type of road"
                value={claim.accidentDetails.typeOfRoad}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Was the road wet?"
                value={claim.accidentDetails.roadWet}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Were lights in the vehicle on?"
                value={claim.accidentDetails.vehicleLightsOn}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Did you warn the other party?"
                value={claim.accidentDetails.warnedOtherParty}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Speed driven"
                value={claim.accidentDetails.estimatedSpeed}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Use of the vehicle during accident"
                value={claim.accidentDetails.vehicleUseDuringAccident}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Did the vehicle carry any goods?"
                value={claim.accidentDetails.hadGoodsDuringAccident}
                updateCount={updateAccidentCount}
              />
              {claim.accidentDetails.hadGoodsDuringAccident && (
                <DataContainer
                  label="Goods carried"
                  value={claim.accidentDetails.goodsCarriedDetails}
                  updateCount={updateAccidentCount}
                />
              )}
              <DataContainer
                label="Did you have a trailer attached?"
                value={claim.accidentDetails.hadTrailerAttached}
                updateCount={updateAccidentCount}
              />
              {claim.accidentDetails.hadTrailerAttached && (
                <>
                  <DataContainer
                    label="Trailer weight"
                    value={claim.accidentDetails.trailerWeight}
                    updateCount={updateAccidentCount}
                  />
                  <DataContainer
                    label="Vehicle weight"
                    value={claim.accidentDetails.vehicleWeightDuringAccident}
                    updateCount={updateAccidentCount}
                  />
                </>
              )}
              <DataContainer
                label="Accident Photos"
                value={claim.accidentDetails.accidentPhotos}
                updateCount={updateAccidentCount}
              />
              <DataContainer
                label="Accident Sketch"
                value={claim.accidentDetails.accidentSketch.url}
                updateCount={updateAccidentCount}
              />
              {!missingCount.accident && (
                <p className="s-title">Nothing missing</p>
              )}
            </>
          )}
        </div>
        <div className="col-md-6 col-12 py-2">
          <p className="sp-main-title mb-0">Driver Details</p>
          {isNil(claim.driverDetails) ? (
            <DataContainer
              label="Unfilled section"
              value={claim.driverDetails}
            />
          ) : (
            <>
              <DataContainer
                label="Were you the driver?"
                value={claim.driverDetails.driverWasSelf}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Driver name"
                value={claim.driverDetails.driverName}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Phone number"
                value={claim.driverDetails.driverPhoneNumber}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Date of birth"
                value={claim.driverDetails.driverDateOfBirth}
                updateCount={updateDriverCount}
              />
              {!claim.driverDetails.driverWasSelf && (
                <>
                  <DataContainer
                    label="Is the driver an employee?"
                    value={claim.driverDetails.isEmployee}
                    updateCount={updateDriverCount}
                  />
                  {claim.driverDetails.isEmployee && (
                    <DataContainer
                      label="Years in your service"
                      value={claim.driverDetails.yearsInYourService}
                      updateCount={updateDriverCount}
                    />
                  )}
                </>
              )}
              <DataContainer
                label="Years of driving experience"
                value={claim.driverDetails.yearsOfDrivingExperience}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Is the driver licensed?"
                value={claim.driverDetails.isLicensed}
                updateCount={updateDriverCount}
              />
              {claim.driverDetails.isLicensed && (
                <>
                  <DataContainer
                    label="License Number"
                    value={claim.driverDetails.drivingLicenseNumber}
                    updateCount={updateDriverCount}
                  />
                  <DataContainer
                    label="Date licensed"
                    value={claim.driverDetails.dateLicensed}
                    updateCount={updateDriverCount}
                  />
                </>
              )}
              {!claim.driverDetails.driverWasSelf &&
                !claim.driverDetails.isEmployee && (
                  <>
                    <DataContainer
                      label="Does the driver own a vehicle?"
                      value={claim.driverDetails.hasVehicle}
                      updateCount={updateDriverCount}
                    />
                    {claim.driverDetails.hasVehicle && (
                      <>
                        <DataContainer
                          label="Insurer name"
                          value={claim.driverDetails.insurerName}
                          updateCount={updateDriverCount}
                        />
                        <DataContainer
                          label="Policy number"
                          value={claim.driverDetails.insurerPolicyNumber}
                          updateCount={updateDriverCount}
                        />
                      </>
                    )}
                  </>
                )}
              {!claim.driverDetails.driverWasSelf && (
                <DataContainer
                  label="Was the driver driving with your permission?"
                  value={claim.driverDetails.wasDrivingWithPermission}
                  updateCount={updateDriverCount}
                />
              )}
              <DataContainer
                label="Is the driver to blame for the accident"
                value={claim.driverDetails.isDriverToBlame}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Has the driver admitted liability for the accident"
                value={claim.driverDetails.hasAdmittedLiability}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Has the driver ever been convicted?"
                value={claim.driverDetails.hasBeenConvicted}
                updateCount={updateDriverCount}
              />
              <DataContainer
                label="Driver statement"
                value={claim.driverDetails.driverStatement.url}
                updateCount={updateDriverCount}
              />
              {!missingCount.driver && (
                <p className="s-title">Nothing missing</p>
              )}
            </>
          )}
        </div>
        <div className="col-md-6 col-12 py-2">
          <p className="sp-main-title mb-0">Police Details</p>
          {isNil(claim.policeDetails) ? (
            <DataContainer
              label="Unfilled section"
              value={claim.policeDetails}
            />
          ) : (
            <>
              <DataContainer
                label="Constable force number"
                value={claim.policeDetails.constableForceNumber}
                updateCount={updatePoliceCount}
              />
              <DataContainer
                label="Constable name"
                value={claim.policeDetails.constablePoliceStation}
                updateCount={updatePoliceCount}
              />
              <DataContainer
                label="Police station"
                value={claim.policeDetails.reportingPoliceStation}
                updateCount={updatePoliceCount}
              />
              <DataContainer
                label="Is the driver prosecuting"
                value={claim.policeDetails.isProsecuting}
                updateCount={updatePoliceCount}
              />
              {claim.policeDetails.isProsecuting && (
                <DataContainer
                  label="Notice of prosecution"
                  value={claim.policeDetails.noticeOfProsecution}
                  updateCount={updatePoliceCount}
                />
              )}
              {!missingCount.police && (
                <p className="s-title">Nothing missing</p>
              )}
            </>
          )}
        </div>
        <div className="col-md-6 col-12 py-2">
          <p className="sp-main-title mb-0">Vehicle Damage Details</p>
          {isEmpty(claim.vehicleDamageDetails) ? (
            <DataContainer
              label="Unfilled section"
              value={claim.vehicleDamageDetails}
            />
          ) : (
            <p className="s-title">Nothing missing</p>
          )}
        </div>
      </div>
    </Div>
  );
};

ClaimViewMissingInfo.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default ClaimViewMissingInfo;
