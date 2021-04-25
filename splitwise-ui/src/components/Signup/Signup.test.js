import { render, screen,fireEvent } from '@testing-library/react';

import Signup from './Signup';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "../../redux/store/index";

test('Check Name during Create', () => {
  render(<Provider store={store}><Router><Signup /></Router></Provider>);
  const inputBox=screen.getByTestId('custName');

  fireEvent.change(inputBox,{target:{value:'newgroup'}})
  expect(inputBox.value).toBe('newgroup')
});