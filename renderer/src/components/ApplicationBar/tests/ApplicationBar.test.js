import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ApplicationBar from '../ApplicationBar';
import {
    IconButton, Badge
  } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';

jest.useFakeTimers();

const buttons = (
    <IconButton color="inherit">
      <Badge badgeContent={17} color="secondary">
        <Notifications />
      </Badge>
    </IconButton>
  );

test('renders without fail', () => {
  render(<ApplicationBar />);
});

describe('Starred content table test', () => {
      test('Check AppBar title', () => {
        const { getByTestId } = render(
        <ApplicationBar 
            title="Autographa"
            buttons={buttons} 
        />);
        const titleBox = getByTestId('app-title');
        expect(titleBox).toHaveTextContent('Autographa');
      });

      test('Check AppBar buttons', () => {
        const { getByTestId } = render(
        <ApplicationBar 
            title="Autographa"
            buttons={buttons} 
        />);
        const buttonslist = getByTestId('app-buttons');
        expect(buttonslist).toHaveTextContent(17)
      });
})