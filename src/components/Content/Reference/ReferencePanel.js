import React from 'react'

const ReferencePanel = props => {
    console.log( "panel" ,props)
    return (
        <div>
         <div dangerouslySetInnerHTML={{__html: props.refContent}}></div>
        </div>
    );
};

export default ReferencePanel;