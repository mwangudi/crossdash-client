import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  colors,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDialog = styled(Dialog)`
  .progressCircular {
    color: ${colors.grey[500]};
  }
`;

const Modal = props => {
  const {
    open,
    showSuccess,
    title,
    children,
    handleCancel,
    handleSuccess,
    maxWidth,
    loading,
    successLabel,
    submittingForm,
    id,
  } = props;

  const buttonProps = submittingForm
    ? {
        form: id,
        type: 'submit',
      }
    : {
        onClick: handleSuccess,
      };

  return (
    <StyledDialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle id="alert-modal-title">{title}</DialogTitle>
      <DialogContent id="alert-modal-description">{children}</DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          color={showSuccess ? 'default' : 'primary'}
        >
          Close
        </Button>
        {showSuccess && (
          <Button {...buttonProps} color="primary" disabled={loading}>
            {!loading ? (
              successLabel
            ) : (
              <div className="d-flex flex-row align-items-center">
                <span className="pr-2">Processing</span>
                <CircularProgress size={25} className="progressCircular" />
              </div>
            )}
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  showSuccess: PropTypes.bool,
  maxWidth: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func,
  loading: PropTypes.bool,
  successLabel: PropTypes.string,
  id: PropTypes.string,
  submittingForm: PropTypes.bool,
};

Modal.defaultProps = {
  showSuccess: false,
  loading: false,
  submittingForm: false,
  successLabel: 'Submit',
  maxWidth: 'sm',
  id: '',
  handleSuccess: () => {},
};

export default Modal;
