describe("NFTMarket", function() {
  
  it("Should create and execute market sales", async function() {
    const Market = await ethers.getContractFactory("ClabMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("ClabNFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address
    const creater = "0x18b15eBD34b5a78622F5630525d46bf9F38e9830"

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    await nft.createToken("https://www.clab.com", 5)
    // await nft.createToken("https://www.clab.com")
  
    await market.createMarketItem(nftContractAddress, creater, 1, auctionPrice, 5, { value: listingPrice })
    // await market.createMarketItem(nftContractAddress, creater, 2, auctionPrice, { value: listingPrice })
    
    const [_, buyerAddress] = await ethers.getSigners()
    // console.log('buyerAddress   = ', buyerAddress)

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})
    // await market.connect(buyerAddress).createBulkMarketSale(nftContractAddress, 2, 3, { value: auctionPrice})

    items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        creater: i.creater,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})
