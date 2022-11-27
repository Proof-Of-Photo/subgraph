import { BigInt } from '@graphprotocol/graph-ts'
import { MintFeeUpdated } from '../../generated/TalentLayerID/TalentLayerID'
import {
  Approval,
  ApprovalForAll,
  CidUpdated,
  ConsecutiveTransfer,
  Mint,
  Transfer,
} from '../../generated/TalentLayerPlatformID/TalentLayerPlatformID'
import { getOrCreatePlatform, getOrCreateProtocol } from '../getters'

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCidUpdated(event: CidUpdated): void {
  const platform = getOrCreatePlatform(event.params._tokenId)
  platform.uri = event.params._newCid
  platform.save()
}

export function handleConsecutiveTransfer(event: ConsecutiveTransfer): void {}

export function handleMint(event: Mint): void {
  const platform = getOrCreatePlatform(event.params._tokenId)
  platform.address = event.params._platformOwnerAddress
  platform.name = event.params._platformName

  platform.createdAt = event.block.timestamp

  platform.save()

  const protocol = getOrCreateProtocol()
  const currentTotalMintFees = protocol.totalMintFees || new BigInt(0)
  protocol.totalMintFees = currentTotalMintFees.plus(event.params._fee)
  protocol.save()
}

export function handleTransfer(event: Transfer): void {}

export function handleMintFeeUpdated(event: MintFeeUpdated): void {
  const protocol = getOrCreateProtocol()
  protocol.platformMintFee = event.params._mintFee
  protocol.save()
}