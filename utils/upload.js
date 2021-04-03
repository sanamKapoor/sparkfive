import moment from "moment"
import "moment-duration-format"

export const convertTimeFromSeconds =  (seconds) => {
	return moment.duration(seconds,'seconds').format('h [hours] m [minutes] s [seconds]')
}

export const getTypeFromMimeType =  (type) => {
	if(!type) return ''
	const types = type.split('/')
	return types[types.length-1]
}

export const  formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
