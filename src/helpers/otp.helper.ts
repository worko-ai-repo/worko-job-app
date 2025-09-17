class OtpHelper {
    /**
     * Generate a random OTP of the specified length.
     *
     * @param {number} length - the length of the OTP
     * @return {number} the generated OTP
     */
    static generateOtp(length: number): number {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return parseInt(code);
    }
}

export { OtpHelper }