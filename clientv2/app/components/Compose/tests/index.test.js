import React from 'react';
import { shallow } from 'enzyme';

import Compose from '../index';

describe('<Compose />', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Compose />);

    expect(
      wrapper.length
    ).toEqual(1);
  });
});
