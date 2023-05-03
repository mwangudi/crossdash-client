import React from 'react';
import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import actions from '../../store/rootActions';
import ClaimInfoView from '../Claims/ClaimInfoView';

const SingleClaimTicketView = props => {
  const {
    claim: { selectedClaim, claimsLoader },
    approve: { selectedApproval },
    shared: { identificationTypes },
    fetchClaim,
    fetchIdentityTypes,
    updateSelectedApproval,
  } = props;

  React.useEffect(() => {
    const fetchClaimAsync = async () => {
      if (!isEmpty(selectedApproval)) {
        const claimLink = selectedApproval.links.claim;
        await Promise.all([
          fetchClaim({
            scope: claimLink,
          }),
          fetchIdentityTypes({
            scope: '/identification_types',
          }),
        ]);
      }
    };
    fetchClaimAsync();

    return () => {
      updateSelectedApproval({ empty: true });
    };
  }, [
    fetchClaim,
    selectedApproval,
    updateSelectedApproval,
    fetchIdentityTypes,
  ]);

  return (
    <div className="container">
      {!claimsLoader.fetch && !isEmpty(selectedClaim.attributes) && (
        <ClaimInfoView
          selectedClaim={selectedClaim}
          identificationTypes={identificationTypes}
        />
      )}
      {claimsLoader.fetch && (
        <div className="py-5 w-100 d-flex flex-row justify-content-center">
          <CircularProgress size={50} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
    approve: state.approve,
    shared: state.shared,
  };
}

SingleClaimTicketView.propTypes = {
  claim: PropTypes.object.isRequired,
  approve: PropTypes.object.isRequired,
  fetchClaim: PropTypes.func.isRequired,
  shared: PropTypes.object.isRequired,
  fetchIdentityTypes: PropTypes.func.isRequired,
  updateSelectedApproval: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(SingleClaimTicketView);
