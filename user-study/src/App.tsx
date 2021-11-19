import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallAdapter, CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

function App(): JSX.Element {
  const userId = '';
  const displayName = 'Anjul Garg';
  const token = '';

  //Calling Variables
  //For Group Id, developers can pass any GUID they can generate
  const groupId = '1f4940c5-4dad-42e0-a630-98abb5ffa17f';
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  // We can't even initialize the Chat and Call adapters without a well-formed token.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    if (credential !== undefined) {
      const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: { communicationUserId: userId },
            displayName,
            credential,
            locator: { groupId }
          })
        );
      };
      createAdapter(credential);
    }
  }, [credential]);

  if (!!callAdapter) {
    return (
      <div className="wrapper">
        <CallComposite adapter={callAdapter} />
      </div>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
