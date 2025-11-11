// middleware delay
const delay = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 0); // delay 2s
};
export default delay;
