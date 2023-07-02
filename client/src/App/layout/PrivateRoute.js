import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useAppSelector } from '../store/configureStore';
import { Component } from 'react';

export default function PrivateRoute({ component, ...rest }) {
    const {user} = useAppSelector(state => state.account);
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }