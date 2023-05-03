import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  .text-label {
    font-size: 14px;
  }
  .container-wrapper {
    padding: 10px;
    border: none;

    input {
      width: 100%;
    }

    svg {
      width: 35px;
      height: 35px;
    }
  }

  .label-text {
    font-size: 14px;
    font-family: inherit;
  }

  .MuiChip-root {
    max-width: 160px;
    margin-bottom: 3px;
  }

  .container-height {
    height: ${props => props.height}px;
  }
`;

const UploadField = props => {
  const { label, handleChange, height, acceptedFiles, ...rest } = props;
  return (
    <Div className="mb-2" height={height}>
      <p className="text-label mb-2">{label}</p>
      <DropzoneArea
        showPreviews={false}
        useChipsForPreview={false}
        dropzoneClass="container-wrapper rounded container-height"
        dropzoneParagraphClass="label-text"
        dropzoneText=""
        onChange={handleChange}
        acceptedFiles={acceptedFiles}
        showPreviewsInDropzone
        showFileNames
        {...rest}
      />
    </Div>
  );
};

UploadField.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  height: PropTypes.number,
  acceptedFiles: PropTypes.array,
};

UploadField.defaultProps = {
  height: null,
  acceptedFiles: ['image/jpeg', 'image/png'],
};

export default UploadField;
