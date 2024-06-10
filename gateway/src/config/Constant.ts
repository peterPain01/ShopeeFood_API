const MAX_REQUEST_PER_MINUTE: number = 200;
const MILLISECONDS_PER_MINUTE: number = 60 * 1000;

const Constant = {
    rateLimit: MAX_REQUEST_PER_MINUTE,
    interval: MILLISECONDS_PER_MINUTE
};

export default Constant;
