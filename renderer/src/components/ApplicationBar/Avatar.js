import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import {
    StyledBadgeOnline,
    StyledBadgeOffline,
  } from './useStyles';

export default function BadgeAvatars({
    path,
    size,
    status,
}) {
  return (
    <div>
      {(status === 'online') && (
        <StyledBadgeOnline
          overlap="circle"
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
          status={status}
          variant="dot"
        >
          <Avatar className={size} alt="Remy Sharp" src={path} />
        </StyledBadgeOnline>
    )}
      {(status === 'offline') && (
        <StyledBadgeOffline
          overlap="circle"
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
          status={status}
          variant="dot"
        >
          <Avatar className={size} alt="Remy Sharp" src={path} />
        </StyledBadgeOffline>
    )}
      {(!status && (
      <Avatar className={size} alt="Remy Sharp" src={path} />
      ))}
    </div>
  );
}
BadgeAvatars.propTypes = {
    path: PropTypes.string.isRequired,
    size: PropTypes.object.isRequired,
    status: PropTypes.string,
};
