import React from 'react';
import {shallow} from 'enzyme';
import Profile from '../routes/Profile/index';

const setUp = (props={}) => {
    const component = shallow(<Profile {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Profile Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'profileComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'profileComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Form', () => {
        it('Fill out bio in the form', () => {
            const wrapper = shallow(<Profile/>);
            let bioInput = wrapper.find('Input').first();
            bioInput.simulate('change', { 
                target: {value: 'This is bio section'},
            })
            bioInput = wrapper.find('Input').first();
            expect(bioInput.props().value).toEqual('This is bio section')
        })
    })

    describe('Button', () => {
        it('Should render Button with click handle', () => {
            const wrapper =  findByTestAttr(component, 'buttonComponent');
            expect(wrapper.length).toEqual(1);
        })
    })
})
