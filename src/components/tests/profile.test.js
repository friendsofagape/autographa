import React from 'react';
import { shallow, mount } from 'enzyme'
import { findByTestAttr, checkProps } from '../../../test/testUtils'
import Profile from '../ProjectsPane/Profile'
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import intl from './helper';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();
/**
 * Setup funtion for app component 
 * @returns {ShallowWrapper}
 */

    const setup = () => {
        return shallow(<Profile />)
    }

    test('Profile renders without error', () => {
        const wrapper = setup();
        const profileCompoent = findByTestAttr(wrapper, 'component-profile')
        expect(profileCompoent.length).toBe(1)
    })

    describe('state controlled profile fields', () => {
        test("state update on first name upon change", async() => {
            const { getByTestId } = render(intl(<Profile />), 'en');
            const firstnameBox = getByTestId("firstnamefield")
            await act(async() => {
            fireEvent.change(firstnameBox, { target: { value: 'John' } });
            })
            expect(firstnameBox).toHaveValue('John');
        })
        test("state update on last name upon change", async() => {
            const { getByTestId } = render(intl(<Profile />), 'en');
            const firstnameBox = getByTestId("lastnamefield")
            await act(async() => {
            fireEvent.change(firstnameBox, { target: { value: 'Philip' } });
            })
            expect(firstnameBox).toHaveValue('Philip');
        })

        test("state update on email upon change", async() => {
            const { getByTestId } = render(intl(<Profile />), 'en');
            const firstnameBox = getByTestId("emailfield")
            await act(async() => {
            fireEvent.change(firstnameBox, { target: { value: 'testmail@mail.com' } });
            })
            expect(firstnameBox).toHaveValue('testmail@mail.com');
        })
        
    })