const generateVerificationToken = () =>
    Math.floor(Math.random() * 10000000).toString();

export default generateVerificationToken;
