import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AutographaStore from "../../AutographaStore";
import { FormattedMessage } from "react-intl";
const fontList = require("font-list");

export default function FontSelect() {
  const [font, setFont] = React.useState();
  const [value, setValue] = React.useState("");
  let filtered = [];

  useEffect(() => {
    fontList
      .getFonts()
      .then((fonts) => {
        fonts.forEach((element) => {
          filtered.push(element.replace(/\"/gm, ""));
        });
        setFont(filtered);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filtered]);

  return (
    <div>
      <Autocomplete
        inputValue={value}
        onInputChange={(_, val) => {
          setValue(val);
          AutographaStore.fontselected = val;
        }}
        id="controllable-states-demo"
        options={font}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<FormattedMessage id="label-change-font" />}
            variant="outlined"
          />
        )}
      />
    </div>
  );
}
