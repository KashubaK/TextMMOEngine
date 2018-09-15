import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import HomePage from '../index';

describe('<HomePage />', () => {
  it('should render the game', () => {
    const wrapper = shallow(<HomePage />);
    expect(
      wrapper.find('Game').length,
    ).toEqual(1);
  });
});
