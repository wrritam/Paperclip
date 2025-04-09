export function sendOTP() {
  const randomNumber = Math.random() * 9000;
  return Math.floor(1000 + randomNumber);
}
