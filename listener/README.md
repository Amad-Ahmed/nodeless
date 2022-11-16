
<a name="readmemd"></a>

# @nodelesslabs/core

<a name="_librarymd"></a>

@nodelesslink/core - v1.0.1

# @nodelesslink/core - v1.0.1

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

[index.ts:5](https://github.com/statechangelabs/chainlinkfall2022/blob/ef46d81/listener/src/index.ts#L5)

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

[index.ts:38](https://github.com/statechangelabs/chainlinkfall2022/blob/ef46d81/listener/src/index.ts#L38)

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

[index.ts:19](https://github.com/statechangelabs/chainlinkfall2022/blob/ef46d81/listener/src/index.ts#L19)
