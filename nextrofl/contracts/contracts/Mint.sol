// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title MintNFT
 * @dev ERC721 NFT contract with encrypted metadata (assumed input is encrypted URI).
 * Only the NFT owner can update metadata, grant/revoke permissions.
 * Only authorized addresses (owner or granted) can view metadata.
 * Metadata is protected from public access (e.g., Nexus API).
 * Uses Oasis Sapphire for confidential storage and ROFL app for signing transactions.
 *
 * --- SUMMARY ---
 * - NFT Owner: Mint (via ROFL), update metadata, grant/revoke view/update permissions, transfer, burn.
 * - Granted address: View/update metadata based on permissions.
 * - Anyone: Cannot view metadata without permission (blocks public APIs).
 * - Metadata: JSON format, stored as URI (e.g., IPFS with encrypted data).
 * - ROFL app: Signs transactions (via Subcall.roflEnsureAuthorizedOrigin).
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Subcall} from "@oasisprotocol/sapphire-contracts/contracts/Subcall.sol";

contract MintNFT is ERC721URIStorage{
    uint256 private _tokenID; // Simple counter replacing deprecated Counters
    bytes21 public roflAppID;

    // Permissions: tokenId => address => bool
    mapping(uint256 => mapping(address => bool)) private _viewPermissions;
    mapping(uint256 => mapping(address => bool)) private _updatePermissions;

    // Events
    event NFTMinted(uint256 indexed tokenID, address indexed recipient);
    event UpdateMetadata(uint256 indexed tokenID, address indexed targetAddress);
    event GrantView(uint256 indexed tokenID, address indexed beneficiary);
    event GrantUpdate(uint256 indexed tokenID, address indexed beneficiary);
    event RevokeView(uint256 indexed tokenID, address indexed beneficiary);
    event RevokeUpdate(uint256 indexed tokenID, address indexed beneficiary);
    event GrantAll(uint256 indexed tokenID, address indexed beneficiary);
    event RevokeAll(uint256 indexed tokenID, address indexed beneficiary);

    /**
     * @dev Constructor sets ROFL app ID and initializes ERC721 with name/symbol.
     * @param roflID The ROFL app ID for authorized transaction signing.
     */
    constructor(bytes21 roflID) ERC721("EncryptedNFT", "ENFT")  {
        roflAppID = roflID;
    }

    /**
     * @dev Helper function to check if a token exists (replacement for deprecated _exists)
     * @param tokenId The token ID to check
     * @return bool Whether the token exists
     */
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Get metadata of an NFT, restricted to owner or addresses with view permission.
     * @param tokenId The NFT token ID.
     * @return The metadata URI (e.g., IPFS link to encrypted data).
     */
    function getMetadata(uint256 tokenId) external view returns (string memory) {
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(
            msg.sender == ownerOf(tokenId) || 
            _viewPermissions[tokenId][msg.sender], 
            "No permission to view this token's metadata"
        );
        return tokenURI(tokenId);
    }

    /**
     * @dev Mint a new NFT to the specified recipient, called only by authorized ROFL app.
     * @param recipient The address to receive the NFT.
     * @param tokenURI_ The metadata URI (assumed encrypted, e.g., IPFS link).
     * @return The new token ID.
     */
    function mintNFT(address recipient, string memory tokenURI_) external returns (uint256) {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(recipient != address(0), "Invalid recipient");
        _tokenID++;
        uint256 newIDToken = _tokenID;
        _mint(recipient, newIDToken);
        _setTokenURI(newIDToken, tokenURI_);
        emit NFTMinted(newIDToken, recipient);
        return newIDToken;
    }

    /**
     * @dev Override tokenURI to restrict access to owner or addresses with view permission.
     * @param tokenId The NFT token ID.
     * @return The metadata URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_tokenExists(tokenId), "ERC721: URI query for nonexistent token");
        require(
            msg.sender == ownerOf(tokenId) || 
            _viewPermissions[tokenId][msg.sender], 
            "No permission to view this token's metadata"
        );
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Update metadata of an NFT, called by ROFL app on behalf of targetAddress.
     * @param tokenID The NFT token ID.
     * @param newMetadata The new metadata URI.
     * @param targetAddress The address requesting the update (must be owner or have update permission).
     */
    function updateMetadata(uint256 tokenID, string memory newMetadata, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenID), "TokenID doesn't exist");
        require(targetAddress != address(0), "Invalid target address");
        require(
            targetAddress == ownerOf(tokenID) || 
            _updatePermissions[tokenID][targetAddress], 
            "Target address not authorized"
        );
        _setTokenURI(tokenID, newMetadata);
        emit UpdateMetadata(tokenID, targetAddress);
    }

    /**
     * @dev Grant view permission for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to grant view permission.
     * @param targetAddress The address requesting the grant (must be NFT owner).
     */
    function grantAnotherAddressView(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        require(beneficiary != address(0), "Invalid beneficiary");
        _viewPermissions[tokenId][beneficiary] = true;
        emit GrantView(tokenId, beneficiary);
    }

    /**
     * @dev Grant update permission for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to grant update permission.
     * @param targetAddress The address requesting the grant (must be NFT owner).
     */
    function grantAnotherAddressUpdate(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        require(beneficiary != address(0), "Invalid beneficiary");
        _updatePermissions[tokenId][beneficiary] = true;
        emit GrantUpdate(tokenId, beneficiary);
    }

    /**
     * @dev Revoke view permission for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to revoke view permission.
     * @param targetAddress The address requesting the revoke (must be NFT owner).
     */
    function revokeView(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        _viewPermissions[tokenId][beneficiary] = false;
        emit RevokeView(tokenId, beneficiary);
    }

    /**
     * @dev Revoke update permission for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to revoke update permission.
     * @param targetAddress The address requesting the revoke (must be NFT owner).
     */
    function revokeUpdate(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        _updatePermissions[tokenId][beneficiary] = false;
        emit RevokeUpdate(tokenId, beneficiary);
    }

    /**
     * @dev Grant both view and update permissions for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to grant permissions.
     * @param targetAddress The address requesting the grant (must be NFT owner).
     */
    function grantAll(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        require(beneficiary != address(0), "Invalid beneficiary");
        _viewPermissions[tokenId][beneficiary] = true;
        _updatePermissions[tokenId][beneficiary] = true;
        emit GrantAll(tokenId, beneficiary);
    }

    /**
     * @dev Revoke both view and update permissions for an NFT, called by ROFL app on behalf of NFT owner.
     * @param tokenId The NFT token ID.
     * @param beneficiary The address to revoke permissions.
     * @param targetAddress The address requesting the revoke (must be NFT owner).
     */
    function revokeAll(uint256 tokenId, address beneficiary, address targetAddress) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(targetAddress == ownerOf(tokenId), "Target address must be NFT owner");
        _viewPermissions[tokenId][beneficiary] = false;
        _updatePermissions[tokenId][beneficiary] = false;
        emit RevokeAll(tokenId, beneficiary);
    }

    /**
     * @dev Burn an NFT, only callable by the NFT owner.
     * @param tokenId The NFT token ID.
     */
    function burnNFT(uint256 tokenId) external {
        require(_tokenExists(tokenId), "TokenID doesn't exist");
        require(msg.sender == ownerOf(tokenId), "You're not the owner");
        _burn(tokenId);
        // Optional: Clean up permissions to avoid data residue
        // delete _viewPermissions[tokenId];
        // delete _updatePermissions[tokenId];
    }
}