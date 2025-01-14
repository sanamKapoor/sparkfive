export const validation = {
    UPLOAD: {
        MAX_SIZE: {
            VALUE: 10 * 1024 * 1024 * 1024,
            ERROR_MESSAGE: 'File size too large. 10GB maximum upload size per file'
        },
        MAX_GUEST_UPLOAD_FILES: {
            VALUE: 200
        }
    }
}
