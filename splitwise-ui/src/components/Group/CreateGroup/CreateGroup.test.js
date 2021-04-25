import { render, screen,fireEvent } from '@testing-library/react';

import CreateGroup from './CreateGroup';

import { BrowserRouter as Router } from 'react-router-dom';
import store from "../../../redux/store/index";
import { Provider } from 'react-redux';

test('Check Create Group', () => {
    render(<Provider store={store}><Router><CreateGroup/></Router></Provider>)
     const linkElement = screen.getByText(/My group shall be called/i);
  expect(linkElement).toBeInTheDocument();

});