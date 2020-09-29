import React from "react";
import {
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
} from "@material-ui/core";
import { CreateProjectStyles } from "./useStyles/CreateProjectStyles";
import { AllBooks, NT, OT } from "../../lib/CanonSpecification";
import CustomSpecification from "./CustomSpecification";

const canonItems = [
  { id: "OT", spec: "Old Testament (OT)" },
  { id: "NT", spec: "New Testament (NT)" },
  { id: "DC", spec: "Deutro Canon" },
  { id: "OTDC", spec: "OT Deutro Canon" },
  { id: "Custom", spec: "Custom" },
];
const AdvancedSetttings = () => {
  const classes = CreateProjectStyles();
  const [canonSpecification, setcanonSpecification] = React.useState("OT");
  const [content, setContent] = React.useState(OT);
  const [hideplaceholder, setHideplaceholder] = React.useState(false);
  const [custonOpen, setCustonOpen] = React.useState(false);
  const [updateCanonItems, setUpdateCanonItems] = React.useState(canonItems);

  const changeCanonSpecification = (event) => {
    setcanonSpecification(event.target.value);
    setHideplaceholder(true);
    switch (event.target.value.toString()) {
      case "OT":
        setContent(OT);
        setHideplaceholder(false);
        break;
      case "NT":
        setContent(NT);
        setHideplaceholder(false);
        break;
      case "Custom":
        setContent(NT);
        setHideplaceholder(false);
        setCustonOpen(!custonOpen);
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Box fontWeight={600} m={1}>
                    Versification Scheme
                  </Box>
                </FormLabel>
                <Select
                  className={classes.biblename}
                  value="kjv"
                  variant="outlined"
                >
                  <MenuItem value={"kjv"}>King James Version (KJV)</MenuItem>
                  <MenuItem value={"niv"}>
                    New Internation Version (NIV)
                  </MenuItem>
                </Select>
              </FormControl>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Canon Specifications
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.biblename}
                    value={canonSpecification}
                    onChange={(event) => changeCanonSpecification(event)}
                    variant="outlined"
                  >
                    {updateCanonItems.map((value) => {
                      return (
                        <MenuItem key={value.id} value={value.id}>
                          {value.spec}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </span>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Content
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.biblename}
                    value={content[0]}
                    variant="outlined"
                  >
                    {hideplaceholder && (
                      <MenuItem value={content[0]} disabled>
                        {content[0]}
                      </MenuItem>
                    )}
                    {content.map((bookname, index) => {
                      return (
                        <MenuItem value={bookname} key={index}>
                          {bookname}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </span>
              <div>
                <FormControl className={classes.license} component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      License
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.licenseselect}
                    value="bi"
                    variant="outlined"
                  >
                    <MenuItem value={"md"}>MdFile</MenuItem>
                    <MenuItem value={"bi"}>Bible</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
      <CustomSpecification
        opencustom={custonOpen}
        setCustonOpen={setCustonOpen}
        allbooks={AllBooks}
        setContent={setContent}
        updateCanonItems={updateCanonItems}
        setUpdateCanonItems={setUpdateCanonItems}
      />
    </>
  );
};
export default AdvancedSetttings;
