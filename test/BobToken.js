const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BobToken contract", function () {
  // Global vars:
  let Token;
  let bobToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("BobToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    bobToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await bobToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await bobToken.balanceOf(owner.address);
      expect(await bobToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await bobToken.cap();
      // Convert to number and divide by 10^18 to handle token decimals
      expect(Number(cap) / 1e18).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await bobToken.blockReward();
      // Convert to number and divide by 10^18 to handle token decimals
      expect(Number(blockReward) / 1e18).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await bobToken.transfer(addr1.address, 50);
      const addr1Balance = await bobToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await bobToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await bobToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await bobToken.balanceOf(owner.address);
      await expect(
        bobToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.reverted;

      expect(await bobToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await bobToken.balanceOf(owner.address);

      await bobToken.transfer(addr1.address, 100);
      await bobToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await bobToken.balanceOf(owner.address);
      // Use BigInt for large number calculations
      expect(finalOwnerBalance).to.equal(
        BigInt(initialOwnerBalance) - BigInt(150)
      );

      const addr1Balance = await bobToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await bobToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});