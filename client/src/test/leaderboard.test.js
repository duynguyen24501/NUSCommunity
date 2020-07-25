import React from 'react';
import {shallow} from 'enzyme';
import Leaderboard from '../routes/Leaderboard/index';

const setUp = (props={}) => {
    const component = shallow(<Leaderboard {...props} />);
    return component;
}

const findByTestAttr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}

describe('Leaderboard Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    })

    it('Should render correctly', () => {
        const wrapper =  findByTestAttr(component, 'leaderboardComponent');
        expect(wrapper).toMatchSnapshot();
    });

    it('Should render without errors', () => {
        const wrapper =  findByTestAttr(component, 'leaderboardComponent');
        expect(wrapper.length).toEqual(1);       
    });

    describe('Leaderboard Table', () => {
        it('Should render leaderboard table without errors', () => {
            const wrapper =  findByTestAttr(component, 'leaderboardTableComponent');
            expect(wrapper.length).toEqual(1);       
        });
    })
})