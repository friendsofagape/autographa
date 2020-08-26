import React, { useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AutographaStore from "../../AutographaStore";
import { FormattedMessage } from "react-intl";
const fontList = window.fontList;

export default function FontSelect() {
  const [font, setFont] = React.useState();
  const [value, setValue] = React.useState("");
  const didMountRef = useRef(false);
  let filtered = [];
  useEffect(() => {
    if (didMountRef.current) {
      fontList
        .getFonts()
        .then((fonts) => {
          fonts.forEach((element) => {
            filtered.push(element.replace(/"/gm, ""));
          });
          setFont(filtered);
          didMountRef.current = false;
        })
        .catch((err) => {
          console.log(err);
        });
    } else didMountRef.current = true;
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
