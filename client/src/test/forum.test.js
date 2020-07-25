import React from 'react';
import {shallow} from 'enzyme';
import Forum from '../routes/Forum/index';

const setUp = (props={}) => {
    const component = shallow(<Forum {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Forum Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'forumComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'forumComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Form List', () => {
        it('Should render forum list', () => {
            const wrapper =  findByTestAttr(component, 'forumList');
            expect(wrapper).toMatchSnapshot();
        });
    })

    describe('Search Button', () => {
        it('Should render Search Button', () => {
            const wrapper =  findByTestAttr(component, 'searchButtonComponent');
            expect(wrapper.length).toEqual(1);
        })
    })
})
