import React from 'react';
import {shallow} from 'enzyme';
import Login from '../routes/Login/index';

const setUp = (props={}) => {
    const component = shallow(<Login {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Login Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'loginComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'loginComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Form', () => {
        it('Fill out email in the form', () => {
            const wrapper = shallow(<Login/>);
            let emailInput = wrapper.find('Input').first();
            emailInput.simulate('change', { 
                target: {value: 'e0407663'},
            })
            emailInput = wrapper.find('Input').first();
            expect(emailInput.props().value).toEqual('e0407663')
        })

        it('Fill out password in the form', () => {
            const wrapper = shallow(<Login/>);
            let passwordInput = wrapper.find('Input').last();
            passwordInput.simulate('change', { 
                target: {value: 'Anonymous'},
            })
            passwordInput = wrapper.find('Input').last();
            expect(passwordInput.props().value).toEqual('Anonymous')
        })
    })

    describe('Button', () => {
        it('Should render Button with click handle', () => {
            const wrapper =  findByTestAttr(component, 'buttonComponent');
            expect(wrapper.length).toEqual(1);
        })
    })
})
