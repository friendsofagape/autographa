import PropTypes from 'prop-types';
import * as logger from '../../../../logger';
import CheckHelpsUpdatePopUp from './CheckHelpsUpdatePopUp';

const checkHelpsVersionUpdate = async (reference) => {
    try {
        logger.debug('checkHelpsVersionUpdate.js', 'check update for resource');
        // console.log('reference : ', { reference });
        const currentResourceReleased = reference?.value?.meta?.released;
        let latestResourceReleased = null;
        // get released from repo fetch new meta
        const subject = reference?.value?.meta?.subject;
        const lang = reference?.value?.meta?.language;
        const owner = reference?.value?.meta?.owner;
        fetch(`https://git.door43.org/api/catalog/v5/search?subject=${subject}&lang=${lang}&owner=${owner}`)
        .then((res) => res.json())
        .then((resultMeta) => {
            // console.log({ resultMeta });
            latestResourceReleased = resultMeta?.data[0]?.released;

            // check for update
            console.log({ currentResourceReleased, latestResourceReleased });
            // currentResourceReleased = '2022-07-18T20:49:56Z';
            if (new Date(latestResourceReleased) > new Date(currentResourceReleased)) {
                console.log('update available');
                logger.debug('checkHelpsVersionUpdate.js', 'update avaailable');
                  <CheckHelpsUpdatePopUp update />;
            } else {
                logger.debug('checkHelpsVersionUpdate.js', 'No update avaailable');
                  <CheckHelpsUpdatePopUp update={false} />;
                console.log('No update available');
            }
        });
    } catch (err) {
        console.log('error check update :', { err });
    }
};

checkHelpsVersionUpdate.propTypes = {
    reference: PropTypes.object,
  };

export default checkHelpsVersionUpdate;
