import React from 'react';
import {shallow} from 'enzyme';
import Register from '../routes/Register/index';

const setUp = (props={}) => {
    const component = shallow(<Register {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Register Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'registerComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'registerComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Registration Form', () => {
        it('Fill out email in the form', () => {
            const wrapper = shallow(<Register/>);
            let emailInput = wrapper.find('Input').first();
            emailInput.simulate('change', { 
                target: {value: 'e0407663'},
            })
            emailInput = wrapper.find('Input').first();
            expect(emailInput.props().value).toEqual('e0407663')
        })

        it('Fill out username in the form', () => {
            const wrapper = shallow(<Register/>);
            let usernameInput = wrapper.find('Input').last();
            usernameInput.simulate('change', { 
                target: {value: 'Anonymous'},
            })
            usernameInput = wrapper.find('Input').last();
            expect(usernameInput.props().value).toEqual('Anonymous')
        })
    })

    describe('Button', () => {
        it('Should render Button with click handle', () => {
            const wrapper =  findByTestAttr(component, 'buttonComponent');
            expect(wrapper.length).toEqual(1);
        })
    })
})