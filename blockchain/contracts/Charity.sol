// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Charity {
    /// @notice Structure for storing campaign information.
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        bool fundsWithdrawn;
        bool cancelled;
        uint256 creationTime;
        address[] donators;
        uint256[] donations;
        uint256[] donationTimestamps;
        mapping(address => uint256) contributions;
    }

    /// @notice Mapping to store campaigns by their ID.
    mapping(uint256 => Campaign) public campaigns;
    /// @notice Total number of campaigns created.
    uint256 public numberOfCampaigns = 0;

    /**
     * @notice Creates a new campaign.
     * @param _owner The address of the campaign owner.
     * @param _title The title of the campaign.
     * @param _description The description of the campaign.
     * @param _target The funding target in wei.
     * @param _deadline The campaign deadline (Unix timestamp). Must be in the future.
     * @param _image The URL of the campaign image.
     * @return The ID of the newly created campaign.
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(
            _deadline > block.timestamp,
            "Deadline should be in the future."
        );
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.fundsWithdrawn = false;
        campaign.cancelled = false;
        campaign.creationTime = block.timestamp;
        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    /**
     * @notice Allows a user to donate to a campaign.
     * @param _id The ID of the campaign.
     * @dev This function accepts ETH as the donation amount (via msg.value). Donations are accepted until the campaign deadline,
     * unless the campaign owner has already withdrawn the funds (i.e., the campaign is completed).
     */
    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(!campaign.cancelled, "Campaign is cancelled.");
        require(!campaign.fundsWithdrawn, "Campaign is completed.");
        require(block.timestamp < campaign.deadline, "Campaign has ended.");

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.donationTimestamps.push(block.timestamp);
        campaign.amountCollected += msg.value;
        campaign.contributions[msg.sender] += msg.value;
    }

    /**
     * @notice Allows a donator to claim a refund for their contribution.
     * @param _id The ID of the campaign.
     * @dev A refund can be claimed if the campaign is cancelled, or if the deadline has passed and the target was not reached.
     */
    function claimRefund(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.cancelled ||
                (block.timestamp >= campaign.deadline &&
                    campaign.amountCollected < campaign.target),
            "Refund not allowed at this time."
        );
        uint256 contributed = campaign.contributions[msg.sender];
        require(contributed > 0, "No contributions to refund.");
        campaign.contributions[msg.sender] = 0;
        campaign.amountCollected -= contributed;
        (bool sent, ) = payable(msg.sender).call{value: contributed}("");
        require(sent, "Refund transfer failed.");
    }

    /**
     * @notice Allows the campaign owner to withdraw funds once the campaign target is reached.
     * @param _id The ID of the campaign.
     * @dev Withdrawal is allowed only if the campaign is not cancelled, the collected amount meets or exceeds the target,
     * and funds have not already been withdrawn. Withdrawal can occur even if the deadline has not passed.
     */
    function withdrawFunds(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can withdraw funds.");
        require(!campaign.cancelled, "Campaign is cancelled.");
        require(
            campaign.amountCollected >= campaign.target,
            "Campaign target not reached."
        );
        require(!campaign.fundsWithdrawn, "Funds already withdrawn.");

        uint256 amount = campaign.amountCollected;
        campaign.fundsWithdrawn = true;
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Withdrawal transfer failed.");
    }

    /**
     * @notice Allows the campaign owner to cancel the campaign.
     * @param _id The ID of the campaign.
     * @dev Cancellation enables donators to claim refunds via claimRefund.
     */
    function cancelCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(
            msg.sender == campaign.owner,
            "Only owner can cancel the campaign."
        );
        require(!campaign.cancelled, "Campaign already cancelled.");
        campaign.cancelled = true;
    }

    /// @notice Structure for presenting campaign data without the contributions mapping (for frontend use).
    struct CampaignView {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        bool fundsWithdrawn;
        bool cancelled;
        uint256 creationTime;
        address[] donators;
        uint256[] donations;
        uint256[] donationTimestamps;
    }

    /**
     * @notice Retrieves an array of all campaigns for display purposes.
     * @return An array of CampaignView structs containing campaign data.
     */
    function getCampaigns() public view returns (CampaignView[] memory) {
        CampaignView[] memory allCampaigns = new CampaignView[](
            numberOfCampaigns
        );
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            allCampaigns[i] = CampaignView({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: campaign.target,
                deadline: campaign.deadline,
                amountCollected: campaign.amountCollected,
                image: campaign.image,
                fundsWithdrawn: campaign.fundsWithdrawn,
                cancelled: campaign.cancelled,
                creationTime: campaign.creationTime,
                donators: campaign.donators,
                donations: campaign.donations,
                donationTimestamps: campaign.donationTimestamps
            });
        }
        return allCampaigns;
    }

    /**
     * @notice Retrieves the list of donators and their donation amounts for a specific campaign.
     * @param _id The ID of the campaign.
     * @return Two arrays: the first containing the donator addresses, and the second containing the donation amounts.
     */
    function getDonators(
        uint256 _id
    )
        public
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.donators,
            campaign.donations,
            campaign.donationTimestamps
        );
    }

    /**
     * @notice Retrieves global statistics for all campaigns.
     * @return totalCampaigns - the total number of campaigns.
     * @return totalAmountCollected - total amount collected for all campaigns.
     * @return totalDonationsCount - total number of donations.
     * @return averageDonation - average donation amount.
     * @return campaignsReachedTarget - the number of campaigns that reached the goal.
     */
    function getPlatformStats()
        public
        view
        returns (
            uint256 totalCampaigns,
            uint256 totalAmountCollected,
            uint256 totalDonationsCount,
            uint256 averageDonation,
            uint256 campaignsReachedTarget
        )
    {
        uint256 sumDonations = 0;
        uint256 donationsCount = 0;
        uint256 reachedCount = 0;

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            sumDonations += campaign.amountCollected;
            donationsCount += campaign.donators.length;
            if (campaign.amountCollected >= campaign.target) {
                reachedCount++;
            }
        }

        totalCampaigns = numberOfCampaigns;
        totalAmountCollected = sumDonations;
        totalDonationsCount = donationsCount;
        averageDonation = donationsCount > 0
            ? sumDonations / donationsCount
            : 0;
        campaignsReachedTarget = reachedCount;
    }
}
