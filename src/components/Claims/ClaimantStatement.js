import React from 'react';
import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UploadField from '../Shared/UploadField';
import actions from '../../store/rootActions';

const Wrapper = styled(Paper)`
  .content-preview {
    max-height: 540px;
    overflow-y: auto;
  }
`;

const ClaimantStatement = props => {
  const {
    claim: { driverForm, claimantStatement },
    updateClaimantStatement,
  } = props;

  return (
    <Wrapper className="p-3 w-100 mt-2 mb-3" elevation={3}>
      <h6 className="formTitle">Claimant statement</h6>
      <hr />
      <div className="row">
        <div className="col-6">
          <UploadField
            label={
              driverForm.driverWasSelf ? 'Your statement' : 'Claimant statement'
            }
            height={360}
            filesLimit={1}
            handleChange={files => {
              updateClaimantStatement(files);
            }}
            initialFiles={[
              ...claimantStatement.map(p => p.name || '').filter(p => p !== ''),
            ]}
          />
        </div>
      </div>
    </Wrapper>
  );
};

ClaimantStatement.propTypes = {
  claim: PropTypes.object.isRequired,
  updateClaimantStatement: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    claim: state.claim,
  };
}

export default connect(mapStateToProps, actions)(ClaimantStatement);
