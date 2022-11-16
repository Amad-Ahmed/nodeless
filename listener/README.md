
<a name="readmemd"></a>

Template for making easy-to-work-with tempates

# ts-template

## Usage

1. [Copy this template](https://github.com/rhdeck/ts-template/)
2. Clone to a local directory (eg `git clone https://github.com/me/my-repository/ && cd my-repository`)
3. Run `yarn && yarn setup` to initialize the node package (Get rid of template strings - and this readme!)
4. Happy Coding!

## Useful Scripts

1. `yarn build` will build using typescript pre-configured to node-compatible defaults
2. `yarn docs` will auto-generate a README.md that starts with TOP.md, then adds CLI documentation (via [commanderdoc](https://npmjs.com/package/commanderdoc)) for any tool you have set up, and then library documentation after that.
3. `yarn test` is pre-configured to test for typescript errors
4. `yarn watch` will watch the codebase for changes and rebuild (using [livelink](https://npmjs.com/package/@raydeck/livelink))

## Git code protections

1. `git commit` will be blocked on the `main` branch unless you set the environment variable `ALLOWMAIN=1` Branch commits and PRs are thus encouraged
2. `git commit` also tests messages for meeting the commitline standard conventions.
3. `git commit` blocks pushes that do not pass `yarn test` (as a base case, they must pass typescript compilation)
4. `npm publish` will always rebuild the code, the documentation, and push those changes back to the repository.
5. `npm publish` will only publish the lib and src directories - any others are no

## A note on "main"

I made a deliberate choice to change the primary branch from `master` to `main` for reasons that are obvious to some. This repository endeavors to make that just automatic.

PRs and feedback welcome via GitHub issues.


<a name="_librarymd"></a>

@nodelesslink/core - v1.0.0

# @nodelesslink/core - v1.0.0

## Table of contents

### Functions

- [parseRequestBody](#parserequestbody)
- [parseWebhook](#parsewebhook)
- [sendResult](#sendresult)

## Functions

### parseRequestBody

▸ **parseRequestBody**(`body`): `undefined` \| { `decodedData`: `Record`<`string`, `any`\> ; `id`: `number` ; `jobId`: `string` ; `key`: `string`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `undefined` \| ``null`` \| `string` |

#### Returns

`undefined` \| { `decodedData`: `Record`<`string`, `any`\> ; `id`: `number` ; `jobId`: `string` ; `key`: `string`  }

#### Defined in

[index.ts:5](https://github.com/statechangelabs/chainlinkfall2022/blob/5fbd2f7/listener/src/index.ts#L5)

___

### parseWebhook

▸ **parseWebhook**(`body`): `undefined` \| { `callbackAddr`: `string` ; `callbackFunctionId`: `string` ; `cancelExpiration`: `string` ; `chainId`: `string` ; `confirmed`: `boolean` ; `data`: `any` ; `dataVersion`: `string` ; `decodedData`: `Record`<`string`, `any`\> ; `jobId`: `string` ; `oracleAddress`: `string` ; `payment`: `string` ; `private_key`: `string` ; `providerUri`: `string` ; `rawData`: `string` ; `requestId`: `string` ; `requester`: `string`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `undefined` \| ``null`` \| `string` |

#### Returns

`undefined` \| { `callbackAddr`: `string` ; `callbackFunctionId`: `string` ; `cancelExpiration`: `string` ; `chainId`: `string` ; `confirmed`: `boolean` ; `data`: `any` ; `dataVersion`: `string` ; `decodedData`: `Record`<`string`, `any`\> ; `jobId`: `string` ; `oracleAddress`: `string` ; `payment`: `string` ; `private_key`: `string` ; `providerUri`: `string` ; `rawData`: `string` ; `requestId`: `string` ; `requester`: `string`  }

#### Defined in

[index.ts:38](https://github.com/statechangelabs/chainlinkfall2022/blob/5fbd2f7/listener/src/index.ts#L38)

___

### sendResult

▸ **sendResult**(`data`, `__namedParameters`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `__namedParameters` | `Object` |
| `__namedParameters.id` | `number` |
| `__namedParameters.key` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:19](https://github.com/statechangelabs/chainlinkfall2022/blob/5fbd2f7/listener/src/index.ts#L19)
