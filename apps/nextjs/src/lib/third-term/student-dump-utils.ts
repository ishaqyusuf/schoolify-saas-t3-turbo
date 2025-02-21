import { classByCodes, classGroups } from "./constants";

export const getClassRoomData = (code) => {
  const classRoomName = classByCodes[code];

  const classGroupCode =
    Object.entries(classGroups).find(([a, b]) => b.includes(code))?.[0] || code;

  const resp = {
    classTitle: classRoomName,
    classCode: code,
    classGroupCode,
  };
  return resp;
};
