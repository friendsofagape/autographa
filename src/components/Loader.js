import React from "react";
import { FormattedMessage } from "react-intl";

class Loader extends React.Component {
  render() {
    return (
      <div id="loading-img">
        <div>
          <FormattedMessage id="label-please-wait">
            {(message) => (
              <p
                className="loading"
                dangerouslySetInnerHTML={{ __html: message }}
              ></p>
            )}
          </FormattedMessage>
        </div>
      </div>
    );
  }
}
export default Loader;
