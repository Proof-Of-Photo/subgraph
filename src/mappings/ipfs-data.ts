import { json, JSONValue, JSONValueKind, BigInt, TypedMap, Bytes, dataSource, log } from '@graphprotocol/graph-ts'
import {
  ServiceDescription,
  ProposalDescription,
  UserDescription,
  PlatformDescription,
  ReviewDescription,
  EvidenceDescription,
} from '../../generated/schema'

//Adds metadata from ipfs as a entity called ServiceDescription.
export function handleServiceData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const serviceId = context.getBigInt('serviceId')
  const id = context.getString('id')

  let description = new ServiceDescription(id)
  description.service = serviceId.toString()

  // Non-mandatory (nullable) fields assigned below
  description.title = getValueAsString(jsonObject, 'title')
  description.about = getValueAsString(jsonObject, 'about')
  description.startDate = getValueAsBigInt(jsonObject, 'startDate')
  description.expectedEndDate = getValueAsBigInt(jsonObject, 'expectedEndDate')
  description.latitude = getValueAsString(jsonObject, 'latitude')
  description.longitude = getValueAsString(jsonObject, 'longitude')
  description.rateToken = getValueAsString(jsonObject, 'rateToken')
  description.rateAmount = getValueAsString(jsonObject, 'rateAmount')
  description.video_url = getValueAsString(jsonObject, 'video_url')

  //Creates duplicate values. Open issue
  //https://github.com/graphprotocol/graph-node/issues/4087

  description.save()
}

//Adds metadata from ipfs as a entity called ProposalDescription.
//The description entity has the id of the cid to the file on IPFS
export function handleProposalData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const proposalId = context.getString('proposalId')
  const id = context.getString('id')

  let description = new ProposalDescription(id)
  description.proposal = proposalId.toString()

  description.startDate = getValueAsBigInt(jsonObject, 'startDate')
  description.about = getValueAsString(jsonObject, 'about')
  description.expectedHours = getValueAsBigInt(jsonObject, 'expectedHours')
  description.video_url = getValueAsString(jsonObject, 'video_url')

  description.save()
}

//Adds metadata from ipfs as a entity called ReviewDescription.
//The description entity has the id of the cid to the file on IPFS
//Does not need to remove reviews because they can not be updated.
export function handleReviewData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const reviewId = context.getString('reviewId')
  const id = context.getString('id')

  let description = new ReviewDescription(id)
  description.review = reviewId
  description.content = getValueAsString(jsonObject, 'content')

  description.save()
}

//Adds metadata from ipfs as a entity called UserDescription.
//The description entity has the id of the cid to the file on IPFS
export function handleUserData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const userId = context.getBigInt('userId')
  const id = context.getString('id')

  let description = new UserDescription(id)
  description.user = userId.toString()

  description.title = getValueAsString(jsonObject, 'title')
  description.about = getValueAsString(jsonObject, 'about')
  const skills = getValueAsString(jsonObject, 'skills')
  if (skills !== null) {
    description.skills_raw = skills.toLowerCase()
  }
  description.timezone = getValueAsBigInt(jsonObject, 'timezone')
  description.headline = getValueAsString(jsonObject, 'headline')
  description.country = getValueAsString(jsonObject, 'country')
  description.role = getValueAsString(jsonObject, 'role')
  description.name = getValueAsString(jsonObject, 'name')
  description.video_url = getValueAsString(jsonObject, 'video_url')
  description.image_url = getValueAsString(jsonObject, 'image_url')

  //Creates duplicate values. Open issue
  //https://github.com/graphprotocol/graph-node/issues/4087

  description.save()
}

//Adds metadata from ipfs as a entity called PlatformDescription.
//The description entity has the id of the cid to the file on IPFS
export function handlePlatformData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const platformId = context.getBigInt('platformId')
  const id = context.getString('id')

  let description = new PlatformDescription(id)

  description.platform = platformId.toString()
  description.about = getValueAsString(jsonObject, 'about')
  description.website = getValueAsString(jsonObject, 'website')
  description.video_url = getValueAsString(jsonObject, 'video_url')
  description.image_url = getValueAsString(jsonObject, 'image_url')

  description.save()
}

export function handleEvidenceData(content: Bytes): void {
  const checkJson = json.try_fromBytes(content)
  const jsonObject = checkJson.isOk ? checkJson.value.toObject() : null

  if (jsonObject === null) {
    log.warning('Error parsing json: {}', [dataSource.stringParam()])
    return
  }

  const context = dataSource.context()
  const evidenceId = context.getString('evidenceId')
  const id = context.getString('id')

  let description = new EvidenceDescription(id)
  description.evidence = evidenceId.toString()

  description.fileUri = getValueAsString(jsonObject, 'fileUri')
  description.fileHash = getValueAsString(jsonObject, 'fileHash')
  description.fileTypeExtension = getValueAsString(jsonObject, 'fileTypeExtension')
  description.name = getValueAsString(jsonObject, 'name')
  description.description = getValueAsString(jsonObject, 'description')

  description.save()
}

//==================================== Help functions ===========================================

function getValueAsString(jsonObject: TypedMap<string, JSONValue>, key: string): string | null {
  const value = jsonObject.get(key)

  if (value == null || value.isNull() || value.kind != JSONValueKind.STRING) {
    return null
  }

  return value.toString()
}

function getValueAsBigInt(jsonObject: TypedMap<string, JSONValue>, key: string): BigInt | null {
  const value = jsonObject.get(key)

  if (value == null || value.isNull() || value.kind != JSONValueKind.NUMBER) {
    return null
  }

  return value.toBigInt()
}
