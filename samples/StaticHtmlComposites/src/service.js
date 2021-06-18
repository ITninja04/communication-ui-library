// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const createUserWithToken = async () => {
  // Calling the samples/Server. In your real app, your authenticated service should create users and issue tokens.
  // For more info, see https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript
  return (await fetch('http://localhost:8080/token?scope=chat,voip')).json();
};

export const createChatThread = async () => {
  return (await fetch('http://localhost:8080/createThread', { method: 'POST' })).text();
};

export const addChatUser = async (threadId, user, displayName) => {
  await fetch(`http://localhost:8080/addUser/${threadId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Id: user.communicationUserId, DisplayName: displayName })
  });
};

export const getEndpointUrl = async () => {
  // Pure convenience for running this sample, you would hard-code your Azure Communication Resource domain instead.
  return (await fetch('http://localhost:8080/getEndpointUrl')).text();
};