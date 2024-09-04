# Lab L6: Implementing Identity Resolution

In this lab, you will develop a simple application that allows users to search for identities by identity keys, using attributes, and resolving and displaying identity information without exposing raw public keys to the user.

## Prerequisites
- Basic understanding of JavaScript and Node.js
- Familiarity with HTML and CSS, or React for front-end development
- Experience with the Babbage SDK
- The stageline MetaNet Client (or other compatible wallet) running locally

## Learning Objectives
- Understand the process of identity resolution in a web application
- Implement a search box for identity attribute discovery
- Integrate an identity resolution library to handle identity search and display
- Process and display selected identities in a user-friendly format

## Step-by-Step Instructions

### Set Up Your Development Environment
1. Begin by cloning the blockchain-engineering-labs repo. You will be working in the lab-l6 directory which has a basic React app setup.
2. Install dependencies that are already configured in package.json.

```
git clone 'https://github.com/blockchain-engineering-labs'
npm i
```

### Discover By Identity Key
1. Open the App.tsx file and import the following functions at the top of the file.
```
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
```
2. Next, use the discoverByIdentityKey to resolve identity information and print the results to the console.

### Parse Identity Information
Once you are able to get results back from the discoverBy function calls, we need a way to parse the identity information depending on what type of certificates and fields are presented.

The Identinator package makes this very simple. 
1. Import the following functions and types the Identinator package at the top of App.tsx.
```
import { parseIdentity, TrustLookupResult, Identity } from 'identinator'
```
2. Create a state variable to hold the Identity state.
3. In the useAsyncEffect function, parse out and update the Identity state variable.
4. In the React UI code below line 15, display the identity information in the UI.

### Implement the Search Functionality
Now your goal is to build a search box that allows users to type in identity attributes such as name, email, or username and get back that user’s identity information including resolving/displaying UHRP images.

1. The Autocomplete and TextField MUI components can be utilized to display a search box that can display resolved results as the user types.
2. Implement a fetchIdentities function.
3. Utilize the “any attribute” to dynamically search attributes without having to specify type (ex. email).

Ex.
```ts
const results = await discoverByAttributes({
  attributes: {
    any: query,
  },
  description: "Discover MetaNet Identity",
})
```

### Running the Lab
Start the Application

```
npm run start
```

In this lab, you have integrated identity resolution into a React application using the identinator package and the Babbage SDK. This exercise illustrates how to work with blockchain-based identity management in a web application and provides a foundation for more complex implementations.

### Troubleshooting Tips
- If you aren’t seeing any results, check your Trust Network settings and make sure you trust the main certifiers including SocialCert, and IdentiCert.
- When displaying UHRP images, make sure you have configured the correct Overlay Service URL or else the resolution won’t work correctly.
- Make sure you have the stageline MetaNet Client running.
