import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MDEditor } from './MDEditor';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import ProjectContextProvider from '../context/ProjectContext';

jest.useFakeTimers();
const version = [
    { id: 1, value: 'IRV' },
    { id: 2, value: 'NLT' },
    { id: 3, value: 'UDB' },
    { id: 4, value: 'ULB' },
    { id: 5, value: 'UJNT' },
  ];

test('MDEditor renders without error', () => {
  render(
    <ProjectContextProvider>
    <MDEditor openMDFile={true} />
    </ProjectContextProvider>
    );
});

test('should check md preview and edit selector', async () => {
    const { getByTestId } = render(
      <ProjectContextProvider>
      <MDEditor openMDFile={true} />
      </ProjectContextProvider>
      );
    const titleBox = getByTestId('test-tabs');
    expect(titleBox).toHaveTextContent('PreviewMarkdown');
});

test('Check mdeditor buttons', () => {
    const { getByTestId } = render(
      <ProjectContextProvider>
      <MDEditor openMDFile={true} />
      </ProjectContextProvider>
      );
    const saveButton = getByTestId('test-save');
    expect(saveButton).toHaveTextContent("save")
    const cancelButton = getByTestId('test-cancel');
    expect(cancelButton).toHaveTextContent("cancel")
  });
