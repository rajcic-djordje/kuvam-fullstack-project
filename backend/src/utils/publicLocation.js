import crypto from 'node:crypto';

const MAX_UINT32 = 0xffffffff;
const MIN_OFFSET_METERS = 300
const MAX_OFFSET_METERS = 500
const PUBLIC_ZONE_RADIUS_METERS = 650
const EARTH_RADIUS_METERS = 6371000;

function degreesToRadians(value) {
  return value * Math.PI / 180;
}

function radiansToDegrees(value) {
  return value * 180 / Math.PI;
}

function generateSellerOffset(sellerId) {
  const secret = process.env.PUBLIC_LOCATION_SECRET;

  if (!secret) {
    throw new Error('PUBLIC_LOCATION_SECRET is not configured.');
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(String(sellerId))
    .digest();

  const angleNumber = hash.readUInt32BE(0);
  const distanceNumber = hash.readUInt32BE(4);

  const normalizedAngle = angleNumber / MAX_UINT32;
  const normalizedDistance = distanceNumber / MAX_UINT32;

  const angle = normalizedAngle * 2 * Math.PI;

  const distance =
    MIN_OFFSET_METERS +
    normalizedDistance * (MAX_OFFSET_METERS - MIN_OFFSET_METERS);

  return {
    angle,
    distance
  };
}

function moveCoordinates(latitude, longitude, distance, angle) {
  const angularDistance = distance / EARTH_RADIUS_METERS;

  const latitudeRadians = degreesToRadians(latitude);
  const longitudeRadians = degreesToRadians(longitude);

  const movedLatitude = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(angularDistance) +
    Math.cos(latitudeRadians) * Math.sin(angularDistance) * Math.cos(angle)
  );

  const movedLongitude =
    longitudeRadians +
    Math.atan2(
      Math.sin(angle) * Math.sin(angularDistance) * Math.cos(latitudeRadians),
      Math.cos(angularDistance) -
        Math.sin(latitudeRadians) * Math.sin(movedLatitude)
    );

  return {
    latitude: Number(radiansToDegrees(movedLatitude).toFixed(6)),
    longitude: Number(radiansToDegrees(movedLongitude).toFixed(6))
  };
}

export function createPublicLocationZone(sellerId, latitude, longitude) {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined
  ) {
    return null;
  }

  const { angle, distance } = generateSellerOffset(sellerId);

  const center = moveCoordinates(latitude, longitude, distance, angle);

  return {
    center,
    radius: PUBLIC_ZONE_RADIUS_METERS
  };
}
