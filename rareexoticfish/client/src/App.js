// import logo from './logo.svg';
import './App.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as HashRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'
// import { Link } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';

const httpLink = createHttpLink({
  uri: '/grpahql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient ({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
        <div>
          <Header />
          <Container>
            <Routes>
              <Route path='/' element={<Home />} />
              {/*<Route path='/' element={} />
              <Route path='/' element={} /> */}
            </Routes>
          </Container>
          {/* <Footer /> */}
        </div>
      </HashRouter>
    </ApolloProvider>
  );
}

export default App;
