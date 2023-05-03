import React from 'react';
import { Menu, MenuItem, Button, IconButton } from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_arrow_drop_down as icDropdown } from 'react-icons-kit/md/ic_arrow_drop_down';
import { ic_chevron_left as icLeft } from 'react-icons-kit/md/ic_chevron_left';
import { ic_chevron_right as icRight } from 'react-icons-kit/md/ic_chevron_right';
import PropTypes from 'prop-types';

const Pagination = props => {
  const {
    paginationProps: {
      selectedRowPerPage,
      updateRowsPerPage,
      hasNext,
      hasPrevious,
      currentPage,
      updateCurrentPage,
    },
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const rows = [10, 15, 25];

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRow = row => () => {
    updateRowsPerPage(row);
    handleClose();
  };

  const handleNext = () => {
    if (hasNext) {
      updateCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (hasPrevious) {
      updateCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="d-flex flex-row justify-content-end w-100 pt-3">
      <div className="d-flex flex-row align-items-center">
        <p className="pr-2 mb-0">Rows per page:</p>
        <Button
          className="px-4"
          aria-controls="table-pagination-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <div className="d-flex flex-row align-items-center">
            <span>{selectedRowPerPage}</span>
            <Icon icon={icDropdown} size={18} />
          </div>
        </Button>
        <Menu
          id="table-pagination-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {React.Children.toArray(
            rows.map(row => (
              <MenuItem onClick={handleSelectRow(row)} className="px-4">
                {row}
              </MenuItem>
            )),
          )}
        </Menu>
        <p className="pr-2 mb-0">
          Page: <span className="pl-2">{currentPage}</span>
        </p>
        <IconButton
          edge="end"
          aria-label="previous"
          color={hasPrevious ? 'primary' : 'default'}
          disabled={!hasPrevious}
          onClick={handlePrev}
        >
          <Icon icon={icLeft} size={24} />
        </IconButton>
        <IconButton
          aria-label="next"
          color={hasNext ? 'primary' : 'default'}
          disabled={!hasNext}
          onClick={handleNext}
        >
          <Icon icon={icRight} size={24} />
        </IconButton>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  paginationProps: PropTypes.object.isRequired,
};

export default Pagination;
