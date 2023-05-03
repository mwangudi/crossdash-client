import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Paper, Tab, AppBar, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import { isEqual, isNil, isEmpty, find, get } from 'lodash';

import utils from '../../utils';
import ImageCarousel from '../Shared/ImageCarousel';
import { Hooks } from '../../utils/reactHooks';
import VehicleDamages from './ClaimViewVehicleDamages';
import OtherParty from './ClaimViewOtherParty';
import InjuredPerson from './ClaimViewInjuredPerson';
import Passengers from './ClaimViewPassengers';
import Witnesses from './ClaimViewWitnesses';
import GroupDataContainer from '../Shared/GroupDataContainer';
import MissingInfo from './ClaimViewMissingInfo';

const DataWrapper = styled.div`
  .text-dc-label {
    font-weight: 500;
    color: #424242;
    font-size: 1.1rem;
  }

  .text-content {
    font-size: 1rem;
    color: #1b1b1e;
    font-weight: 400;
  }
`;

const DataContainer = ({ label, value, formatter }) => {
  return (
    <DataWrapper className="w-100">
      {!isNil(value) && (
        <div className="d-flex flex-column align-items-start pt-2 pb-2">
          <p className="mb-1 text-dc-label">{label}</p>
          <p className="mb-3 text-content">{formatter(value)}</p>
        </div>
      )}
    </DataWrapper>
  );
};

DataContainer.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  formatter: PropTypes.func,
};

DataContainer.defaultProps = {
  value: null,
  formatter: value => value,
};

const BoolContainer = ({ label, value }) => {
  return (
    <DataWrapper className="w-100">
      {!isNil(value) && (
        <div className="d-flex flex-column align-items-start pt-2 pb-2">
          <p className="mb-1 text-dc-label">{label}</p>
          <p className="mb-3 text-content">{value ? 'Yes' : 'No'}</p>
        </div>
      )}
    </DataWrapper>
  );
};

BoolContainer.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

BoolContainer.defaultProps = {
  value: null,
};

const ImageContainer = ({ label, images }) => {
  return (
    <DataWrapper className="w-100">
      {!isNil(images[0]) && (
        <div className="d-flex flex-column align-items-start pt-2 pb-2">
          <p className="mb-1 text-mini-label">{label}</p>
          <ImageCarousel title={label} images={images} />
        </div>
      )}
    </DataWrapper>
  );
};

ImageContainer.propTypes = {
  label: PropTypes.string.isRequired,
  images: PropTypes.any,
};

ImageContainer.defaultProps = {
  images: null,
};

const Wrapper = styled.div`
  .tabs-cont {
    button:focus {
      outline: none;
    }
  }

  .cont-min-height {
    min-height: 70vh;
  }

  .cont-wrapper-height {
    min-height: 70vh;
  }

  .text-header-label {
    font-weight: 600;
    color: #424242;
    font-size: 1.2rem;
  }

  .text-mini-label {
    font-weight: 500;
    color: #424242;
    font-size: 0.9rem;
  }
`;

const a11yProps = index => {
  return {
    id: `claim-tab-${index}`,
    'aria-controls': `claim-tab-panel-${index}`,
  };
};

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={!isEqual(value, index)}
      id={`claim-tab-panel-${index}`}
      aria-labelledby={`claim-tab-${index}`}
      {...other}
    >
      {isEqual(value, index) && <div>{children}</div>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const ClaimInfoView = props => {
  const { selectedClaim, identificationTypes } = props;
  const [value, setValue] = React.useState(0);
  const { checkRole } = Hooks();
  const { pathname } = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const checkExists = v => !isEmpty(v) && !isNil(v);

  const getIdentityTypeName = identityTypeId => {
    const identity = find(identificationTypes, { id: identityTypeId });
    const val = get(
      {
        ...identity,
      },
      'attributes.name',
    );
    return val || null;
  };

  const checkQueue = path => pathname.includes(path);

  const assessorAndAssessmentQueue = () => {
    return checkQueue('/assessment-queue/tickets') && checkRole('assessor');
  };

  const reviewerAndReviewQueue = () => {
    return checkQueue('/review-queue/tickets') && checkRole('reviewer');
  };
  const financeAndFinanceQueue = () => {
    return checkQueue('/finance-queue/tickets') && checkRole('finance');
  };

  const showSensitiveInfo = () => {
    switch (true) {
      case assessorAndAssessmentQueue():
        return true;
      case reviewerAndReviewQueue():
        return true;
      case financeAndFinanceQueue():
        return true;
      case checkRole('admin'):
      case checkRole('manager'):
      case checkRole('customer'):
        return true;
      case checkRole('approver'):
        return false;
      default:
        return false;
    }
  };

  return (
    <Wrapper className="row">
      {!isEmpty(selectedClaim) && selectedClaim.attributes.claimant && (
        <div className="w-100">
          <AppBar position="static" color="default" className="pt-3 rounded">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="claim form tabs"
              className="tabs-cont"
            >
              {' '}
              <Tab label="Missing Details" {...a11yProps(0)} />
              <Tab label="Claimant/Vehicle Details" {...a11yProps(1)} />
              <Tab label="Accident Details" {...a11yProps(2)} />
              <Tab label="Driver Details" {...a11yProps(3)} />
              <Tab label="Police Details" {...a11yProps(4)} />
              <Tab label="Vehicle Damages Details" {...a11yProps(5)} />
              <Tab label="Other Party Details" {...a11yProps(6)} />
              <Tab label="Injured Person Details" {...a11yProps(7)} />
              <Tab label="Passenger Details" {...a11yProps(8)} />
              <Tab label="Witness Details" {...a11yProps(9)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={1}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <GroupDataContainer
                        label="Customer"
                        value={[
                          selectedClaim.attributes.claimant.name,
                          selectedClaim.attributes.claimant.customerType,
                          `${
                            showSensitiveInfo()
                              ? selectedClaim.attributes.claimant.emailAddress
                              : ''
                          }`,
                        ]}
                      />
                      {checkExists(
                        selectedClaim.attributes.claimant.statement,
                      ) && (
                        <ImageContainer
                          label="Claimant statement"
                          images={[
                            selectedClaim.attributes.claimant.statement.url,
                          ]}
                        />
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      <GroupDataContainer
                        label="Policy"
                        value={[
                          `Cover: ${selectedClaim.attributes.vehicle.insurancePolicy.policyCover.name}`,
                          `Ref.No: ${selectedClaim.attributes.vehicle.insurancePolicy.policyNumber}`,
                          `Expiry: ${utils.formatDate(
                            selectedClaim.attributes.vehicle.insurancePolicy
                              .policyEndDate,
                          )}`,
                          `Cover amount: ${utils.addCommasToNumbers(
                            selectedClaim.attributes.vehicle.insurancePolicy
                              .coverAmount,
                          )}`,
                        ]}
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      {showSensitiveInfo() && (
                        <GroupDataContainer
                          label="Vehicle"
                          value={
                            isNil(selectedClaim.attributes.vehicle.vehicleModel)
                              ? [
                                  `${
                                    showSensitiveInfo()
                                      ? `Registration: ${selectedClaim.attributes.vehicle.registrationNumber}`
                                      : ''
                                  }`,
                                ]
                              : [
                                  `${
                                    showSensitiveInfo()
                                      ? `Registration: ${selectedClaim.attributes.vehicle.registrationNumber}`
                                      : ''
                                  }`,
                                  `Manufacturer: ${selectedClaim.attributes.vehicle.vehicleModel.vehicleManufacturer}`,
                                  `Model: ${selectedClaim.attributes.vehicle.vehicleModel.name}`,
                                  `Year: ${selectedClaim.attributes.vehicle.vehicleModel.yearOfManufacture}`,
                                ]
                          }
                        />
                      )}
                      {showSensitiveInfo() &&
                        checkExists(
                          selectedClaim.attributes.vehicle.vehiclePhotos,
                        ) && (
                          <ImageContainer
                            label="Vehicle photos"
                            images={[
                              selectedClaim.attributes.vehicle.vehiclePhotos
                                .url,
                            ]}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.accidentDetails) ? (
                      <>
                        <div className="col-lg-6 col-12">
                          <DataContainer
                            label="Date of accident"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .dateOfAccident
                            }
                            formatter={val => utils.formatDate(val)}
                          />
                          <DataContainer
                            label="Place of accident"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .placeOfAccident
                            }
                          />
                          <DataContainer
                            label="Weather conditions"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .weatherConditions
                            }
                          />
                          <BoolContainer
                            label="Was there any visibility during accident"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .visibilityDuringAccident
                            }
                          />
                          <DataContainer
                            label="Type of road"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .typeOfRoad
                            }
                          />
                          <BoolContainer
                            label="Was the road wet?"
                            value={
                              selectedClaim.attributes.accidentDetails.roadWet
                            }
                          />
                          <BoolContainer
                            label="Were lights in the vehicle on?"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .vehicleLightsOn
                            }
                          />
                        </div>
                        <div className="col-lg-6 col-12">
                          <BoolContainer
                            label="Did you warn the other party?"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .warnedOtherParty
                            }
                          />
                          <DataContainer
                            label="Speed driven"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .estimatedSpeed
                            }
                          />
                          <DataContainer
                            label="Use of the vehicle during accident"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .vehicleUseDuringAccident
                            }
                          />
                          <BoolContainer
                            label="Did the vehicle carry any goods?"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .hadGoodsDuringAccident
                            }
                          />
                          {selectedClaim.attributes.accidentDetails
                            .hadGoodsDuringAccident && (
                            <DataContainer
                              label="Goods carried"
                              value={
                                selectedClaim.attributes.accidentDetails
                                  .goodsCarriedDetails
                              }
                            />
                          )}
                          <BoolContainer
                            label="Did you have a trailer attached?"
                            value={
                              selectedClaim.attributes.accidentDetails
                                .hadTrailerAttached
                            }
                          />
                          {selectedClaim.attributes.accidentDetails
                            .hadTrailerAttached && (
                            <>
                              <DataContainer
                                label="Trailer weight"
                                value={
                                  selectedClaim.attributes.accidentDetails
                                    .trailerWeight
                                }
                              />
                              <DataContainer
                                label="Vehicle weight"
                                value={
                                  selectedClaim.attributes.accidentDetails
                                    .vehicleWeightDuringAccident
                                }
                              />
                            </>
                          )}

                          {showSensitiveInfo() &&
                            checkExists(
                              selectedClaim.attributes.accidentDetails
                                .accidentPhotos,
                            ) && (
                              <ImageContainer
                                label="Accident Photos"
                                images={[
                                  ...selectedClaim.attributes.accidentDetails.accidentPhotos.map(
                                    photo => photo.url,
                                  ),
                                ]}
                              />
                            )}
                          {showSensitiveInfo() &&
                            checkExists(
                              selectedClaim.attributes.accidentDetails
                                .accidentSketch,
                            ) && (
                              <ImageContainer
                                label="Accident Sketch"
                                images={[
                                  selectedClaim.attributes.accidentDetails
                                    .accidentSketch.url,
                                ]}
                              />
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.driverDetails) ? (
                      <>
                        <div className="col-lg-6 col-12">
                          <BoolContainer
                            label="Were you the driver?"
                            value={
                              selectedClaim.attributes.driverDetails
                                .driverWasSelf
                            }
                          />
                          <DataContainer
                            label="Driver name"
                            value={
                              selectedClaim.attributes.driverDetails.driverName
                            }
                          />
                          {showSensitiveInfo() && (
                            <DataContainer
                              label="Phone number"
                              value={
                                selectedClaim.attributes.driverDetails
                                  .driverPhoneNumber
                              }
                            />
                          )}
                          <DataContainer
                            label="Date of birth"
                            value={
                              selectedClaim.attributes.driverDetails
                                .driverDateOfBirth
                            }
                            formatter={val => utils.formatDate(val)}
                          />
                          {!selectedClaim.attributes.driverDetails
                            .driverWasSelf && (
                            <>
                              <BoolContainer
                                label="Is the driver an employee?"
                                value={
                                  selectedClaim.attributes.driverDetails
                                    .isEmployee
                                }
                              />
                              {selectedClaim.attributes.driverDetails
                                .isEmployee && (
                                <DataContainer
                                  label="Years in your service"
                                  value={
                                    selectedClaim.attributes.driverDetails
                                      .yearsInYourService
                                  }
                                />
                              )}
                            </>
                          )}
                          <DataContainer
                            label="Years of driving experience"
                            value={
                              selectedClaim.attributes.driverDetails
                                .yearsOfDrivingExperience
                            }
                          />
                          <BoolContainer
                            label="Is the driver licensed?"
                            value={
                              selectedClaim.attributes.driverDetails.isLicensed
                            }
                          />
                        </div>
                        <div className="col-lg-6 col-12">
                          {selectedClaim.attributes.driverDetails
                            .isLicensed && (
                            <>
                              <DataContainer
                                label="License Number"
                                value={
                                  selectedClaim.attributes.driverDetails
                                    .drivingLicenseNumber
                                }
                              />
                              <DataContainer
                                label="Date licensed"
                                value={
                                  selectedClaim.attributes.driverDetails
                                    .dateLicensed
                                }
                                formatter={val => utils.formatDate(val)}
                              />
                            </>
                          )}
                          {!selectedClaim.attributes.driverDetails
                            .driverWasSelf &&
                            !selectedClaim.attributes.driverDetails
                              .isEmployee && (
                              <>
                                <BoolContainer
                                  label="Does the driver own a vehicle?"
                                  value={
                                    selectedClaim.attributes.driverDetails
                                      .hasVehicle
                                  }
                                />
                                {selectedClaim.attributes.driverDetails
                                  .hasVehicle && (
                                  <>
                                    <DataContainer
                                      label="Insurer name"
                                      value={
                                        selectedClaim.attributes.driverDetails
                                          .insurerName
                                      }
                                    />
                                    <DataContainer
                                      label="Policy number"
                                      value={
                                        selectedClaim.attributes.driverDetails
                                          .insurerPolicyNumber
                                      }
                                    />
                                  </>
                                )}
                              </>
                            )}
                          {!selectedClaim.attributes.driverDetails
                            .driverWasSelf && (
                            <BoolContainer
                              label="Was the driver driving with your permission?"
                              value={
                                selectedClaim.attributes.driverDetails
                                  .wasDrivingWithPermission
                              }
                            />
                          )}
                          <BoolContainer
                            label="Is the driver to blame for the accident"
                            value={
                              selectedClaim.attributes.driverDetails
                                .isDriverToBlame
                            }
                          />
                          <BoolContainer
                            label="Has the driver admitted liability for the accident"
                            value={
                              selectedClaim.attributes.driverDetails
                                .hasAdmittedLiability
                            }
                          />
                          <BoolContainer
                            label="Has the driver ever been convicted?"
                            value={
                              selectedClaim.attributes.driverDetails
                                .hasBeenConvicted
                            }
                          />
                          {selectedClaim.attributes.driverDetails
                            .hasBeenConvicted &&
                            !isEmpty(
                              selectedClaim.attributes.driverDetails
                                .convictionDetails,
                            ) && (
                              <DataContainer
                                label="Conviction details"
                                value={selectedClaim.attributes.driverDetails.convictionDetails
                                  .map(c => {
                                    const words = c.split(' - ');
                                    if (words.length > 1) {
                                      return words[1];
                                    }
                                    return c;
                                  })
                                  .join(' ,')}
                              />
                            )}
                          {showSensitiveInfo() &&
                            checkExists(
                              selectedClaim.attributes.driverDetails
                                .driverStatement.url,
                            ) && (
                              <ImageContainer
                                label="Driver statement"
                                images={[
                                  selectedClaim.attributes.driverDetails
                                    .driverStatement.url,
                                ]}
                              />
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.policeDetails) ? (
                      <>
                        <div className="col-lg-6 col-12">
                          <DataContainer
                            label="Constable force number"
                            value={
                              selectedClaim.attributes.policeDetails
                                .constableForceNumber
                            }
                          />
                          <DataContainer
                            label="Constable name"
                            value={
                              selectedClaim.attributes.policeDetails
                                .constablePoliceStation
                            }
                          />
                          <DataContainer
                            label="Police station"
                            value={
                              selectedClaim.attributes.policeDetails
                                .reportingPoliceStation
                            }
                          />
                        </div>
                        <div className="col-lg-6 col-12">
                          <BoolContainer
                            label="Is the driver prosecuting"
                            value={
                              selectedClaim.attributes.policeDetails
                                .isProsecuting
                            }
                          />
                          {selectedClaim.attributes.policeDetails
                            .isProsecuting &&
                            checkExists(
                              selectedClaim.attributes.policeDetails
                                .noticeOfProsecution.url,
                            ) && (
                              <ImageContainer
                                label="Driver statement"
                                images={[
                                  selectedClaim.attributes.policeDetails
                                    .noticeOfProsecution.url,
                                ]}
                              />
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                {checkExists(selectedClaim.attributes.vehicleDamageDetails) ? (
                  <VehicleDamages
                    vehicleDamages={
                      selectedClaim.attributes.vehicleDamageDetails
                    }
                  />
                ) : (
                  <div className="px-5 w-100">
                    <p className="mb-1 text-mini-label text-center">
                      Details not found!
                    </p>
                  </div>
                )}
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={6}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.otherPartyDetails) ? (
                      <OtherParty
                        otherParty={selectedClaim.attributes.otherPartyDetails}
                        getIdentificationType={getIdentityTypeName}
                        showSensitiveInfo={showSensitiveInfo}
                      />
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={7}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(
                      selectedClaim.attributes.injuredPersonDetails,
                    ) ? (
                      <InjuredPerson
                        injuredPersons={
                          selectedClaim.attributes.injuredPersonDetails
                        }
                        getIdentificationType={getIdentityTypeName}
                        showSensitiveInfo={showSensitiveInfo}
                      />
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={8}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.passengerDetails) ? (
                      <Passengers
                        passengers={selectedClaim.attributes.passengerDetails}
                        showSensitiveInfo={showSensitiveInfo}
                      />
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={9}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    {checkExists(selectedClaim.attributes.witnessDetails) ? (
                      <Witnesses
                        witnesses={selectedClaim.attributes.witnessDetails}
                        showSensitiveInfo={showSensitiveInfo}
                      />
                    ) : (
                      <div className="px-5 w-100">
                        <p className="mb-1 text-mini-label text-center">
                          Details not found!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={value} index={0}>
            <div className="w-100">
              <Paper
                className="py-4 w-100 mb-3 cont-wrapper-height"
                elevation={3}
              >
                <div className="container">
                  <div className="row">
                    <MissingInfo claim={selectedClaim.attributes} />
                  </div>
                </div>
              </Paper>
            </div>
          </TabPanel>
        </div>
      )}
    </Wrapper>
  );
};

ClaimInfoView.propTypes = {
  selectedClaim: PropTypes.object.isRequired,
  identificationTypes: PropTypes.array.isRequired,
};

export default ClaimInfoView;
