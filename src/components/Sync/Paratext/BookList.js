import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const BookList = (props) => {
  return (
    <FormGroup row>
      {props.booksList.map((book, i) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                key={i}
                onChange={props.handleChange}
                value={book}
                color="primary"
              />
            }
            label={book}
          />
        );
      })}
    </FormGroup>
  );
};
export default BookList;
