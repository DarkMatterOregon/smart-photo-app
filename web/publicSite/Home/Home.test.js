import React from 'react';
import renderer from 'react-test-renderer';
import Home from './index';

describe('<Home />', () => {
    it('renders correctly', () => {
        const home = renderer.create(<Home />).toJSON();
        expect(home).toMatchSnapshot();
    });
});
