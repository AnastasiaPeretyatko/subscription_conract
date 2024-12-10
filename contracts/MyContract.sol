// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyToken.sol";

contract MyContract {
    struct Account {
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
        bool isActive;
    }

    struct Type {
        uint256 id;
        uint256 channelId;
        string name;
        uint256 price;
        uint256 period;
    }

    mapping(address => Account) public accounts;

    mapping(uint256 => Channel) public channels;
    uint256[] public channelIds;

    mapping(address => uint256) public channelOwnership;

    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    uint256 public nextSubscriptionId;

    mapping(uint256 => Type) public types_subscription;
    uint256 public nextTypeId;

    uint256 public nextChannelId;

    event AccountCreated(address indexed user, string name, string email);
    event ChannelCreated(Channel channel);

    MyToken public token;

    constructor(MyToken _token) {
        token = _token;
    }

    function createAccount(string memory name, string memory email) public {
        require(
            bytes(accounts[msg.sender].name).length == 0,
            "You already have an account"
        );

        accounts[msg.sender] = Account(name, email, 0);

        emit AccountCreated(msg.sender, name, email);
    }

    function signIn(
        string memory name,
        string memory email
    ) public view returns (Account memory) {
        require(
            keccak256(abi.encodePacked(accounts[msg.sender].name)) ==
                keccak256(abi.encodePacked(name)) &&
                keccak256(abi.encodePacked(accounts[msg.sender].email)) ==
                keccak256(abi.encodePacked(email)),
            "Invalid name or email"
        );

        return accounts[msg.sender];
    }

    function createChannel(
        string memory name,
        string memory description
    ) public {
        channels[nextChannelId] = Channel(
            nextChannelId,
            msg.sender,
            name,
            description,
            block.timestamp,
            true
        );

        emit ChannelCreated(channels[nextChannelId]);
        channelOwnership[msg.sender] = nextChannelId;
        channelIds.push(nextChannelId);
        nextChannelId++;
    }

    function createSubscription(uint256 typeId, uint256 channelId) public payable {
        require(channels[channelId].isActive, "Channel is not active");

        // Проверка на активную подписку
        for (uint256 i = 0; i < nextSubscriptionId; i++) {
            if (
                subscriptions[msg.sender][i].channelId == channelId &&
                subscriptions[msg.sender][i].endDate > block.timestamp
            ) {
                revert(
                    "You already have an active subscription to this channel"
                );
            }
        }

        uint256 price = types_subscription[typeId].price;

        require(msg.value >= price, "Insufficient funds");

        // Перевод необходимой суммы
        (bool success, ) = channels[channelId].owner.call{value: price}("");
        require(success, "Transfer failed");

        Type memory subscriptionType = types_subscription[typeId];

        // Создание подписки
        subscriptions[msg.sender][nextSubscriptionId] = Subscription(
            msg.sender,
            channelId,
            block.timestamp,
            block.timestamp + subscriptionType.period,
            typeId,
            true
        );

        nextSubscriptionId++;
    }

    function getSubscriptions() public view returns (Subscription[] memory) {
        uint256 count = 0;

        // Подсчёт количества подписок у msg.sender
        for (uint256 i = 0; i < nextSubscriptionId; i++) {
            if (subscriptions[msg.sender][i].subscriber == msg.sender) {
                count++;
            }
        }

        // Создаём массив фиксированного размера для хранения подписок
        Subscription[] memory userSubscriptions = new Subscription[](count);
        uint256 index = 0;

        // Заполняем массив подписками
        for (uint256 i = 0; i < nextSubscriptionId; i++) {
            if (
                subscriptions[msg.sender][i].subscriber == msg.sender &&
                subscriptions[msg.sender][i].endDate > block.timestamp
            ) {
                userSubscriptions[index] = subscriptions[msg.sender][i];
                index++;
            }
        }

        return userSubscriptions;
    }

    function getChannelsOwner() public view returns (Channel[] memory) {
        uint256 count = 0;

        // Считаем количество каналов, принадлежащих владельцу
        for (uint256 i = 0; i < channelIds.length; i++) {
            if (channels[channelIds[i]].owner == msg.sender) {
                count++;
            }
        }

        // Создаем массив для хранения каналов владельца
        Channel[] memory userChannels = new Channel[](count);
        uint256 index = 0;

        // Заполняем массив каналами владельца
        for (uint256 i = 0; i < channelIds.length; i++) {
            if (channels[channelIds[i]].owner == msg.sender) {
                userChannels[index] = channels[channelIds[i]];
                index++;
            }
        }

        return userChannels;
    }

    function suspendSubscription(uint256 channelId) public {
        require(
            subscriptions[msg.sender][channelId].isActive == true,
            "You don't have an active subscription to this channel"
        );
        subscriptions[msg.sender][channelId].isActive = false;
    }

    function createSubscriptionType(
        uint256 channelId,
        string memory name,
        uint256 price,
        uint256 period
    ) public {
        // Проверяем, что канал принадлежит вызывающему
        require(
            channels[channelId].owner == msg.sender,
            "You do not own this channel"
        );

        require(channels[channelId].isActive, "Channel is not active");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(price > 0, "Price must be greater than zero");
        require(period > 0, "Period must be greater than zero");

        // Создаем новый тип подписки для канала
        types_subscription[nextTypeId] = Type(
            nextTypeId,
            channelId,
            name,
            price,
            period * 86400
        );

        nextTypeId++;
    }

    function getTypesChannel(
        uint256 channelId
    ) public view returns (Type[] memory) {
        require(channels[channelId].isActive, "Channel is not active");

        // Вычисляем количество типов подписки для данного канала
        uint256 count = 0;
        for (uint256 i = 0; i < nextTypeId; i++) {
            if (types_subscription[i].channelId == channelId) {
                count++;
            }
        }

        // Создаем массив точного размера
        Type[] memory types = new Type[](count);

        // Заполняем массив подходящими типами
        uint256 index = 0;
        for (uint256 i = 0; i < nextTypeId; i++) {
            if (types_subscription[i].channelId == channelId) {
                types[index] = types_subscription[i];
                index++;
            }
        }

        return types;
    }
}
