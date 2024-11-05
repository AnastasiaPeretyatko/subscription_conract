// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import {ERC20} from "./EC20.sol";
import {IERC20} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/809ded806fe1d952027026b056ff6623ff2e2dfc/contracts/token/ERC20/IERC20.sol";

contract ContentSubscription is ERC20 {

    IERC20 public token;

    struct Account{
        string name;
        string email;
        uint256 balance;
    }

    struct Channel {
        uint256 id;
        address owner;
        string name;
        string description;
        uint256 createdAt;
        bool isActive;
    }

    struct Subscription {
        address subscriber;
        uint256 channelId;
        uint256 startDate;
        uint256 endDate;
        uint256 subscriptionType;
    }

    struct Type {
        string name;
        uint256 price;
        uint256 period;
    }

    mapping (address => Account) public accounts;
    mapping (address => bool) public hasAccount;

    mapping (uint256 => Channel) public channels;
    mapping(address => uint256) public channelOwnership; // Сопоставление владельцев каналов с ID канала
    uint256 public nextChannelId;

    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    // mapping (address => bool) public hasSubscriptions;

    mapping(uint256 => Type) public types_subscription;
    uint256[] public typeList;

    constructor(IERC20 _token) ERC20("Stars", "STR"){
        token = _token;

        types_subscription[1] = Type("mounth", 10, 30 * 86400);
        typeList.push(1);
    }

    function createAccount (string memory name, string memory email) public {
        require(!hasAccount[msg.sender], "You already have an account");

        accounts[msg.sender] = Account(name, email, 0);
        hasAccount[msg.sender] = true;
    }

    function createChannel (string memory name, string memory description) public {
        require(channelOwnership[msg.sender] == 0, "You already have a channel"); // проверяем что у юзера нет канала

        uint256 channelId = nextChannelId++;

        channels[channelId] = Channel(channelId, msg.sender, name, description, block.timestamp, true);
        channelOwnership[msg.sender] = channelId;
    }

    function createSubscription (address ownerChannel, uint256 typeId, uint256 channelId) public {
        require(msg.sender != ownerChannel, "You can't subscribe to your channel");
        
        uint256 price = types_subscription[typeId].price;
        require(token.balanceOf(msg.sender) >= price, "You don't have enough tokens");

        // Перевод токенов от подписчика к владельцу канала
        require(token.transferFrom(msg.sender, ownerChannel, price), "Token transfer failed");

        require(channels[channelId].isActive, "Channel is not active");

        token.transferFrom(msg.sender, ownerChannel, types_subscription[typeId].price);


        uint256 duration = types_subscription[typeId].period;

        subscriptions[msg.sender][channelId] = Subscription(msg.sender, channelId, block.timestamp, block.timestamp + duration, typeId);
    }

    function suspendSubscription (uint256 channelId) public {
        require(subscriptions[msg.sender][channelId].endDate < block.timestamp, "No active subscription found");

        subscriptions[msg.sender][channelId].endDate = block.timestamp;
    }

    //продажа канала
    function transferChannelOwnership (uint256 channelId, address newOwner, uint256 amount) public {
        require(channelOwnership[msg.sender] != 0, "You do not own a channel");
        require(channelOwnership[newOwner] == 0, "New owner already owns a channel");
        require(accounts[newOwner].balance >= amount, "New owner already owns a channel");

        channelOwnership[newOwner] = channelId;
        channelOwnership[msg.sender] = 0;

        require(token.transferFrom(newOwner, msg.sender, amount), "Token transfer failed");
    }

    //Функция изменения периода подписки
    function setSubscriptionType(uint256 channelId, uint256 newTypeId) public {
        require(subscriptions[msg.sender][channelId].endDate < block.timestamp, "You are not subscribed to this channel");
        require(types_subscription[newTypeId].price > 0, "Invalid subscription type");
        subscriptions[msg.sender][channelId].subscriptionType = newTypeId;
    }
}
