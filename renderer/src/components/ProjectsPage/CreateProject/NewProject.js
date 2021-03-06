import React from 'react';
import ApplicationBar from '../../ApplicationBar/ApplicationBar';
import CreateProjectAccordions from './CreateProjectAccordions';

const style = { top: '65px', width: 'inherit', left: '153px' };

export default function NewProject() {
    return (
      <div>
        <div>
          <ApplicationBar
            title="NEW PROJECT"
            theme="secondary"
            appBarStyle={style}
          />
        </div>
        <CreateProjectAccordions />
      </div>
    );
}
