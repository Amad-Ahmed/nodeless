// eslint-disable-next-line
const output = JSON.parse('"// SPDX-License-Identifier: MIT\npragma solidity ^0.8.7;\n\nimport \"@chainlink/contracts/src/v0.8/ChainlinkClient.sol\";\n\n// import \"hardhat/console.sol\";\n// import \"@openzeppelin/contracts/access/Ownable.sol\";\n\ncontract Template is ChainlinkClient {\n    using Chainlink for Chainlink.Request;\n\n    address private oracle = {{{oracleId}}};\n    bytes32 private jobId = \"{{{jobId}}}\";\n    uint256 private fee = 0.1 * 10**18;\n    mapping(bytes32 => string) public requests;\n\n    constructor() {\n        setChainlinkToken({{{linkAddress}}}); // for mumbai network\n    }\n\n    /**\n     * Create a Chainlink request to retrieve API response, find the target\n     * data, then multiply by 1000000000000000000 (to remove decimal places from data).\n     */\n    function _oracleRequest({{{args}}})\n        internal\n        returns (bytes32 requestId)\n    {\n        Chainlink.Request memory request = buildChainlinkRequest(\n            jobId,\n            address(this),\n            this.fulfillOracleRequest.selector\n        );\n        {{{requests}}}\n        \n        // Sends the request\n        bytes32 _requestId = sendChainlinkRequestTo(oracle, request, fee);\n        requests[_requestId] = symbol;\n        return _requestId;\n    }\n\n    /**\n     * Receive the response in the form of {{{returnType}}}\n     */\n    function fulfillOracleRequest(bytes32 _requestId, {{{returnType}}} _returnedValue)\n        public\n        recordChainlinkFulfillment(_requestId)\n    {\n        string storage _symbol = requests[_requestId];\n        prices[_symbol] = _returnedValue;\n    }\n\n    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract\n"'); export default output;