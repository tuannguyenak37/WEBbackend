// middleware delay
const delay = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 1000); // delay 2s
};
export default delay;
