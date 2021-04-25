import { render, screen,fireEvent } from '@testing-library/react';


import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';
import { Provider } from 'react-redux';
import store from "../../redux/store/index";


test('Check Landing Page Text', () => {

    render(<Provider store={store}><Router><LandingPage/></Router></Provider>)
     const linkElement = screen.getByText(/Less Stress/i);
  expect(linkElement).toBeInTheDocument();

});