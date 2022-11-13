// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract Template is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle = 0x57858402413b9fadC961459e9509a253A57885C6;
    bytes32 private jobId = "e94cc2e6281545058d45470bb3a9ae16";
    uint256 private fee = 0.1 * 10**18;
    mapping(bytes32 => string) public requests;

    constructor() {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // for mumbai network
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function _oracleRequest(string memory symbol)
        internal
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillOracleRequest.selector
        );

        request.add("string_1", symbol);
        // Sends the request
        bytes32 _requestId = sendChainlinkRequestTo(oracle, request, fee);
        requests[_requestId] = symbol;
        return _requestId;
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfillOracleRequest(bytes32 _requestId, uint256 _returnedValue)
        public
        recordChainlinkFulfillment(_requestId)
    {
        string storage _symbol = requests[_requestId];

        // prices[_symbol] = _returnedValue;
        // blocks[_symbol] = block.number;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}
