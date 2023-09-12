const numberDistance = (num1, num2) => Math.abs(num1 - num2);

const vectorDistance = (pos1, pos2) => Math.max(
  numberDistance(pos1[0], pos2[0]),
  numberDistance(pos1[1], pos2[1]),
);

const vectorIntersects = (subjectPos, boxPos, boxRadius) => {
  const dist = vectorDistance(subjectPos, boxPos);
  return (dist < boxRadius);
};

const vectorAdd = (pos1, pos2) => [
  pos1[0] + pos2[0],
  pos1[1] + pos2[1],
];

const vectorAngle = (pos1, pos2) =>
  Math.atan2(pos1[0] - pos2[0], pos1[1] - pos2[1]);

const vectorLength = (vector) =>
  Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[0], 2));

const vectorRotate = (vector, rotation) => [
  (vector[0] * Math.cos(rotation)) - (vector[1] * Math.sin(rotation)),
  (vector[0] * Math.sin(rotation)) - (vector[1] * Math.cos(rotation)),
];

const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
};

const rndFloat = () => Math.random();
const rndOne = () => (rndFloat() - 0.5) * 2;
const rndRange = (point, spread = 10) => point + (rndOne() * spread);
const rndInt = (max, min = 0) => Math.floor((rndFloat() * (max - min)) + min);
const rndRadius = (pos, radius = 10) => [rndRange(pos[0], radius), rndRange(pos[1], radius)];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));