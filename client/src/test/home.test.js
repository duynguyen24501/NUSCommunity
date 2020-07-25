import React from 'react';
import {shallow} from 'enzyme';
import Home from '../routes/Home/index';

const setUp = (props={}) => {
    const component = shallow(<Home {...props} />);
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
        const wrapper =  findByTestAttr(component, 'homeComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'homeComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('List of posts', () => {
        it('Should render list of posts without errors', () => {
            const wrapper =  findByTestAttr(component, 'postListComponent');
            expect(wrapper.length).toEqual(1);
        });

        it('Should render user information without errors', () => {
            const wrapper =  findByTestAttr(component, 'userInfoComponent');
            expect(wrapper.length).toEqual(1);
        })
    })
})
