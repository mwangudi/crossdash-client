import React from 'react';
import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';

import actions from '../../store/rootActions';
import ClaimInfoView from './ClaimInfoView';

const SingleClaim = props => {
  const {
    claim: { selectedClaim, claimsLoader },
    shared: { identificationTypes },
    fetchClaim,
    fetchIdentityTypes,
  } = props;
  const { claimId } = useParams();

  React.useEffect(() => {
    const fetchClaimAsync = async () => {
      await Promise.all([
        fetchClaim({
          scope: `/claims`,
          fingerprint: claimId,
        }),
        fetchIdentityTypes({
          scope: '/identification_types',
        }),
      ]);
    };
    fetchClaimAsync();
  }, [fetchClaim, claimId, fetchIdentityTypes]);

  return (
    <div className="container">
      {!claimsLoader.fetch && !isEmpty(selectedClaim) && (
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
    shared: state.shared,
  };
}

SingleClaim.propTypes = {
  claim: PropTypes.object.isRequired,
  fetchClaim: PropTypes.func.isRequired,
  shared: PropTypes.object.isRequired,
  fetchIdentityTypes: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actions)(SingleClaim);
