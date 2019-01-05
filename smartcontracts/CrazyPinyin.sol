pragma solidity ^0.4.23;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
    int256 constant private INT256_MIN = -2**255;

    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Multiplies two signed integers, reverts on overflow.
    */
    function mul(int256 a, int256 b) internal pure returns (int256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        require(!(a == -1 && b == INT256_MIN)); // This is the only case of overflow not detected by the check below

        int256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Integer division of two signed integers truncating the quotient, reverts on division by zero.
    */
    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != 0); // Solidity only automatically asserts when dividing by 0
        require(!(b == -1 && a == INT256_MIN)); // This is the only case of overflow

        int256 c = a / b;

        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Subtracts two signed integers, reverts on overflow.
    */
    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));

        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Adds two signed integers, reverts on overflow.
    */
    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));

        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

/**
 * @title CrazyPinyin
 * @dev CrazyPinyin Main Contract
 */
contract CrazyPinyin {
    using SafeMath for uint256;
    
    event BuyGoldCompeteEvent(address owner, uint256 numGoldsToBuy);
    event BuyVideoAdsCompeteEvent(address owner, uint256 numVideoAdsToBuy);
    event ChallengeModeBonusRewardedEvent(address owner, uint256 numRewarded);
    event WithdrawTRXBalanceCompleteEvent(address owner, uint256 numTRX);
    
    struct VideoAdsData {
        uint256 total;
        uint256 numCV; // number of completed view
        uint256 cpcv; // cost per completed view
        string platform;
        string videoId;
    }
    VideoAdsData[] internal allVideoAds;
    mapping (address => uint256[]) internal advertiserToVideoAdsIdx;
    mapping (uint => address) internal videoAdsIdxToAdvertiser;
    
    address public ceoAddress;
    address public devTeamAddress;
    uint256 public goldPrice = 0.01 trx;
    uint256 private maxChallengeBonus = 15000000; // 15 trx
    uint256 private currentLockedTRX = 0;
    mapping(address => uint256) public trxBalance;
    
    /**
    * @dev Constructor
    */
    constructor(address _devTeam) public {
        ceoAddress = msg.sender;
        devTeamAddress = _devTeam;
    }
    
    /**
    * @dev Access Control Modifier
    */
    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }
    
    /**
    * @dev Access Control
    */
    function setCEO(address _newCEO) public onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
    }
    
    /**
    * @dev Set the price for each gold
    */
    function setGoldPrice(uint256 fee) public onlyCEO {
        goldPrice = fee;
    }
    
    /**
    * @dev Get the price for each gold
    */
    function setMaxChallengeBonus(uint256 max) public onlyCEO {
        maxChallengeBonus = max;
    }

    /**
    * @dev Get total Prize Pool
    */
    function getPrizePool() public view returns (uint256) {
        return (address(this).balance - currentLockedTRX);
    }
    
    /**
    * @dev Buy golds according to the goldPrice.
    * 10% of the trx received will be given to Dev Team
    * 90% of the trx received will be used as an incentive prize pool for gamers
    */
    function buyGolds() public payable {
        require(msg.sender != address(0));
        require(msg.value >= goldPrice);
        
        uint256 numGoldsToBuy = msg.value.div(goldPrice);
        uint256 devTeamVal = msg.value.mul(10).div(100);
        uint256 remainingVal = msg.value - devTeamVal;
        
        _safeSend(devTeamAddress, devTeamVal);
        if (remainingVal > numGoldsToBuy.mul(goldPrice)) {
            uint256 feeExcess = remainingVal.sub(numGoldsToBuy.mul(goldPrice));
            //emit LOG_SEND_MONEY_BACK(feeExcess);
            _safeSend(msg.sender, feeExcess);
        }
        
        emit BuyGoldCompeteEvent(msg.sender, numGoldsToBuy);
    }

    /**
    * @dev Get Video Ad Info base on index on allVideoAds
    */
    function getTotalNumVideoAds() public view returns (uint256) {
        require(msg.sender != address(0));
        return allVideoAds.length;
    }

    /**
    * @dev Get Video Ad Info base on index on allVideoAds
    */
    function getVideoAdsInfo(uint256 vid) public view returns (uint256, uint256, uint256, string, string) {
        require(msg.sender != address(0));
        require(vid >= 0 && vid < allVideoAds.length);

        VideoAdsData storage videoData = allVideoAds[vid];
        return (videoData.total, videoData.numCV, videoData.cpcv, videoData.platform, videoData.videoId);
    }
    
    /**
    * @dev Buy Video Ads according to the _cpcv.
    * This method is ready to use for advitisers who want to promote their product in CrazyPinyin.
    * 10% of the trx received will be given to Dev Team
    * 90% of the trx received will be used as an incentive prize pool for gamers
    */
    function buyVideoAds(string _platform, string _vid, uint256 _cpcv) public payable {
        require(msg.sender != address(0));
        require(msg.value >= _cpcv);
        
        uint256 numAdsToBuy = msg.value.div(_cpcv);
        uint256 devTeamVal = msg.value.mul(10).div(100);
        uint256 remainingVal = msg.value - devTeamVal;
        
        VideoAdsData memory _videoAdsData = VideoAdsData({
            total: numAdsToBuy,
            numCV: uint256(0),
            cpcv: _cpcv,
            platform: _platform,
            videoId: _vid
        });
        
        uint256 newVideoIdx = allVideoAds.push(_videoAdsData) - 1;
        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newVideoIdx == uint256(uint32(newVideoIdx)));
        
        advertiserToVideoAdsIdx[msg.sender].push(newVideoIdx);
        videoAdsIdxToAdvertiser[newVideoIdx] = msg.sender;
        
        _safeSend(devTeamAddress, devTeamVal);
        if (remainingVal > numAdsToBuy.mul(_cpcv)) {
            uint256 feeExcess = remainingVal.sub(numAdsToBuy.mul(_cpcv));
            //emit LOG_SEND_MONEY_BACK(feeExcess);
            _safeSend(msg.sender, feeExcess);
        }
        
        emit BuyVideoAdsCompeteEvent(msg.sender, numAdsToBuy);
    }
    
    /**
    * @dev Get a random Video Ad to display in CrazyPinyin
    */
    function getRandomVideoAds() public view returns (string, string, uint256) {
        require(allVideoAds.length > 0);
        
        uint256 index = _random(0, allVideoAds.length, block.timestamp, 10000, 1);
        VideoAdsData storage data = allVideoAds[index];
        return (data.platform, data.videoId, index);
    }
    
    /**
    * @dev Gamers claim the estimated rewards for each challenge round
    *      Later, this method should be call from a remote server with onlyCEO access.
    */
    function claimChallengeModeReward(uint256 bonus, uint256 videoId) public {
        require(msg.sender != address(0));
        require(bonus > 0);

        if (videoId >= 0) {
            VideoAdsData storage data = allVideoAds[videoId];
            data.numCV++;
            bonus = bonus.mul(2);
        }

        if (bonus > maxChallengeBonus) {
            bonus = maxChallengeBonus;
        }

        trxBalance[msg.sender] = trxBalance[msg.sender].add(bonus);
        currentLockedTRX = currentLockedTRX.add(bonus);
        
        emit ChallengeModeBonusRewardedEvent(msg.sender, bonus);
    }
    
    /**
    * @dev Withdraw trx games earned by playing CrazyPinyin
    */
    function withdrawTRXBalance() public {
        require(msg.sender != address(0));
        require(trxBalance[msg.sender] > 0);
        
        uint256 amount = trxBalance[msg.sender];
        trxBalance[msg.sender] = 0;
        if (currentLockedTRX > amount) {
            currentLockedTRX = currentLockedTRX.sub(amount);
        } else {
            currentLockedTRX = 0;
        }
        _safeSend(msg.sender, amount);

        emit WithdrawTRXBalanceCompleteEvent(msg.sender, amount);
    }

    /**
    * @dev Utility method
    */
    function _safeSend(address _recipient, uint256 _amount) private {
        require(_recipient != address(0));
        require(_amount > 0);
        
        _recipient.transfer(_amount);
    }
    
    /**
    * @dev Utility method
    */
    function _random(uint256 _min, uint256 _max, uint256 _hash, uint256 _reminder, uint256 _divider) private pure returns (uint256) {
        return _hash.mod(_reminder).div(_divider).mod(_max - _min).add(_min);
    }
    
    /**
    * @dev Fallback
    */
    function() external payable {
    }
}
  