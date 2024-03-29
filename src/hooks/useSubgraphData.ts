import ChainContext from '@/contexts/ChainContext';
import { DocumentNode } from 'graphql/language/ast';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { useState, useEffect, useContext } from 'react';

export const useSubgraphData = (
  query: DocumentNode,
  variables: object = {}
) => {
  const { subgraphClient } = useContext(ChainContext) as ChainContextType;
  const [data, setData] = useState<any>();
  const [lastVariable, setLastVariable] = useState<string>('');

  useEffect(() => {
    if (!subgraphClient || !query) {
      return;
    }

    (async () => {
      for (const param of Object.values(variables)) {
        if (param === undefined || param === null) {
          return;
        }
      }

      if (JSON.stringify(variables) == lastVariable) {
        return;
      }
      setLastVariable(JSON.stringify(variables));

      try {
        const response = await (
          subgraphClient as ApolloClient<NormalizedCacheObject>
        ).query({ query: query, variables });
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [query, subgraphClient, variables, lastVariable]);

  return data;
};
