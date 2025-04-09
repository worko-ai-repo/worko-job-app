/**
 * FileHelper
 * 
 * Helper to help with directory/file related activities.
 */
class FileHelper {
    /**
     * getFileName
     * 
     * Process the provided file path and extract the file name out of it.
     * 
     * @param {string} filename
     * @returns {string | undefined}
     */
    static getFileName(filename: string): string | undefined {
        return filename.split(/[\\/]/).pop()
    }
}

export { FileHelper }