import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { AutoCompleteSearch } from './AutoCompleteSearch';

jest.useFakeTimers();
const version = [
    { id: 1, value: 'IRV' },
    { id: 2, value: 'NLT' },
    { id: 3, value: 'UDB' },
    { id: 4, value: 'ULB' },
    { id: 5, value: 'UJNT' },
  ];

test('AutoCompleteSearch renders without error', () => {
  render(<AutoCompleteSearch listarray={version} />);
});
