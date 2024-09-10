# Lab L7: Implementing ToDo List Application with PushDrop

In this lab, you will enhance your understanding of the PushDrop library by applying it to a practical scenario—creating and managing a ToDo list application where each task is represented as a token. The goal of this lab is to help you gain experience in creating, decoding, and redeeming tokens using PushDrop and the Babbage SDK.

## Prerequisites
- Basic understanding of JavaScript and Node.js
- Node.js and NPM installed on your machine
- Familiarity with the PushDrop library and Babbage SDK
- Basic knowledge of front-end development (React, HTML, CSS, JavaScript/TypeScript)

## Learning Objectives
- Set up a development environment for working with PushDrop and Babbage SDK
- Implement token creation functionality using the PushDrop library
- Retrieve and decode tokens using PushDrop
- Redeem tokens and update the ToDo list

## Step-by-Step Instructions
### Set Up Your Development Environment
Begin by cloning the repository that contains the partially completed ToDo list application, and install dependencies.

```
git clone 'https://github.com/blockchain-engineering-labs'
npm i
```

### Task Creation (Encrypting Task and Creating Token)
- Encrypt Task Description: Implement the logic to encrypt the task description using a key that only the user has access to. This will ensure that the task's content remains secure and can only be decrypted by the user who created it.
- Create PushDrop ToDo Token: Use the PushDrop library to create a new token that contains the encrypted task description. You'll need to generate an output script that will be used in the Bitcoin transaction representing the task.

- Register the Token with the Blockchain: After creating the token output script, use the Babbage SDK createAction function to create a new Bitcoin transaction that will contain a UTXO representing the task. Following the SDK docs, put it in a todo basket for the current user so that they can retrieve it once they are ready to complete the task.

### Task Completion (Redeeming the Token)
- Redeem ToDo Token: Implement the functionality to redeem the task token when the user marks a task as complete. This involves using PushDrop to create an output script that will unlock the UTXO and be consumed as input to a new transaction.
- Create a New Action for Redeem: Once the unlocking script is created, create a new transaction (Action) on the blockchain that represents the completion of the task. This transaction will remove the task from the user's ToDo list and update their Bitcoin balance.

### Loading Existing ToDo Tokens
- Decode ToDo PushDrop Tokens: Implement the logic to decode the tokens retrieved from the user's basket. This step involves converting the locking script back into readable fields, including the encrypted task content.
- Decrypt Task Descriptions: After decoding, decrypt the task descriptions so that they can be displayed in the ToDo list. Ensure that the same protocol ID and key ID used during encryption are applied here to accurately retrieve the original task content.

## Running the Lab
Start the Application

```
npm run start
```

### Test Your Implementation

Create Tasks: Use the UI to create new tasks, which will be represented as tokens and stored in the specified basket.
View Tasks: Ensure that the tasks are correctly displayed in the task list by decoding the tokens.
Complete Tasks: Mark tasks as done by redeeming the associated tokens, which should remove them from the list.

*Note: Make sure you have the stageline MetaNet Client running.*
