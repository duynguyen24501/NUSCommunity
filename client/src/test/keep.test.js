import React from 'react';
import {shallow} from 'enzyme';
import Keep from '../routes/Keep/index';

const setUp = (props={}) => {
    const component = shallow(<Keep {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Keep Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'keepComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'keepComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Create Add Area', () => {
        it('Should render without errors', () => {
            const wrapper =  findByTestAttr(component, 'addArea');
            expect(wrapper.length).toEqual(1);
        });
    })
})
