import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
    IconButton, Badge
  } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import CustomDialog from '../CustomDialog';

jest.useFakeTimers();

const buttons = (
    <IconButton color="inherit">
      <Badge badgeContent={17} color="secondary">
        <Notifications />
      </Badge>
    </IconButton>
  );

test('renders without fail', () => {
  render(<CustomDialog open={true} />);
});

describe('Custom Dialog bar test', () => {
      test('Check Dialog title', () => {
        const { getByTestId } = render(
        <CustomDialog 
            title="Autographa Dialog"
            buttons={buttons}
            open={true}
        />);
        const titleBox = getByTestId('dialog-title');
        expect(titleBox).toHaveTextContent('Autographa Dialog');
      });

      test('Check Dialog buttons', () => {
        const { getByTestId } = render(
        <CustomDialog 
            title="Autographa Dialog"
            buttons={buttons}
            open={true} 
        />);
        const buttonslist = getByTestId('dialog-buttons');
        expect(buttonslist).toHaveTextContent(17)
      });
})