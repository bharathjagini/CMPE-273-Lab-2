import { render, screen,fireEvent } from '@testing-library/react';
import Login from './Login';
import MyGroup from '../Group/MyGroup/MyGroup';
import App from '../../App'
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "../../redux/store/index";

test('renders Login Email address', () => {
  render(<Provider store={store}><Router><Login /></Router></Provider>);
  const inputBox=screen.getByTestId('email-test');

  fireEvent.change(inputBox,{target:{value:'bharath'}})
  expect(inputBox.value).toBe('bharath')
//  const linkElement = screen.getByText(/Email/i);
//   expect(linkElement).toBeInTheDocument();
});
