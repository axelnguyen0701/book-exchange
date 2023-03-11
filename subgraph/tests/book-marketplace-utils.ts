import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ListingCreated,
  ListingUpdated,
  Transfer
} from "../generated/BookMarketplace/BookMarketplace"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createListingCreatedEvent(
  tokenId: BigInt,
  seller: Address,
  owner: Address,
  instantPrice: BigInt,
  startingPrice: BigInt,
  allowBid: boolean,
  sold: boolean
): ListingCreated {
  let listingCreatedEvent = changetype<ListingCreated>(newMockEvent())

  listingCreatedEvent.parameters = new Array()

  listingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "instantPrice",
      ethereum.Value.fromUnsignedBigInt(instantPrice)
    )
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startingPrice",
      ethereum.Value.fromUnsignedBigInt(startingPrice)
    )
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("allowBid", ethereum.Value.fromBoolean(allowBid))
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("sold", ethereum.Value.fromBoolean(sold))
  )

  return listingCreatedEvent
}

export function createListingUpdatedEvent(
  tokenId: BigInt,
  seller: Address,
  owner: Address,
  instantPrice: BigInt,
  startingPrice: BigInt,
  allowBid: boolean,
  sold: boolean
): ListingUpdated {
  let listingUpdatedEvent = changetype<ListingUpdated>(newMockEvent())

  listingUpdatedEvent.parameters = new Array()

  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "instantPrice",
      ethereum.Value.fromUnsignedBigInt(instantPrice)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "startingPrice",
      ethereum.Value.fromUnsignedBigInt(startingPrice)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("allowBid", ethereum.Value.fromBoolean(allowBid))
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("sold", ethereum.Value.fromBoolean(sold))
  )

  return listingUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
