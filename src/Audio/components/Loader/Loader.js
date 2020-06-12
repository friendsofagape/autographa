// @flow
import * as React from 'react';
require('./loader.css')

const Loader = () => {
  return (
    <div>
        <div id="app">
				<div id="loader-wrapper">
					<div id="loader"></div>
					<div className="loader-section section-left"></div>
					<div className="loader-section section-right"></div>
				</div>
	    </div>
    </div>
  )
}

export default Loader;