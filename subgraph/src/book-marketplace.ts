import { BigInt } from "@graphprotocol/graph-ts"
import {
  BookMarketplace,
  Approval,
  ApprovalForAll,
  ListingCreated,
  ListingUpdated,
  Transfer,
  BidAdded
} from "../generated/BookMarketplace/BookMarketplace"
import { ExampleEntity, Listing, Bid } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.fetchItemsListed(...)
  // - contract.fetchListings(...)
  // - contract.fetchMyNFTs(...)
  // - contract.getApproved(...)
  // - contract.getBidList(...)
  // - contract.getBiddingPrice(...)
  // - contract.getHighestBid(...)
  // - contract.getHighestBidIndex(...)
  // - contract.getHighestBidder(...)
  // - contract.getInstantPrice(...)
  // - contract.getListingByTokenId(...)
  // - contract.getListingPrice(...)
  // - contract.getMarketOwnerAddress(...)
  // - contract.hasUserBid(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleListingCreated(event: ListingCreated): void {
  let listing = new Listing(event.params.tokenId.toHex())
  listing.tokenId = event.params.tokenId
  listing.seller = event.params.seller
  listing.owner = event.params.owner
  listing.instantPrice = event.params.instantPrice
  listing.startingPrice = event.params.startingPrice
  listing.allowBid = event.params.allowBid
  listing.sold = event.params.sold
  listing.save()
}

export function handleListingUpdated(event: ListingUpdated): void {
  let listing = Listing.load(event.params.tokenId.toHex())

  //Basic null check
  if (listing) {
    listing.instantPrice = event.params.instantPrice
    listing.startingPrice = event.params.startingPrice
    listing.allowBid = event.params.allowBid
    listing.save()
  }
}

export function handleTransfer(event: Transfer): void {
  let listing = Listing.load(event.params.tokenId.toHex())

  //Basic null check
  if (listing != null) {
    listing.owner = event.params.to
    listing.sold = true
    listing.save()
  }
}

export function handleBidAdded(event: BidAdded): void {
  let listing = Listing.load(event.params.tokenId.toHex())

  
  //Basic null check
  // if (listing != null) {
  //   let bid = new Bid(event.params.tokenId.toHex())
  //   bid.id = event.params.tokenId.toString()
  //   bid.bidder = event.params.bidder
  //   bid.amount = event.params.bidAmount
  //   bid.listing = listing.id 
  //   bid.save()

  //   listing.bidList = listing.bidList.push(bid)
  //   listing.save()
  // }
}
