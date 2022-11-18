// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract Template is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle = {{{oracleId}}};
    bytes32 private jobId = "{{{jobId}}}";
    uint256 private fee = 0.1 * 10**18;
    mapping(bytes32 => string)  requests;
    mapping(string => {{{returnTypeForMapping}}})  values;

    constructor() {
        setChainlinkToken({{{linkAddress}}}); // for mumbai network
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function _oracleRequest({{{args}}})
        internal
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillOracleRequest.selector
        );
        {{{requests}}}
        
        // Sends the request
        bytes32 _requestId = sendChainlinkRequestTo(oracle, request, fee);
        requests[_requestId] = {{{key}}};
        return _requestId;
    }

    /**
     * Receive the response in the form of {{{returnType}}}
     */
    function fulfillOracleRequest(bytes32 _requestId, {{{returnType}}} _returnedValue)
        public
        recordChainlinkFulfillment(_requestId)
    {
        string storage _key = requests[_requestId];
        values[_key] = _returnedValue;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
