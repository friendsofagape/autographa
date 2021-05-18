import PropTypes from 'prop-types';
import { XIcon } from '@heroicons/react/solid';

export default function Notifications(props) {
  const {
    children,
    closeNotifications,
  } = props;

  function close() {
    closeNotifications(false);
  }

  return (
    <div className="absolute top-16 right-0 h-full shadow overflow-hidden rounded-l-md">

      <div className="flex flex-row w-96 text-center bg-black text-white text-xs font-medium tracking-wider uppercase">
        <div className="m-auto">
          notifications
        </div>
        <div className="flex justify-end">
          <button type="button" className="w-9 h-9 bg-black p-2" onClick={close}>
            <XIcon />
          </button>
        </div>
      </div>
      <div className="bg-white h-full p-4">
        {children}
      </div>
    </div>

  );
}

Notifications.propTypes = {
  children: PropTypes.any,
  closeNotifications: PropTypes.func,
};
