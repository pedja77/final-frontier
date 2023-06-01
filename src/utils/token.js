import { Buffer } from 'buffer';

// Vraca string reprezentaciju objekta koji sadrzi username, expiration i niz authorities u kome
// se nalaze role koje korisnik ima, izmedju ostalog
export const  decodeJwtPayload = (token) => {
    const base64Payload = getTokenPayload(token);
    console.log('decodeJwtPayload ' + Buffer.from(base64Payload, 'base64').toString('utf8'))
    return Buffer.from(base64Payload, 'base64').toString('utf8');
  };

// Izbacim "Bearer " i izdvojim drugi od tri segmenta razdvojena tackom
const getTokenPayload = (token) => token.split(" ")[1].split(".")[1]; 

const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("getUser " + user);
  return user;
};

export const getToken = () => {
  return `Bearer ${getUser().token}`;
};