import { ApolloProvider } from "@apollo/client";

import { client } from "../lib/apollo.connection";
import UserContext from "../context/AuthContext";


const AppProvider = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <UserContext>
       {children}
      </UserContext>
    </ApolloProvider>
  );
};

export default AppProvider;
