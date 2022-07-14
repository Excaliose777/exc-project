    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.9;

    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/Strings.sol";

    import "./IWhitelist.sol";

    contract EXCNFT is ERC721Enumerable, Ownable {
        using Strings for uint256;

        string _baseTokenURI;
        
        uint256 public _price = 0.015 ether;
        
        bool public _paused;
        
        uint256 public maxTokenIds = 7;
        uint256 public tokenIds;
        
        IWhitelist whitelist;
        

        modifier onlyWhenNotPaused {
          require(!_paused, "Contract currently paused");
          _;
        }

        constructor (string memory baseURI, address whitelistContract) ERC721("EXC NFT", "EXC") {
          _baseTokenURI = baseURI;
          whitelist = IWhitelist(whitelistContract);
      }

      function mint() public payable onlyWhenNotPaused {
          require(whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
          require(tokenIds < maxTokenIds, "Exceeded maximum Crypto Devs supply");
          require(msg.value >= _price, "Ether sent is not correct");
          tokenIds += 1;
          _safeMint(msg.sender, tokenIds);
      }

        function _baseURI() internal view virtual override returns (string memory) {
            return _baseTokenURI;
        }


        function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

            string memory baseURI = _baseURI();
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
        }


        function setPaused(bool val) public onlyOwner {
          _paused = val;
      }

        function withdraw() public onlyOwner  {
            address _owner = owner();
            uint256 amount = address(this).balance;
            (bool sent, ) =  _owner.call{value: amount}("");
            require(sent, "Failed to send Ether");
        }

         // Function to receive Ether. msg.data must be empty
        receive() external payable {}

        // Fallback function is called when msg.data is not empty
        fallback() external payable {}

    }