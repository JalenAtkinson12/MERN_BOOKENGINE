import React from 'react';
import {ApolloProvider} from '@Apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem('id_token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  uri: '/graphql',
});




function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <>
        <Navbar />
        <Switch> 
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
         </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
