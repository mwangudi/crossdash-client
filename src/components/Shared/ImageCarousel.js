import React from 'react';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { ButtonBase, IconButton } from '@material-ui/core';
import { isNil, isEmpty, isEqual } from 'lodash';
import { Icon } from 'react-icons-kit';
import PropTypes from 'prop-types';
import { ic_navigate_before as icBefore } from 'react-icons-kit/md/ic_navigate_before';
import { ic_navigate_next as icNext } from 'react-icons-kit/md/ic_navigate_next';

import Modal from './Modal';

const Wrapper = styled.div`
  .vehicle-photo {
    width: 200px;
    height: 120px;
  }

  .more-label {
    font-weight: 600;
    font-size: 23px;
  }

  .vehicle-slider-photo {
    max-width: 600px;
    height: 500px;
  }
`;

const existing = val => !isNil(val) && !isEmpty(val);

const ImageCarousel = props => {
  const { images, title } = props;

  const size = images.length;
  const [openModal, setOpenModal] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);

  const toggleModal = () => setOpenModal(!openModal);
  const openImage = index => () => {
    setImageIndex(index);
    toggleModal();
  };

  const nextImage = () => {
    if (!isEqual(size, imageIndex)) {
      setImageIndex(imageIndex + 1);
    }
  };

  const prevImage = () => {
    if (!isEqual(0, imageIndex)) {
      setImageIndex(imageIndex - 1);
    }
  };

  return (
    <Wrapper className="d-flex flex-column">
      <Modal open={openModal} title={title} handleCancel={toggleModal}>
        <div className="d-flex flex-row">
          {images.map((image, i) => {
            if (isEqual(i, imageIndex)) {
              return (
                <div className="vehicle-slider-photo w-100" key={`image-${i}`}>
                  <Image aspectRatio={16 / 9} src={image} />
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="d-flex flex-row align-items-center pt-3 justify-content-center">
          <IconButton
            className="pr-2"
            color="primary"
            onClick={prevImage}
            disabled={isEqual(0, imageIndex)}
          >
            <Icon size={24} icon={icBefore} />
          </IconButton>
          <IconButton
            className="pl-2"
            color="primary"
            onClick={nextImage}
            disabled={isEqual(size - 1, imageIndex)}
          >
            <Icon size={24} icon={icNext} />
          </IconButton>
        </div>
      </Modal>
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          {existing(images[0]) && (
            <ButtonBase focusRipple onClick={openImage(0)}>
              <div className="vehicle-photo rounded p-1">
                <Image aspectRatio={16 / 9} src={images[0]} />
              </div>
            </ButtonBase>
          )}
        </div>
        <div className="d-flex flex-column">
          {existing(images[1]) && (
            <ButtonBase focusRipple onClick={openImage(1)}>
              <div className="vehicle-photo rounded p-1">
                <Image aspectRatio={16 / 9} src={images[1]} />
              </div>
            </ButtonBase>
          )}
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          {existing(images[2]) && (
            <ButtonBase focusRipple onClick={openImage(2)}>
              <div className="vehicle-photo rounded p-1">
                <Image aspectRatio={16 / 9} src={images[2]} />
              </div>
            </ButtonBase>
          )}
        </div>
        <div className="d-flex flex-column">
          {existing(images[3]) && (
            <div className="col-lg-6 col-12 px-0">
              <ButtonBase focusRipple onClick={openImage(0)}>
                <div className="vehicle-photo rounded p-1">
                  <div className="h-100 w-100 d-flex flex-row align-items-center justify-content-center">
                    <span className="text-capitalize more-label">
                      {size - 3} more image{isEqual(size - 3, 1) ? '.' : 's.'}
                    </span>
                  </div>
                </div>
              </ButtonBase>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default ImageCarousel;
